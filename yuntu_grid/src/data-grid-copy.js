const excludedKeys = new Set(['actions', 'avatar', 'selectedState'])

export function tableCopyValue(value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') {
    try { return JSON.stringify(value) } catch { return String(value) }
  }
  return String(value).replace(/[\t\r\n]+/g, ' ').trim()
}

export function copyableTableColumns(columns = []) {
  return columns.filter(column => column?.label && !excludedKeys.has(String(column.key)))
}

export function tableRowsToClipboard(columns, selectedRows) {
  const copyableColumns = copyableTableColumns(columns)
  if (!copyableColumns.length || !selectedRows?.length) return ''
  const header = copyableColumns.map(column => String(column.label)).join('\t')
  const lines = selectedRows.map(({ row, index }) => copyableColumns.map(column => {
    if (String(column.key) === 'index' && row?.[column.key] === undefined) return String(index + 1)
    return tableCopyValue(row?.[column.key])
  }).join('\t'))
  return [header, ...lines].join('\r\n')
}
