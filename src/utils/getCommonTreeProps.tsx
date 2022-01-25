import {ReactSortableTreeProps} from 'react-sortable-tree'
import NodeContentRenderer from '../components/NodeContentRenderer'
import PlaceholderDropzone from '../components/PlaceholderDropzone'
import TreeNodeRenderer from '../components/TreeNodeRenderer'
import {ROW_HEIGHT} from './getTreeHeight'

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
