import React from 'react'
import {usePaneRouter} from '@sanity/desk-tool'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'

import 'react-sortable-tree/style.css?raw'
import {SanityDocument} from '@sanity/client'
import {Button, Flex} from '@sanity/ui'
import {ChevronRightIcon} from '@sanity/icons'

/**
 * Renders a preview for each referenced document.
 * Nested inside TreeNode.tsx
 * @TODO: make it occupy all of the space available.
 */
const TreeEntry: React.FC<SanityDocument> = (props) => {
  const {navigateIntent} = usePaneRouter()

  return (
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
  )
}

export default TreeEntry
