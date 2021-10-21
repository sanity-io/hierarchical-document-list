import {Box} from '@sanity/ui'
import {ReactSortableTreeProps} from 'react-sortable-tree'
import Callout from './Callout'
import TreeNode from './TreeNode'

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
      )
    }
  }
}
