import {AddCircleIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Heading, Spinner, Stack, Text, Tooltip} from '@sanity/ui'
import React from 'react'
import SortableTree, {FullTree, NodeData, OnMovePreviousAndNextLocation} from 'react-sortable-tree'
import {SanityTreeItem, TreeInputOptions} from '../types/types'
import getCommonTreeProps, {getTreeHeight} from '../utils/getCommonTreeProps'
import getTreePatch from '../utils/getTreePatch'
import {getUnaddedItems} from '../utils/treeData'
import useAllItems from '../utils/useAllItems'
import useLocalTree from '../utils/useLocalTree'
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
  const {treeData, handleVisibilityToggle} = useLocalTree(props.tree, allItems)

  function handleMovedNode(data: NodeData & FullTree & OnMovePreviousAndNextLocation) {
    const patch = getTreePatch(data, props.patchPrefix)
    props.onChange(patch)
  }

  return (
    <TreeEditorErrorBoundary>
      <Stack space={4} paddingTop={4}>
        <Card style={{minHeight: getTreeHeight(treeData)}} borderBottom={true}>
          <SortableTree
            maxDepth={props.options.maxDepth}
            onChange={() => {
              // Do nothing. onMoveNode will do all the work
            }}
            onVisibilityToggle={handleVisibilityToggle}
            onMoveNode={handleMovedNode}
            treeData={treeData}
            {...getCommonTreeProps({
              placeholder: {
                title: 'Add items by dragging them here'
              }
            })}
          />
        </Card>

        {allItemsStatus === 'success' ? (
          <Stack space={1}>
            <Box paddingX={4} paddingBottom={2} paddingTop={3}>
              <Heading size={1} as="h2">
                Items not added
              </Heading>
            </Box>
            <Box paddingX={1}>
              {unaddedItems.map((item) => (
                <DocumentInNode
                  key={item._key}
                  item={item}
                  action={
                    <Tooltip
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
                          handleMovedNode({
                            nextPath: [],
                            node: item,
                            treeIndex: -1,
                            treeData
                          } as any)
                        }}
                        mode="bleed"
                        icon={AddCircleIcon}
                        style={{cursor: 'pointer'}}
                      />
                    </Tooltip>
                  }
                />
              ))}
            </Box>
          </Stack>
        ) : (
          <Flex padding={4} align={'center'} justify={'center'}>
            <Spinner size={3} muted />
          </Flex>
        )}
      </Stack>
    </TreeEditorErrorBoundary>
  )
}

export default TreeEditor
