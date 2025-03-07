import SortableTree, {FullTree, NodeData} from '@nosferatu500/react-sortable-tree'
import {AddCircleIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Spinner, Stack, Text, Tooltip} from '@sanity/ui'
import * as React from 'react'
import {useCallback, useMemo} from 'react'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {PatchEvent} from 'sanity'
import useAllItems from '../hooks/useAllItems'
import useLocalTree from '../hooks/useLocalTree'
import {TreeOperationsContext} from '../hooks/useTreeOperations'
import useTreeOperationsProvider from '../hooks/useTreeOperationsProvider'
import {Optional, StoredTreeItem, TreeDeskStructureProps} from '../types'
import getCommonTreeProps from '../utils/getCommonTreeProps'
import getTreeHeight from '../utils/getTreeHeight'
import {getUnaddedItems} from '../utils/treeData'
import {HandleMovedNodeData} from '../utils/treePatches'
import DocumentInNode from './DocumentInNode'
import {TreeEditorErrorBoundary} from './TreeEditorErrorBoundary'

/**
 * The loaded tree users interact with
 */
const TreeEditor: React.FC<{
  tree: StoredTreeItem[]
  onChange: (patch: PatchEvent) => void
  options: Optional<TreeDeskStructureProps, 'documentId'>
  patchPrefix?: string
}> = (props) => {
  const {status: allItemsStatus, allItems} = useAllItems(props.options)
  const unAddedItems = getUnaddedItems({tree: props.tree, allItems})

  const {localTree, handleVisibilityToggle} = useLocalTree({
    tree: props.tree,
    allItems
  })

  const operations = useTreeOperationsProvider({
    patchPrefix: props.patchPrefix,
    onChange: props.onChange,
    localTree
  })

  const [context, setContext] = React.useState<HTMLElement | null>(null)
  const [treeViewHeight, setTreeViewHeight] = React.useState<string>('')

  const updateTreeViewHeight = () => {
    const el = document.querySelector(`#${props.options.documentId} [data-known-size]`) as HTMLElement | null
    const rowHeight = Number(el?.dataset.knownSize || 51)
    setTreeViewHeight(getTreeHeight(localTree, rowHeight))
  }

  React.useEffect(() => {
    if (props.options.documentId) {
      setContext(document.getElementById(props.options.documentId))
    }
  }, [props.options.documentId])

  React.useEffect(() => {
    // Wait for dom to load before initial execution.
    setTimeout(updateTreeViewHeight)
  }, [])

  React.useEffect(() => {
    // Immediately update when changes are detected.
    updateTreeViewHeight()
  }, [props.options.documentId, localTree])

  const onMoveNode = useCallback(
    (data: NodeData & FullTree & any) =>
      operations.handleMovedNode(data as unknown as HandleMovedNodeData),
    [operations]
  )

  const treeProps = useMemo(
    () =>
      getCommonTreeProps({
        placeholder: {
          title: 'Add items from the list below'
        }
      }),
    []
  )

  const operationContext = useMemo(
    () => ({...operations, allItemsStatus}),
    [operations, allItemsStatus]
  )

  return (
    <TreeEditorErrorBoundary>
      {/*Use this Box-wrapper to get a context Element to prevent DndProvider to have to HTML% backend at the same time https://github.com/react-dnd/react-dnd/issues/186#issuecomment-978206387 */}
      <Box id={props.options.documentId}>
        {context ? (
          <DndProvider backend={HTML5Backend} options={{rootElement: context}}>
            <TreeOperationsContext.Provider value={operationContext}>
              <Stack space={4} paddingTop={4}>
                <Card
                  style={{minHeight: treeViewHeight}}
                  // Only include borderBottom if there's something to show in unadded items
                  borderBottom={allItemsStatus !== 'success' || unAddedItems?.length > 0}
                >
                  <SortableTree
                    maxDepth={props.options.maxDepth}
                    onChange={doNothingOnChange}
                    onVisibilityToggle={handleVisibilityToggle}
                    canDrop={canDrop}
                    onMoveNode={onMoveNode}
                    treeData={localTree}
                    {...treeProps}
                  />
                </Card>

                {allItemsStatus === 'success' && unAddedItems?.length > 0 && (
                  <Stack space={1} paddingX={2} paddingTop={3}>
                    <Stack space={2} paddingX={2} paddingBottom={3}>
                      <Text size={2} as="h2" weight="semibold">
                        Add more items
                      </Text>
                      <Text size={1} muted>
                        Only published documents are shown.
                      </Text>
                    </Stack>
                    {unAddedItems.map((item) => (
                      <DocumentInNode
                        key={item.publishedId || item.draftId}
                        item={item}
                        action={
                          <Tooltip
                            portal
                            placement="left"
                            content={
                              <Box padding={2}>
                                <Text size={1}>Add to list</Text>
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
          </DndProvider>
        ) : null}
      </Box>
    </TreeEditorErrorBoundary>
  )
}

function canDrop({nextPath, prevPath}: any & NodeData) {
  const insideItself =
    nextPath.length >= prevPath.length &&
    prevPath.every((pathIndex: any, index: string | number) => nextPath[index] === pathIndex)
  return !insideItself
}

const doNothingOnChange = () => {
  // Do nothing. onMoveNode will do all the work
}

export default TreeEditor
