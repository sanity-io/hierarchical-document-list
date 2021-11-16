import {Box} from '@sanity/ui'
import {ReactSortableTreeProps} from 'react-sortable-tree'
import Callout from '../components/Callout'
import TreeNode from '../components/TreeNode'
import TreeNodeRenderer from '../components/TreeNodeRenderer'

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
      rowHeight: 50
    }
  }
}
