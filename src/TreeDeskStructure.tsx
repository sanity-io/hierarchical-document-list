import {useDocumentOperation, useEditState} from '@sanity/react-hooks'
import React from 'react'
import TreeEditor from './components/TreeEditor'
import {SanityTreeItem, TreeDeskStructureProps} from './types/types'
import {toGradient} from './utils/gradientPatchAdapter'

interface ComponentProps {
  options: TreeDeskStructureProps
}

// @TODO: decide on exposing this to users and letting them create their own tree schemas
const TREE_FIELD_KEY = 'tree'

const TreeDeskStructure: React.FC<ComponentProps> = React.forwardRef((props) => {
  const {published} = useEditState(props.options.treeDocId, 'customTree')
  const {patch}: any = useDocumentOperation(props.options.treeDocId, 'customTree')

  const value = (published?.[TREE_FIELD_KEY] || []) as SanityTreeItem[]

  const handleChange = React.useCallback(
    (patchEvent) => patch.execute(toGradient(patchEvent.patches)),
    [patch]
  )

  // @TODO: handle drafts by warning users when they exist and displaying a Live Sync badge when they don't

  return (
    <TreeEditor
      options={props.options}
      tree={value}
      onChange={handleChange}
      patchPrefix={TREE_FIELD_KEY}
    />
  )
})

export default TreeDeskStructure
