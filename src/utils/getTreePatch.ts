import {
  FullTree,
  getFlatDataFromTree,
  NodeData,
  OnMovePreviousAndNextLocation,
  TreeItem
} from 'react-sortable-tree'
import PatchEvent from '@sanity/form-builder/PatchEvent'
import * as Patch from '@sanity/form-builder/lib/patch/patches'
import {normalizeNodeForStorage} from './treeData'

function getChildrenPaths(node: TreeItem): string[] {
  if (!Array.isArray(node.children)) {
    return []
  }

  return node.children
    .reduce(
      (keyPaths, child) => [...keyPaths, child._key, ...getChildrenPaths(child)],
      [] as string[]
    )
    .filter(Boolean)
}

export default function getTreePatch(
  data: NodeData & FullTree & OnMovePreviousAndNextLocation,
  prefix?: string
): unknown {
  const {nextParentNode, nextTreeIndex, treeData: nextTree} = data
  const node = normalizeNodeForStorage(data.node)
  const keyPath = {_key: node._key}

  // nextPath will be `null` if the item was removed from the tree
  if (!Array.isArray(data.nextPath)) {
    const children = getChildrenPaths(data.node)
    return PatchEvent.from([
      Patch.unset([keyPath]),
      ...children.map((path) => Patch.unset([{_key: path}]))
    ])
  }

  const nextFlatTree = getFlatDataFromTree({
    treeData: nextTree,
    getNodeKey: (t) => t.node._key
  })

  let insertionPatch

  // Let's try to minimize syncing inconsistencies by placing it before what would be its following adjescent node
  const followingSibling = nextFlatTree
    .slice(nextTreeIndex + 1)
    .find((item) => !item.path.includes(node._key))
  if (followingSibling?.node?._key) {
    insertionPatch = Patch.insert([node], 'before', [{_key: followingSibling.node._key}])
  } else {
    // Or after the sibling right before it
    const leadingSibling = nextFlatTree
      .slice(0, nextTreeIndex)
      .reverse()
      .find((item) => !item.path.includes(node._key))

    /* eslint-disable */
    insertionPatch = Patch.insert([node], 'after', [
      leadingSibling?.node?._key ? {_key: leadingSibling.node._key} : nextTreeIndex
    ])
    /* eslint-enable */
  }

  const patches = [
    Patch.setIfMissing([]),
    // Unset the moved node
    Patch.unset([keyPath]),
    // Add it to where in the tree it should appear
    insertionPatch,
    nextParentNode
      ? // If it has a parent node, set that parent's _key
        Patch.set(nextParentNode._key, [keyPath, 'parent'])
      : // Else remove the parent key entirely
        Patch.unset([keyPath, 'parent'])
  ]

  if (prefix) {
    return PatchEvent.from(patches.map((patch) => Patch.prefixPath(patch, prefix)))
  }
  return PatchEvent.from(patches)
}
