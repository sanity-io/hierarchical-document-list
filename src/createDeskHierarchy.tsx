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
  const {documentId, referenceField} = props
  if (typeof documentId !== 'string' && !documentId) {
    throw new Error('[hierarchical input] Please add a documentId to your tree')
  }
  if (!Array.isArray(referenceField?.to)) {
    throw new Error(
      `[hierarchical input] Missing valid options.referenceField in createTreeField (documentId "${documentId}")`
    )
  }
  return (deskProps) => <TreeDeskStructure {...deskProps} options={props} />
}

export default function createDeskHierarchy(props: TreeProps) {
  const {documentId, referenceField} = props
  const mainList =
    referenceField?.to?.length === 1
      ? S.documentTypeList(referenceField.to[0].type).serialize()
      : S.documentList()
          .id(documentId)
          .filter(referenceField.options?.filter || '')
          .params(referenceField.options?.filterParams || {})
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
