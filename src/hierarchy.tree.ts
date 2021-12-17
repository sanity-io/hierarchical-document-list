import createTreeField from './createTreeField'

export default {
  name: 'hierarchy.tree',
  title: 'Hierarchical tree',
  type: 'document',
  liveEdit: true,
  fields: [
    createTreeField({
      name: 'tree',
      title: 'Tree',
      options: {
        referenceField: {
          to: [{type: 'category'}]
        }
      }
    })
  ]
}
