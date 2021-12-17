/* eslint-disable complexity */
import {useTimeAgo} from '@sanity/base/hooks'

import {Badge, Box, Button, Flex, Stack, Text, Tooltip} from '@sanity/ui'
import {PlayIcon} from '@sanity/icons'
import React from 'react'
import styled from 'styled-components'

const Root = styled(Flex)`
  cursor: default;
`

/**
 * Adapted from sanity\packages\@sanity\desk-tool\src\panes\document\statusBar\sparkline\PublishStatus.tsx
 */
const LiveEditNotice: React.FC<{
  lastPublished?: string
}> = ({lastPublished}) => {
  const lastPublishedTimeAgo = useTimeAgo(lastPublished || '', {minimal: true, agoSuffix: true})
  const lastPublishedTime = useTimeAgo(lastPublished || '', {minimal: true})

  return (
    <Root align="center" data-ui="SessionLayout" sizing="border">
      <Flex gap={3} align={'center'}>
        <Tooltip
          content={
            <Stack padding={3} space={3}>
              <Text size={1} muted>
                <>Last updated {lastPublishedTimeAgo}</>
              </Text>
            </Stack>
          }
        >
          <Button mode="bleed" tone={'critical'} tabIndex={-1}>
            <Flex align="center">
              <Box marginRight={3}>
                <Text size={2}>
                  <PlayIcon />
                </Text>
              </Box>
              <Text size={1} weight="medium">
                {lastPublishedTime}
              </Text>
            </Flex>
          </Button>
        </Tooltip>
        <Badge
          fontSize={1}
          mode="outline"
          paddingX={2}
          paddingY={1}
          radius={4}
          tone={'critical'}
          style={{whiteSpace: 'nowrap'}}
        >
          Live
        </Badge>
      </Flex>
    </Root>
  )
}

export default LiveEditNotice
