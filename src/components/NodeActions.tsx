import {
  ArrowDownIcon,
  ArrowUpIcon,
  EllipsisVerticalIcon,
  LaunchIcon,
  RemoveCircleIcon
} from '@sanity/icons'
import {Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import React from 'react'
import {SanityTreeItem} from '../types/types'
import useTreeOperations from '../utils/useTreeOperations'

/**
 * Applicable only to nodes inside the main tree.
 * Unadded items have their actions defined in TreeEditor.
 */
const NodeActions: React.FC<{item: SanityTreeItem}> = ({item}) => {
  const operations = useTreeOperations()

  // Adapted from @sanity\form-builder\src\inputs\ReferenceInput\ArrayItemReferenceInput.tsx
  // @TODO: Make OpenLink work - currently getting "No router context provider found"
  // const OpenLink = React.useMemo(
  //   () =>
  //     // eslint-disable-next-line @typescript-eslint/no-shadow
  //     React.forwardRef(function OpenLinkInner(
  //       restProps: React.ComponentProps<typeof IntentLink>,
  //       _ref: React.ForwardedRef<HTMLAnchorElement>
  //     ) {
  //       return (
  //         <IntentLink
  //           {...restProps}
  //           intent="edit"
  //           params={{id: item.node?._ref, type: item?.nodeDocType}}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           ref={_ref}
  //         />
  //       )
  //     }),
  //   [item.node?._ref, item?.nodeDocType]
  // )

  return (
    <MenuButton
      button={<Button padding={2} mode="bleed" icon={EllipsisVerticalIcon} />}
      id={`hiearchical-doc-list--${item._key}-menuButton`}
      menu={
        <Menu>
          <MenuItem
            text="Remove from list"
            tone="critical"
            icon={RemoveCircleIcon}
            onClick={() => operations.removeItem(item)}
          />
          <MenuItem
            text="Move up"
            icon={ArrowUpIcon}
            disabled={!item.publishedId}
            onClick={() => alert('Work in progress!')}
          />
          <MenuItem
            text="Move down"
            icon={ArrowDownIcon}
            disabled={!item.publishedId}
            onClick={() => alert('Work in progress!')}
          />
          <MenuDivider />
          <MenuItem
            text="Open in new tab"
            icon={LaunchIcon}
            disabled={!item.publishedId}
            onClick={() => alert('Work in progress!')}
          />
        </Menu>
      }
      placement="right"
      popover={{portal: true, tone: 'default'}}
    />
  )
}

export default NodeActions
