import {AddIcon} from '@sanity/icons'
import * as React from 'react'
import type {ConfigContext} from 'sanity'
import {StructureBuilder} from 'sanity/desk'

import TreeDeskStructure from './TreeDeskStructure'
import {TreeDeskStructureProps} from './types'
import throwError from './utils/throwError'

export interface TreeProps extends TreeDeskStructureProps {
  /**
   * Visible title above the tree.
   * Also used as the label in the desk list item.
   */
  title: string

  /**
   * Optional icon for rendering the item in the desk structure.
   */
  icon?: any

  context?: ConfigContext | any
  S?: StructureBuilder | any
}

const deskTreeValidator = (props: TreeProps): React.FC => {
  const {documentId, referenceTo} = props
  if (typeof documentId !== 'string' && !documentId) {
    throwError('invalidDocumentId')
  }
  if (!Array.isArray(referenceTo)) {
    throwError('invalidReferenceTo', `(documentId "${documentId}")`)
  }

  return (deskProps) => <TreeDeskStructure {...deskProps} options={props} />
}

export default function createDeskHierarchy(props: TreeProps) {
  const {documentId, referenceTo, referenceOptions, context, S} = props
  const {schema} = context
  /**
   * Context: With multiple referenced document types we can’t set S.documentList().schemaType(),
   * which only accepts one type. So the desk doesn’t have an expanded schemaType to access and
   * try creating a new document without that, which breaks resolveEnabledActions (and probably more)
   * in packages\@sanity\base\src\actions\utils\legacy_documentActionUtils.js
   */
  const safelyCreatableTypes = referenceTo.slice(0, 1)
  let mainList = (
    safelyCreatableTypes?.length === 1
      ? S.documentTypeList(safelyCreatableTypes[0]).schemaType(safelyCreatableTypes[0])
      : S.documentList().filter('_type in $types').params({types: safelyCreatableTypes})
  )
    .id(documentId)
    .menuItems(
      (safelyCreatableTypes || []).map((schemaType) =>
        S.menuItem()
          .intent({
            type: 'create',
            params: {type: schemaType}
          })
          .title(`Create ${schema.get(schemaType)?.title}`)
          .icon(schema.get(schemaType)?.icon || AddIcon)
      )
    )
    .canHandleIntent((intent: string, c: Record<string, unknown>) => {
      // Can edit itself
      if (intent === 'edit' && c.id === props.documentId) {
        return true
      }
      // Can create & edit referenced document types
      if (safelyCreatableTypes.includes(c.type as string)) {
        return true
      }
      return false
    })

  if (referenceOptions?.filter) {
    mainList = mainList.filter(referenceOptions.filter)
  }

  if (referenceOptions?.filterParams) {
    mainList = mainList.params(referenceOptions.filterParams)
  }

  return S.listItem()
    .id(documentId)
    .title(props.title || documentId)
    .icon(props.icon)
    .child(
      Object.assign(
        mainList.serialize(),
        {
          type: 'component',
          component: deskTreeValidator(props),
          options: props,
          __preserveInstance: true
        },
        props.title ? {title: props.title} : {}
      )
    )
}
