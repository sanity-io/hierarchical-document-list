# sanity-plugin-hierarchies

Plugin for editing hierarchical references in the [Sanity studio](https://www.sanity.io/docs/sanity-studio).

![Screenshot of the plugin](/screenshot-1.jpg)

## Getting started

```bash
sanity install hieararchies
# or yarn add sanity-plugin-hiearchies
# or npm i sanity-plugin-hierarchies
```

With the plugin installed, you'll add the following to your Desk Structure - if you don't have a custom desk structure, refer to the [Structure Builder docs](https://www.sanity.io/docs/overview-structure-builder) to learn how to do so.

```js
// deskStructure.js
import S from '@sanity/desk-tool/structure-builder'
import {createDeskHierarchy} from 'sanity-plugin-tree-input'

export default () => {
  return S.list()
    .title('Content')
    .items([
      ...S.documentTypeListItems(), // or whatever other structure you have
      createDeskHierarchy({
        title: 'Main table of contents',

        // The hiearchy will be stored in this document ID 👇
        documentId: 'main-table-of-contents',

        // Document types editors should be able to include in the hierarchy
        referenceTo: ['site.page', 'site.post', 'docs.article', 'social.youtubeVideo'],

        // ❓ Optional: provide filters and/or parameters for narrowing which documents can be added
        referenceOptions: {
          filter: 'status in $acceptedStatuses',
          filterParams: {
            acceptedStatuses: ['published', 'approved']
          }
        }
      })
    ])
}
```

## How it works

The hierarchical data is stored in the document specified by the `documentId` of your choosing. This makes it easier to implement different hierarchies for the same content according to the context, and also simplifies querying the full structure, as you'll see in [Querying data](#querying-data) below.

Keep in mind that **this document is live-edited**, meaning it has no draft and every change by editors will directly affect its published version.

Instead of manually adding items one-by-one, the plugin will create a [GROQ](https://www.sanity.io/docs/overview-groq) query that matches all documents with a type in `referenceTo`, that also match the optional `referenceOptions.filter`. From these documents, editors are able to drag, nest and re-order them at will from the "Items not added" list.

If a document in the tree doesn't match the filters set, it'll still exist in the tree. This can happen if the document has a new, unfitting value, the configuration changed or it was deleted. Although the tree will still be publishable, editors will get a warning and won't be able to drag these entries around.

## Querying data

- GROQ HELPERS

## Using the data

- CONSTRUCTTREE

## Usage with GraphQL

By default, this plugin will create and update documents of `_type: hierarchy.tree`, with a `tree` field holding the hierarchical data. When deploying a [GraphQL Sanity endpoint](https://www.sanity.io/docs/graphql), however, you'll need an explicit document type in your schema so that you get the proper types for querying.

To add this document type, create a new document schema similar to the following:

```js
import {createHierarchicalField} from 'sanity-plugin-tree-input'

export default {
  name: 'myCustomHierarchicalType',
  title: 'Custom document type for holding hierarchical data',
  type: 'document',
  fields: [
    createHierarchicalField({
      name: 'treeData', // custom key for
      title: 'Custom tree',
      options: {
        referenceTo: ['category']
      }
    })
  ]
}
```

📌 **Note:** you can also use the method above to add hierarchies inside the schema of documents and objects. We're considering adapting this input to support any type of nest-able data, not only references. Until then, we suggest avoiding this input component for fields in nested schemas as, in these contexts, it lacks the necessary affordances for a good editing experience.

Then, in your desk structure where you added the hierarchical document(s), include the right `documentType` and `fieldKeyInDocument` properties:

```js
createDeskHierarchy({
  title: 'Hierarchies',
  referenceTo: ['product', 'collection'],
  documentId: 'hierarchies',

  // Include whatever values you defined in your schema
  documentType: 'myCustomHierarchicalType',
  fieldKeyInDocument: 'treeData'
})
```

## License

MIT-licensed. See LICENSE.
