import {cyan, gray, red} from '@sanity/color'
import {ChevronDownIcon, ChevronUpIcon, DragHandleIcon} from '@sanity/icons'
import {Box, Button, Flex, Spinner} from '@sanity/ui'
import React from 'react'
import {isDescendant, NodeRenderer} from '@nosferatu500/react-sortable-tree'
import styled from 'styled-components'

const Root = styled.div`
  // Adapted from react-sortable-tree/style.css
  &[data-landing='true'] > *,
  &[data-cancel='true'] > * {
    opacity: 0 !important;
  }
  &[data-landing='true']::before,
  &[data-cancel='true']::before {
    background-color: ${cyan[50].hex};
    border: 2px dashed ${gray[400].hex};
    border-radius: 3px;
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
  }

  &[data-cancel='true']::before {
    background-color: ${red[50].hex};
  }
`

/**
 * Customization of react-sortable-tree's default node.
 * Created in order to use Sanity UI for styles.
 * Reference: https://github.com/frontend-collective/react-sortable-tree/blob/master/src/node-renderer-default.js
 */
const NodeContentRenderer: NodeRenderer = (props) => {
  const {node, path, treeIndex, canDrag = false} = props
  const nodeTitle = node.title
  const Handle = React.useMemo(() => {
    if (!canDrag) {
      return null
    }
    if (typeof node.children === 'function' && node.expanded) {
      // Show a loading symbol on the handle when the children are expanded
      //  and yet still defined by a function (a callback to fetch the children)
      return <Spinner />
    }

    // Show the handle used to initiate a drag-and-drop
    return props.connectDragSource(
      <div>
        <Button mode="bleed" padding={0} style={{cursor: 'grab'}}>
          <DragHandleIcon />
        </Button>
      </div>,
      {
        dropEffect: 'copy'
      }
    )
  }, [canDrag, node, typeof node.children === 'function'])

  const isDraggedDescendant = props.draggedNode && isDescendant(props.draggedNode, node)
  const isLandingPadActive = !props.didDrop && props.isDragging

  return (
    <Box style={{position: 'relative'}}>
      {props.toggleChildrenVisibility &&
        node.children &&
        (node.children.length > 0 || typeof node.children === 'function') && (
          <div
            style={{
              position: 'absolute',
              left: '-1.5em',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            <Button
              aria-label={node.expanded ? 'Collapse' : 'Expand'}
              icon={node.expanded ? ChevronUpIcon : ChevronDownIcon}
              mode="bleed"
              tone="primary"
              fontSize={0}
              padding={2}
              onClick={() =>
                props.toggleChildrenVisibility?.({
                  node,
                  path,
                  treeIndex
                })
              }
            />
          </div>
        )}

      {props.connectDragPreview(
        <div>
          <Root
            data-landing={isLandingPadActive}
            data-cancel={isLandingPadActive && !props.canDrop}
            style={{
              opacity: isDraggedDescendant ? 0.5 : 1
            }}
          >
            <Flex gap={1} align="center">
              {Handle}
              {typeof nodeTitle === 'function'
                ? nodeTitle({
                    node,
                    path,
                    treeIndex
                  })
                : nodeTitle}
            </Flex>
          </Root>
        </div>
      )}
    </Box>
  )
}

export default NodeContentRenderer
