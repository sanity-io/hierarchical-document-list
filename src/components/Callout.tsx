import React from 'react'
import {ErrorOutlineIcon, InfoOutlineIcon} from '@sanity/icons'
import {Box, Card, CardTone, Heading, Inline, Stack, Text} from '@sanity/ui'

const Callout: React.FC<{
  tone?: CardTone
  title: string
  subtitle?: string
}> = (props) => {
  const tone = props.tone || 'caution'
  return (
    <Box padding={2}>
      <Card tone={tone} padding={3} radius={2} shadow={1}>
        <Inline space={3}>
          <Text size={4}>{tone === 'critical' ? <ErrorOutlineIcon /> : <InfoOutlineIcon />}</Text>
          <Stack space={2}>
            <Heading size={1} as="h2" muted>
              {props.title}
            </Heading>
            {props.subtitle && <Text size={2}>{props.subtitle}</Text>}
            {props.children}
          </Stack>
        </Inline>
      </Card>
    </Box>
  )
}

export default Callout
