const ERROR_MESSAGES = {
  invalidDocumentId: 'Please add a documentId to your tree',
  invalidDocumentType: 'Please add a valid documentType to createHierarchicalSchemas',
  invalidReferenceTo: "Missing valid 'referenceTo' value"
}

export default function throwError(message: keyof typeof ERROR_MESSAGES, extraContext = ''): void {
  throw new Error(`[hierarchical input] ${ERROR_MESSAGES[message]} ${extraContext}`)
}
