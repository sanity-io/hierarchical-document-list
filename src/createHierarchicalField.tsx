import {ArraySchemaType} from '@sanity/types'
import React from 'react'
import TreeInputComponent from './TreeInputComponent'
import {TreeFieldSchema} from './types'

export default function createHierarchicalField({
  name,
  title,
  options,
  ...rest
}: TreeFieldSchema): Omit<ArraySchemaType, 'type' | 'jsonType' | 'of'> & {
  type: string
  inputComponent: React.FC<any>
  of: any[]
} {
  if (!Array.isArray(options?.referenceTo)) {
    throw new Error(
      `[hierarchical input] Missing valid options.referenceTo in createHierarchicalField (field of name "${name}")`
    )
  }

  return {
    ...rest,
    options,
    name,
    title,
    type: 'array',
    of: [
      {
        type: 'object',
        fields: [
          {name: 'parent', type: 'string'},
          {
            name: 'value',
            type: 'object',
            fields: [
              {name: 'docType', type: 'string'},
              {
                name: 'reference',
                type: 'reference',
                weak: true,
                to: options.referenceTo.map((type) => ({type})),
                options: options.referenceOptions
              }
            ]
          }
        ]
      }
    ],
    inputComponent: TreeInputComponent
  }
}
