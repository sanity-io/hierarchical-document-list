import * as Patch from '@sanity/form-builder/lib/patch/patches'
import PatchEvent from '@sanity/form-builder/PatchEvent'
import {NodeRendererProps, TreeItem} from 'react-sortable-tree'
import {SanityTreeItem} from '../types/types'
import {
  getAddItemPatch,
  getDuplicateItemPatch,
  getMovedNodePatch,
  getMoveItemPatch,
  getRemoveItemPatch,
  HandleMovedNode,
  HandleMovedNodeData
} from './treePatches'

export default function useTreeOperationsProvider(props: {
  patchPrefix?: string
  onChange: (patch: unknown) => void
  localTree: TreeItem[]
}): {
  handleMovedNode: HandleMovedNode
  addItem: (item: SanityTreeItem) => void
  duplicateItem: (nodeProps: NodeRendererProps) => void
  removeItem: (nodeProps: NodeRendererProps) => void
  moveItemUp: (nodeProps: NodeRendererProps) => void
  moveItemDown: (nodeProps: NodeRendererProps) => void
} {
  const {localTree} = props

  function runPatches(patches: unknown[]) {
    const finalPatches = [
      // Ensure tree array exists before any operation
      Patch.setIfMissing([]),
      ...(patches || [])
    ]
    let patchEvent = PatchEvent.from(finalPatches)
    if (props.patchPrefix) {
      patchEvent = PatchEvent.from(
        finalPatches.map((patch) => Patch.prefixPath(patch, props.patchPrefix))
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

  function duplicateItem(nodeProps: NodeRendererProps) {
    runPatches(getDuplicateItemPatch(nodeProps))
  }

  function removeItem(nodeProps: NodeRendererProps) {
    runPatches(getRemoveItemPatch(nodeProps))
  }

  function moveItemUp(nodeProps: NodeRendererProps) {
    runPatches(
      getMoveItemPatch({
        nodeProps,
        localTree,
        direction: 'up'
      })
    )
  }

  function moveItemDown(nodeProps: NodeRendererProps) {
    runPatches(
      getMoveItemPatch({
        nodeProps,
        localTree,
        direction: 'down'
      })
    )
  }

  return {
    handleMovedNode,
    addItem,
    removeItem,
    moveItemUp,
    moveItemDown,
    duplicateItem
  }
}
