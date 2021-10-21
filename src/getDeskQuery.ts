import {TreeDeskStructureProps} from './types'

export function getDeskFilter(props: TreeDeskStructureProps): string {
  const typeFilter = props.documentType ? `_type == ${props.documentType}` : ''

  return `${typeFilter} ${!!typeFilter && !!props.filter ? '&&' : ''} ${props.filter || ''}`
}

export default function getDeskQuery(props: TreeDeskStructureProps): string {
  return /* groq */ `{
    "treeDoc": *[_id == "${props.treeDocId}"][0],
    "allItems": *[${getDeskFilter(props)}] {
      _id,
      _type,
    },
  }`
}
