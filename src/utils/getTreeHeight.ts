import {getVisibleNodeCount, TreeItem} from '@nosferatu500/react-sortable-tree'

export default function getTreeHeight(treeData: TreeItem[], rowHeight: number): string {
  const visibleNodeCount = getVisibleNodeCount({treeData})

  // prettier-ignore
  return `${50 + (rowHeight * visibleNodeCount)}px`
}
