import {usePaneRouter} from '@sanity/desk-tool'
import {ChevronRightIcon} from '@sanity/icons'
import {Button, Card, Flex} from '@sanity/ui'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import React from 'react'
import 'react-sortable-tree/style.css?raw'
import {SanityTreeItem} from './types'

/**
 * Renders a preview for each referenced document.
 * Nested inside TreeNode.tsx
 * @TODO: make it occupy all of the space available.
 */
const TreeEntry: React.FC<{item: SanityTreeItem}> = (props) => {
  const {node, nodeDocType} = props.item
  const {navigateIntent, routerPanesState} = usePaneRouter()

  const isActive = React.useMemo(() => {
    // If some pane is active with the current document `_id`, it's active
    return routerPanesState.some((pane) => pane.some((group) => group.id === node?._ref))
  }, [routerPanesState])

  const schemaType = React.useMemo(() => schema.get(nodeDocType), [nodeDocType])

  if (!node?._ref) {
    return null
  }

  return (
    <Card tone={isActive ? 'primary' : 'default'} padding={1} radius={2}>
      <Flex gap={2} justify="space-between" width="100%">
        <Preview layout="default" type={schemaType} value={{_ref: node?._ref}} />
        <Button
          icon={ChevronRightIcon}
          onClick={() => navigateIntent('edit', {type: nodeDocType, id: node?._ref})}
          mode="bleed"
        />
      </Flex>
    </Card>
  )
}

export default TreeEntry
