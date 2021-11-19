import {SanityDocument} from '@sanity/client'
import React from 'react'
import {TreeItem} from 'react-sortable-tree'
import DocumentInTree from '../components/DocumentInTree'
import {SanityTreeItem} from '../types/types'

export const treeToData = (tree: TreeItem[]): SanityTreeItem[] =>
  tree.map((entry) => ({
    _key: entry._key,
    node: entry.node,
    nodeDocType: entry.nodeDocType,
    children: Array.isArray(entry.children) ? treeToData(entry.children) : undefined
  }))

export const dataToTree = (data: SanityTreeItem[]): TreeItem[] =>
  data.map((item) => ({
    ...item,
    expanded: true,
    title: () => <DocumentInTree item={item} />,
    children: Array.isArray(item.children) ? dataToTree(item.children) : undefined
  }))

export const documentToNode = (doc: SanityDocument): SanityTreeItem => {
  return {
    _key: doc._id,
    nodeDocType: doc._type,
    node: {
      _ref: doc._id,
      _type: 'reference'
    }
  }
}

export const flatTree = (tree: TreeItem[]): TreeItem[] => {
  return tree.reduce((flattened, item) => {
    const {children, ...node} = item
    return [...flattened, node, ...(Array.isArray(children) ? flatTree(children) : [])]
  }, [] as TreeItem[])
}
