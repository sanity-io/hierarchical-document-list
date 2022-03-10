import {TextWithTone} from '@sanity/base/components'
import {SanityDocument} from '@sanity/client'
import {usePaneRouter} from '@sanity/desk-tool'
import {HelpCircleIcon} from '@sanity/icons'
import {Box, Card, Flex, Stack, Text, Tooltip} from '@sanity/ui'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import React from 'react'
import {LocalTreeItem} from '../types'
import useTreeOperations from '../hooks/useTreeOperations'
import DocumentPreviewStatus from './DocumentPreviewStatus'

/**
 * Renders a preview for each referenced document.
 * Nested inside TreeNode.tsx
 */
const DocumentInNode: React.FC<{
  item: LocalTreeItem
  action?: React.ReactNode
}> = (props) => {
  const {value: {reference, docType} = {}, draftId, publishedId} = props.item
  const {routerPanesState, ChildLink} = usePaneRouter()
  const {allItemsStatus} = useTreeOperations()

  const isActive = React.useMemo(() => {
    // If some pane is active with the current document `_id`, it's active
    return routerPanesState.some((pane) => pane.some((group) => group.id === reference?._ref))
  }, [routerPanesState])

  const schemaType = React.useMemo(() => schema.get(docType), [docType])

  const LinkComponent = React.useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-shadow
      React.forwardRef((linkProps: any, ref: any) => (
        <ChildLink
          {...linkProps}
          childId={reference?._ref}
          ref={ref}
          childParameters={{
            type: docType
          }}
        />
      )),
    [ChildLink, reference?._ref]
  )

  if (!reference?._ref) {
    return null
  }

  return (
    <Flex gap={2} align="center" style={{flex: 1}}>
      {/* Show loading preview while allItems aren't ready */}
      {publishedId || allItemsStatus !== 'success' ? (
        /* Card loosely copied from @sanity/desk-tool's PaneItem.tsx */
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
            value={{_ref: draftId || reference?._ref}}
            status={
              <DocumentPreviewStatus
                draft={
                  draftId
                    ? ({
                        _id: draftId,
                        _type: docType,
                        _updatedAt: props.item.draftUpdatedAt
                      } as SanityDocument)
                    : undefined
                }
                published={
                  {
                    _id: reference?._ref,
                    _type: docType,
                    _updatedAt: props.item.publishedUpdatedAt
                  } as SanityDocument
                }
              />
            }
          />
        </Card>
      ) : (
        <Card padding={3} radius={1} flex={1}>
          <Flex align="center">
            <Text size={2} muted style={{flex: 1}}>
              Invalid document
            </Text>
            <Tooltip
              placement="left"
              portal
              content={
                <Box padding={3}>
                  <Flex align="flex-start" gap={3}>
                    <TextWithTone tone="default" size={3}>
                      <HelpCircleIcon />
                    </TextWithTone>
                    <Stack space={3}>
                      <Text as="h2" size={1} weight="semibold">
                        This document is not valid
                      </Text>
                      {/* <Text size={1}>
                        It was deleted or it doesn't match the filters set by this hierarchy.
                      </Text> */}
                      <Text size={1}>ID: {reference?._ref}</Text>
                    </Stack>
                  </Flex>
                </Box>
              }
            >
              <TextWithTone tone="default" size={2}>
                <HelpCircleIcon />
              </TextWithTone>
            </Tooltip>
          </Flex>
        </Card>
      )}
      {props.action}
    </Flex>
  )
}

export default DocumentInNode
