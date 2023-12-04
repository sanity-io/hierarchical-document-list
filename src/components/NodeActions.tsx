import {CopyIcon, EllipsisVerticalIcon, LaunchIcon, RemoveCircleIcon} from '@sanity/icons'
import {Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import * as React from 'react'
import {IntentButton as IntentLink} from 'sanity'
import useTreeOperations from '../hooks/useTreeOperations'
import {NodeProps} from '../types'

/**
 * Applicable only to nodes inside the main tree.
 * Unadded items have their actions defined in TreeEditor.
 */
const NodeActions: React.FC<{nodeProps: NodeProps}> = ({nodeProps}) => {
  const operations = useTreeOperations()
  const {node} = nodeProps
  const {reference, docType} = node?.value || {}

  // Adapted from @sanity\form-builder\src\inputs\ReferenceInput\ArrayItemReferenceInput.tsx
  const OpenLink = React.useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-shadow
      React.forwardRef(function OpenLinkInner(
        restProps: React.ComponentProps<typeof IntentLink>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _ref: React.ForwardedRef<HTMLAnchorElement>
      ) {
        return (
          <IntentLink
            {...restProps}
            intent="edit"
            params={{id: reference?._ref, type: docType}}
            target="_blank"
            rel="noopener noreferrer"
          />
        )
      }),
    [reference?._ref, docType]
  )

  const isValid = !!node.publishedId
  return (
    <MenuButton
      button={<Button padding={2} mode="bleed" icon={EllipsisVerticalIcon} />}
      id={`hiearchical-doc-list--${node._key}-menuButton`}
      menu={
        <Menu>
          <MenuItem
            text="Remove from list"
            tone="critical"
            icon={RemoveCircleIcon}
            onClick={() => operations.removeItem(nodeProps)}
          />
          <MenuItem
            text="Duplicate item"
            icon={CopyIcon}
            disabled={!isValid}
            onClick={() => operations.duplicateItem(nodeProps)}
          />
          {/* <MenuItem
            text="Move up"
            icon={ArrowUpIcon}
            disabled={!isValid}
            onClick={() => operations.moveItemUp(nodeProps)}
          />
          <MenuItem
            text="Move down"
            icon={ArrowDownIcon}
            disabled={!isValid}
            onClick={() => operations.moveItemDown(nodeProps)}
          /> */}
          <MenuDivider />
          <MenuItem
            text="Open in new tab"
            icon={LaunchIcon}
            disabled={!isValid}
            as={OpenLink}
            data-as="a"
          />
        </Menu>
      }
      popover={{portal: true, tone: 'default', placement: 'right'}}
    />
  )
}

export default NodeActions
