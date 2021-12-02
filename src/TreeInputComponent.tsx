import {FormFieldPresence} from '@sanity/base/presence'
import {Marker, Path} from '@sanity/types'
import React from 'react'
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
    <TreeEditor options={props.type.options} tree={props.value || []} onChange={props.onChange} />
  )
})

export default TreeInputComponent
