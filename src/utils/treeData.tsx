import {SanityDocument} from '@sanity/client'
import {randomKey} from '@sanity/util/content'
import React from 'react'
import {TreeItem} from 'react-sortable-tree'
import DocumentInNode from '../components/DocumentInNode'
import {AllItems, DocumentPair, SanityTreeItem} from '../types/types'
import flatDataToTree from './flatDataToTree'

export const dataToEditorTree = (data: (SanityTreeItem & {expanded?: boolean})[]): TreeItem[] => {
  const itemsWithTitle = data
    .filter((item) => item?.node?._ref)
    .map((item) => ({
      ...item,
      expanded: item.expanded,
      title: () => <DocumentInNode item={item} />,
      children: []
    }))
  return flatDataToTree(itemsWithTitle)
}

const documentPairToNode = (doc?: DocumentPair): SanityTreeItem | undefined => {
  if (!doc?.published?._id) {
    return undefined
  }

  return {
    _key: randomKey(12),
    _type: 'hierarchy.node',
    nodeDocType: doc.published._type,
    draftId: doc.draft?._id,
    publishedId: doc.published._id,
    node: {
      _ref: doc.published._id,
      _type: 'reference',
      _weak: true
    }
  }
}

export const flatTree = (tree: TreeItem[]): TreeItem[] => {
  return tree.reduce((flattened, item) => {
    const {children, ...node} = item
    return [...flattened, node, ...(Array.isArray(children) ? flatTree(children) : [])]
  }, [] as TreeItem[])
}

export interface FetchData {
  mainTree?: SanityTreeItem[]
  allItems?: SanityDocument[]
}

export const getUnaddedItems = (data: {
  allItems: AllItems
  tree: SanityTreeItem[]
}): SanityTreeItem[] => {
  if (!data.tree) {
    return Object.entries(data.allItems)
      .map((value) => documentPairToNode(value[1]))
      .filter(Boolean) as SanityTreeItem[]
  }

  return Object.entries(data.allItems)
    .filter(
      ([publishedId]) =>
        publishedId && !data.tree.some((treeItem) => treeItem?.node?._ref === publishedId)
    )
    .map(([_publishedId, documentPair]) => documentPairToNode(documentPair))
    .filter(Boolean) as SanityTreeItem[]
}

export function normalizeNodeForStorage(item: TreeItem): SanityTreeItem {
  return {
    _key: item._key,
    _type: item._type || 'hierarchy.node',
    node: item.node,
    parent: item.parent,
    nodeDocType: item.nodeDocType
  }
}
