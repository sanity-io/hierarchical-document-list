import {FormField} from '@sanity/base/components'
import {FormFieldPresence} from '@sanity/base/presence'
import PatchEvent from '@sanity/form-builder/PatchEvent'
import {Marker, Path} from '@sanity/types'
import * as React from 'react'
import TreeEditor from './components/TreeEditor'
import {StoredTreeItem, TreeFieldSchema} from './types'
import injectNodeTypeInPatches, {DEFAULT_DOC_TYPE} from './utils/injectNodeTypeInPatches'

export interface TreeInputComponentProps {
  type: TreeFieldSchema
  value: StoredTreeItem[]
  compareValue: StoredTreeItem[]
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
  const documentType = props.type.options.documentType || DEFAULT_DOC_TYPE

  const onChange = React.useCallback(
    (patch: any) => {
      const patches = injectNodeTypeInPatches(patch?.patches, documentType)
      props.onChange(new PatchEvent(patches))
    },
    [props.onChange]
  )

  return (
    <FormField
      description={props.type.description} // Creates description from schema
      title={props.type.title} // Creates label from schema title
      __unstable_markers={props.markers} // Handles all markers including validation
      __unstable_presence={props.presence} // Handles presence avatars
      // @ts-expect-error FormField's TS definitions are off - it doesn't include compareValue
      compareValue={props.compareValue} // Handles "edited" status
    >
      <TreeEditor options={props.type.options} tree={props.value || []} onChange={onChange} />
    </FormField>
  )
})

export default TreeInputComponent
