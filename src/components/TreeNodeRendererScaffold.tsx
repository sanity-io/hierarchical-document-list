import { blue } from '@sanity/color'
import React from 'react'
import {TreeRendererProps} from 'react-sortable-tree'
import {createGlobalStyle} from 'styled-components'

// Adapted from react-sortable-tree/src/tree-node.js
const ScaffoldStyles = createGlobalStyle`
  .rst__lineBlock,
  .rst__absoluteLineBlock {
    height: 100%;
    position: relative;
    display: inline-block;
    --stroke-width: 2.5px;
  }

  .rst__absoluteLineBlock {
    position: absolute;
    top: 0;
  }

  /* Highlight line for pointing to dragged row destination
   ========================================================================== */
  /**
 * +--+--+
 * |  |  |
 * |  |  |
 * |  |  |
 * +--+--+
 */
  .rst__highlightLineVertical {
    z-index: 3;
  }
  .rst__highlightLineVertical::before {
    position: absolute;
    content: '';
    background-color: ${blue[400].hex};
    width: calc(var(--stroke-width) * 2);
    margin-left: calc(var(--stroke-width) * -1);
    left: 50%;
    top: 0;
    height: 100%;
  }

  @keyframes arrow-pulse {
    0% {
      transform: translate(0, 0);
      opacity: 0;
    }
    30% {
      transform: translate(0, 300%);
      opacity: 1;
    }
    70% {
      transform: translate(0, 700%);
      opacity: 1;
    }
    100% {
      transform: translate(0, 1000%);
      opacity: 0;
    }
  }
  .rst__highlightLineVertical::after {
    content: '';
    position: absolute;
    height: 0;
    margin-left: calc(var(--stroke-width) * -1);
    left: 50%;
    top: 0;
    border-left: var(--stroke-width) solid transparent;
    border-right: var(--stroke-width) solid transparent;
    border-top: var(--stroke-width) solid white;
    animation: arrow-pulse 1s infinite linear both;
  }

  /**
 * +-----+
 * |     |
 * |  +--+
 * |  |  |
 * +--+--+
 */
  .rst__highlightTopLeftCorner::before {
    z-index: 3;
    content: '';
    position: absolute;
    border-top: solid calc(var(--stroke-width) * 2) ${blue[400].hex};
    border-left: solid calc(var(--stroke-width) * 2) ${blue[400].hex};
    box-sizing: border-box;
    height: calc(50% + var(--stroke-width));
    top: 50%;
    margin-top: calc(var(--stroke-width) * -1);
    right: 0;
    width: calc(50% + var(--stroke-width));
  }

  /**
 * +--+--+
 * |  |  |
 * |  |  |
 * |  +->|
 * +-----+
 */
  .rst__highlightBottomLeftCorner {
    z-index: 3;
  }
  .rst__highlightBottomLeftCorner::before {
    content: '';
    position: absolute;
    border-bottom: solid calc(var(--stroke-width) * 2) ${blue[400].hex};
    border-left: solid calc(var(--stroke-width) * 2) ${blue[400].hex};
    box-sizing: border-box;
    height: calc(100% + var(--stroke-width));
    top: 0;
    right: calc(var(--stroke-width) * 3);
    width: calc(50% - calc(var(--stroke-width) * 2));
  }

  .rst__highlightBottomLeftCorner::after {
    content: '';
    position: absolute;
    height: 0;
    right: 0;
    top: 100%;
    margin-top: calc(var(--stroke-width) * -3);
    border-top: calc(var(--stroke-width) * 3) solid transparent;
    border-bottom: calc(var(--stroke-width) * 3) solid transparent;
    border-left: calc(var(--stroke-width) * 3) solid ${blue[400].hex};
  }

  .rst__unclickable {
    pointer-events: none;
    margin-top: -calc(var(--stroke-width) * 3);
  }
`

const TreeNodeRendererScaffold: React.FC<TreeRendererProps> = (props) => {
  const {
    lowerSiblingCounts,
    scaffoldBlockPxWidth,
    listIndex,
    swapDepth,
    swapFrom,
    swapLength,
    treeIndex
  } = props

  // Construct the scaffold representing the structure of the tree
  const scaffold: React.ReactNode[] = []
  lowerSiblingCounts.forEach((lowerSiblingCount, i) => {
    let lineClass = ''
    if (lowerSiblingCount > 0) {
      // At this level in the tree, the nodes had sibling nodes further down

    if (treeIndex !== listIndex && i === swapDepth) {
      // This row has been shifted, and is at the depth of
      // the line pointing to the new destination
      let highlightLineClass = ''

      if (listIndex === (swapFrom || 0) + (swapLength || 0) - 1) {
        // This block is on the bottom (target) line
        // This block points at the target block (where the row will go when released)
        highlightLineClass = 'rst__highlightBottomLeftCorner'
      } else if (treeIndex === swapFrom) {
        // This block is on the top (source) line
        highlightLineClass = 'rst__highlightTopLeftCorner'
      } else {
        // This block is between the bottom and top
        highlightLineClass = 'rst__highlightLineVertical'
      }

      const style = {
        width: scaffoldBlockPxWidth,
        left: scaffoldBlockPxWidth * i
      }

      scaffold.push(
        <div
          key={i}
          style={style}
          className={`rst__unclickable rst__absoluteLineBlock ${highlightLineClass || ''}`}
          tabIndex={-1}
        />
      )
    }
  })

  return (
    <>
      {scaffold}
      <ScaffoldStyles />
    </>
  )
}

export default TreeNodeRendererScaffold
