import React from 'react'
import useTreeOperationsProvider from './useTreeOperationsProvider'

type ContextValue = ReturnType<typeof useTreeOperationsProvider>

function placeholder() {
  // no-op
}

export const TreeOperationsContext = React.createContext<ContextValue>({
  addItem: placeholder,
  removeItem: placeholder,
  handleMovedNode: placeholder,
  moveItemDown: placeholder,
  moveItemUp: placeholder
})

export default function useTreeOperations(): ContextValue {
  return React.useContext(TreeOperationsContext)
}
