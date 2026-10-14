import { describe, it, expect, vi } from 'vitest'
import { rowsToCsv } from '../src/browser-services.js'
import { gridRowActions, runGridRowAction } from '../src/grid-row-actions.js'
describe('browser export and row actions', () => {
  it('exports quoted Unicode cells and neutralizes spreadsheet formulas', () => {
    const csv = rowsToCsv([{ name: '云途,"表格"\n第二行', note: '=1+1' }], [{ key: 'name', label: '名称' }, { key: 'note', label: '备注' }])
    expect(csv).toBe('\uFEFF"名称","备注"\r\n"云途,""表格"" 第二行","\'=1+1"')
  })
  it('keeps sequence values and empty cells', () => {
    expect(rowsToCsv([{ name: null }], [{ key: 'index', label: '序号' }, { key: 'name', label: '名称' }])).toContain('"1",""')
  })
  it('never falls through a disabled default action to a destructive action', () => {
    const remove = vi.fn()
    const actions = gridRowActions([{ label: 'open', disabled: true, run: vi.fn() }, { label: 'delete', run: remove }])
    expect(runGridRowAction(actions[0])).toBe(false)
    expect(remove).not.toHaveBeenCalled()
  })
})
