import S from '@sanity/desk-tool/structure-builder'
import React from 'react'
import TreeDeskStructure from './TreeDeskStructure'
import {TreeDeskStructureProps} from './types/types'

interface TreeProps extends TreeDeskStructureProps {
  /**
   * Visible title above the tree.
   * Also used as the label in the desk list item.
   */
  title: string
}

const deskTreeValidator = (props: TreeProps): React.FC => {
  const {documentId, referenceTo} = props
  if (typeof documentId !== 'string' && !documentId) {
    throw new Error('[hierarchical input] Please add a documentId to your tree')
  }
  if (!Array.isArray(referenceTo)) {
    throw new Error(
      `[hierarchical input] Missing valid 'referenceTo' in createDeskHierarchy (documentId "${documentId}")`
    )
  }
  return (deskProps) => <TreeDeskStructure {...deskProps} options={props} />
}

export default function createDeskHierarchy(props: TreeProps) {
  const {documentId, referenceTo, referenceOptions} = props
  const mainList =
    referenceTo?.length === 1
      ? S.documentTypeList(referenceTo[0]).serialize()
      : S.documentList()
          .id(documentId)
          .filter(referenceOptions?.filter || '')
          .params(referenceOptions?.filterParams || {})
          .serialize()

  return S.listItem()
    .id(documentId)
    .title(props.title || documentId)
    .child(
      Object.assign(
        mainList,
        {
          type: 'component',
          component: deskTreeValidator(props),
          options: props
        },
        props.title ? {title: props.title} : {}
      )
    )
}
