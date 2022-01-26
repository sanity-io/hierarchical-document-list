import {SanityDocument} from '@sanity/client'
import {randomKey} from '@sanity/util/content'
import React from 'react'
import {NodeRendererProps, TreeItem} from 'react-sortable-tree'
import DocumentInNode from '../components/DocumentInNode'
import NodeActions from '../components/NodeActions'
import {
  AllItems,
  DocumentPair,
  EnhancedTreeItem,
  LocalTreeItem,
  StoredTreeItem,
  VisibilityMap
} from '../types'
import flatDataToTree from './flatDataToTree'

export const dataToEditorTree = ({
  tree,
  allItems,
  visibilityMap
}: {
  tree: StoredTreeItem[]
  allItems: AllItems
  visibilityMap: VisibilityMap
}): LocalTreeItem[] => {
  const itemsWithTitle = tree
    .filter((item) => item?.value?.reference?._ref)
    .map((item) => {
      const refId = item.value?.reference?._ref
      const docPair = refId ? allItems[refId] : undefined
      const draftDoc = docPair?.draft
      const publishedDoc = docPair?.published

      const enhancedItem: LocalTreeItem = {
        ...item,
        expanded: visibilityMap[item._key] !== false,
        draftId: draftDoc?._id,
        publishedId: publishedDoc?._id,
        draftUpdatedAt: draftDoc?._updatedAt,
        publishedUpdatedAt: publishedDoc?._updatedAt
      }

      return {
        ...enhancedItem,
        title: (nodeProps: NodeRendererProps) => (
          <DocumentInNode item={enhancedItem} action={<NodeActions nodeProps={nodeProps} />} />
        ),
        children: []
      }
    })
  return flatDataToTree(itemsWithTitle)
}

const documentPairToNode = (doc?: DocumentPair): EnhancedTreeItem | undefined => {
  if (!doc?.published?._id) {
    return undefined
  }

  return {
    _key: randomKey(12),
    _type: 'hierarchy.node',
    draftId: doc.draft?._id,
    draftUpdatedAt: doc.draft?._updatedAt,
    publishedId: doc.published._id,
    publishedUpdatedAt: doc.published?._updatedAt,
    value: {
      reference: {
        _ref: doc.published._id,
        _type: 'reference',
        _weak: true
      },
      docType: doc.published._type
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
  mainTree?: LocalTreeItem[]
  allItems?: SanityDocument[]
}

export const getUnaddedItems = (data: {
  allItems: AllItems
  tree: StoredTreeItem[]
}): EnhancedTreeItem[] => {
  if (!data.tree) {
    return Object.entries(data.allItems)
      .map((value) => documentPairToNode(value[1]))
      .filter(Boolean) as EnhancedTreeItem[]
  }

  return Object.entries(data.allItems)
    .filter(
      ([publishedId]) =>
        publishedId &&
        // unadded items shouldn't be in the tree
        !data.tree.some((treeItem) => treeItem?.value?.reference?._ref === publishedId)
    )
    .map(([_publishedId, documentPair]) => documentPairToNode(documentPair))
    .filter(Boolean) as EnhancedTreeItem[]
}

export function normalizeNodeForStorage(item: LocalTreeItem): StoredTreeItem {
  return {
    _key: item._key,
    _type: item._type || 'hierarchy.node',
    value: item.value,
    parent: item.parent
  }
}
