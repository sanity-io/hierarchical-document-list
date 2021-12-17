import {useToast} from '@sanity/ui'
import React from 'react'

interface ErrorInfo {
  title: string
  description?: string
}

const ErrorToast: React.FC<{error?: ErrorInfo}> = ({error}) => {
  const {push} = useToast()

  React.useEffect(() => {
    if (error?.title) {
      push({
        title: error.title,
        description: error.description,
        closable: true,
        status: 'error',
        id: 'hierarchical-error'
      })
    }
  }, [error])

  return null
}

class TreeEditorErrorBoundary extends React.Component<any, {error?: ErrorInfo}> {
  constructor(props: any) {
    super(props)
    this.state = {error: undefined}
  }

  static getDerivedStateFromError(error: unknown) {
    if (!error) {
      return {
        error: undefined
      }
    }

    return {
      error: {
        title: 'Something went wrong'
      } as ErrorInfo
    }
  }

  render() {
    return (
      <React.Fragment>
        <ErrorToast error={this.state.error} />
        {this.props.children}
      </React.Fragment>
    )
  }
}

export default TreeEditorErrorBoundary
