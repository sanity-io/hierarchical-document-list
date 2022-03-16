import * as React from 'react'

/**
 * react-sortable-tree emits a lot of random errors when dragging to invalid states,
 * even when drag-targets are disabled.
 *
 * This boundary is a workaround so users are not pestered with error-toasts for things
 * that have no functional impact.
 *
 * This boundry does NOT handle errors that happen in the React dnd
 * event handlers, so there is addtional workarounds in the
 * DnDManager.
 *  */
export class TreeEditorErrorBoundary extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error: Error) {
    // do nothing
  }
  render() {
    return this.props.children
  }
}
