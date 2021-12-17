import {Spinner, Stack, Text} from '@sanity/ui'
import React from 'react'
import SortableTree, {
  FullTree,
  NodeData,
  OnMovePreviousAndNextLocation
} from '@nosferatu500/react-sortable-tree'
import {SanityTreeItem, TreeInputOptions} from '../types/types'
import getCommonTreeProps, {getTreeHeight} from '../utils/getCommonTreeProps'
import getTreePatch from '../utils/getTreePatch'
import {dataToEditorTree, getUnaddedItems} from '../utils/treeData'
import useAllItems from '../utils/useAllItems'
import useTreeWithVisibility from '../utils/useTreeWithVisibility'

/**
 * The loaded tree users interact with
 */
const TreeEditor: React.FC<{
  tree: SanityTreeItem[]
  onChange: (patch: unknown) => void
  options: TreeInputOptions
  patchPrefix?: string
}> = (props) => {
  const {tree} = props
  const {status: allItemsStatus, allItems} = useAllItems(props.options)
  const unaddedItems = getUnaddedItems({tree, allItems})
  const {treeData, handleVisibilityToggle} = useTreeWithVisibility(tree)

  function handleMovedNode(data: NodeData & FullTree & OnMovePreviousAndNextLocation) {
    const patch = getTreePatch(data, props.patchPrefix)
    props.onChange(patch)
  }

  const dndId = React.useMemo(() => `sanityTree-${Math.random().toFixed(5)}`, [])

  return (
    <Stack space={4} paddingTop={4}>
      <div style={{minHeight: getTreeHeight(tree)}}>
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
            },
            dndType: dndId
          })}
        />
      </div>
      <Stack space={2}>
        <Text size={2} as="h2">
          Items not added
        </Text>
        <Text size={1} muted>
          Drag them into the list above to add to the hieararchy. Unpublished documents won't show
          up in this list.
        </Text>
      </Stack>

      {allItemsStatus === 'success' ? (
        <div style={{minHeight: getTreeHeight(unaddedItems)}}>
          <SortableTree
            onChange={() => {
              // Do nothing. unaddedTree will reflect whatever meaningful changes happen to this tree
            }}
            treeData={dataToEditorTree(unaddedItems)}
            maxDepth={1}
            {...getCommonTreeProps({
              placeholder: {
                title: 'Drag items here to remove from hierarchy'
              },
              dndType: dndId
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
