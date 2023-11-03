import {getVisibleNodeCount, TreeItem} from '@nosferatu500/react-sortable-tree'

export const ROW_HEIGHT = 51

export default function getTreeHeight(treeData: TreeItem[]): string {
  const visibleNodeCount = getVisibleNodeCount({treeData})

  // prettier-ignore
  return `${50 + (ROW_HEIGHT * visibleNodeCount)}px`
}
