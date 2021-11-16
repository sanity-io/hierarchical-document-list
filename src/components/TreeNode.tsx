import {CollapseIcon, DragHandleIcon, ExpandIcon} from '@sanity/icons'
import {Button, Flex, Inline, Spinner} from '@sanity/ui'
import React from 'react'
import {NodeRenderer} from 'react-sortable-tree'

/**
 * Customization of react-sortable-tree's default node.
 * Created in order to use Sanity UI for styles.
 * @TODO: finish porting over styles from default renderer
 *  - https://github.com/frontend-collective/react-sortable-tree/blob/master/src/node-renderer-default.js
 */
const TreeNode: NodeRenderer = (props) => {
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
        <Button mode="bleed" padding={0}>
          <DragHandleIcon />
        </Button>
      </div>,
      {
        dropEffect: 'copy'
      }
    )
  }, [canDrag, node, typeof node.children === 'function'])

  return (
    <Flex align="center" gap={2}>
      {props.toggleChildrenVisibility &&
        node.children &&
        (node.children.length > 0 || typeof node.children === 'function') && (
          <>
            <Button
              aria-label={node.expanded ? 'Collapse' : 'Expand'}
              icon={node.expanded ? CollapseIcon : ExpandIcon}
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
          </>

          /* {node.expanded && !props.isDragging && (
              <div style={{width: '200px', marginTop: '200px'}} className="rst__lineChildren"></div>
            )} */
        )}

      {props.connectDragPreview(
        <div>
          <Inline space={1}>
            {Handle}

            {typeof nodeTitle === 'function'
              ? nodeTitle({
                  node,
                  path,
                  treeIndex
                })
              : nodeTitle}
          </Inline>
        </div>
      )}
    </Flex>
  )
}

export default TreeNode
