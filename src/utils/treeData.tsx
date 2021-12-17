import {SanityDocument} from '@sanity/client'
import React from 'react'
import {TreeItem} from '@nosferatu500/react-sortable-tree'
import {randomKey} from '@sanity/util/content'

import DocumentInNode from '../components/DocumentInNode'
import {SanityTreeItem} from '../types/types'
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

const documentToNode = (doc: SanityDocument): SanityTreeItem => {
  return {
    _key: randomKey(12),
    _type: 'hierarchy.node',
    nodeDocType: doc._type,
    node: {
      _ref: doc._id,
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
  allItems?: SanityDocument[]
  tree: SanityTreeItem[]
}): SanityTreeItem[] => {
  if (!data?.allItems?.length) {
    return []
  }

  if (!data.tree) {
    return data.allItems.map(documentToNode)
  }

  return data.allItems
    .filter((item) => item._id && !data.tree.some((treeItem) => treeItem?.node?._ref === item._id))
    .map(documentToNode)
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
