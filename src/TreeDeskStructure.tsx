import {PublishIcon} from '@sanity/icons'
import {useDocumentOperation, useEditState} from '@sanity/react-hooks'
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  useToast
} from '@sanity/ui'
import React from 'react'
import TreeEditor from './components/TreeEditor'
import {DocumentOperations, SanityTreeItem, TreeDeskStructureProps} from './types'
import {toGradient} from './utils/gradientPatchAdapter'

interface ComponentProps {
  options: TreeDeskStructureProps
}

const DEFAULT_TREE_FIELD_KEY = 'tree'
const DEFAULT_TREE_DOC_TYPE = 'hierarchy.tree'

const TreeDeskStructure: React.FC<ComponentProps> = (props) => {
  const treeDocType = props.options.documentType || DEFAULT_TREE_DOC_TYPE
  const treeFieldKey = props.options.fieldKeyInDocument || DEFAULT_TREE_FIELD_KEY
  const {published, draft} = useEditState(props.options.documentId, treeDocType)
  const {patch, ...ops} = useDocumentOperation(
    props.options.documentId,
    treeDocType
  ) as DocumentOperations
  const {push} = useToast()

  const treeValue = (published?.[treeFieldKey] || []) as SanityTreeItem[]

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

  if (draft?._id) {
    return (
      <Container padding={5} style={{maxWidth: '25rem'}} sizing={'content'}>
        <Card padding={4} border radius={2} width={0} tone="caution">
          <Stack space={3}>
            <Heading size={1}>This hierarchy tree contains a draft</Heading>
            {/* <Text>Hierarchies can't currently contain drafts.</Text> */}
            <Text size={1}>
              Click on the button below to publish your draft in order to continue editing the live
              published document.
            </Text>
            <Box marginTop={2}>
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
            </Box>
          </Stack>
        </Card>
      </Container>
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
