import { tableCopyValue } from './data-grid-copy.js'

// Neutral browser defaults. Electron hosts may inject their own bridge.
export function rowsToCsv(rows, columns) {
  const cell = value => {
    let text = tableCopyValue(value)
    // Do not let spreadsheet applications interpret untrusted cells as formulas.
    if (/^[=+\-@]/.test(text)) text = "'" + text
    return '"' + text.replaceAll('"', '""') + '"'
  }
  return '\uFEFF' + [columns.map(c => cell(c.label || c.key)).join(','), ...rows.map((row, index) => columns.map(c => cell(c.key === 'index' || c.key === 'n' ? index + 1 : row[c.key])).join(','))].join('\r\n')
}

export const browserServices = {
  async copyText(text) {
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return }
    } catch { /* file:// and embedded pages may need the legacy user-gesture fallback. */ }
    const previous = document.activeElement
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('aria-label', '复制内容')
    Object.assign(area.style, { position: 'fixed', top: '0', left: '-9999px' })
    document.body.append(area)
    try {
      area.select()
      if (!document.execCommand('copy')) throw new Error('浏览器未允许复制，请检查剪贴板权限')
    } finally { area.remove(); previous?.focus?.() }
  },
  async exportRows({ title = '导出数据', rows, columns }) {
    const blob = new Blob([rowsToCsv(rows, columns)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = title.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_') + '.csv'
    document.body.append(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}
