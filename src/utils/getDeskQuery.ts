import {TreeDeskStructureProps} from '../types/types'

export function getDeskFilter(props: TreeDeskStructureProps): string {
  const filterParts: string[] = ['!(_id in path("drafts.**"))']

  if (props.documentType) {
    filterParts.push(`_type == ${props.documentType}`)
  }

  if (props.filter) {
    filterParts.push(props.filter)
  }

  return filterParts.join(' && ')
}

export default function getDeskQuery(props: TreeDeskStructureProps): string {
  return /* groq */ `{
    "mainTree": *[_id == "${props.treeDocId}"][0].tree,
    "allItems": *[${getDeskFilter(props)}] {
      _id,
      _type,
    },
  }`
}
