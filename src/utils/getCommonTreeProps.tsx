import {Box} from '@sanity/ui'
import {ReactSortableTreeProps, TreeItem} from 'react-sortable-tree'
import Callout from '../components/Callout'
import TreeNode from '../components/TreeNode'
import TreeNodeRenderer from '../components/TreeNodeRenderer'

const ROW_HEIGHT = 50

export function getTreeHeight(tree: TreeItem[] | undefined): string {
  // prettier-ignore
  return `${50 + (ROW_HEIGHT * (tree || [1])?.length)}px`
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
      rowHeight: ROW_HEIGHT
    }
  }
}
