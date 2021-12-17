import {getTreeFromFlatData} from '@nosferatu500/react-sortable-tree'
import {SanityTreeItem} from '../types/types'

interface TreeItemWithChildren extends SanityTreeItem {
  children?: TreeItemWithChildren[]
}

export default function flatDataToTree(data: SanityTreeItem[]): TreeItemWithChildren[] {
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
