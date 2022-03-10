import * as Patch from '@sanity/form-builder/lib/patch/patches'
import PatchEvent from '@sanity/form-builder/PatchEvent'
import {LocalTreeItem, NodeProps} from '../types'
import {
  getAddItemPatch,
  getDuplicateItemPatch,
  getMovedNodePatch,
  getMoveItemPatch,
  getRemoveItemPatch,
  HandleMovedNode,
  HandleMovedNodeData
} from '../utils/treePatches'

export default function useTreeOperationsProvider(props: {
  patchPrefix?: string
  onChange: (patch: unknown) => void
  localTree: LocalTreeItem[]
}): {
  handleMovedNode: HandleMovedNode
  addItem: (item: LocalTreeItem) => void
  duplicateItem: (nodeProps: NodeProps) => void
  removeItem: (nodeProps: NodeProps) => void
  moveItemUp: (nodeProps: NodeProps) => void
  moveItemDown: (nodeProps: NodeProps) => void
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

  function handleMovedNode(data: HandleMovedNodeData & {node: LocalTreeItem}) {
    runPatches(getMovedNodePatch(data))
  }

  function addItem(item: LocalTreeItem) {
    runPatches(getAddItemPatch(item))
  }

  function duplicateItem(nodeProps: NodeProps & {node: LocalTreeItem}) {
    runPatches(getDuplicateItemPatch(nodeProps))
  }

  function removeItem(nodeProps: NodeProps) {
    runPatches(getRemoveItemPatch(nodeProps))
  }

  function moveItemUp(nodeProps: NodeProps) {
    runPatches(
      getMoveItemPatch({
        nodeProps,
        localTree,
        direction: 'up'
      })
    )
  }

  function moveItemDown(nodeProps: NodeProps) {
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
