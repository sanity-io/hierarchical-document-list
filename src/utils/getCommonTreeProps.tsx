import {ReactSortableTreeProps} from '@nosferatu500/react-sortable-tree/react-sortable-tree'
import React from 'react'
import NodeContentRenderer from '../components/NodeContentRenderer'
import PlaceholderDropzone from '../components/PlaceholderDropzone'
import TreeNodeRenderer from '../components/TreeNodeRenderer'
// import {ROW_HEIGHT} from './getTreeHeight'

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
      placeholderRenderer: (props: any) => <PlaceholderDropzone {...placeholder} {...props} />,
      treeNodeRenderer: TreeNodeRenderer,
      style: {height: '100%'},
      innerStyle: undefined,
      //TODO: check if this is needed
      scaffoldBlockPxWidth: 44,
      slideRegionSize: 100
      // rowHeight: ROW_HEIGHT,
    }
  }
}
