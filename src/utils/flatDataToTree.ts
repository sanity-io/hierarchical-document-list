import {getTreeFromFlatData} from 'react-sortable-tree'
import {StoredTreeItem} from '../types'

interface TreeItemWithChildren extends StoredTreeItem {
  children?: TreeItemWithChildren[]
}

export default function flatDataToTree(data: StoredTreeItem[]): TreeItemWithChildren[] {
  return getTreeFromFlatData({
    flatData: data.map((item) => ({
      ...item,
      // if parent: undefined, the tree won't be constructed
      parent: item.parent || null
    })),
    getKey: (item) => item._key,
    getParentKey: (item) => item.parent,
    // without rootKey, the tree won't be constructed
    rootKey: null as any
  }) as TreeItemWithChildren[]
}
