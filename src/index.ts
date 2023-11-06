import {definePlugin} from 'sanity'
import {default as createDeskHierarchy, type TreeProps} from './createDeskHierarchy'
import {default as createHierarchicalSchemas} from './createHierarchicalSchemas'
import {default as hierarchyTree} from './schemas/hierarchy.tree'
import {default as flatDataToTree} from './utils/flatDataToTree'

export {createDeskHierarchy, createHierarchicalSchemas, flatDataToTree, hierarchyTree, TreeProps}

/**
 * Usage in `sanity.config.ts` (or .js)
 *
 * ```ts
 * import {defineConfig} from 'sanity'
 * import {myPlugin} from 'sanity-plugin-hdl-sanity'
 *
 * export default defineConfig({
 *   // ...
 *   plugins: [myPlugin()],
 * })
 * ```
 */

export const hierarchicalDocumentList = definePlugin({
  name: 'sanity-plugin-hierarchical-document-list'
})
