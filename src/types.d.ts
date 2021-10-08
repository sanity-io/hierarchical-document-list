declare module 'part:*'

interface SanityReference {
  _type: 'reference'
  _ref: string
}

export interface SanityTreeItem {
  _key: string
  node?: SanityReference
  children?: SanityTreeItem[]
}
