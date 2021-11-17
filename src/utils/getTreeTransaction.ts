import {SanityClient, Transaction} from '@sanity/client'
import {diffPatch} from 'sanity-diff-patch'
import {SanityTreeItem} from '../types/types'

export default function getTreeTransaction({
  treeDocId,
  prevTree,
  nextTree,
  client
}: {
  prevTree: SanityTreeItem[] | undefined
  nextTree: SanityTreeItem[]
  treeDocId: string
  client: SanityClient
}): Transaction {
  const prevDoc = {
    _id: treeDocId,
    tree: prevTree
  }
  const nextDoc = {
    _id: treeDocId,
    tree: nextTree
  }
  const patch = diffPatch(prevDoc, nextDoc)

  return client.transaction([{patch: {id: treeDocId, setIfMissing: {tree: []}}}, ...patch])
}
