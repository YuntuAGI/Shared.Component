const EMPTY_OPERATORS = new Set(['empty', 'not-empty'])

export const GRID_OPERATORS = Object.freeze({
  text: [
    ['contains', '包含'], ['not-contains', '不包含'], ['equals', '等于'], ['not-equals', '不等于'],
    ['empty', '为空'], ['not-empty', '不为空']
  ],
  number: [['equals', '等于'], ['gte', '大于等于'], ['lte', '小于等于'], ['between', '范围'], ['empty', '为空'], ['not-empty', '不为空']],
  datetime: [['before', '早于'], ['after', '晚于'], ['between', '时间范围'], ['empty', '为空'], ['not-empty', '不为空']],
  boolean: [['equals', '等于']],
  enum: [['equals', '等于'], ['not-equals', '不等于']]
})

const NUMBER_KEYS = new Set(['n', 'index', 'age', 'followerCount', 'followingCount', 'awemeCount', 'favoritingCount', 'commentCount', 'diggCount', 'shareCount', 'collectCount', 'durationSeconds', 'minimumLevel', 'minimumFollowers', 'minimumAwemeCount', 'unreadCount', 'progress'])
const DATETIME_KEYS = new Set(['createTime', 'createdAt', 'updatedAt', 'startedAt', 'finishedAt', 'syncedAt', 'time', 'timestamp'])
const BOOLEAN_KEYS = new Set(['verified', 'enabled', 'connected', 'online'])

export function gridColumnType(column = {}) {
  if (['text', 'number', 'datetime', 'boolean', 'enum'].includes(column.dataType)) return column.dataType
  const key = String(column.key || '')
  if (NUMBER_KEYS.has(key)) return 'number'
  if (DATETIME_KEYS.has(key)) return 'datetime'
  if (BOOLEAN_KEYS.has(key)) return 'boolean'
  return 'text'
}

export function gridRawValue(row, column, originalIndex = 0) {
  if (!column) return undefined
  if (column.key === 'n' || column.key === 'index') return originalIndex + 1
  const accessor = column.filterValue || column.sortValue || column.value
  return typeof accessor === 'function' ? accessor(row, originalIndex) : row?.[column.key]
}

const missing = value => value == null || String(value).trim() === ''
const comparableText = value => String(value ?? '').trim().toLocaleLowerCase('zh-CN')
const comparableNumber = value => {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}
const comparableDate = value => {
  const date = typeof value === 'number' && value < 1e12 ? value * 1000 : new Date(value).getTime()
  return Number.isFinite(date) ? date : null
}

export function matchesGridFilter(row, column, filter, originalIndex = 0) {
  const raw = gridRawValue(row, column, originalIndex)
  if (filter.operator === 'empty') return missing(raw)
  if (filter.operator === 'not-empty') return !missing(raw)
  const type = gridColumnType(column)
  if (type === 'number') {
    const actual = comparableNumber(raw)
    const from = comparableNumber(filter.value)
    const to = comparableNumber(filter.valueTo)
    if (actual == null || from == null) return false
    if (filter.operator === 'gte') return actual >= from
    if (filter.operator === 'lte') return actual <= from
    if (filter.operator === 'between') return to != null && actual >= Math.min(from, to) && actual <= Math.max(from, to)
    return actual === from
  }
  if (type === 'datetime') {
    const actual = comparableDate(raw)
    const from = comparableDate(filter.value)
    const to = comparableDate(filter.valueTo)
    if (actual == null || from == null) return false
    if (filter.operator === 'before') return actual < from
    if (filter.operator === 'after') return actual > from
    return filter.operator === 'between' ? to != null && actual >= Math.min(from, to) && actual <= Math.max(from, to) : actual === from
  }
  if (type === 'boolean') return Boolean(raw) === (String(filter.value) === 'true')
  const actual = comparableText(raw)
  const wanted = comparableText(filter.value)
  if (filter.operator === 'contains') return actual.includes(wanted)
  if (filter.operator === 'not-contains') return !actual.includes(wanted)
  if (filter.operator === 'not-equals') return actual !== wanted
  return actual === wanted
}

export function applyGridFilters(rows = [], columns = [], filters = []) {
  const map = new Map(columns.map(column => [String(column.key), column]))
  return rows.map((row, originalIndex) => ({ row, originalIndex })).filter(item => filters.every(filter => {
    const column = map.get(String(filter.columnKey))
    return column ? matchesGridFilter(item.row, column, filter, item.originalIndex) : true
  }))
}

export function sortGridRows(items = [], columns = [], sort = { key: '__sequence', direction: 'asc' }) {
  const direction = sort?.direction === 'desc' ? -1 : 1
  const column = columns.find(item => String(item.key) === String(sort?.key))
  return [...items].sort((left, right) => {
    if (!column || sort?.key === '__sequence' || column.key === 'n' || column.key === 'index') return (left.originalIndex - right.originalIndex) * direction
    const type = gridColumnType(column)
    const a = gridRawValue(left.row, column, left.originalIndex)
    const b = gridRawValue(right.row, column, right.originalIndex)
    if (missing(a) && missing(b)) return left.originalIndex - right.originalIndex
    if (missing(a)) return 1
    if (missing(b)) return -1
    const av = type === 'number' ? comparableNumber(a) : type === 'datetime' ? comparableDate(a) : type === 'boolean' ? Number(Boolean(a)) : comparableText(a)
    const bv = type === 'number' ? comparableNumber(b) : type === 'datetime' ? comparableDate(b) : type === 'boolean' ? Number(Boolean(b)) : comparableText(b)
    const compared = typeof av === 'string' ? av.localeCompare(bv, 'zh-CN', { numeric: true }) : av === bv ? 0 : av < bv ? -1 : 1
    return compared * direction || left.originalIndex - right.originalIndex
  })
}

export function nextGridSort(current, key) {
  if (key === 'n' || key === 'index') return { key: '', direction: 'asc' }
  const normalizedKey = String(key)
  return current?.key === normalizedKey
    ? { key: normalizedKey, direction: current.direction === 'asc' ? 'desc' : 'asc' }
    : { key: normalizedKey, direction: 'asc' }
}

export function gridFilterNeedsValue(operator) { return !EMPTY_OPERATORS.has(operator) }
export function gridFilterNeedsRange(operator) { return operator === 'between' }
