import {Card, CardTone, Stack, Text} from '@sanity/ui'
import React from 'react'
import {PlaceholderRendererProps} from 'react-sortable-tree'

const PlaceholderDropzone: React.FC<
  {
    tone?: CardTone
    title: string
    subtitle?: string
  } & PlaceholderRendererProps
> = (props) => {
  const isValid = props.isOver && props.canDrop
  const isInvalid = props.isOver && !props.canDrop
  let tone: CardTone = 'transparent'
  if (isValid) {
    tone = 'positive'
  }
  if (isInvalid) {
    tone = 'caution'
  }
  return (
    <Card
      padding={5}
      radius={2}
      border
      tone={tone}
      style={{
        borderStyle: props.isOver ? undefined : 'dashed'
      }}
    >
      <Stack space={2} style={{textAlign: 'center'}}>
        <Text size={2} as="h2" muted>
          {!props.isOver && props.title}
          {isValid && 'Drop here'}
          {isInvalid && 'Invalid location or element'}
        </Text>
        {props.subtitle && <Text size={1}>{props.subtitle}</Text>}
        {props.children}
      </Stack>
    </Card>
  )
}

export default PlaceholderDropzone
