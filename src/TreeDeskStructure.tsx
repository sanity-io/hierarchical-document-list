import {Button, Flex, Heading, Spinner, Stack, Text, useToast} from '@sanity/ui'
import React from 'react'
import SortableTree from 'react-sortable-tree'
import Callout from './components/Callout'
import {TreeDeskStructureProps} from './types/types'
import getCommonTreeProps, {getTreeHeight} from './utils/getCommonTreeProps'
import useTreeDeskData from './utils/useTreeDeskData'

const TreeDeskStructure: React.FC<{options: TreeDeskStructureProps}> = ({options}) => {
  const {state, send} = useTreeDeskData(options)
  const toast = useToast()

  const {mainTree, allItems, unaddedItems} = state.context

  const hasItems = Boolean(mainTree?.length || allItems?.length)

  const persistError = state.matches('loaded.persistError')
  React.useEffect(() => {
    if (persistError) {
      toast.push({
        title: 'Error saving changes',
        status: 'error',
        description: 'Please try again'
      })
    }
  }, [persistError])

  return (
    <div style={{height: '100%'}}>
      {state.value === 'loading' && (
        <Flex padding={4} height="fill" align="center" justify="center">
          <Spinner size={3} muted />
        </Flex>
      )}
      {state.value === 'creatingDocument' && (
        <Flex padding={4} height="fill" align="center" justify="center">
          <Spinner size={3} muted />
          <Text>Setting up documents...</Text>
        </Flex>
      )}
      {state.value === 'error' && (
        <Callout title="Something went wrong">
          <Button text="Retry" mode="bleed" onClick={() => send('RETRY_LOAD')} />
        </Callout>
      )}
      {state.matches('loaded') && !hasItems && (
        <Callout tone="primary" title="No items added yet" />
      )}
      {state.matches('loaded') && hasItems && Array.isArray(mainTree) && (
        <Stack space={4} paddingTop={4}>
          <div style={{minHeight: getTreeHeight(mainTree)}}>
            <SortableTree
              onChange={(newTree) =>
                send({
                  type: 'HANDLE_MAIN_TREE_CHANGE',
                  newTree
                })
              }
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
              onChange={(newTree) =>
                send({
                  type: 'HANDLE_UNADDED_TREE_CHANGE',
                  newTree
                })
              }
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
