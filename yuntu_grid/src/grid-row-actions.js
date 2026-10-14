// Both the context menu and double-click consume this same ordered list.
// A disabled first action remains the default; it must not fall through to
// another action (which might send or delete data).
export function gridRowActions(actions, row, context) {
  const resolved = typeof actions === 'function' ? actions(row, context) : actions
  return (Array.isArray(resolved) ? resolved : []).filter(action => action && !action.hidden)
}

export function runGridRowAction(action) {
  if (!action || action.disabled || typeof action.run !== 'function') return false
  return action.run()
}
