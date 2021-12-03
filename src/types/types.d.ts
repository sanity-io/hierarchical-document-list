import {ArraySchemaType} from '@sanity/types'

interface SanityReference {
  _type: 'reference'
  _ref: string
  _weak?: boolean
}

export interface SanityTreeItem {
  _key: string
  _type: 'hierarchy.node' | string
  node: SanityReference
  nodeDocType: string
  /**
   * _key of parent node
   */
  parent?: string | null
}

export interface TreeInputOptions {
  /**
   * The reference field
   * @docs https://www.sanity.io/docs/reference-type
   */
  referenceField: {
    to: {type: string}[]
    options?: {
      /**
       * Static filter to apply to tree document queries.
       */
      filter?: string
      filterParams?: Record<string, unknown>
    }
  }
  /**
   * How deep should editors be allowed to nest items.
   */
  maxDepth?: number
}

export interface TreeFieldSchema
  extends Omit<ArraySchemaType, 'of' | 'type' | 'inputComponent' | 'jsonType'> {
  options: ArraySchemaType['options'] & TreeInputOptions
}
