import type {TreeItem} from 'react-sortable-tree'
import type {SanityTreeItem} from './types'

function sanitizeTreeItem(item: TreeItem): SanityTreeItem {
  return {
    _key: item._key,
    node: item.node,
    children:
      Array.isArray(item.children) && item.children.length
        ? sanitizeTreeInput(item.children)
        : undefined
  }
}

export default function sanitizeTreeInput(items?: TreeItem[]): SanityTreeItem[] {
  if (!Array.isArray(items) || !items.length) {
    return []
  }
  return items.map(sanitizeTreeItem).filter(Boolean)
}
