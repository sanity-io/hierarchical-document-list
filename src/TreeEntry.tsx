import React from 'react'
import {usePaneRouter} from '@sanity/desk-tool'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'

import 'react-sortable-tree/style.css?raw'
import {SanityDocument} from '@sanity/client'
import {Button, Card, Flex} from '@sanity/ui'
import {ChevronRightIcon} from '@sanity/icons'

/**
 * Renders a preview for each referenced document.
 * Nested inside TreeNode.tsx
 * @TODO: make it occupy all of the space available.
 */
const TreeEntry: React.FC<SanityDocument> = (props) => {
  const {navigateIntent, routerPanesState, ...rest} = usePaneRouter()

  const isActive = React.useMemo(() => {
    // If some pane is active with the current document `_id`, it's active
    return routerPanesState.some((pane) => pane.some((group) => group.id === props._id))
  }, [routerPanesState])

  return (
    <Card tone={isActive ? 'primary' : 'default'} padding={1} radius={2}>
      <Flex gap={2} justify="space-between" width="100%">
        <div style={{flex: 1}}>
          <Preview layout="default" type={schema.get(props._type)} value={{_ref: props._id}} />
        </div>
        <Button
          icon={ChevronRightIcon}
          onClick={() => navigateIntent('edit', {type: props._type, id: props._id})}
          mode="bleed"
        />
      </Flex>
    </Card>
  )
}

export default TreeEntry
