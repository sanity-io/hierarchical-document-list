export function getSchemaTypeName(
  documentType: string,
  type: 'document' | 'node' | 'nodeValue' | 'array'
): string {
  switch (type) {
    case 'document':
      return documentType
    case 'array':
      return `${documentType}.array`
    case 'node':
      return `${documentType}.node`
    case 'nodeValue':
      return `${documentType}.nodeValue`
    default:
      return documentType
  }
}

/**
 * Temporary value of nodes' `_type` before they are normalized and persisted as the user-defined choice.
 */
export const DEFAULT_DOC_TYPE = 'hierarchy.tree'
export const INTERNAL_NODE_TYPE = getSchemaTypeName(DEFAULT_DOC_TYPE, 'node')
export const INTERNAL_NODE_VALUE_TYPE = getSchemaTypeName(DEFAULT_DOC_TYPE, 'nodeValue')
export const INTERNAL_NODE_ARRAY_TYPE = getSchemaTypeName(DEFAULT_DOC_TYPE, 'array')

/**
 * Barebones recursive utility to inject the desired nodeObjectType in patches generated in deeply nested components and utilities.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function injectNodeTypeInPatches(patchData: any, documentType: string): any {
  if (Array.isArray(patchData)) {
    return patchData.map((child) => injectNodeTypeInPatches(child, documentType))
  }
  if (typeof patchData === 'object' && patchData !== null) {
    return Object.keys(patchData).reduce((newObject, key) => {
      const value = patchData[key as keyof typeof patchData]

      if (
        key === '_type' &&
        typeof value === 'string' &&
        [INTERNAL_NODE_TYPE, INTERNAL_NODE_VALUE_TYPE].includes(value)
      ) {
        return {
          ...newObject,
          [key]: getSchemaTypeName(
            documentType,
            value === INTERNAL_NODE_TYPE ? 'node' : 'nodeValue'
          )
        }
      }

      return {
        ...newObject,
        [key]: injectNodeTypeInPatches(value, documentType)
      }
    }, {})
  }
  return patchData
}
