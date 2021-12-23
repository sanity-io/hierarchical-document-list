import * as Patch from '@sanity/form-builder/lib/patch/patches'
import {getFlatDataFromTree, NodeRendererProps, TreeItem} from 'react-sortable-tree'
import {SanityTreeItem} from '../types/types'
import {normalizeNodeForStorage} from './treeData'
import {HandleMovedNodeData} from './useTreeOperationsProvider'

export function getAddItemPatch(item: SanityTreeItem): unknown[] {
  const normalizedNode = normalizeNodeForStorage(item)

  return [
    // 1. Ensure tree array exists
    Patch.setIfMissing([]),

    // 2. Add the node to the end of the tree
    Patch.insert([normalizedNode], 'after', [-1])
  ]
}

export function getRemoveItemPatch({node}: Pick<NodeRendererProps, 'node'>): unknown[] {
  const keyPath = {_key: node._key}
  const children = getChildrenPaths(node)

  return [
    // 1. Ensure tree array exists
    Patch.setIfMissing([]),

    // 2. Unset the removed node
    Patch.unset([keyPath]),

    // 3. Unset its children
    ...children.map((path) => Patch.unset([{_key: path}]))
  ]
}

export function getMovedNodePatch(data: HandleMovedNodeData): unknown[] {
  const {nextParentNode} = data
  const keyPath = {_key: data.node._key}

  // === REMOVING NODE FROM TREE ===
  // `nextPath` will be null if the item is removed from tree
  if (!Array.isArray(data.nextPath)) {
    return getRemoveItemPatch({node: data.node})
  }

  return [
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
}

/**
 * Returns a patch for inserting the new, normalized node into the tree.
 */
function getInsertionPatch(data: HandleMovedNodeData): unknown {
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
