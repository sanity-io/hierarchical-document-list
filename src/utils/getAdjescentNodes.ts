import {FlatDataItem, TreeItem} from '@nosferatu500/react-sortable-tree'

/**
 * Gets adjescent non-children nodes of a given treeIndex.
 */
export default function getAdjescentNodes({
  flatTree,
  node,
  treeIndex,
}: {
  flatTree: FlatDataItem[]
  node: TreeItem
  treeIndex: number
}): {
  leadingNode?: FlatDataItem
  followingNode?: FlatDataItem
} {
  const leadingNode = flatTree
    .slice(0, treeIndex)
    .reverse()
    // Disregard children nodes - these include the current node's key in their `path` array
    .find((item) => !item.path.includes(node._key))

  const followingNode = flatTree.slice(treeIndex + 1).find((item) => !item.path.includes(node._key))

  return {
    leadingNode,
    followingNode,
  }
}
