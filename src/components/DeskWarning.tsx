import {Box, Card, Container, Heading, Stack, Text} from '@sanity/ui'
import React from 'react'

// React component that wraps text between two delimiters in a <pre> tag

const WrapCodeBlocks: React.FC<{text: string}> = ({text}) => {
  return (
    <>
      {text.split('`').map((part, i) => (
        <React.Fragment key={i}>{i % 2 === 0 ? part : <code>{part}</code>}</React.Fragment>
      ))}
    </>
  )
}

const DeskWarning: React.FC<{
  title: string
  subtitle?: string
}> = ({subtitle, title, children}) => {
  return (
    <Container padding={5} style={{maxWidth: '25rem'}} sizing={'content'}>
      <Card padding={4} border radius={2} width={0} tone="caution">
        <Stack space={3}>
          <Heading size={1}>{title}</Heading>
          {subtitle &&
            subtitle.split('\\n').map((line) => (
              <Text size={1}>
                <WrapCodeBlocks text={line} />
              </Text>
            ))}
          {children && <Box marginTop={2}>{children}</Box>}
        </Stack>
      </Card>
    </Container>
  )
}

export default DeskWarning
