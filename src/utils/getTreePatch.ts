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

export default function getTreePatch(
  data: NodeData & FullTree & OnMovePreviousAndNextLocation,
  prefix?: string
): unknown {
  const {nextParentNode} = data
  const keyPath = {_key: data.node._key}

  // === REMOVING NODE FROM TREE ===
  // `nextPath` will be `null` if the item was removed from the tree
  if (!Array.isArray(data.nextPath)) {
    const children = getChildrenPaths(data.node)
    return PatchEvent.from([
      Patch.unset([keyPath]),
      ...children.map((path) => Patch.unset([{_key: path}]))
    ])
  }

  const patches = [
    // 1. Ensure tree array exists
    Patch.setIfMissing([]),

    // 2. Unset the moved node
    // (will be ignored by Content Lake on new nodes with _key not yet in tree)
    Patch.unset([keyPath]),

    // 3. Add it to where in the tree it should appear
    getInsertionPatch(data),

    // 4. Patch the new node with its new `parent`
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

/**
 * Returns a patch for inserting the new, normalized node into the tree.
 */
function getInsertionPatch(data: NodeData & FullTree & OnMovePreviousAndNextLocation): unknown {
  const {nextTreeIndex, treeData: nextTree} = data
  const normalizedNode = normalizeNodeForStorage(data.node)

  const nextFlatTree = getFlatDataFromTree({
    treeData: nextTree,
    getNodeKey: (t) => t.node._key
  })

  // SIBLING-BASED PLACEMENT
  // If we were to place solely based on nextTreeIndex, concurrent changes from other editors could put the new node in an unexpected position.
  // Let's instead anchor it to the _key of the sibling coming before or after it.

  const leadingSibling = nextFlatTree
    .slice(0, nextTreeIndex)
    .reverse()
    // Disregard children nodes - these include the current node's key in their `path` array
    .find((item) => !item.path.includes(normalizedNode._key))
  if (leadingSibling?.node?._key) {
    return Patch.insert([normalizedNode], 'after', [{_key: leadingSibling.node._key}])
  }

  // Or before the sibling right after it, in case there's no leading sibling node
  const followingSibling = nextFlatTree
    .slice(nextTreeIndex + 1)
    .find((item) => !item.path.includes(normalizedNode._key))

  // prettier-ignore
  return Patch.insert([normalizedNode], 'before', [followingSibling?.node?._key ? {_key: followingSibling.node._key} : nextTreeIndex])
}

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
