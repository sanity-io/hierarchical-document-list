import type {SanityDocument} from '@sanity/client'

declare module 'part:@sanity/*'

interface SanityReference {
  _type: 'reference'
  _ref: string
}

export interface SanityTreeItem {
  _key: string
  node?: SanityReference
  children?: SanityTreeItem[]
}

export interface TreeDoc extends SanityDocument {
  tree: SanityTreeItem[]
}

export interface TreeDeskStructureProps {
  /**
   * _id of the document that will hold the tree data.
   */
  treeDocId: string
  /**
   * GROQ filter that should return documents
   * Example: _type in ["category", "post"]
   */
  filter?: string
  /**
   * If only using one document type, add it here to get proper menu items.
   */
  documentType?: string
  /**
   * Parameters to be added to the GROQ query.
   */
  params?: Record<string, unknown>
}
