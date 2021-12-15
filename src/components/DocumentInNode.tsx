import {usePaneRouter} from '@sanity/desk-tool'
import {Card} from '@sanity/ui'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import React from 'react'
import {SanityTreeItem} from '../types/types'
import useTreeContext from '../utils/useTreeContext'

/**
 * Renders a preview for each referenced document.
 * Nested inside TreeNode.tsx
 */
const DocumentInNode: React.FC<{item: SanityTreeItem}> = (props) => {
  const {node, nodeDocType} = props.item
  const {routerPanesState, ChildLink, navigateIntent} = usePaneRouter()
  const {placement} = useTreeContext()

  const isActive = React.useMemo(() => {
    // If some pane is active with the current document `_id`, it's active
    return routerPanesState.some((pane) => pane.some((group) => group.id === node?._ref))
  }, [routerPanesState])

  const schemaType = React.useMemo(() => schema.get(nodeDocType), [nodeDocType])

  const LinkComponent = React.useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-shadow
      React.forwardRef(function LinkComponentInner(linkProps: any, ref: any) {
        if (placement === 'tree') {
          // @TODO: produce proper href for tree link
          return (
            <a
              onClick={() =>
                navigateIntent('edit', {
                  type: nodeDocType,
                  id: node._ref
                })
              }
            />
          )
        }

        return (
          <ChildLink
            {...linkProps}
            childId={node._ref}
            ref={ref}
            childParameters={{
              type: nodeDocType,
              // @TODO: replace this with proper parentRefPath
              parentRefPath: 'test'
            }}
          />
        )
      }),
    [ChildLink, node._ref, placement]
  )

  if (!node?._ref) {
    return null
  }

  return (
    // Loosely copied from @sanity/desk-tool's PaneItem.tsx
    <Card
      __unstable_focusRing
      as={LinkComponent}
      tone={isActive ? 'primary' : 'default'}
      padding={2}
      radius={2}
      data-as="a"
      data-ui="PaneItem"
      style={{flex: 1, maxWidth: '600px'}}
    >
      <Preview layout="default" type={schemaType} value={{_ref: node?._ref}} />
    </Card>
  )
}

export default DocumentInNode
