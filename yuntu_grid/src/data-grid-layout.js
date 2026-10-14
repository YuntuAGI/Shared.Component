export const MIN_COLUMN_WIDTH = 64
export const MAX_COLUMN_WIDTH = 640

function columnWidthBounds(column = {}) {
  const min = Math.max(MIN_COLUMN_WIDTH, Number(column.minWidth) || MIN_COLUMN_WIDTH)
  const max = Math.max(min, Math.min(MAX_COLUMN_WIDTH, Number(column.maxWidth) || MAX_COLUMN_WIDTH))
  return { min, max }
}

export function columnSignature(columns = []) {
  return columns.map(column => String(column.key)).join('|')
}

export function normalizeGridLayout(columns = [], saved = {}) {
  const keys = columns.map(column => String(column.key))
  const known = new Set(keys)
  const savedOrder = Array.isArray(saved.order) ? saved.order.map(String).filter(key => known.has(key)) : []
  const order = [...savedOrder, ...keys.filter(key => !savedOrder.includes(key))]
  const widths = Object.fromEntries(columns.map(column => {
    const key = String(column.key)
    const fallback = Number(column.width) || 160
    const value = Number(saved.widths?.[key]) || fallback
    const { min, max } = columnWidthBounds(column)
    return [key, Math.min(max, Math.max(min, value))]
  }))
  return { order, widths }
}

export function reorderGridColumn(layout, sourceKey, targetKey) {
  const source = String(sourceKey)
  const target = String(targetKey)
  if (!source || !target || source === target) return layout
  const targetIndex = layout.order.indexOf(target)
  if (targetIndex < 0) return layout
  const order = layout.order.filter(key => key !== source)
  order.splice(targetIndex, 0, source)
  return { ...layout, order }
}

export function resizeGridColumn(layout, key, width, column) {
  const { min, max } = columnWidthBounds(column)
  return { ...layout, widths: { ...layout.widths, [key]: Math.min(max, Math.max(min, Math.round(Number(width) || min))) } }
}

export function resizeGridColumnFromPointer(layout, key, startWidth, startX, clientX, column) {
  const delta = clientX - startX
  return resizeGridColumn(layout, key, startWidth + (column?.sticky === 'right' ? -delta : delta), column)
}
