import {useDocumentOperation, useEditState} from '@sanity/react-hooks'
import {Box, Card, Flex, Spinner} from '@sanity/ui'
import React from 'react'
import LiveEditNotice from './components/LiveEditNotice'
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

const TreeDeskStructure: React.FC<ComponentProps> = React.forwardRef((props) => {
  const {published, draft} = useEditState(props.options.treeDocId, TREE_DOC_TYPE)
  const {patch}: any = useDocumentOperation(props.options.treeDocId, TREE_DOC_TYPE)

  const value = (published?.[TREE_FIELD_KEY] || []) as SanityTreeItem[]

  const handleChange = React.useCallback(
    (patchEvent) => patch.execute(toGradient(patchEvent.patches)),
    [patch]
  )

  React.useEffect(() => {
    if (!published?._id && patch?.excute && !patch?.disabled) {
      // If no published document, create it
      patch.execute([{setIfMissing: {[TREE_FIELD_KEY]: []}}])
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
    <TreeContext.Provider value={{placement: 'tree'}}>
      <Box paddingX={4} paddingY={2} style={{minHeight: '100%'}}>
        <TreeEditor
          options={props.options}
          tree={value}
          onChange={handleChange}
          patchPrefix={TREE_FIELD_KEY}
        />
      </Box>
      <Card padding={3} style={{position: 'sticky', left: 0, bottom: 0}} borderTop={true}>
        <LiveEditNotice lastPublished={published._updatedAt} />
      </Card>
    </TreeContext.Provider>
  )
})

export default TreeDeskStructure
