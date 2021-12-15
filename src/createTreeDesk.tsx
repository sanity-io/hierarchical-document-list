import S from '@sanity/desk-tool/structure-builder'
import React from 'react'
import TreeDeskStructure from './TreeDeskStructure'
import {TreeDeskStructureProps} from './types/types'

interface TreeProps extends TreeDeskStructureProps {
  /**
   * Visible title above the tree.
   */
  title?: string
}

const deskTreeValidator = (props: TreeProps): React.FC => {
  const {treeDocId, referenceField} = props
  if (typeof treeDocId !== 'string' && !treeDocId) {
    throw new Error('[hierarchical input] Please add a treeDocId to your tree')
  }
  if (!Array.isArray(referenceField?.to)) {
    throw new Error(
      `[hierarchical input] Missing valid options.referenceField in createTreeField (treeDocId "${treeDocId}")`
    )
  }
  return (deskProps) => <TreeDeskStructure {...deskProps} options={props} />
}

export default function createDeskTree(props: TreeProps) {
  const {treeDocId, referenceField} = props
  const mainList =
    referenceField?.to?.length === 1
      ? S.documentTypeList(referenceField.to[0].type).serialize()
      : S.documentList()
          .id(treeDocId)
          .filter(referenceField.options?.filter || '')
          .params(referenceField.options?.filterParams || {})
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
