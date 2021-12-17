import {useDocumentOperation, useEditState} from '@sanity/react-hooks'
import {Box} from '@sanity/ui'
import React from 'react'
import TreeEditor from './components/TreeEditor'
import {SanityTreeItem, TreeDeskStructureProps} from './types/types'
import {toGradient} from './utils/gradientPatchAdapter'
import {TreeContext} from './utils/useTreeContext'

interface ComponentProps {
  options: TreeDeskStructureProps
}

// @TODO: decide on exposing this to users and letting them create their own tree schemas
const TREE_FIELD_KEY = 'tree'
const TREE_DOC_TYPE = 'hierarchy.tree'

const TreeDeskStructure: React.FC<ComponentProps> = (props) => {
  const {published, ready} = useEditState(props.options.treeDocId, TREE_DOC_TYPE)
  const {patch}: any = useDocumentOperation(props.options.treeDocId, TREE_DOC_TYPE)

  const value = (published?.[TREE_FIELD_KEY] || []) as SanityTreeItem[]

  const handleChange = React.useCallback(
    (patchEvent) => patch.execute(toGradient(patchEvent.patches)),
    [patch]
  )

  React.useEffect(() => {
    console.info('Mounting TreeDeskStructure')
  }, [])
  // @TODO: handle drafts by warning users when they exist and displaying a Live Sync badge when they don't

  return (
    <TreeContext.Provider value={{placement: 'tree'}}>
      <Box paddingX={4} paddingY={2}>
        <TreeEditor
          options={props.options}
          tree={value}
          onChange={handleChange}
          patchPrefix={TREE_FIELD_KEY}
        />
      </Box>
    </TreeContext.Provider>
  )
}

export default React.memo(TreeDeskStructure, (prev, next) => {
  console.info('PROPS ARE EQUAL')
  return (
    prev.options?.treeDocId === next.options?.treeDocId &&
    JSON.stringify(prev.options?.referenceField?.to) ===
      JSON.stringify(next.options?.referenceField?.to)
  )
})
