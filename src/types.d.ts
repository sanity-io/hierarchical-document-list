import {SanityDocument} from '@sanity/client'
import {ArraySchemaType} from '@sanity/types/src/schema'
import {NodeRendererProps, TreeItem} from 'react-sortable-tree'

interface SanityReference {
  _type: 'reference'
  _ref: string
  _weak?: boolean
}

/**
 * Objects saved to tree documents in Sanity's Content Lake
 */
export interface StoredTreeItem {
  _key: string
  _type: 'hierarchy.node' | string
  value?: {
    reference?: SanityReference
    docType?: string
  }
  /**
   * _key of parent node
   */
  parent?: string | null
}

/**
 * Tree items enhanced locally in the client with info from `allItems` and `visibilityMap`.
 * `allItems` stop here and never become LocalTreeItems as they aren't added to react-sortable-tree.
 *
 * See `useLocalTree.ts` and `dataToEditorTree()`.
 */
export interface EnhancedTreeItem extends StoredTreeItem {
  expanded?: boolean | undefined
  /**
   * Used by DocumentInNode to render the preview for drafts if they exist.
   * Also informs document status icons.
   */
  draftId?: string
  draftUpdatedAt?: string
  /**
   * If not present, DocumentInNode will show up an error for invalid document.
   *  - undefined `publishedId` could mean the document is either deleted, or it doesn't match GROQ filters anymore
   */
  publishedId?: string
  publishedUpdatedAt?: string
}

/**
 * Tree items as found in the sortable tree itself.
 */
export type LocalTreeItem = EnhancedTreeItem & Pick<TreeItem, 'title' | 'children'>

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
   * (Optional)
   * Schema type for your hierarchical documents.
   * By default, the document will be of type `hierarchy.tree`, a type provided by the plugin.
   */
  documentType?: string

  /**
   * (Optional)
   * Key for the field representing the hierarchical tree inside the document.
   * `tree` by default.
   */
  fieldKeyInDocument?: string
}

export interface DocumentPair {
  draft?: SanityDocument
  published?: SanityDocument
}

export interface AllItems {
  [publishedId: string]: DocumentPair | undefined
}

type DocumentOperation<Payload = unknown> = {
  execute?: (payload?: Payload) => void
  disabled?: boolean | string
}

export interface DocumentOperations {
  patch?: DocumentOperation<unknown[]>
  commit?: DocumentOperation
  del?: DocumentOperation
  delete?: DocumentOperation
  discardChanges?: DocumentOperation
  duplicate?: DocumentOperation
  restore?: DocumentOperation
  unpublish?: DocumentOperation
  publish?: DocumentOperation
}

export interface VisibilityMap {
  [_key: string]: boolean
}

export interface NodeProps extends NodeRendererProps {
  node: LocalTreeItem
}
