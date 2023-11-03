// import {createDndContext} from 'react-dnd'
// import {HTML5Backend} from 'react-dnd-html5-backend'
// import {DragDropManager} from 'dnd-core'
// import {DragDropMonitor, Identifier} from 'dnd-core/lib/interfaces'

/**
 * Fix lifted from https://github.com/frontend-collective/react-sortable-tree/issues/510#issuecomment-731233436
 * This DND context is used to resolve errors: "Error: Cannot have two HTML5 backends at the same time."
 */
// const DnDContext = createDndContext(HTML5Backend)
// const manager = DnDContext.dragDropManager as DragDropManager
// const monitor = manager.getMonitor()

/**
 * The suppressing monitor (and manager that uses it),
 * is an additional workaround to prevent non-functional errors in react-dnd from
 * bubbling to the Sanity error handler (which will emit a toast that can be ignored by the user anyway).
 */
// const suppressedMonitor: DragDropMonitor = {
//   canDragSource: monitor.canDragSource.bind(monitor),
//   canDropOnTarget(targetId: Identifier | undefined): boolean {
//     try {
//       return monitor.canDropOnTarget(targetId)
//     } catch (e) {
//       // suppress error
//       return false
//     }
//   },
//   didDrop: monitor.didDrop.bind(monitor),
//   getClientOffset: monitor.getClientOffset.bind(monitor),
//   getDifferenceFromInitialOffset: monitor.getDifferenceFromInitialOffset.bind(monitor),
//   getDropResult: monitor.getDropResult.bind(monitor),
//   getInitialClientOffset: monitor.getInitialClientOffset.bind(monitor),
//   getInitialSourceClientOffset: monitor.getInitialSourceClientOffset.bind(monitor),
//   getItem() {
// return empty instead of undefined to work around property access failing
//   return monitor.getItem() ?? {}
// },
//   getItemType: monitor.getItemType.bind(monitor),
//   getSourceClientOffset: monitor.getSourceClientOffset.bind(monitor),
//   getSourceId: monitor.getSourceId.bind(monitor),
//   getTargetIds: monitor.getTargetIds.bind(monitor),
//   isDragging: monitor.isDragging.bind(monitor),
//   isDraggingSource: monitor.isDraggingSource.bind(monitor),
//   isOverTarget: monitor.isOverTarget.bind(monitor),
//   isSourcePublic: monitor.isSourcePublic.bind(monitor),
//   subscribeToOffsetChange: monitor.subscribeToOffsetChange.bind(monitor),
//   subscribeToStateChange: monitor.subscribeToStateChange.bind(monitor),
// }

// export const suppressedDnDManager: DragDropManager = {
//   getMonitor() {
//     return suppressedMonitor
//   },
//   getBackend: manager.getBackend.bind(manager),
//   getRegistry: manager.getRegistry.bind(manager),
//   getActions: manager.getActions.bind(manager),
//   dispatch: manager.dispatch.bind(manager),
// }

export {}
