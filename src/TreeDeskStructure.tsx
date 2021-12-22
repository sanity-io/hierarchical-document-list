import {useDocumentOperation, useEditState} from '@sanity/react-hooks'
import {Box, Flex, Spinner} from '@sanity/ui'
import React from 'react'
import TreeEditor from './components/TreeEditor'
import {SanityTreeItem, TreeDeskStructureProps} from './types/types'
import {toGradient} from './utils/gradientPatchAdapter'

interface ComponentProps {
  options: TreeDeskStructureProps
}

const DEFAULT_TREE_FIELD_KEY = 'tree'
const DEFAULT_TREE_DOC_TYPE = 'hierarchy.tree'

const TreeDeskStructure: React.FC<ComponentProps> = React.forwardRef((props) => {
  const treeDocType = props.options.documentType || DEFAULT_TREE_DOC_TYPE
  const treeFieldKey = props.options.fieldKeyInDocument || DEFAULT_TREE_FIELD_KEY
  const {published, draft} = useEditState(props.options.documentId, treeDocType)
  const {patch}: any = useDocumentOperation(props.options.documentId, treeDocType)

  const value = (published?.[treeFieldKey] || []) as SanityTreeItem[]

  const handleChange = React.useCallback(
    (patchEvent) => patch.execute(toGradient(patchEvent.patches)),
    [patch]
  )

  React.useEffect(() => {
    if (!published?._id && patch?.excute && !patch?.disabled) {
      // If no published document, create it
      patch.execute([{setIfMissing: {[treeFieldKey]: []}}])
    }
  }, [published?._id, patch])

  if (draft?._id && !published?._id) {
    // @TODO: handle drafts by warning users when they exist and displaying a Live Sync badge when they don't
  }

  if (draft?._id) {
    // @TODO: Warning to delete draft
  }

  if (!published?._id) {
    return (
      <Flex padding={5} align={'center'} justify={'center'}>
        <Spinner width={4} muted />
      </Flex>
    )
  }

  return (
    <Box paddingBottom={5} paddingRight={2}>
      <TreeEditor
        options={props.options}
        tree={value}
        onChange={handleChange}
        patchPrefix={treeFieldKey}
      />
    </Box>
  )
})

export default TreeDeskStructure
