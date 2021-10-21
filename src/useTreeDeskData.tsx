import {SanityClient, SanityDocument} from '@sanity/client'
import sanityClient from 'part:@sanity/base/client'
import React from 'react'
import {ReactSortableTreeProps} from 'react-sortable-tree'
import 'react-sortable-tree/style.css?raw'
import {Subscription} from 'rxjs'
import getDeskQuery from './getDeskQuery'
import {TreeDeskStructureProps, TreeDoc} from './types'

interface StateData {
  treeDoc?: TreeDoc
  allItems?: SanityDocument[]
  unaddedItems?: SanityDocument[]
}

type State = 'loading' | 'loaded' | 'error'

const client = sanityClient.withConfig({
  apiVersion: '2021-09-01'
}) as SanityClient

const getUnaddedItems = (data: Omit<StateData, 'unaddedItems'>): SanityDocument[] => {
  if (!data.treeDoc?._id || !data.allItems?.length) {
    return []
  }

  const stringifiedTree = JSON.stringify(data.treeDoc.tree)
  return data.allItems.filter((item) => !stringifiedTree.includes(item._id))
}

export default function useTreeDeskData(options: TreeDeskStructureProps) {
  const [data, setData] = React.useState<StateData>({})
  const [state, setState] = React.useState<State>('loading')

  const loadData = React.useCallback(async () => {
    try {
      const newData = await client.fetch<Omit<StateData, 'unaddedItems'>>(
        getDeskQuery(options),
        options.params as Record<string, unknown>
      )

      if (!newData.treeDoc?._id) {
        const newTreeDoc = await client.create({
          _type: 'tree.document',
          _id: options.treeDocId,
          tree: []
        })
        newData.treeDoc = newTreeDoc
      }

      if (!newData.treeDoc?._id || !newData.allItems?.length) {
        setState('error')
        return
      }

      setData({
        ...newData,
        unaddedItems: getUnaddedItems(newData)
      })
      setState('loaded')
    } catch (error) {
      setState('error')
    }
  }, [options.treeDocId, options.filter, options.params])

  React.useEffect(() => {
    let subscription: Subscription
    if (state === 'loaded') {
      subscription = client.observable
        .listen(getDeskQuery(options), options.params, {
          visibility: 'query'
        })
        .subscribe(loadData)
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [state])

  React.useEffect(() => {
    loadData()
  }, [])

  const handleMainTreeChange: ReactSortableTreeProps['onChange'] = (newTree) => {
    console.log({newTree})
  }

  const handleUnaddedTreeChange: ReactSortableTreeProps['onChange'] = (newTree) => {
    return setData({
      ...data,
      unaddedItems: newTree.map((entry) => entry.item) as SanityDocument[]
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
