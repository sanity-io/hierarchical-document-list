import {defineType} from 'sanity'

export default defineType({
  name: 'hierarchy.tree',
  title: 'Hierarchical tree',
  type: 'document',
  // The plugin needs to define a `schemaType` with liveEdit enabled so that
  // `useDocumentOperation` in TreeDeskStructure.tsx doesn't create drafts at every patch.
  liveEdit: true,
  // Let's avoid defining the actual hierarchical field, else GraphQL users won't be able to deploy schemas
  fields: [
    {
      name: 'unusedField',
      title: 'Unused field',
      type: 'string',
      hidden: true,
    },
  ],
})
