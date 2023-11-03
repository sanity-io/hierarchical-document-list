import {Box, Flex, Spinner} from '@sanity/ui'
import * as React from 'react'
import {PatchEvent, useDocumentOperation, useEditState} from 'sanity'
import DeskWarning from './components/DeskWarning'
import TreeEditor from './components/TreeEditor'
import {DocumentOperations, StoredTreeItem, TreeDeskStructureProps} from './types'
import {toGradient} from './utils/gradientPatchAdapter'
import injectNodeTypeInPatches, {DEFAULT_DOC_TYPE} from './utils/injectNodeTypeInPatches'

interface ComponentProps {
  options: TreeDeskStructureProps
}

export const DEFAULT_FIELD_KEY = 'tree'

const TreeDeskStructure: React.FC<ComponentProps> = (props) => {
  const treeDocType = props.options.documentType || DEFAULT_DOC_TYPE
  const treeFieldKey = props.options.fieldKeyInDocument || DEFAULT_FIELD_KEY
  const {published, draft, liveEdit} = useEditState(props.options.documentId, treeDocType)
  const {patch} = useDocumentOperation(props.options.documentId, treeDocType) as DocumentOperations

  const treeValue = (published?.[treeFieldKey] || []) as StoredTreeItem[]

  const handleChange = React.useCallback(
    (patchEvent: PatchEvent) => {
      if (!patch?.execute) {
        return
      }
      patch.execute(toGradient(injectNodeTypeInPatches(patchEvent.patches, treeDocType)))
    },
    [patch]
  )

  React.useEffect(() => {
    if (!published?._id && patch?.execute && !patch?.disabled) {
      // If no published document, create it
      patch.execute([{setIfMissing: {[treeFieldKey]: []}}])
    }
  }, [published?._id, patch])

  if (!liveEdit) {
    return (
      <DeskWarning
        title="Invalid configuration"
        subtitle="The `documentType` passed to `createDeskHiearchy` isn't live editable. \nTo continue using this plugin, add `liveEdit: true` to your custom schema type or unset `documentType` in your hierarchy configuration."
      />
    )
  }

  if (draft?._id) {
    return (
      <DeskWarning
        title="This hierarchy tree contains a draft"
        subtitle="Click on the button below to publish your draft in order to continue editing the live
      published document."
      />
    )
  }

  if (!published?._id) {
    return (
      <Flex padding={5} align={'center'} justify={'center'} height={'fill'}>
        <Spinner width={4} muted />
      </Flex>
    )
  }

  return (
    <Box paddingBottom={5} paddingRight={2}>
      <TreeEditor
        options={props.options}
        tree={treeValue}
        onChange={handleChange}
        patchPrefix={treeFieldKey}
      />
    </Box>
  )
}

export default TreeDeskStructure
