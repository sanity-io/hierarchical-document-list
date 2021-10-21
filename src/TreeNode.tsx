import {DragHandleIcon} from '@sanity/icons'
import {Button, Card, Inline, Spinner} from '@sanity/ui'
import React from 'react'
import {isDescendant, NodeRenderer} from 'react-sortable-tree'

function classnames(...classes: unknown[]) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Customization of react-sortable-tree's default node.
 * Created in order to use Sanity UI for styles.
 * @TODO: finish porting over styles from default renderer
 *  - https://github.com/frontend-collective/react-sortable-tree/blob/master/src/node-renderer-default.js
 */
const TreeNode: NodeRenderer = (props) => {
  const {node, path, treeIndex, canDrop, canDrag = false} = props
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
        <Button mode="bleed">
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
    <Card padding={2} height="fill">
      {props.toggleChildrenVisibility &&
        node.children &&
        (node.children.length > 0 || typeof node.children === 'function') && (
        <div>
          <button
            type="button"
            aria-label={node.expanded ? 'Collapse' : 'Expand'}
            onClick={() => props.toggleChildrenVisibility?.({
              node,
              path,
              treeIndex
            })
            }
          />

          {node.expanded && !props.isDragging && (
            <div>Scaffold Spacer</div>
          )}
        </div>
      )}

      {props.connectDragPreview(
        <div
          className={classnames(
            'rst__row',
            isLandingPadActive && 'rst__rowLandingPad',
            isLandingPadActive && !canDrop && 'rst__rowCancelPad'
          )}
          style={{
            opacity: isDraggedDescendant ? 0.5 : 1
          }}
        >
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
    </Card>
  )
}

export default TreeNode
