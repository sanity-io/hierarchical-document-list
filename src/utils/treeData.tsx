import {SanityDocument} from '@sanity/client'
import React from 'react'
import {getTreeFromFlatData, TreeItem} from 'react-sortable-tree'
import DocumentInNode from '../components/DocumentInNode'
import {SanityTreeItem} from '../types/types'

export const dataToTree = (data: (SanityTreeItem & {expanded?: boolean})[]): TreeItem[] => {
  const itemsWithTitle = data.map((item) => ({
    ...item,
    // if parent: undefined, the tree won't be constructed
    parent: item.parent || null,
    expanded: item.expanded,
    title: () => <DocumentInNode item={item} />,
    children: []
  }))
  return getTreeFromFlatData({
    flatData: itemsWithTitle,
    getKey: (item) => item._key,
    getParentKey: (item) => item.parent,
    // without rootKey, the tree won't be constructed
    rootKey: null as any
  })
}

export const documentToNode = (doc: SanityDocument): SanityTreeItem => {
  return {
    _key: doc._id,
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
  if (!data.allItems?.length) {
    return []
  }

  if (!data.tree) {
    return data.allItems.map(documentToNode)
  }

  return data.allItems
    .filter((item) => item._id && !data.tree.some((treeItem) => treeItem.node._ref === item._id))
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
