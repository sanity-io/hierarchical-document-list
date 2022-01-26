import {Box, Card, Container, Heading, Stack, Text} from '@sanity/ui'
import React from 'react'

const DeskWarning: React.FC<{
  title: string
  subtitle?: string
}> = ({subtitle, title, children}) => {
  return (
    <Container padding={5} style={{maxWidth: '25rem'}} sizing={'content'}>
      <Card padding={4} border radius={2} width={0} tone="caution">
        <Stack space={3}>
          <Heading size={1}>{title}</Heading>
          {/* <Text>Hierarchies can't currently contain drafts.</Text> */}
          {subtitle && <Text size={1}>{subtitle}</Text>}
          {children && <Box marginTop={2}>{children}</Box>}
        </Stack>
      </Card>
    </Container>
  )
}

export default DeskWarning
