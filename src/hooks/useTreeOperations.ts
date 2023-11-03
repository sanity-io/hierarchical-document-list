import * as React from 'react'
import useAllItems from './useAllItems'
import useTreeOperationsProvider from './useTreeOperationsProvider'

type ContextValue = ReturnType<typeof useTreeOperationsProvider> & {
  allItemsStatus: ReturnType<typeof useAllItems>['status']
}

function placeholder() {
  // no-op
}

export const TreeOperationsContext = React.createContext<ContextValue>({
  addItem: placeholder,
  duplicateItem: placeholder,
  removeItem: placeholder,
  handleMovedNode: placeholder,
  moveItemDown: placeholder,
  moveItemUp: placeholder,
  allItemsStatus: 'loading',
})

export default function useTreeOperations(): ContextValue {
  return React.useContext(TreeOperationsContext)
}
