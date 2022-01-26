import {PublishIcon} from '@sanity/icons'
import {useDocumentOperation, useEditState} from '@sanity/react-hooks'
import {Box, Button, Flex, Spinner, useToast} from '@sanity/ui'
import React from 'react'
import DeskWarning from './components/DeskWarning'
import TreeEditor from './components/TreeEditor'
import {DocumentOperations, StoredTreeItem, TreeDeskStructureProps} from './types'
import {toGradient} from './utils/gradientPatchAdapter'

interface ComponentProps {
  options: TreeDeskStructureProps
}

const DEFAULT_TREE_FIELD_KEY = 'tree'
const DEFAULT_TREE_DOC_TYPE = 'hierarchy.tree'

const TreeDeskStructure: React.FC<ComponentProps> = (props) => {
  const treeDocType = props.options.documentType || DEFAULT_TREE_DOC_TYPE
  const treeFieldKey = props.options.fieldKeyInDocument || DEFAULT_TREE_FIELD_KEY
  const {published, draft, liveEdit} = useEditState(props.options.documentId, treeDocType)
  const {patch, ...ops} = useDocumentOperation(
    props.options.documentId,
    treeDocType
  ) as DocumentOperations
  const {push} = useToast()

  const treeValue = (published?.[treeFieldKey] || []) as StoredTreeItem[]

  const handleChange = React.useCallback(
    (patchEvent) => {
      if (!patch?.execute) {
        return
      }
      patch.execute(toGradient(patchEvent.patches))
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
        subtitle="The `documentType` passed to `createDeskHiearchy` isn't live editable. Add `liveEdit: true` to your schema in order to use this plugin."
      />
    )
  }

  if (draft?._id) {
    return (
      <DeskWarning
        title="This hierarchy tree contains a draft"
        subtitle="Click on the button below to publish your draft in order to continue editing the live
      published document."
      >
        <Button
          fontSize={1}
          tone="positive"
          text="Publish draft"
          icon={PublishIcon}
          onClick={() => {
            ops.publish?.execute?.()
            push({
              status: 'info',
              title: 'Publishing draft...'
            })
          }}
        />
      </DeskWarning>
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
