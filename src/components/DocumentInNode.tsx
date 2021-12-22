import {usePaneRouter} from '@sanity/desk-tool'
import {Card, Flex} from '@sanity/ui'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import React from 'react'
import {SanityTreeItem} from '../types/types'
import useTreeContext from '../utils/useTreeContext'

/**
 * Renders a preview for each referenced document.
 * Nested inside TreeNode.tsx
 */
const DocumentInNode: React.FC<{
  item: SanityTreeItem
  status?: React.ReactNode
  action?: React.ReactNode
}> = (props) => {
  const {node, nodeDocType} = props.item
  const {routerPanesState, ChildLink} = usePaneRouter()
  const {placement} = useTreeContext()

  const isActive = React.useMemo(() => {
    // If some pane is active with the current document `_id`, it's active
    return routerPanesState.some((pane) => pane.some((group) => group.id === node?._ref))
  }, [routerPanesState])

  const schemaType = React.useMemo(() => schema.get(nodeDocType), [nodeDocType])

  const LinkComponent = React.useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-shadow
      React.forwardRef((linkProps: any, ref: any) => (
        <ChildLink
          {...linkProps}
          childId={node?._ref}
          ref={ref}
          childParameters={{
            type: nodeDocType
          }}
        />
      )),
    [ChildLink, node?._ref, placement]
  )

  if (!node?._ref) {
    return null
  }

  return (
    <Flex gap={2} align="center" style={{flex: 1, maxWidth: '600px'}}>
      {/* Card loosely copied from @sanity/desk-tool's PaneItem.tsx */}
      <Card
        __unstable_focusRing
        as={LinkComponent}
        tone={isActive ? 'primary' : 'default'}
        padding={1}
        radius={2}
        flex={1}
        data-as="a"
        data-ui="PaneItem"
      >
        <Preview
          layout="default"
          type={schemaType}
          value={{_ref: node?._ref}}
          status={props.status}
        />
      </Card>
      {props.action}
    </Flex>
  )
}

export default DocumentInNode
