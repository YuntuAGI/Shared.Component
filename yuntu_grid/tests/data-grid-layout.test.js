import { describe, expect, it } from 'vitest'
import { MAX_COLUMN_WIDTH, MIN_COLUMN_WIDTH, columnSignature, normalizeGridLayout, reorderGridColumn, resizeGridColumn, resizeGridColumnFromPointer } from '../src/data-grid-layout.js'

const columns = [
  { key: 'name', width: 180 },
  { key: 'uid', width: 220 },
  { key: 'content' },
]

describe('shared data-grid layout', () => {
  it('keeps every current column visible and restores saved widths/order', () => {
    const layout = normalizeGridLayout(columns, { order: ['uid', 'missing', 'name'], widths: { uid: 260, content: 90 } })
    expect(layout.order).toEqual(['uid', 'name', 'content'])
    expect(layout.widths).toEqual({ name: 180, uid: 260, content: 90 })
    expect(columnSignature(columns)).toBe('name|uid|content')
  })

  it('reorders columns without dropping any column', () => {
    const layout = normalizeGridLayout(columns)
    expect(reorderGridColumn(layout, 'content', 'name').order).toEqual(['content', 'name', 'uid'])
    expect(reorderGridColumn(layout, 'name', 'uid').order).toEqual(['uid', 'name', 'content'])
  })

  it('clamps resized columns to readable bounds', () => {
    const layout = normalizeGridLayout(columns)
    expect(resizeGridColumn(layout, 'uid', 5).widths.uid).toBe(MIN_COLUMN_WIDTH)
    expect(resizeGridColumn(layout, 'uid', 9999).widths.uid).toBe(MAX_COLUMN_WIDTH)
  })

  it('honors a compact column bound for saved layouts and dragging', () => {
    const actions = { key: 'actions', width: 108, minWidth: 76, maxWidth: 132 }
    const layout = normalizeGridLayout([actions], { widths: { actions: 360 } })
    expect(layout.widths.actions).toBe(132)
    expect(resizeGridColumn(layout, 'actions', 50, actions).widths.actions).toBe(76)
    expect(resizeGridColumn(layout, 'actions', 110, actions).widths.actions).toBe(110)
  })

  it('keeps the visible left boundary of a sticky-right column under the pointer', () => {
    const actions = { key: 'actions', width: 108, minWidth: 76, maxWidth: 132, sticky: 'right' }
    const layout = normalizeGridLayout([actions])
    expect(resizeGridColumnFromPointer(layout, 'actions', 108, 300, 280, actions).widths.actions).toBe(128)
    expect(resizeGridColumnFromPointer(layout, 'actions', 108, 300, 320, actions).widths.actions).toBe(88)
  })
})
