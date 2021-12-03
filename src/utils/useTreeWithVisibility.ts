import React from 'react'
import {OnVisibilityToggleData, TreeItem} from 'react-sortable-tree'
import {SanityTreeItem} from '../types/types'
import {dataToTree} from './treeData'

type VisibilityMap = {
  [_key: string]: boolean
}

/**
 * Enhances tree data with information on the `expanded` property from sortable-tree's TreeItem.
 * Doesn't modify the main tree or has side-effects on data.
 * Has the added benefit of being local to the user, so external changes won't affect local visibility.
 */
export default function useTreeWithVisibility(tree: SanityTreeItem[]): {
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
    expanded: visibilityMap[item._key] !== false
  }))

  return {
    treeData: dataToTree(treeWithExpanded),
    handleVisibilityToggle
  }
}
