import {AddCircleIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Spinner, Stack, Text, Tooltip} from '@sanity/ui'
import React from 'react'
import SortableTree from 'react-sortable-tree'
import {SanityTreeItem, TreeInputOptions} from '../types/types'
import getCommonTreeProps, {getTreeHeight} from '../utils/getCommonTreeProps'
import {getUnaddedItems} from '../utils/treeData'
import useAllItems from '../utils/useAllItems'
import useLocalTree from '../utils/useLocalTree'
import {TreeOperationsContext} from '../utils/useTreeOperations'
import useTreeOperationsProvider from '../utils/useTreeOperationsProvider'
import DocumentInNode from './DocumentInNode'
import TreeEditorErrorBoundary from './TreeEditorErrorBoundary'

/**
 * The loaded tree users interact with
 */
const TreeEditor: React.FC<{
  tree: SanityTreeItem[]
  onChange: (patch: unknown) => void
  options: TreeInputOptions
  patchPrefix?: string
}> = (props) => {
  const {status: allItemsStatus, allItems} = useAllItems(props.options)
  const unaddedItems = getUnaddedItems({tree: props.tree, allItems})
  const {localTree, handleVisibilityToggle} = useLocalTree({
    tree: props.tree,
    allItems
  })
  const operations = useTreeOperationsProvider({
    patchPrefix: props.patchPrefix,
    onChange: props.onChange,
    localTree: localTree
  })

  return (
    <TreeEditorErrorBoundary>
      <TreeOperationsContext.Provider value={operations}>
        <Stack space={4} paddingTop={4}>
          <Card
            style={{minHeight: getTreeHeight(props.tree)}}
            // Only include borderBottom if there's something to show in unadded items
            borderBottom={allItemsStatus !== 'success' || unaddedItems?.length > 0}
          >
            <SortableTree
              maxDepth={props.options.maxDepth}
              onChange={() => {
                // Do nothing. onMoveNode will do all the work
              }}
              onVisibilityToggle={handleVisibilityToggle}
              onMoveNode={operations.handleMovedNode}
              treeData={localTree}
              {...getCommonTreeProps({
                placeholder: {
                  title: 'Add items by dragging them here'
                }
              })}
            />
          </Card>

          {allItemsStatus === 'success' && unaddedItems?.length > 0 && (
            <Stack space={1} paddingX={2} paddingTop={3}>
              <Box paddingX={2} paddingBottom={3}>
                <Text size={2} as="h2" weight="semibold">
                  Items not added
                </Text>
              </Box>
              {unaddedItems.map((item) => (
                <DocumentInNode
                  key={item._key}
                  item={item}
                  action={
                    <Tooltip
                      placement="left"
                      content={
                        <Box padding={2}>
                          <Text muted size={1}>
                            Add to the bottom of the list
                          </Text>
                        </Box>
                      }
                    >
                      <Button
                        onClick={() => {
                          operations.addItem(item)
                        }}
                        mode="bleed"
                        icon={AddCircleIcon}
                        style={{cursor: 'pointer'}}
                      />
                    </Tooltip>
                  }
                />
              ))}
            </Stack>
          )}
          {allItemsStatus === 'loading' && (
            <Flex padding={4} align={'center'} justify={'center'}>
              <Spinner size={3} muted />
            </Flex>
          )}
          {allItemsStatus === 'error' && (
            <Flex padding={4} align={'center'} justify={'center'}>
              <Text size={2} weight="semibold">
                Something went wrong when loading documents
              </Text>
            </Flex>
          )}
        </Stack>
      </TreeOperationsContext.Provider>
    </TreeEditorErrorBoundary>
  )
}

export default TreeEditor
