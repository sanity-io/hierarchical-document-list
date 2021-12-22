export function unprefixId(_id = ''): string {
  return _id.replace('drafts.', '')
}

export function isDraft(_id = ''): boolean {
  return _id.startsWith('drafts.')
}
