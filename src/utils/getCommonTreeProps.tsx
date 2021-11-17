import {Box} from '@sanity/ui'
import {ReactSortableTreeProps, TreeItem} from 'react-sortable-tree'
import Callout from '../components/Callout'
import TreeNode from '../components/TreeNode'
import TreeNodeRenderer from '../components/TreeNodeRenderer'

const ROW_HEIGHT = 50

function getExpandedItemCount(tree: TreeItem[]): number {
  return tree.reduce((count, curItem) => {
    return (
      count +
      1 +
      (Array.isArray(curItem.children) && curItem.expanded
        ? getExpandedItemCount(curItem.children)
        : 0)
    )
  }, 1)
}

export function getTreeHeight(tree: TreeItem[] | undefined): string {
  return `${ROW_HEIGHT * getExpandedItemCount(tree || [])}px`
}

export default function getCommonTreeProps({
  placeholder
}: {
  placeholder: {
    title: string
    subtitle?: string
  }
}): Partial<ReactSortableTreeProps> {
  return {
    dndType: 'sanityDocument',
    theme: {
      nodeContentRenderer: TreeNode,
      placeholderRenderer: () => (
        <Box padding={3}>
          <Callout {...placeholder} tone="default" />
        </Box>
      ),
      treeNodeRenderer: TreeNodeRenderer,
      scaffoldBlockPxWidth: 20,
      rowHeight: ROW_HEIGHT
    }
  }
}
