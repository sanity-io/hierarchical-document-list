import * as React from 'react'
import {AllItems, LocalTreeItem, StoredTreeItem, VisibilityMap} from '../types'
import {dataToEditorTree} from '../utils/treeData'

/**
 * Enhances tree data with information on:
 *   - `expanded` - native property of react-sortable-tree to determine collapsing & expanding of a node's children
 *   - `draftId` & `publishedId` - refer to LocalTreeItem's type annotations
 *
 * Doesn't modify the main tree or has side-effects on data.
 * Has the added benefit of being local to the user, so external changes won't affect local visibility.
 */
export default function useLocalTree({
  tree,
  allItems,
}: {
  tree: StoredTreeItem[]
  allItems: AllItems
}): {
  handleVisibilityToggle: (data: any) => void
  localTree: LocalTreeItem[]
} {
  const [visibilityMap, setVisibilityMap] = React.useState<VisibilityMap>({})

  function handleVisibilityToggle(data: any) {
    setVisibilityMap({
      ...visibilityMap,
      [data.node._key]: data.expanded,
    })
  }

  return {
    localTree: dataToEditorTree({
      tree,
      allItems,
      visibilityMap,
    }),
    handleVisibilityToggle,
  }
}
