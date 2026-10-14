import { describe, expect, it } from 'vitest'
import { applyGridFilters, nextGridSort, sortGridRows } from '../src/yuntu-grid.js'

const columns = [
  { key: 'name', label: '名称', dataType: 'text' },
  { key: 'fans', label: '粉丝数', dataType: 'number' },
  { key: 'createdAt', label: '创建时间', dataType: 'datetime' },
  { key: 'enabled', label: '启用', dataType: 'boolean' },
  { key: 'status', label: '状态', dataType: 'enum', options: ['运行中', '停止'] }
]

const rows = [
  { id: 'a', name: '南京获客', fans: 20, createdAt: '2026-09-18T10:00:00Z', enabled: true, status: '运行中' },
  { id: 'b', name: '上海运营', fans: 5, createdAt: '2026-09-19T10:00:00Z', enabled: false, status: '停止' },
  { id: 'c', name: '南京直播', fans: 100, createdAt: '2026-09-20T10:00:00Z', enabled: true, status: '停止' }
]

describe('YuntuGrid data model', () => {
  it('combines typed filters with AND semantics', () => {
    const result = applyGridFilters(rows, columns, [
      { columnKey: 'name', operator: 'contains', value: '南京' },
      { columnKey: 'fans', operator: 'between', value: 10, valueTo: 50 },
      { columnKey: 'enabled', operator: 'equals', value: 'true' }
    ])
    expect(result.map(item => item.row.id)).toEqual(['a'])
  })

  it('filters datetime and enum values', () => {
    const result = applyGridFilters(rows, columns, [
      { columnKey: 'createdAt', operator: 'after', value: '2026-09-18T12:00' },
      { columnKey: 'status', operator: 'equals', value: '停止' }
    ])
    expect(result.map(item => item.row.id)).toEqual(['b', 'c'])
  })

  it('uses one sort column and toggles its direction', () => {
    const items = applyGridFilters(rows, columns, [])
    expect(sortGridRows(items, columns, { key: 'fans', direction: 'asc' }).map(item => item.row.id)).toEqual(['b', 'a', 'c'])
    expect(nextGridSort({ key: 'fans', direction: 'asc' }, 'fans')).toEqual({ key: 'fans', direction: 'desc' })
    expect(nextGridSort({ key: 'fans', direction: 'desc' }, 'name')).toEqual({ key: 'name', direction: 'asc' })
  })

  it('restores original sequence sorting', () => {
    const items = applyGridFilters(rows, columns, [])
    expect(sortGridRows(items, columns, { key: '__sequence', direction: 'asc' }).map(item => item.row.id)).toEqual(['a', 'b', 'c'])
    expect(sortGridRows(items, columns, { key: '', direction: 'asc' }).map(item => item.row.id)).toEqual(['a', 'b', 'c'])
    expect(nextGridSort({ key: 'fans', direction: 'desc' }, 'n')).toEqual({ key: '', direction: 'asc' })
    expect(nextGridSort({ key: '', direction: 'asc' }, 'index')).toEqual({ key: '', direction: 'asc' })
  })
})
