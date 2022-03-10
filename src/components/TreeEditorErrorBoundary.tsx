import {ErrorBoundary, ErrorBoundaryProps, useToast} from '@sanity/ui'
import * as React from 'react'

type BoundaryError = Parameters<ErrorBoundaryProps['onCatch']>[0]

const DISPLAY_ERROR = false

const ErrorToast: React.FC<{error?: BoundaryError}> = ({error}) => {
  const {push} = useToast()

  React.useEffect(() => {
    if (error?.error && DISPLAY_ERROR) {
      push({
        title: error.error.name,
        description: error.error.message,
        closable: true,
        status: 'error',
        id: 'hierarchical-error'
      })
    }
  }, [error])

  return null
}

const TreeEditorErrorBoundary: React.FC = (props) => {
  const [exception, setException] = React.useState<BoundaryError | undefined>(undefined)
  return (
    <ErrorBoundary
      onCatch={(newException) => {
        setException(newException)
      }}
    >
      <ErrorToast error={exception} />
      {props.children}
    </ErrorBoundary>
  )
}

export default TreeEditorErrorBoundary
