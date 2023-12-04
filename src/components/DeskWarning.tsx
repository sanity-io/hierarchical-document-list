import {Box, Card, Container, Heading, Stack, Text} from '@sanity/ui'
import * as React from 'react'

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

const DeskWarning: React.FC<
  React.PropsWithChildren<{
    title: string
    subtitle?: string
  }>
> = (props) => {
  return (
    <Container padding={5} style={{maxWidth: '25rem'}} sizing={'content'}>
      <Card padding={4} border radius={2} width={0} tone="caution">
        <Stack space={3}>
          <Heading size={1}>{props.title}</Heading>
          {props.subtitle &&
            props.subtitle.split('\\n').map((line: string) => (
              <Text size={1}>
                <WrapCodeBlocks text={line} />
              </Text>
            ))}
          {props.children && <Box marginTop={2}>{props.children}</Box>}
        </Stack>
      </Card>
    </Container>
  )
}

export default DeskWarning
