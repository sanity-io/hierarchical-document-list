import {ArraySchemaType} from '@sanity/types'
import React from 'react'
import TreeInputComponent from './TreeInputComponent'
import {TreeFieldSchema} from './types/types'

export default function createTreeField({name, title, options, ...rest}: TreeFieldSchema): Omit<
  ArraySchemaType,
  'type' | 'jsonType'
> & {
  type: string
  inputComponent: React.FC<any>
} {
  if (!Array.isArray(options?.referenceField?.to)) {
    throw new Error(
      `[hierarchical input] Missing valid options.referenceField in createTreeField (field of name "${name}")`
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
          {name: 'nodeDocType', type: 'string'},
          {
            name: 'node',
            type: 'reference',
            weak: true,
            to: options.referenceField,
            options: options.referenceField.options
          }
        ]
      }
    ],
    inputComponent: TreeInputComponent
  }
}
