import {FullTree, NodeData, OnMovePreviousAndNextLocation, TreeItem} from 'react-sortable-tree'
import {SanityTreeItem} from '../types/types'
import getTreePatch from './getTreePatch'

export type HandleMovedNodeData = NodeData & FullTree & OnMovePreviousAndNextLocation

export type HandleMovedNode = (moveData: HandleMovedNodeData) => void

export default function useTreeOperationsProvider(props: {
  patchPrefix?: string
  onChange: (patch: unknown) => void
  localTree: TreeItem[]
}): {
  handleMovedNode: HandleMovedNode
  addItem: (item: SanityTreeItem) => void
  removeItem: (item: SanityTreeItem) => void
} {
  function handleMovedNode(data: HandleMovedNodeData) {
    const patch = getTreePatch(data, props.patchPrefix)
    props.onChange(patch)
  }

  function addItem(item: SanityTreeItem) {
    handleMovedNode({
      nextPath: [],
      node: item,
      treeIndex: -1,
      treeData: props.localTree
    } as any)
  }

  function removeItem(item: SanityTreeItem) {
    handleMovedNode({
      nextPath: null,
      node: item
    } as any)
  }

  return {
    handleMovedNode,
    addItem,
    removeItem
  }
}
