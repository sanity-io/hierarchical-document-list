import * as React from 'react'
import {SanityDocument, useClient} from 'sanity'
import {AllItems, TreeInputOptions} from '../types'
import {isDraft, unprefixId} from '../utils/idUtils'

function getDeskFilter({referenceTo, referenceOptions}: TreeInputOptions): {
  filter: string
  params: Record<string, unknown>
} {
  const filterParts: string[] = ['_type in $docTypes']

  if (referenceOptions?.filter) {
    filterParts.push(referenceOptions.filter)
  }

  return {
    filter: filterParts.join(' && '),
    params: {
      ...(referenceOptions?.filterParams || {}),
      docTypes: referenceTo.map((schemaType) => schemaType)
    }
  }
}

type Status = 'loading' | 'success' | 'error'

type ACTIONTYPE =
  | {type: 'addOrEditItem'; item: SanityDocument}
  | {type: 'removeItem'; itemId: string}
  | {type: 'setInitialData'; items: SanityDocument[]}

function updateItemInState(state: AllItems, item: SanityDocument): AllItems {
  const newState = {...state}
  const publishedId = unprefixId(item._id)
  newState[publishedId] = {
    ...(newState[publishedId] || {}),
    [isDraft(item._id) ? 'draft' : 'published']: item
  }
  return newState
}

function allItemsReducer(state: AllItems, action: ACTIONTYPE): AllItems {
  if (action.type === 'addOrEditItem' && action.item?._id) {
    return updateItemInState(state, action.item)
  }

  if (action.type === 'removeItem') {
    const publishedId = unprefixId(action.itemId)
    return {
      ...state,
      [publishedId]: isDraft(action.itemId)
        ? // If a draft, keep only published
          {
            published: state[publishedId]?.published
          }
        : {
            draft: state[publishedId]?.draft
          }
    }
  }

  if (action.type === 'setInitialData') {
    return action.items.reduce(updateItemInState, {} as AllItems)
  }
  return state
}

export default function useAllItems(options: TreeInputOptions): {
  status: Status
  allItems: AllItems
} {
  const client = useClient({
    apiVersion: '2021-09-01'
  })
  const [status, setStatus] = React.useState<Status>('loading')
  const [allItems, dispatch] = React.useReducer(allItemsReducer, {})

  function handleListener(event: any) {
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
      _updatedAt,
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
