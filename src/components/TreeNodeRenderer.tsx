import React from 'react'
import {TreeRenderer} from '@nosferatu500/react-sortable-tree'

/**
 * To prevent expand buttons from overflowing on the left, we add a minimum left padding to all entries
 */
const BASE_LEFT_PADDING = -5
const NESTING_PADDING = 35

const TreeNodeRenderer: TreeRenderer = (props) => {
  const {children, lowerSiblingCounts, connectDropTarget, isOver, draggedNode, canDrop} = props

  // Construct the scaffold representing the structure of the tree
  const scaffoldBlockCount = lowerSiblingCounts.length

  return connectDropTarget(
    <div style={props.style}>
      <div
        style={{
          // prettier-ignore
          paddingLeft: `${BASE_LEFT_PADDING + (NESTING_PADDING * scaffoldBlockCount)}px`
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
