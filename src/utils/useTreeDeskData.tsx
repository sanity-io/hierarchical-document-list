import {SanityClient, SanityDocument} from '@sanity/client'
import sanityClient from 'part:@sanity/base/client'
import React from 'react'
import {ReactSortableTreeProps, TreeItem} from 'react-sortable-tree'
import {asyncScheduler} from 'rxjs'
import {throttleTime} from 'rxjs/operators'
import {SanityTreeItem, TreeDeskStructureProps} from '../types/types'
import getDeskQuery from './getDeskQuery'
import getTreeTransaction from './getTreeTransaction'
import {dataToTree, documentToNode, flatTree, treeToData} from './treeData'

interface FetchData {
  mainTree?: SanityTreeItem[]
  allItems?: SanityDocument[]
}

// What FetchData gets transformed into by loadData
interface StateData {
  mainTree?: TreeItem[]
  allItems?: SanityDocument[]
  unaddedItems?: TreeItem[]
}

type State = 'loading' | 'loaded' | 'error'

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
  const [data, setData] = React.useState<StateData>({})
  const [state, setState] = React.useState<State>('loading')

  const loadData = React.useCallback(async () => {
    try {
      const newData = await client.fetch<FetchData>(
        getDeskQuery(options),
        options.params as Record<string, unknown>
      )

      if (!Array.isArray(newData.mainTree)) {
        const newTreeDoc = await client.create({
          _type: 'tree.document',
          _id: options.treeDocId,
          tree: []
        })
        newData.mainTree = newTreeDoc.tree
      }

      if (!Array.isArray(newData.mainTree) || !newData.allItems?.length) {
        setState('error')
        return
      }

      setData({
        ...newData,
        mainTree: dataToTree(newData.mainTree),
        unaddedItems: dataToTree(getUnaddedItems(newData))
      })
      setState('loaded')
    } catch (error) {
      setState('error')
    }
  }, [options])

  React.useEffect(() => {
    loadData()
  }, [])

  React.useEffect(() => {
    const listener = client
      .listen(
        '*[_id == $treeDocId][0]',
        {treeDocId: options.treeDocId},
        {
          visibility: 'query'
        }
      )
      .pipe(throttleTime(1000, asyncScheduler, {trailing: true}))
      .subscribe(loadData)
    return () => {
      listener.unsubscribe()
    }
  }, [options])

  const handleMainTreeChange: ReactSortableTreeProps['onChange'] = async (nextTree) => {
    const prevTree = data.mainTree

    // 1. Update local state for immediate feedback
    setData({
      ...data,
      mainTree: nextTree
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
        client
      })
      await transaction.commit({returnDocuments: false})
    } catch (error) {
      // If the patch didn't work, rollback the changes
      setData({
        ...data,
        mainTree: prevTree
      })
      // @TODO: error toast
    }
  }

  const handleUnaddedTreeChange: ReactSortableTreeProps['onChange'] = (newTree) => {
    setData({
      ...data,
      unaddedItems: flatTree(newTree)
    })
  }

  const retryFetching = () => {
    setState('loading')
    loadData()
  }

  return {
    handleMainTreeChange,
    handleUnaddedTreeChange,
    retryFetching,
    data,
    state
  }
}
