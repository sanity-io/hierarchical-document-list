import {FormFieldPresence} from '@sanity/base/presence'
import {Marker, Path} from '@sanity/types'
import React from 'react'
import {FormField} from '@sanity/base/components'
import TreeEditor from './components/TreeEditor'
import {SanityTreeItem, TreeFieldSchema} from './types/types'

export interface TreeInputComponentProps {
  type: TreeFieldSchema
  value: SanityTreeItem[]
  compareValue: SanityTreeItem[]
  markers: Marker[]
  level: number
  onChange: (event: unknown) => void
  onFocus: (path: Path) => void
  onBlur: () => void
  focusPath: Path
  readOnly: boolean
  presence: FormFieldPresence[]
}

const TreeInputComponent: React.FC<TreeInputComponentProps> = React.forwardRef((props) => {
  return (
    <FormField
      description={props.type.description} // Creates description from schema
      title={props.type.title} // Creates label from schema title
      __unstable_markers={props.markers} // Handles all markers including validation
      __unstable_presence={props.presence} // Handles presence avatars
      // @ts-expect-error FormField's TS definitions are off - it doesn't include compareValue
      compareValue={props.compareValue} // Handles "edited" status
    >
      <TreeEditor options={props.type.options} tree={props.value || []} onChange={props.onChange} />
    </FormField>
  )
})

export default TreeInputComponent
