import {MutationEvent, SanityClient, SanityDocument} from '@sanity/client'
import {nanoid} from 'nanoid'
import sanityClient from 'part:@sanity/base/client'
import React from 'react'
import {TreeInputOptions} from '../types/types'

const client = sanityClient.withConfig({
  apiVersion: '2021-09-01'
}) as SanityClient

function getDeskFilter({referenceField}: TreeInputOptions): {
  filter: string
  params: Record<string, unknown>
} {
  const {to = [], options} = referenceField
  const filterParts: string[] = ['!(_id in path("drafts.**"))', '_type in $generatedTypes']

  if (options?.filter) {
    filterParts.push(options.filter)
  }

  return {
    filter: filterParts.join(' && '),
    params: {
      ...(options?.filterParams || {}),
      generatedTypes: to.map((schemaType) => schemaType.type)
    }
  }
}

type Status = 'loading' | 'success' | 'error'

type ACTIONTYPE =
  | {type: 'addOrEditItem'; item: SanityDocument}
  | {type: 'removeItem'; itemId: string}
  | {type: 'setInitialData'; items: SanityDocument[]}

function allItemsReducer(state: SanityDocument[], action: ACTIONTYPE) {
  if (action.type === 'addOrEditItem' && action.item?._id) {
    const idx = state.findIndex((item) => item._id === action.item._id)
    if (idx >= 0) {
      return [...state.slice(0, idx), action.item, ...state.slice(idx + 1)]
    }
    return [...state, action.item]
  }
  if (action.type === 'removeItem') {
    const idx = state.findIndex((item) => item._id === action.itemId)
    if (idx < 0) {
      return state
    }
    return [...state.slice(0, idx), ...state.slice(idx + 1)]
  }
  if (action.type === 'setInitialData') {
    return action.items.map((item) => ({
      ...item,
      _key: item._key || nanoid()
    }))
  }
  return state
}

export default function useAllItems(options: TreeInputOptions): {
  status: Status
  allItems: SanityDocument[]
} {
  const [status, setStatus] = React.useState<Status>('loading')
  const [allItems, dispatch] = React.useReducer(allItemsReducer, [])

  function handleListener(event: MutationEvent<unknown>) {
    if (event.type !== 'mutation') {
      return
    }

    if (event.result) {
      dispatch({type: 'addOrEditItem', item: event.result})
    } else {
      dispatch({type: 'removeItem', itemId: event.documentId})
    }
  }

  function handleFirstLoad(items: SanityDocument[]) {
    dispatch({type: 'setInitialData', items})
    setStatus('success')
  }

  React.useEffect(() => {
    const {filter, params} = getDeskFilter(options)
    const query = `*[${filter}] {
      _id,
      _type,
    }`
    client
      .fetch<SanityDocument[]>(query, params)
      .then(handleFirstLoad)
      .catch(() => {
        setStatus('error')
      })

    const listener = client.listen(query, params).subscribe(handleListener)
    return () => {
      listener.unsubscribe()
    }
  }, [])

  return {
    status,
    allItems
  }
}
