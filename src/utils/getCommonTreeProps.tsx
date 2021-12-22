import {ReactSortableTreeProps, TreeItem} from 'react-sortable-tree'
import NodeContentRenderer from '../components/NodeContentRenderer'
import PlaceholderDropzone from '../components/PlaceholderDropzone'
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
    theme: {
      nodeContentRenderer: NodeContentRenderer,
      placeholderRenderer: (props) => <PlaceholderDropzone {...placeholder} {...props} />,
      treeNodeRenderer: TreeNodeRenderer,
      rowHeight: ROW_HEIGHT
    }
  }
}
