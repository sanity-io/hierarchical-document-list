import React from 'react'
import {TreeRenderer} from 'react-sortable-tree'

/**
 * To prevent expand buttons from overflowing on the left, we add a minimum left padding to all entries
 */
const BASE_LEFT_PADDING = 15

const TreeNodeRenderer: TreeRenderer = (props) => {
  const {
    children,
    scaffoldBlockPxWidth,
    lowerSiblingCounts,
    connectDropTarget,
    isOver,
    draggedNode,
    canDrop
  } = props

  // Construct the scaffold representing the structure of the tree
  const scaffoldBlockCount = lowerSiblingCounts.length

  return connectDropTarget(
    <div style={props.style}>
      <div
        style={{
          paddingLeft: `${BASE_LEFT_PADDING + scaffoldBlockPxWidth * scaffoldBlockCount}px`
        }}
      >
        {React.Children.map(children, (child) =>
          React.cloneElement(child as React.ReactElement<any>, {
            isOver,
            canDrop,
            draggedNode
          })
        )}
      </div>
    </div>
  )
}

export default TreeNodeRenderer
