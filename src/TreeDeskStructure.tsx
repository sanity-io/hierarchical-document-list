import {Button, Flex, Heading, Spinner, Stack, Text} from '@sanity/ui'
import React from 'react'
import SortableTree from 'react-sortable-tree'
import 'react-sortable-tree/style.css?raw'
import Callout from './Callout'
import getCommonTreeProps from './getCommonTreeProps'
import TreeEntry from './TreeEntry'
import {TreeDeskStructureProps} from './types'
import useTreeDeskData from './useTreeDeskData'

const TreeDeskStructure: React.FC<{options: TreeDeskStructureProps}> = ({options}) => {
  const {
    data: {treeDoc, allItems, unaddedItems},
    handleMainTreeChange,
    handleUnaddedTreeChange,
    state,
    retryFetching
  } = useTreeDeskData(options)

  const hasItems = Boolean(treeDoc?.tree?.length || allItems?.length)

  return (
    <div style={{height: '100%'}}>
      {state === 'loading' && (
        <Flex padding={4} height="fill" align="center" justify="center">
          <Spinner size={3} muted />
        </Flex>
      )}
      {state === 'error' && (
        <Callout title="Something went wrong">
          <Button text="Retry" mode="bleed" onClick={retryFetching} />
        </Callout>
      )}
      {state === 'loaded' && !hasItems && <Callout tone="primary" title="No items added yet" />}
      {state === 'loaded' && hasItems && treeDoc?._id && (
        <div>
          <div style={{minHeight: '400px'}}>
            <SortableTree
              treeData={treeDoc.tree}
              onChange={handleMainTreeChange}
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
                  onChange={handleUnaddedTreeChange}
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
