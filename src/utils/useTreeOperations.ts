import React from 'react'
import useTreeOperationsProvider from './useTreeOperationsProvider'

type ContextValue = ReturnType<typeof useTreeOperationsProvider>

export const TreeOperationsContext = React.createContext<ContextValue>({
  addItem: () => {
    /* */
  },
  removeItem: () => {
    /* */
  },
  handleMovedNode: () => {
    /* */
  }
})

export default function useTreeOperations(): ContextValue {
  return React.useContext(TreeOperationsContext)
}
