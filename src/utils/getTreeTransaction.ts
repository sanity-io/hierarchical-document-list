import {SanityClient, Transaction} from '@sanity/client'
import sanityClient from 'part:@sanity/base/client'
import {diffPatch} from 'sanity-diff-patch'
import {SanityTreeItem} from '../types/types'

const client = sanityClient.withConfig({
  apiVersion: '2021-09-01'
}) as SanityClient

export default function getTreeTransaction({
  treeDocId,
  prevTree,
  nextTree,
  transactionId
}: {
  prevTree: SanityTreeItem[] | undefined
  nextTree: SanityTreeItem[]
  treeDocId: string
  transactionId: string
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

  return client
    .transaction([{patch: {id: treeDocId, setIfMissing: {tree: []}}}, ...patch])
    .transactionId(transactionId)
}
