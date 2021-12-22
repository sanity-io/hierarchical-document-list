import {EllipsisVerticalIcon, TrashIcon} from '@sanity/icons'
import {Button, Menu, MenuButton, MenuItem} from '@sanity/ui'
import React from 'react'
import {SanityTreeItem} from '../types/types'
import useTreeOperations from '../utils/useTreeOperations'

const NodeActions: React.FC<{item: SanityTreeItem}> = ({item}) => {
  const operations = useTreeOperations()
  return (
    <MenuButton
      button={<Button padding={2} mode="bleed" icon={EllipsisVerticalIcon} />}
      id={`hiearchical-doc-list--${item._key}-menuButton`}
      menu={
        <Menu>
          <MenuItem
            text="Remove"
            tone="critical"
            icon={TrashIcon}
            onClick={() => operations.removeItem(item)}
          />
        </Menu>
      }
      placement="right"
      popover={{portal: true, tone: 'default'}}
    />
  )
}

export default NodeActions
