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
   * What document types this hierarchy can refer to.
   * Similar to the `to` property of the [reference field](https://www.sanity.io/docs/reference-type).
   */
  referenceTo: string[]

  /**
   * Used to provide fine-grained filtering for documents.
   */
  referenceOptions?: {
    /**
     * Static filter to apply to tree document queries.
     */
    filter?: string
    /**
     * Parameters / variables to pass to the GROQ query ran to fetch documents.
     */
    filterParams?: Record<string, unknown>
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

export interface TreeDeskStructureProps extends TreeInputOptions {
  /**
   * _id of the document that will hold the tree data.
   */
  documentId: string
  /**
   * Schema type for your hierarchical documents.
   */
  documentType?: string
  /**
   * Key for the field representing the hierarchical tree inside the document.
   */
  fieldKeyInDocument?: string
}
