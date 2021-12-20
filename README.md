# sanity-plugin-hierarchies

Plugin for editing hierarchical references in the [Sanity studio](https://www.sanity.io/docs/sanity-studio).

![Screenshot of the plugin](/screenshot-1.jpg)

## Getting started

```bash
sanity install hieararchies
# or yarn add sanity-plugin-hiearchies
# or npm i sanity-plugin-hierarchies
```

With the plugin installed, you'll add the following to your Desk Structure:

💡 _If you don't have a custom desk structure, refer to the [Structure Builder docs](https://www.sanity.io/docs/overview-structure-builder) to learn how to do so._

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

The hierarchical data is stored in the document specified by the `documentId` of your choosing. As compared to storing `parent` fields in each individual document in the hierarchy, this makes it easier to implement different hierarchies for the same content according to the context, and also simplifies querying the full structure - as you'll see in [Querying data](#querying-data) below.

Keep in mind that **this document is live-edited**, meaning it has no draft and every change by editors will directly affect its published version.

Instead of manually adding items one-by-one, the plugin will create a [GROQ](https://www.sanity.io/docs/overview-groq) query that matches all documents with a `_type` in `referenceTo`, that also match the optional `referenceOptions.filter`. From these documents, editors are able to drag, nest and re-order them at will from the "Items not added" list.

If a document in the tree doesn't match the filters set, it'll still exist in the tree. This can happen if the document has a new, unfitting value, the configuration changed or it was deleted. Although the tree will still be publishable, editors will get a warning and won't be able to drag these entries around.

## Querying data

The plugin stores flat arrays which represent your hierarchical data through `parent` keys. Here's an example of one top-level item with one child:

```json
[
  {
    "_key": "741b9edde2ba",
    "_type": "hierarchy.node",
    "node": {
      "_ref": "75c47994-e6bb-487a-b8c9-b283f2436031",
      "_type": "reference",
      "_weak": true // This plugin includes weak references by default
    }
    // no `parent`, this item is top-level
  },
  {
    "_key": "f92eaeec96f7",
    "_type": "hierarchy.node",
    "node": {
      "_ref": "7ad60a02-5d6e-47d8-92e2-6724cc130058",
      "_type": "reference",
      "_weak": true
    },
    // The `parent` property points to the _key of the parent node where this one is nested
    "parent": "741b9edde2ba"
  }
]
```

📌 If using GraphQL, refer to [Usage with GraphQL](#usage-with-graphql).

From the the above, we know how to expand referenced documents in GROQ:

```groq
*[_id == "main-table-of-contents"][0]{
  tree[] {
    // Make sure you include each item's _key and parent
    _key,
    parent,

    // "Expand" the reference to the node
    node->{
      // Get whatever property you need from your documents
      title,
      slug,
    }
  }
}
```

The query above will then need to be converted from flat data to a tree. Refer to [Using the data](#using-the-data).

<!-- ### Other query scenarios

Find a given document in a hierarchy and get its parent - useful for rendering breadcrumbs:

```groq
// Works starting from Content Lake V2021-03-25
*[_id == "main-table-of-contents"][0]{
  // From the tree, get the 1st node that references a given document _id
  tree[node._ref == "my-book-section"][0] {
    _key,
    "section": node->{
      title,
    },
    // Then, from the tree get the element matching the `parent` _key of the found node
    "parentChapter": ^.tree[_key == ^.parent][0]{
      _key,
      "chapter": node->{
        title,
        contributors,
      }
    },
  }
}
```

---- -->

## Using the data

From the flat data queried, you'll need to convert it to a nested tree with `flatDataToTree`:

```js
import {flatDataToTree} from 'sanity-plugin-tree-input'

const hierarchyDocument = await client.fetch(`*[_id == "book-v3-review-a"][0]{
  tree[] {
    // Make sure you include each item's _key and parent
    _key,
    parent,
    node->{
      title,
      slug,
      content,
    }
  }
}`)
const tree = flatDataToTree(data.tree)
```

After the transformation above, nodes with nested entries will include a `children` array. This data structure is recursive.

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

---

📌 **Note:** you can also use the method above to add hierarchies inside the schema of documents and objects. We're considering adapting this input to support any type of nest-able data, not only references. Until then, avoid `createHierarchicalField` for fields in nested schemas as, in these contexts, it lacks the necessary affordances for a good editing experience.

---

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
