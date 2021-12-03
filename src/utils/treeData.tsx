import {SanityDocument} from '@sanity/client'
import React from 'react'
import {getTreeFromFlatData, TreeItem} from 'react-sortable-tree'
import DocumentInNode from '../components/DocumentInNode'
import {SanityTreeItem} from '../types/types'

export const dataToTree = (data: SanityTreeItem[]): TreeItem[] => {
  const itemsWithTitle = data.map((item) => ({
    ...item,
    // if parent: undefined, the tree won't be constructed
    parent: item.parent || null,
    expanded: true,
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
  tree?: (SanityTreeItem | TreeItem)[]
}): SanityTreeItem[] => {
  if (!data.allItems?.length) {
    return []
  }

  if (!data.tree) {
    return data.allItems.map(documentToNode)
  }

  const stringifiedTree = JSON.stringify(data.tree)
  return data.allItems
    .filter((item) => item._id && !stringifiedTree.includes(item._id))
    .map(documentToNode)
}
