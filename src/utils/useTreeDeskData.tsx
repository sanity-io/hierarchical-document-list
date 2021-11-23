import {SanityClient, SanityDocument, ListenEvent} from '@sanity/client'
import {useMachine} from '@xstate/react'
import {nanoid} from 'nanoid'
import sanityClient from 'part:@sanity/base/client'
import {TreeItem} from 'react-sortable-tree'
import {assign} from 'xstate'
import {SanityTreeItem, TreeDeskStructureProps} from '../types/types'
import {treeDeskMachine} from '././treeDesk.machine'
import getDeskQuery from './getDeskQuery'
import getTreeTransaction from './getTreeTransaction'
import {dataToTree, documentToNode, flatTree, treeToData} from './treeData'

interface FetchData {
  mainTree?: SanityTreeItem[]
  allItems?: SanityDocument[]
}

const client = sanityClient.withConfig({
  apiVersion: '2021-09-01'
}) as SanityClient

const getUnaddedItems = (data: FetchData): SanityTreeItem[] => {
  if (!data.mainTree || !data.allItems?.length) {
    return []
  }

  const stringifiedTree = JSON.stringify(data.mainTree)
  return data.allItems
    .filter((item) => item._id && !stringifiedTree.includes(item._id))
    .map(documentToNode)
}

export default function useTreeDeskData(options: TreeDeskStructureProps) {
  const [state, send] = useMachine(treeDeskMachine, {
    context: {
      treeDocId: options.treeDocId,
      filter: options.filter,
      params: options.params
    },
    services: {
      loadData: (context) => client.fetch<FetchData>(getDeskQuery(context), context.params || {}),
      createTreeDocument: (context) =>
        client.create({
          _type: 'tree.document',
          _id: context.treeDocId,
          tree: []
        }),
      subscribeListener: (context) => (callback) => {
        const listener = client
          .listen(
            '*[_id == $treeDocId][0]',
            {treeDocId: context.treeDocId},
            {
              visibility: 'query'
            }
          )
          .subscribe((data) =>
            callback({
              type: 'HANDLE_LISTENER',
              data
            })
          )
        return () => {
          listener.unsubscribe()
        }
      },
      persistChanges: async (context, event) => {
        console.log('persistChanges', {context, event})
        if (!Array.isArray(event.newTree)) {
          return
        }
        const prevTree = context.mainTree
        const nextTree = event.newTree as TreeItem[]

        const transactionId = nanoid()
        // 1. Update local state for immediate feedback
        send({
          type: 'UPDATE_MAIN_TREE',
          data: {
            mainTree: nextTree,
            transactionId
          }
        })

        // 2. Patch the ToC document, only if data has changed
        const storeableData = treeToData(nextTree)
        const currentlyStored = prevTree ? treeToData(prevTree) : undefined

        if (JSON.stringify(storeableData) === JSON.stringify(currentlyStored)) {
          return
        }

        try {
          const transaction = getTreeTransaction({
            prevTree: currentlyStored,
            nextTree: storeableData,
            treeDocId: options.treeDocId,
            client,
            transactionId
          })
          await transaction.commit({returnDocuments: false})
        } catch (error) {
          // If the patch didn't work, rollback the changes
          send({
            type: 'UPDATE_MAIN_TREE',
            data: {
              mainTree: prevTree
            }
          })
          throw new Error("Couldn't update tree")
        }
      }
    },
    actions: {
      setLoadedData: assign((context, event) => {
        // event.data doesn't necessarily hold both mainTree & allItems
        const mainTree =
          (Array.isArray(event.data.mainTree)
            ? dataToTree(event.data.mainTree)
            : context.mainTree) || []
        const allItems = event.data.allItems || context.allItems
        const localTransactions = context.localTransactions
        if (typeof event.data.transactionId === 'string') {
          localTransactions.push(event.data.transactionId)
        }
        return {
          mainTree,
          allItems,
          unaddedItems: event.data.mainTree
            ? dataToTree(getUnaddedItems({allItems, mainTree: event.data.mainTree}))
            : context.mainTree,
          localTransactions
        }
      }),
      handleListener: (context, event) => {
        const data = event.data as ListenEvent<unknown>
        if (data.type !== 'mutation') {
          return
        }

        if (
          data.result?._id === context.treeDocId &&
          Array.isArray((data.result as SanityDocument).tree) &&
          !context.localTransactions.includes(data.transactionId)
        ) {
          send({
            type: 'UPDATE_MAIN_TREE',
            data: {
              mainTree: (data.result as SanityDocument).tree
            }
          })
        }
      },

      // Return a flat version of unaddedItems as we don't want them to be nested
      handleUnaddedTreeChange: assign({
        unaddedItems: (context, event) => {
          return Array.isArray(event.newTree) ? flatTree(event.newTree) : context.unaddedItems
        }
      })
    },
    guards: {
      treeIsValid: (_context, event) => Array.isArray(event.data.mainTree)
    }
  })

  return {
    state,
    send
  }
}
