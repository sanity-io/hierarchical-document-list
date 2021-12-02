import {
  FullTree,
  getFlatDataFromTree,
  NodeData,
  OnMovePreviousAndNextLocation
} from 'react-sortable-tree'
import PatchEvent from '@sanity/form-builder/PatchEvent'
import * as Patch from '@sanity/form-builder/lib/patch/patches'

export default function getTreePatch(
  data: NodeData & FullTree & OnMovePreviousAndNextLocation
): unknown {
  const {node, nextParentNode, nextTreeIndex, treeData: nextTree} = data
  const keyPath = {_key: node._key}

  // nextPath will be `null` if the item was removed from the tree
  if (!Array.isArray(data.nextPath)) {
    return PatchEvent.from(Patch.unset([keyPath]))
  }

  const nextFlatTree = getFlatDataFromTree({
    treeData: nextTree,
    getNodeKey: (t) => t.node._key
  })
  console.log({data, flatTree: nextFlatTree})

  let insertionPatch
  // if (nextTreeIndex === 0) {
  //   console.log('BEFORE')
  //   // If node is moved to the top, add it to the top of the array
  //   insertionPatch = Patch.insert([node], 'before', [0])
  // } else if (nextTreeIndex + 1 === nextFlatTree.length) {
  //   console.log('AFTER')
  //   // Likewise, if moved to the bottom, append to the end
  //   insertionPatch = Patch.insert([node], 'after', [-1])
  // } else {
  // If moved somewhere in the middle, let's try to minimize syncing inconsistencies by placing it before what would be its following adjescent node
  const adjescentSibling = nextFlatTree
    .slice(nextTreeIndex + 1)
    .find((item) => !item.path.includes(node._key))
  console.log('MIDDLE', adjescentSibling)
  if (adjescentSibling?.node?._key) {
    insertionPatch = Patch.insert([node], 'before', [{_key: adjescentSibling?.node?._key}])
  } else {
    insertionPatch = Patch.insert([node], 'after', [nextTreeIndex])
  }

  return PatchEvent.from(
    // Unset the moved node
    Patch.unset([keyPath]),
    // Add it to where in the tree it should appear
    insertionPatch,
    nextParentNode
      ? // If it has a parent node, set that parent's _key
        Patch.set(nextParentNode._key, [keyPath, 'parent'])
      : // Else remove the parent key entirely
        Patch.unset([keyPath, 'parent'])
  )
}
