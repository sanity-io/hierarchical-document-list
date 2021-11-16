import React from 'react'
import S from '@sanity/desk-tool/structure-builder'
import TreeDeskStructure from './TreeDeskStructure'
import Callout from './components/Callout'
import {getDeskFilter} from './utils/getDeskQuery'
import {TreeDeskStructureProps} from './types/types'

interface TreeProps extends TreeDeskStructureProps {
  /**
   * Visible title above the tree.
   */
  title?: string
}

const deskTreeValidator = (props: TreeProps): React.FC => {
  const {treeDocId, filter, documentType} = props
  if (typeof treeDocId !== 'string' && !treeDocId) {
    return () => <Callout title="[sanity-plugin-tree-input] Please add a treeDocId to your tree" />
  }
  // @TODO: handle filters starting with `[]`, similarly to how desk-tool's DocumentList does it.
  if (typeof filter !== 'string' && !filter && typeof documentType !== 'string' && !documentType) {
    return () => (
      <Callout title="[sanity-plugin-tree-input] Please add a GROQ filter or a documentType to your tree" />
    )
  }
  return (deskProps) => <TreeDeskStructure {...deskProps} options={props} />
}

export default function createDeskTree(props: TreeProps) {
  const mainList = props.documentType
    ? S.documentTypeList(props.documentType).serialize()
    : S.documentList()
        .id(props.treeDocId)
        .filter(getDeskFilter(props))
        .params(props.params || {})
        .serialize()

  return Object.assign(
    mainList,
    {
      type: 'component',
      component: deskTreeValidator(props),
      options: props
    },
    props.title ? {title: props.title} : {}
  )
}
