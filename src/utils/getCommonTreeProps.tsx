import NodeContentRenderer from '../components/NodeContentRenderer'
import PlaceholderDropzone from '../components/PlaceholderDropzone'
import TreeNodeRenderer from '../components/TreeNodeRenderer'
import {ROW_HEIGHT} from './getTreeHeight'

export default function getCommonTreeProps({
  placeholder,
}: {
  placeholder: {
    title: string
    subtitle?: string
  }
}): Partial<any> {
  return {
    theme: {
      nodeContentRenderer: NodeContentRenderer,
      placeholderRenderer: (props: any) => <PlaceholderDropzone {...placeholder} {...props} />,
      treeNodeRenderer: TreeNodeRenderer,
      rowHeight: ROW_HEIGHT,
    },
  }
}
