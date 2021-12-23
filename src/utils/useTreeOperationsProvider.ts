import {
  FullTree,
  NodeData,
  NodeRendererProps,
  OnMovePreviousAndNextLocation,
  TreeItem
} from 'react-sortable-tree'
import {SanityTreeItem} from '../types/types'
import {getAddItemPatch, getMovedNodePatch, getRemoveItemPatch} from './treePatches'
import PatchEvent from '@sanity/form-builder/PatchEvent'
import * as Patch from '@sanity/form-builder/lib/patch/patches'

export type HandleMovedNodeData = NodeData & FullTree & OnMovePreviousAndNextLocation

export type HandleMovedNode = (moveData: HandleMovedNodeData) => void

export default function useTreeOperationsProvider(props: {
  patchPrefix?: string
  onChange: (patch: unknown) => void
  localTree: TreeItem[]
}): {
  handleMovedNode: HandleMovedNode
  addItem: (item: SanityTreeItem) => void
  removeItem: (nodeProps: NodeRendererProps) => void
  moveItemUp: (nodeProps: NodeRendererProps) => void
  moveItemDown: (nodeProps: NodeRendererProps) => void
} {
  function runPatches(patches: unknown[]) {
    let patchEvent = PatchEvent.from(patches)
    if (props.patchPrefix) {
      patchEvent = PatchEvent.from(
        patches.map((patch) => Patch.prefixPath(patch, props.patchPrefix))
      )
    }
    props.onChange(patchEvent)
  }

  function handleMovedNode(data: HandleMovedNodeData) {
    runPatches(getMovedNodePatch(data))
  }

  function addItem(item: SanityTreeItem) {
    runPatches(getAddItemPatch(item))
  }

  function removeItem(nodeProps: NodeRendererProps) {
    runPatches(getRemoveItemPatch(nodeProps))
  }

  function moveItemUp(nodeProps: NodeRendererProps) {
    // @TODO: move item up
  }

  function moveItemDown(nodeProps: NodeRendererProps) {
    // @TODO: move item down
  }

  return {
    handleMovedNode,
    addItem,
    removeItem,
    moveItemUp,
    moveItemDown
  }
}
