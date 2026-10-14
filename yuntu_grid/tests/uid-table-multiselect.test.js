import { describe, expect, it } from 'vitest'
import { gridClickSelection, gridContextSelection } from '../src/grid-row-selection.js'

const select = options => gridClickSelection({ selectedKeys: new Set(['a']), targetKey: 'b', displayIndex: 1, anchorIndex: 0, displayKeys: ['a', 'b', 'c'], ...options })
describe('shared grid selection', () => {
  it('replaces selection on a plain click and toggles on Ctrl or Command', () => {
    expect([...select({}).keys]).toEqual(['b'])
    expect([...select({ ctrlKey: true }).keys]).toEqual(['a', 'b'])
    expect([...select({ metaKey: true, targetKey: 'a' }).keys]).toEqual([])
  })
  it('selects the displayed sorted range and preserves the anchor for repeated Shift clicks', () => {
    const result = select({ shiftKey: true, displayKeys: ['c', 'b', 'a'] })
    expect([...result.keys]).toEqual(['c', 'b'])
    expect(result.anchorIndex).toBe(0)
    expect([...select({ shiftKey: true, ctrlKey: true, displayKeys: ['c', 'b', 'a'] }).keys]).toEqual(['a', 'c', 'b'])
  })
  it('preserves selected rows on right-click and replaces them for an unselected target', () => {
    expect([...gridContextSelection(new Set(['a', 'b']), 'b')]).toEqual(['a', 'b'])
    expect([...gridContextSelection(new Set(['a', 'b']), 'c')]).toEqual(['c'])
  })
})
