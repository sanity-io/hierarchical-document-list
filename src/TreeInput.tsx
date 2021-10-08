import React from 'react'
import {FormField} from '@sanity/base/components'
import {Button, Stack} from '@sanity/ui'
import {ArraySchemaType} from '@sanity/types'

import SortableTree, {TreeItem} from 'react-sortable-tree'
import 'react-sortable-tree/style.css?raw'
// @ts-expect-error: PatchEvent isn't typed and we can't overwrite it in a .d.ts `declare module`
import PatchEvent, {set, unset} from '@sanity/form-builder/PatchEvent'
// eslint-disable-next-line
import {Props as ArrayProps} from '@sanity/form-builder/dist/dts/inputs/arrays/ArrayOfObjectsInput/ArrayInput'
import {SanityTreeItem} from './types'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import sanitizeTreeInput from './sanitizeTreeInput'

interface TreeFieldType extends Omit<ArraySchemaType, 'options'> {
  options?: {
    maxDepth?: number
  }
}

interface InputProps extends Omit<ArrayProps, 'type'> {
  value: SanityTreeItem[]
  type: TreeFieldType
}

const TreeInput = React.forwardRef<unknown, InputProps>((props, ref) => {
  const {type, markers, presence, onChange} = props
  const [state, setState] = React.useState<TreeItem[]>(props.value)

  function updateValue(newValue: TreeItem) {
    let patch = unset()
    if (Array.isArray(newValue) && newValue.length) {
      const sanitized = sanitizeTreeInput(newValue)

      // Skip patching if changing non-storable state such as `expanded`
      if (JSON.stringify(sanitized) === JSON.stringify(props.value)) {
        console.log('Skipping update')
        return
      }
      patch = set(sanitized)
    }
    console.log('Updating')
    onChange(PatchEvent.from(patch))
  }

  React.useEffect(() => {
    updateValue(state)
  }, [state])

  return (
    <FormField
      description={type.description}
      title={type.title}
      __unstable_markers={markers}
      __unstable_presence={presence}
      // @ts-expect-error: FormField isn't including compareValue in its declarations
      compareValue={props.compareValue}
    >
      <Stack space={5} padding={3}>
        <div style={{minHeight: '300px'}}>
          <SortableTree
            generateNodeProps={(nodeProps) => {
              const node = nodeProps.node as SanityTreeItem

              return {
                title: <Preview layout="default" type={schema.get('reference')} value={node.node} />
              }
            }}
            treeData={state}
            onChange={(newState) => setState(newState)}
            maxDepth={3}
          />
        </div>
        <Button ref={ref as any} text="Add" onClick={console.info} />
      </Stack>
    </FormField>
  )
})

// Create the default export to import into our schema
export default TreeInput
