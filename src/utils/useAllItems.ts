import {MutationEvent, SanityClient, SanityDocument} from '@sanity/client'
import sanityClient from 'part:@sanity/base/client'
import React from 'react'
import {TreeInputOptions} from '../types/types'

const client = sanityClient.withConfig({
  apiVersion: '2021-09-01'
}) as SanityClient

function getDeskFilter({referenceTo, referenceOptions}: TreeInputOptions): {
  filter: string
  params: Record<string, unknown>
} {
  const filterParts: string[] = ['!(_id in path("drafts.**"))', '_type in $generatedTypes']

  if (referenceOptions?.filter) {
    filterParts.push(referenceOptions.filter)
  }

  return {
    filter: filterParts.join(' && '),
    params: {
      ...(referenceOptions?.filterParams || {}),
      generatedTypes: referenceTo.map((schemaType) => schemaType)
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
      // If document already exists in State, DocumentInNode's <Preview> will auto update these changes
      return state
    }
    return [
      ...state,
      {
        _id: action.item._id,
        _type: action.item._type
      } as SanityDocument
    ]
  }
  if (action.type === 'removeItem') {
    const idx = state.findIndex((item) => item._id === action.itemId)
    if (idx < 0) {
      return state
    }
    return [...state.slice(0, idx), ...state.slice(idx + 1)]
  }
  if (action.type === 'setInitialData') {
    return action.items
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
