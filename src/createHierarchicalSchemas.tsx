import * as React from 'react'
import {ArraySchemaType} from 'sanity'
import {DEFAULT_FIELD_KEY} from './TreeDeskStructure'
import TreeInputComponent from './TreeInputComponent'
import {TreeDeskStructureProps, TreeFieldSchema} from './types'
import {
  INTERNAL_NODE_ARRAY_TYPE,
  INTERNAL_NODE_TYPE,
  INTERNAL_NODE_VALUE_TYPE,
  getSchemaTypeName
} from './utils/injectNodeTypeInPatches'
import throwError from './utils/throwError'

type SchemaOptions = Omit<TreeDeskStructureProps, 'documentId' | 'maxDepth'>

function createHierarchicalNodeValueType({
  referenceTo,
  referenceOptions,
  documentType
}: SchemaOptions) {
  return {
    // when used inside the field, name & type are overwritten by createHierarchicalNodeType
    name: documentType ? getSchemaTypeName(documentType, 'nodeValue') : INTERNAL_NODE_VALUE_TYPE,
    type: 'object',
    title: `Hierarchical node value (${documentType})`,

    fields: [
      {name: 'docType', type: 'string'},
      {
        name: 'reference',
        type: 'reference',
        weak: true,
        to: referenceTo.map((type) => ({type})),
        options: referenceOptions
      }
    ]
  }
}

function createHierarchicalNodeType(options: SchemaOptions) {
  return {
    // name & type are overwritten by createHierarchicalField
    name: options.documentType
      ? getSchemaTypeName(options.documentType, 'node')
      : INTERNAL_NODE_TYPE,
    title: `Hierarchical node (${options.documentType})`,
    type: 'object',
    fields: [
      {name: 'parent', type: 'string'},

      options.documentType
        ? {name: 'value', type: getSchemaTypeName(options.documentType, 'nodeValue')}
        : // If no documentType is defined, use an anonymized inline object to avoid
          // having to define another custom schema type through the plugin
          {
            ...createHierarchicalNodeValueType(options),
            name: 'value',
            type: 'object'
          }
    ]
  }
}

function createHierarchicalArrayType(options: SchemaOptions) {
  return {
    // name & type are overwritten by createHierarchicalField
    name: options.documentType
      ? getSchemaTypeName(options.documentType, 'array')
      : INTERNAL_NODE_ARRAY_TYPE,
    title: `Hierarchical array of nodes (${options.documentType})`,
    type: 'array',
    of: [
      options.documentType
        ? {type: getSchemaTypeName(options.documentType, 'node')}
        : createHierarchicalNodeType(options)
    ]
  }
}

export function createHierarchicalField({name, title, options, ...rest}: TreeFieldSchema): Omit<
  ArraySchemaType,
  'type' | 'jsonType' | 'of'
> & {
  type: string
  inputComponent: React.FC<any>
  of?: any[]
} {
  if (!Array.isArray(options?.referenceTo)) {
    throwError('invalidReferenceTo', `(field of name "${name}")`)
  }

  return {
    ...rest,
    name,
    title,
    inputComponent: TreeInputComponent,
    options,
    ...(options.documentType
      ? {type: getSchemaTypeName(options.documentType, 'array')}
      : {
          ...createHierarchicalArrayType(options),
          name
        })
  }
}

function createHierarchicalDocType(options: SchemaOptions) {
  return {
    name: options.documentType,
    title: 'Hierarchical tree',
    type: 'document',
    // The plugin needs to define a `schemaType` with liveEdit enabled so that
    // `useDocumentOperation` in TreeDeskStructure.tsx doesn't create drafts at every patch.
    liveEdit: true,
    fields: [
      createHierarchicalField({
        name: options.fieldKeyInDocument || DEFAULT_FIELD_KEY,
        title: 'Hierarchical Tree',
        options
      })
    ],
    preview: {
      select: {
        id: '_id',
        tree: 'tree'
      },
      prepare({id, tree}: {id: string; tree: unknown[]}): Record<string, string> {
        return {
          title: `Hierarchical documents (ID: ${id})`,
          subtitle: `${tree?.length || 0} document(s) in its list.`
        }
      }
    }
  }
}

export default function createHierarchicalSchemas(options: SchemaOptions) {
  if (!Array.isArray(options.referenceTo) || options.referenceTo.length <= 0) {
    throwError('invalidReferenceTo')
  }
  if (!options.documentType) {
    throwError('invalidDocumentType')
  }

  return [
    createHierarchicalDocType(options),
    createHierarchicalArrayType(options),
    createHierarchicalNodeType(options),
    createHierarchicalNodeValueType(options)
  ]
}
