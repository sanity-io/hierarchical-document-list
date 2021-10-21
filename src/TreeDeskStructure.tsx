import {SanityClient, SanityDocument} from '@sanity/client'
import {Button, Flex, Heading, Spinner, Stack, Text} from '@sanity/ui'
import sanityClient from 'part:@sanity/base/client'
import React from 'react'
import SortableTree, {ReactSortableTreeProps} from 'react-sortable-tree'
import 'react-sortable-tree/style.css?raw'
import {Subscription} from 'rxjs'

import Callout from './Callout'
import getCommonTreeProps from './getCommonTreeProps'
import getDeskQuery from './getDeskQuery'
import TreeEntry from './TreeEntry'
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

const TreeDeskStructure: React.FC<{options: TreeDeskStructureProps}> = ({options}) => {
  const [{treeDoc, allItems, unaddedItems}, setData] = React.useState<StateData>({})
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

  const retry = () => {
    setState('loading')
    loadData()
  }

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

  const hasItems = Boolean(treeDoc?.tree?.length || allItems?.length)

  const handleTreeChange: ReactSortableTreeProps['onChange'] = (newTree) => {
    console.log({newTree})
  }

  return (
    <div style={{height: '100%'}}>
      {state === 'loading' && (
        <Flex padding={4} height="fill" align="center" justify="center">
          <Spinner size={3} muted />
        </Flex>
      )}
      {state === 'error' && (
        <Callout title="Something went wrong">
          <Button text="Retry" mode="bleed" onClick={retry} />
        </Callout>
      )}
      {state === 'loaded' && !hasItems && <Callout tone="primary" title="No items added yet" />}
      {state === 'loaded' && hasItems && treeDoc?._id && (
        <div>
          <div style={{minHeight: '400px'}}>
            <SortableTree
              treeData={treeDoc.tree}
              onChange={handleTreeChange}
              {...getCommonTreeProps({
                placeholder: {
                  title: 'Add items by dragging them here'
                }
              })}
            />
          </div>
          {Array.isArray(unaddedItems) && unaddedItems.length > 0 && (
            <Stack space={4}>
              <Stack space={2} padding={3}>
                <Heading size={1} muted as="h2">
                  Items not added
                </Heading>
                <Text size={2} muted>
                  Drag them into the list above to add to the hieararchy.
                </Text>
              </Stack>

              <div style={{minHeight: '400px'}}>
                <SortableTree
                  onChange={(newItems) => {
                    return setData({
                      treeDoc,
                      allItems,
                      unaddedItems: newItems.map((entry) => entry.item) as SanityDocument[]
                    })
                  }}
                  maxDepth={1}
                  treeData={unaddedItems.map((item) => ({
                    item,
                    title: () => <TreeEntry {...item} />
                  }))}
                  {...getCommonTreeProps({
                    placeholder: {
                      title: 'Drag items here to remove from hierarchy'
                    }
                  })}
                />
              </div>
            </Stack>
          )}
        </div>
      )}
    </div>
  )
}

// Create the default export to import into our schema
export default TreeDeskStructure
