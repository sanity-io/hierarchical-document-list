import * as React from 'react'
import {FormField, FormNodePresence, PatchEvent, Path} from 'sanity'
import TreeEditor from './components/TreeEditor'
import {StoredTreeItem, TreeFieldSchema} from './types'
import injectNodeTypeInPatches, {DEFAULT_DOC_TYPE} from './utils/injectNodeTypeInPatches'

//TODO: Delete comments when Plugin is ready for production
export interface TreeInputComponentProps {
  type: TreeFieldSchema
  value: StoredTreeItem[]
  // compareValue: StoredTreeItem[]
  // markers: Markers[]
  level: number
  onChange: (event: unknown) => void
  onFocus: (path: Path) => void
  onBlur: () => void
  focusPath: Path
  readOnly: boolean
  presence: FormNodePresence[]
}

const TreeInputComponent: React.FC<TreeInputComponentProps> = React.forwardRef((props) => {
  // const TreeInputComponent: React.ForwardRefExoticComponent<
  //   React.PropsWithoutRef<any> & React.RefAttributes<unknown>> = React.forwardRef((props: any) => {
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
      //__unstable_markers={props.markers} // Handles all markers including validation
      __unstable_presence={props.presence} // Handles presence avatars
      // compareValue={props.compareValue} // Handles "edited" status
    >
      <TreeEditor options={props.type.options} tree={props.value || []} onChange={onChange} />
    </FormField>
  )
})

export default TreeInputComponent
