import {IntentLink} from '@sanity/base/components'
import {CopyIcon, EllipsisVerticalIcon, LaunchIcon, RemoveCircleIcon} from '@sanity/icons'
import {Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import React from 'react'
import {NodeRendererProps} from 'react-sortable-tree'
import useTreeOperations from '../utils/useTreeOperations'

/**
 * Applicable only to nodes inside the main tree.
 * Unadded items have their actions defined in TreeEditor.
 */
const NodeActions: React.FC<{nodeProps: NodeRendererProps}> = ({nodeProps}) => {
  const operations = useTreeOperations()
  const {node} = nodeProps

  // Adapted from @sanity\form-builder\src\inputs\ReferenceInput\ArrayItemReferenceInput.tsx
  const OpenLink = React.useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-shadow
      React.forwardRef(function OpenLinkInner(
        restProps: React.ComponentProps<typeof IntentLink>,
        _ref: React.ForwardedRef<HTMLAnchorElement>
      ) {
        return (
          <IntentLink
            {...restProps}
            intent="edit"
            params={{id: node.node?._ref, type: node.nodeDocType}}
            target="_blank"
            rel="noopener noreferrer"
            ref={_ref}
          />
        )
      }),
    [node.node?._ref, node?.nodeDocType]
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
            text="Duplicate"
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
      placement="right"
      popover={{portal: true, tone: 'default'}}
    />
  )
}

export default NodeActions
