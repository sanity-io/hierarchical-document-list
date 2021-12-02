import {Heading, Spinner, Stack, Text} from '@sanity/ui'
import React from 'react'
import SortableTree, {FullTree, NodeData, OnMovePreviousAndNextLocation} from 'react-sortable-tree'
import {SanityTreeItem, TreeInputOptions} from '../types/types'
import getCommonTreeProps, {getTreeHeight} from '../utils/getCommonTreeProps'
import getTreePatch from '../utils/getTreePatch'
import {dataToTree, getUnaddedItems} from '../utils/treeData'
import useAllItems from '../utils/useAllItems'

/**
 * The loaded tree users interact with
 */
const TreeEditor: React.FC<{
  tree: SanityTreeItem[]
  onChange: (patch: unknown) => void
  options: TreeInputOptions
}> = (props) => {
  const {tree} = props
  const {status: allItemsStatus, allItems} = useAllItems(props.options)
  const unaddedItems = getUnaddedItems({tree, allItems})

  console.log({allItems, unaddedItems, tree})

  function handleMovedNode(data: NodeData & FullTree & OnMovePreviousAndNextLocation) {
    const patch = getTreePatch(data)
    console.info({patch})
    props.onChange(patch)
  }

  return (
    <Stack space={4} paddingTop={4}>
      <div style={{minHeight: getTreeHeight(tree)}}>
        <SortableTree
          maxDepth={props.options.maxDepth}
          onChange={() => {
            // Do nothing. onMoveNode will do all the work
          }}
          onMoveNode={handleMovedNode}
          treeData={dataToTree(tree)}
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

      {allItemsStatus ? (
        <div style={{minHeight: getTreeHeight(unaddedItems)}}>
          <SortableTree
            onChange={() => {
              // Do nothing. unaddedTree will reflect whatever meaningful changes happen to this tree
            }}
            treeData={dataToTree(unaddedItems)}
            maxDepth={1}
            {...getCommonTreeProps({
              placeholder: {
                title: 'Drag items here to remove from hierarchy'
              }
            })}
          />
        </div>
      ) : (
        <Spinner size={3} muted />
      )}
    </Stack>
  )
}

export default TreeEditor
