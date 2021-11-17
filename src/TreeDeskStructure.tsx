import {Button, Flex, Heading, Spinner, Stack, Text} from '@sanity/ui'
import React from 'react'
import SortableTree from 'react-sortable-tree'
import Callout from './components/Callout'
import {TreeDeskStructureProps} from './types/types'
import getCommonTreeProps, {getTreeHeight} from './utils/getCommonTreeProps'
import useTreeDeskData from './utils/useTreeDeskData'

const TreeDeskStructure: React.FC<{options: TreeDeskStructureProps}> = ({options}) => {
  const {
    data: {mainTree, allItems, unaddedItems},
    handleMainTreeChange,
    handleUnaddedTreeChange,
    state,
    retryFetching
  } = useTreeDeskData(options)

  const hasItems = Boolean(mainTree?.length || allItems?.length)
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
      {state === 'loaded' && hasItems && Array.isArray(mainTree) && (
        <Stack space={4} paddingTop={4}>
          <div style={{minHeight: getTreeHeight(mainTree)}}>
            <SortableTree
              onChange={handleMainTreeChange}
              treeData={mainTree}
              {...getCommonTreeProps({
                placeholder: {
                  title: 'Add items by dragging them here'
                }
              })}
            />
          </div>
          <Stack space={2} padding={3}>
            <Heading size={1} as="h2">
              Items not added
            </Heading>
            <Text size={1} muted>
              Drag them into the list above to add to the hieararchy.
            </Text>
          </Stack>

          <div style={{minHeight: getTreeHeight(unaddedItems)}}>
            <SortableTree
              onChange={handleUnaddedTreeChange}
              treeData={unaddedItems || []}
              maxDepth={1}
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
  )
}

// Create the default export to import into our schema
export default TreeDeskStructure
