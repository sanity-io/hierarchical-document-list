import React from 'react'
import {OnVisibilityToggleData, TreeItem} from 'react-sortable-tree'
import {AllItems, SanityTreeItem} from '../types'
import {dataToEditorTree} from './treeData'

type VisibilityMap = {
  [_key: string]: boolean
}

/**
 * Enhances tree data with information on:
 *   - `expanded` - native property of react-sortable-tree to determine collapsing & expanding of a node's children
 *   - `draftId` & `publishedId` - refer to SanityTreeItem's type annotations
 *
 * Doesn't modify the main tree or has side-effects on data.
 * Has the added benefit of being local to the user, so external changes won't affect local visibility.
 */
export default function useLocalTree({
  tree,
  allItems
}: {
  tree: SanityTreeItem[]
  allItems: AllItems
}): {
  handleVisibilityToggle: (data: OnVisibilityToggleData) => void
  localTree: TreeItem[]
} {
  const [visibilityMap, setVisibilityMap] = React.useState<VisibilityMap>({})

  function handleVisibilityToggle(data: OnVisibilityToggleData) {
    setVisibilityMap({
      ...visibilityMap,
      [data.node._key]: data.expanded
    })
  }

  const treeWithLocalContext = tree.map((item) => {
    const refId = item.value?.reference?._ref
    const docPair = refId ? allItems[refId] : undefined
    const draftDoc = docPair?.draft
    const publishedDoc = docPair?.published
    return {
      ...item,
      expanded: visibilityMap[item._key] !== false,
      draftId: draftDoc?._id,
      publishedId: publishedDoc?._id,
      draftUpdatedAt: draftDoc?._updatedAt,
      publishedUpdatedAt: publishedDoc?._updatedAt
    }
  })

  return {
    localTree: dataToEditorTree(treeWithLocalContext),
    handleVisibilityToggle
  }
}
