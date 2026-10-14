import { describe, expect, it } from 'vitest'
import { copyableTableColumns, tableRowsToClipboard } from '../src/data-grid-copy.js'

describe('data grid full-row copy', () => {
  const columns = [
    { key: 'index', label: '序号' },
    { key: 'avatar', label: '头像' },
    { key: 'nickname', label: '昵称' },
    { key: 'uid', label: 'UID' },
    { key: 'details', label: '详情' },
    { key: 'actions', label: '操作' }
  ]

  it('copies visible information columns without image or action controls', () => {
    expect(copyableTableColumns(columns).map(column => column.key)).toEqual(['index', 'nickname', 'uid', 'details'])
    expect(tableRowsToClipboard(columns, [{ row: { nickname: '土豆', uid: '123', details: { source: '同城' } }, index: 0 }]))
      .toBe('序号\t昵称\tUID\t详情\r\n1\t土豆\t123\t{"source":"同城"}')
  })

  it('copies multiple selected rows in table order with full untruncated values', () => {
    const result = tableRowsToClipboard(columns, [
      { row: { nickname: '用户一', uid: '1001', details: '第一行\n详情' }, index: 2 },
      { row: { nickname: '用户二', uid: '1002', details: '第二行完整内容' }, index: 5 }
    ])
    expect(result).toBe('序号\t昵称\tUID\t详情\r\n3\t用户一\t1001\t第一行 详情\r\n6\t用户二\t1002\t第二行完整内容')
  })
})
