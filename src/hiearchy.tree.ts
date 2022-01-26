import createHierarchicalField from './createHierarchicalField'

export default {
  name: 'hierarchy.tree',
  title: 'Hierarchical tree',
  type: 'document',
  // The plugin needs to define a `schemaType` with liveEdit enabled so that
  // `useDocumentOperation` in TreeDeskStructure.tsx doesn't create drafts at every patch.
  liveEdit: true,
  fields: [
    createHierarchicalField({
      name: 'tree',
      title: 'Tree',
      options: {
        referenceTo: ['document']
      }
    })
  ],
  preview: {
    select: {
      id: '_id',
      tree: 'tree'
    },
    prepare({id, tree}: {id: string; tree: unknown[]}): Record<string, string> {
      return {
        title: `Hierarchical documents (ID: ${id})`,
        subtitle: `${tree?.length || 0} document(s) in its list.`
      }
    }
  }
}
