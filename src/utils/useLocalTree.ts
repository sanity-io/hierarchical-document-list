import React from 'react'
import {OnVisibilityToggleData, TreeItem} from 'react-sortable-tree'
import {AllItems, SanityTreeItem} from '../types/types'
import {dataToEditorTree} from './treeData'

type VisibilityMap = {
  [_key: string]: boolean
}

/**
 * Enhances tree data with information on:
 *   - `expanded` - native property of react-sortable-tree to determine collapsing & expanding of a node's children
 *   - `draftId` - our custom property to let DocumentInNode render the preview for drafts if they exist
 *
 * Doesn't modify the main tree or has side-effects on data.
 * Has the added benefit of being local to the user, so external changes won't affect local visibility.
 */
export default function useLocalTree(
  tree: SanityTreeItem[],
  allItems: AllItems
): {
  handleVisibilityToggle: (data: OnVisibilityToggleData) => void
  treeData: TreeItem[]
} {
  const [visibilityMap, setVisibilityMap] = React.useState<VisibilityMap>({})

  function handleVisibilityToggle(data: OnVisibilityToggleData) {
    setVisibilityMap({
      ...visibilityMap,
      [data.node._key]: data.expanded
    })
  }

  const treeWithExpanded = tree.map((item) => ({
    ...item,
    expanded: visibilityMap[item._key] !== false,
    draftId: allItems[item.node?._ref]?.draft?._id
  }))

  return {
    treeData: dataToEditorTree(treeWithExpanded),
    handleVisibilityToggle
  }
}
