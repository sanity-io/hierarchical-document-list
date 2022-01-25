import * as Patch from '@sanity/form-builder/lib/patch/patches'
import {randomKey} from '@sanity/util/content'
import {
  FlatDataItem,
  FullTree,
  getFlatDataFromTree,
  NodeData,
  NodeRendererProps,
  OnMovePreviousAndNextLocation,
  TreeItem
} from 'react-sortable-tree'
import {SanityTreeItem} from '../types'
import getAdjescentNodes from './getAdjescentNodes'
import moveItemInArray from './moveItemInArray'
import {normalizeNodeForStorage} from './treeData'

export type HandleMovedNodeData = Omit<
  NodeData & FullTree & OnMovePreviousAndNextLocation,
  'prevPath' | 'prevTreeIndex' | 'path' | 'treeIndex'
>

export type HandleMovedNode = (moveData: HandleMovedNodeData) => void

export function getAddItemPatch(item: SanityTreeItem): unknown[] {
  const normalizedNode = normalizeNodeForStorage(item)

  return [
    // Add the node to the end of the tree
    Patch.insert([normalizedNode], 'after', [-1])
  ]
}

export function getDuplicateItemPatch(nodeProps: NodeRendererProps): unknown[] {
  const newItem = {
    ...nodeProps.node,
    _key: randomKey(12)
  }
  const normalizedNode = normalizeNodeForStorage(newItem)

  return [
    // Add duplicated node before the existing one
    Patch.insert([normalizedNode], 'before', [{_key: nodeProps.node._key}])
  ]
}

export function getRemoveItemPatch({node}: Pick<NodeRendererProps, 'node'>): unknown[] {
  const keyPath = {_key: node._key}
  const children = getChildrenPaths(node)

  return [
    // 1. Unset the removed node
    Patch.unset([keyPath]),

    // 2. Unset its children
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

  const nextFlatTree = getFlatDataFromTree({
    treeData: data.treeData,
    getNodeKey: (t) => t.node._key
  })
  const normalizedNode = normalizeNodeForStorage(data.node)

  const {leadingNode, followingNode} = getAdjescentNodes({
    flatTree: nextFlatTree,
    node: data.node,
    treeIndex: data.nextTreeIndex
  })

  return [
    // 1. Unset the moved node
    // (will be ignored by Content Lake on new nodes with _key not yet in tree)
    Patch.unset([keyPath]),

    // 2. SIBLING-BASED PLACEMENT
    // If we were to place solely based on nextTreeIndex, concurrent changes from other editors could put the new node in an unexpected position.
    // Let's instead anchor it to the _key of the sibling coming before or after it.
    leadingNode?.node?._key
      ? // After the sibling before it
        Patch.insert([normalizedNode], 'after', [{_key: leadingNode.node._key}])
      : // Or before the sibling right after it, in case there's no leading sibling node
        Patch.insert([normalizedNode], 'before', [
          followingNode?.node?._key ? {_key: followingNode.node._key} : data.nextTreeIndex
        ]),

    // 3. Patch the new node with its new `parent`
    nextParentNode
      ? // If it has a parent node, set that parent's _key
        Patch.set(nextParentNode._key, [keyPath, 'parent'])
      : // Else remove the parent key entirely
        Patch.unset([keyPath, 'parent'])
  ]
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

export function getMoveItemPatch({
  nodeProps: {node, treeIndex, parentNode},
  localTree,
  direction = 'up'
}: {
  nodeProps: NodeRendererProps
  localTree: TreeItem[]
  direction: 'up' | 'down'
}): unknown[] {
  const keyPath = {_key: node._key}

  const nextTreeIndex = treeIndex + (direction === 'up' ? -1 : 1)

  const flatTree = getFlatDataFromTree({
    treeData: localTree,
    getNodeKey: (t) => t.node._key
  })
  const nextFlatTree = moveItemInArray<FlatDataItem>({
    array: flatTree,
    fromIndex: treeIndex,
    toIndex: nextTreeIndex
  })
  const {leadingNode, followingNode} = getAdjescentNodes({
    flatTree: nextFlatTree,
    node,
    treeIndex: nextTreeIndex
  })

  const normalizedNode = normalizeNodeForStorage(node)
  console.log(`Move ${direction}`, {
    node,
    treeIndex,
    parentNode,
    nextFlatTree,
    flatTree,
    localTree,
    leadingSibling: leadingNode,
    followingSibling: followingNode
  })

  // When moving up, look at following node to figure out what is the next parent.
  const nodeToInheritParent = direction === 'up' ? followingNode : leadingNode
  const nextParentNode = nodeToInheritParent?.parentNode

  return [
    // 1. Unset the moved node
    // (will be ignored by Content Lake on new nodes with _key not yet in tree)
    Patch.unset([keyPath]),

    // 2. SIBLING-BASED PLACEMENT
    leadingNode?.node?._key
      ? // After the sibling before it
        Patch.insert([normalizedNode], 'after', [{_key: leadingNode.node._key}])
      : // Or before the sibling right after it, in case there's no leading sibling node
        Patch.insert([normalizedNode], 'before', [
          followingNode?.node?._key ? {_key: followingNode.node._key} : nextTreeIndex
        ]),

    // 3. Patch the new node with its new `parent`
    nextParentNode
      ? // If it has a parent node, set that parent's _key
        Patch.set(nextParentNode._key, [keyPath, 'parent'])
      : // Else remove the parent key entirely
        Patch.unset([keyPath, 'parent'])
  ]
}
