import {TextWithTone} from '@sanity/base/components'
import {useTimeAgo} from '@sanity/base/hooks'
import {EditIcon, PublishIcon} from '@sanity/icons'
import {SanityDocument} from '@sanity/types'
import {Box, Inline, Text, Tooltip} from '@sanity/ui'
import React from 'react'
import {DocumentPair} from '../types'

export function TimeAgo({time}: {time: string | Date}) {
  const timeAgo = useTimeAgo(time)

  return <span title={timeAgo}>{timeAgo} ago</span>
}

const PublishedStatus = ({document}: {document?: SanityDocument | null}) => (
  <Tooltip
    content={
      <Box padding={2}>
        <Text size={1}>
          {document ? (
            <>Published {document._updatedAt && <TimeAgo time={document._updatedAt} />}</>
          ) : (
            <>Not published</>
          )}
        </Text>
      </Box>
    }
  >
    <TextWithTone tone="positive" dimmed={!document} muted={!document} size={1}>
      <PublishIcon />
    </TextWithTone>
  </Tooltip>
)

const DraftStatus = ({document}: {document?: SanityDocument | null}) => (
  <Tooltip
    content={
      <Box padding={2}>
        <Text size={1}>
          {document ? (
            <>Edited {document?._updatedAt && <TimeAgo time={document?._updatedAt} />}</>
          ) : (
            <>No unpublished edits</>
          )}
        </Text>
      </Box>
    }
  >
    <TextWithTone tone="caution" dimmed={!document} muted={!document} size={1}>
      <EditIcon />
    </TextWithTone>
  </Tooltip>
)

// Adapted from @sanity\desk-tool\src\components\paneItem\helpers.tsx
const DocumentPreviewStatus: React.FC<DocumentPair> = ({draft, published}) => {
  return (
    <Inline space={4}>
      <PublishedStatus document={published} />
      <DraftStatus document={draft} />
    </Inline>
  )
}

export default DocumentPreviewStatus
