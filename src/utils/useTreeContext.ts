import React from 'react'

interface TreeContextValue {
  placement: 'tree' | 'input'
}

export const TreeContext = React.createContext<TreeContextValue>({placement: 'input'})

export default function useTreeContext(): TreeContextValue {
  return React.useContext(TreeContext)
}
