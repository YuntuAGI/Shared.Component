import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Copy, ClipboardPaste, Download, Plus, Trash2, X } from 'lucide-react'
import { OverlayPageContext, ViewportOverlay, overlayViewport } from './viewport-overlay.jsx'
import { columnSignature, normalizeGridLayout, reorderGridColumn, resizeGridColumn, resizeGridColumnFromPointer } from './data-grid-layout.js'
import { copyableTableColumns, tableRowsToClipboard } from './data-grid-copy.js'
import { GRID_OPERATORS, applyGridFilters, gridColumnType, gridFilterNeedsRange, gridFilterNeedsValue, nextGridSort, sortGridRows } from './yuntu-grid.js'
import { gridRowActions, runGridRowAction } from './grid-row-actions.js'
import { gridContextSelection, gridClickSelection } from './grid-row-selection.js'
import { browserServices } from './browser-services.js'
import { GridButton as Button, GridEmpty as Empty } from './primitives.jsx'
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`
const short = (value, max = 28) => { const text = value == null ? '' : String(value); return text.length > max ? text.slice(0, max) + '…' : text }
const exportColumns = columns => columns.filter(column => column?.key && column.exportable !== false && !['avatar', 'actions', 'selectedState'].includes(String(column.key))).map(column => ({ key: column.key, label: column.label || column.key }))

export function YuntuGrid({ gridId, columns = [], rows = [], rowKey = 'id', emptyText = '暂无数据', onRowClick, rowActions, selected, selectedKeys, onSelectionChange, selectionDisabled = false, selectionColumn = false, exportConfig, clearConfig, rowRenderBatch = 0, filterEnabled = true, services = {}, active = true, className = '', style }) {
  const api = { ...browserServices, ...services }
  const gridRows = rows
  const gridColumns = selectionColumn ? [{ key: 'selectedState', label: '选择', width: 64, filterable: false, render: (row, displayIndex) => <input type="checkbox" className="yuntu-grid-checkbox" aria-label={`选择 ${row[rowKey]}`} checked={effectiveSelectedKeys.has(rowIdentity(row, displayIndex))} disabled={selectionDisabled} onClick={event => event.stopPropagation()} onChange={() => toggleCheckboxRow(row, displayIndex)} /> }, ...columns] : columns
  const [clearPending, setClearPending] = useState(false)
  const [clearError, setClearError] = useState('')
  const visibleColumns = useMemo(() => gridColumns.filter(column => !column.hidden), [gridColumns])
  const signature = columnSignature(visibleColumns)
  const storageKey = `yuntu-grid-layout:${gridId || signature}`
  const defaultLayout = useMemo(() => normalizeGridLayout(visibleColumns), [signature])
  const [layoutState, setLayoutState] = useState(() => ({ signature, storageKey, layout: (() => {
    try { return normalizeGridLayout(visibleColumns, JSON.parse(localStorage.getItem(storageKey) || '{}')) } catch { return normalizeGridLayout(visibleColumns) }
  })() }))
  const [internalSelectedKeys, setInternalSelectedKeys] = useState(() => new Set())
  const [uidMenu, setUidMenu] = useState(null)
  const [rowActionError, setRowActionError] = useState('')
  const [draggedColumn, setDraggedColumn] = useState('')
  const [filters, setFilters] = useState([])
  const [sort, setSort] = useState({ key: '', direction: 'asc' })
  const [filterOpen, setFilterOpen] = useState(false)
  useEffect(() => {
    if (!filterEnabled) { setFilterOpen(false); setFilters([]) }
  }, [filterEnabled])
  const [filterPosition, setFilterPosition] = useState({ top: 96, left: 270, width: 640 })
  const [clearOpen, setClearOpen] = useState(false)
  const [renderLimit, setRenderLimit] = useState(() => rowRenderBatch > 0 ? rowRenderBatch : Number.POSITIVE_INFINITY)
  const loadMoreRef = useRef(null)
  const filterColumns = useMemo(() => filterEnabled ? gridColumns.filter(column => !column.hidden && column.filterable !== false && !['avatar', 'actions', 'n', 'index', 'selectedState'].includes(String(column.key))) : [], [gridColumns, filterEnabled])
  const firstFilterColumn = filterColumns[0]
  const initialFilterValue = column => gridColumnType(column) === 'boolean' ? 'true' : ''
  const [filterDraft, setFilterDraft] = useState(() => ({ columnKey: firstFilterColumn?.key || '', operator: GRID_OPERATORS[gridColumnType(firstFilterColumn)][0][0], value: initialFilterValue(firstFilterColumn), valueTo: '' }))
  const tableRef = useRef(null)
  const selectionBoxRef = useRef(null)
  const selectionAnchorKeyRef = useRef(null)
  const resizeRef = useRef(null)
  const layoutRef = useRef(null)
  const marqueeRef = useRef(null)
  const marqueeFrameRef = useRef(0)
  const marqueePointRef = useRef(null)
  const suppressClickRef = useRef(false)
  const layout = layoutState.signature === signature && layoutState.storageKey === storageKey ? normalizeGridLayout(visibleColumns, layoutState.layout) : defaultLayout
  layoutRef.current = layout
  const columnMap = new Map(visibleColumns.map(column => [String(column.key), column]))
  const orderedColumns = layout.order.map(key => columnMap.get(key)).filter(Boolean)
  const copyableColumns = copyableTableColumns(orderedColumns)
  const tableWidth = orderedColumns.reduce((total, column) => total + layout.widths[String(column.key)], 0)
  const uidColumn = orderedColumns.find(column => String(column.label || '').toUpperCase().includes('UID') && !String(column.key || '').toLowerCase().includes('sec'))
  const effectiveSelectedKeys = new Set([...(selectedKeys || internalSelectedKeys)].map(String))
  const rowIdentity = (row, index) => String(row?.[rowKey] ?? row?.id ?? `${row?.[uidColumn?.key] || 'row'}-${index}`)
  const filteredItems = useMemo(() => applyGridFilters(gridRows, gridColumns, filterEnabled ? filters : []), [gridRows, gridColumns, filters, filterEnabled])
  const sortedItems = useMemo(() => sortGridRows(filteredItems, gridColumns, sort), [filteredItems, gridColumns, sort])
  const renderedItems = rowRenderBatch > 0 ? sortedItems.slice(0, renderLimit) : sortedItems
  const shownRows = useMemo(() => sortedItems.map(item => item.row), [sortedItems])
  useEffect(() => {
    if (rowRenderBatch <= 0 || renderLimit >= sortedItems.length || !loadMoreRef.current || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) setRenderLimit(current => Math.min(sortedItems.length, current + rowRenderBatch))
    }, { rootMargin: '400px 0px' })
    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [rowRenderBatch, renderLimit, sortedItems.length])
  useEffect(() => { if (rowRenderBatch > 0) setRenderLimit(rowRenderBatch) }, [filters, sort, rowRenderBatch])
  const selectedFilterColumn = filterColumns.find(column => String(column.key) === String(filterDraft.columnKey)) || firstFilterColumn
  const filterOperators = GRID_OPERATORS[gridColumnType(selectedFilterColumn)] || GRID_OPERATORS.text
  const setFilterColumn = columnKey => {
    const column = filterColumns.find(item => String(item.key) === String(columnKey))
    setFilterDraft({ columnKey, operator: (GRID_OPERATORS[gridColumnType(column)] || GRID_OPERATORS.text)[0][0], value: initialFilterValue(column), valueTo: '' })
  }
  const addFilter = () => {
    if (!selectedFilterColumn) return
    if (gridFilterNeedsValue(filterDraft.operator) && String(filterDraft.value).trim() === '') return
    if (gridFilterNeedsRange(filterDraft.operator) && String(filterDraft.valueTo).trim() === '') return
    setFilters(current => [...current, { ...filterDraft, id: uid(), columnKey: String(filterDraft.columnKey) }])
    setFilterOpen(false)
  }
  const toggleFilterEditor = event => {
    if (filterOpen) return setFilterOpen(false)
    const rect = event.currentTarget.getBoundingClientRect()
    const viewport = overlayViewport()
    const width = Math.min(640, viewport.width - 32)
    const left = Math.min(Math.max(16, rect.left / viewport.scale), Math.max(16, viewport.width - width - 16))
    const top = Math.min(Math.max(16, rect.bottom / viewport.scale + 6), Math.max(16, viewport.height - 250))
    setFilterPosition({ top, left, width, maxHeight: viewport.height - top - 16 })
    setFilterOpen(true)
  }
  const labelForFilter = filter => {
    const column = gridColumns.find(item => String(item.key) === String(filter.columnKey))
    const operator = (GRID_OPERATORS[gridColumnType(column)] || GRID_OPERATORS.text).find(item => item[0] === filter.operator)?.[1] || filter.operator
    const value = gridFilterNeedsValue(filter.operator) ? ` ${filter.value}${gridFilterNeedsRange(filter.operator) ? ` ～ ${filter.valueTo}` : ''}` : ''
    return `${column?.label || filter.columnKey} ${operator}${value}`
  }
  const saveLayout = next => {
    const normalized = normalizeGridLayout(visibleColumns, next)
    setLayoutState({ signature, storageKey, layout: normalized })
    try { localStorage.setItem(storageKey, JSON.stringify(normalized)) } catch { /* Layout persistence is best-effort. */ }
  }
  useEffect(() => {
    if (layoutState.signature === signature && layoutState.storageKey === storageKey) return
    let stored = {}
    try { stored = JSON.parse(localStorage.getItem(storageKey) || '{}') } catch { /* Ignore malformed local layout state. */ }
    setLayoutState({ signature, storageKey, layout: normalizeGridLayout(visibleColumns, stored) })
  }, [signature, storageKey])
  useEffect(() => {
    if (!uidMenu) return undefined
    const close = () => setUidMenu(null)
    const onKey = event => { if (event.key === 'Escape') close() }
    window.addEventListener('pointerdown', close)
    window.addEventListener('blur', close)
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('pointerdown', close); window.removeEventListener('blur', close); window.removeEventListener('keydown', onKey) }
  }, [uidMenu])
  useEffect(() => {
    const available = new Set(rows.map(rowIdentity))
    if (!available.has(selectionAnchorKeyRef.current)) selectionAnchorKeyRef.current = null
    setInternalSelectedKeys(current => {
      const next = new Set([...current].filter(key => available.has(key)))
      return next.size === current.size ? current : next
    })
  }, [rows, signature])
  useEffect(() => {
    const onMove = event => {
      if (!resizeRef.current) return
      const current = resizeRef.current
      const width = resizeGridColumnFromPointer(layoutRef.current, current.key, current.startWidth, current.startX, current.startX + (event.clientX - current.startX) / overlayViewport().scale, current.column).widths[current.key]
      current.currentWidth = width
      if (current.columnElement) current.columnElement.style.width = `${width}px`
      if (current.tableElement) current.tableElement.style.width = `${current.column?.sticky === 'right' ? current.startTableWidth : Math.max(current.startTableWidth + width - current.startWidth, 640)}px`
    }
    const onUp = () => {
      const current = resizeRef.current
      resizeRef.current = null
      document.body.classList.remove('resizing-grid-column')
      if (current) saveLayout(resizeGridColumn(layoutRef.current, current.key, current.currentWidth ?? current.startWidth, current.column))
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); if (resizeRef.current) { resizeRef.current = null; document.body.classList.remove('resizing-grid-column') } }
  }, [signature])
  const applySelection = keys => {
    if (selectedKeys == null) setInternalSelectedKeys(new Set(keys))
    onSelectionChange?.(new Set(keys))
  }
  const selectInternalRow = (row, event, displayIndex, sourceIndex) => {
    if (selectionDisabled) return
    const key = rowIdentity(row, sourceIndex)
    const displayKeys = sortedItems.map(item => rowIdentity(item.row, item.originalIndex))
    const anchorIndex = effectiveSelectedKeys.size ? displayKeys.indexOf(selectionAnchorKeyRef.current) : -1
    const next = gridClickSelection({ selectedKeys: effectiveSelectedKeys, targetKey: key, displayIndex, anchorIndex, displayKeys, shiftKey: event.shiftKey, ctrlKey: event.ctrlKey, metaKey: event.metaKey })
    selectionAnchorKeyRef.current = displayKeys[next.anchorIndex] ?? key
    applySelection(next.keys)
  }
  const toggleCheckboxRow = (row, displayIndex) => {
    if (selectionDisabled) return
    const key = rowIdentity(row, displayIndex)
    const next = gridClickSelection({ selectedKeys: effectiveSelectedKeys, targetKey: key, displayIndex, anchorIndex: -1, displayKeys: [], ctrlKey: true })
    selectionAnchorKeyRef.current = key
    applySelection(next.keys)
  }
  const selectedKeysInBox = box => {
    const next = new Set(box.additive ? box.initialKeys : [])
    for (const rowElement of tableRef.current?.querySelectorAll('tbody tr[data-row-index]') || []) {
      const rect = rowElement.getBoundingClientRect()
      if (rect.right >= box.left && rect.left <= box.right && rect.bottom >= box.top && rect.top <= box.bottom) {
        const index = Number(rowElement.dataset.rowIndex)
        if (rows[index]) next.add(rowIdentity(rows[index], index))
      }
    }
    return next
  }
  const beginMarquee = event => {
    if (selectionDisabled) return
    if (event.button !== 0 || event.target.closest('button,input,select,textarea,a,.column-resizer,thead')) return
    const rowElement = event.target.closest('tbody tr[data-row-index]')
    if (!rowElement) return
    const bounds = event.currentTarget.getBoundingClientRect()
    marqueeRef.current = { startX: event.clientX, startY: event.clientY, moved: false, additive: event.ctrlKey || event.metaKey, initialKeys: new Set(effectiveSelectedKeys), bounds, pointerId: event.pointerId, container: event.currentTarget, captured: false }
  }
  const updateMarquee = (clientX, clientY) => {
    const current = marqueeRef.current
    if (!current) return
    const moved = current.moved || Math.hypot(clientX - current.startX, clientY - current.startY) > 5
    if (!moved) return
    current.moved = true
    const left = Math.max(current.bounds.left, Math.min(current.startX, clientX))
    const right = Math.min(current.bounds.right, Math.max(current.startX, clientX))
    const top = Math.max(current.bounds.top, Math.min(current.startY, clientY))
    const bottom = Math.min(current.bounds.bottom, Math.max(current.startY, clientY))
    const box = { ...current, left, right, top, bottom }
    const pendingKeys = selectedKeysInBox(box)
    current.pendingKeys = pendingKeys
    const overlay = selectionBoxRef.current
    const { scale } = overlayViewport()
    if (overlay) Object.assign(overlay.style, { display: 'block', left: `${left / scale}px`, top: `${top / scale}px`, width: `${Math.max(1, right - left) / scale}px`, height: `${Math.max(1, bottom - top) / scale}px` })
    for (const rowElement of tableRef.current?.querySelectorAll('tbody tr[data-row-index]') || []) {
      const index = Number(rowElement.dataset.rowIndex)
      rowElement.classList.toggle('selected', Boolean(rows[index] && pendingKeys.has(rowIdentity(rows[index], index))))
    }
  }
  const moveMarquee = event => {
    const current = marqueeRef.current
    if (!current) return
    if (!current.moved && Math.hypot(event.clientX - current.startX, event.clientY - current.startY) <= 5) return
    event.preventDefault()
    if (!current.captured) {
      current.container?.setPointerCapture?.(current.pointerId)
      current.captured = true
    }
    current.moved = true
    marqueePointRef.current = { x: event.clientX, y: event.clientY }
    if (marqueeFrameRef.current) return
    marqueeFrameRef.current = requestAnimationFrame(() => {
      marqueeFrameRef.current = 0
      const point = marqueePointRef.current
      if (point) updateMarquee(point.x, point.y)
    })
  }
  const endMarquee = event => {
    if (marqueeFrameRef.current) cancelAnimationFrame(marqueeFrameRef.current)
    marqueeFrameRef.current = 0
    if (marqueeRef.current?.moved && Number.isFinite(event?.clientX)) updateMarquee(event.clientX, event.clientY)
    if (marqueeRef.current?.moved) {
      suppressClickRef.current = true
      setTimeout(() => { suppressClickRef.current = false }, 0)
      applySelection(marqueeRef.current.pendingKeys || new Set())
    }
    marqueeRef.current = null
    marqueePointRef.current = null
    if (selectionBoxRef.current) selectionBoxRef.current.style.display = 'none'
  }
  const copyRowsForKeys = async keys => {
    const selectedRows = gridRows.map((row, index) => ({ row, index })).filter(({ row, index }) => keys.has(rowIdentity(row, index)))
    if (!selectedRows.length || !copyableColumns.length) return 0
    await api.copyText(tableRowsToClipboard(copyableColumns, selectedRows))
    setUidMenu(null)
    return selectedRows.length
  }
  const rowActionContext = (row, index) => {
    const key = rowIdentity(row, index)
    const normalizedSelection = new Set([...effectiveSelectedKeys].map(String))
    const keys = gridContextSelection(normalizedSelection, key)
    if (!selectionDisabled && !normalizedSelection.has(key)) { applySelection(keys); selectionAnchorKeyRef.current = key }
    return { keys, selectedRows: rows.filter((item, i) => keys.has(rowIdentity(item, i))), copyAllRows: () => copyRowsForKeys(keys) }
  }
  const actionsForRow = (row, context) => rowActions ? gridRowActions(rowActions, row, context) : [
    { id: 'copy', label: `复制全部信息（${context.keys.size} 行）`, icon: Copy, run: context.copyAllRows },
    ...(uidColumn ? [{ id: 'copy-uids', label: `复制 ${context.keys.size} 个 UID`, icon: ClipboardPaste, run: () => api.copyText([...new Set(context.selectedRows.map(item => String(item?.[uidColumn.key] || '').trim()).filter(Boolean))].join('\r\n')) }] : []),
  ]
  const executeRowAction = action => {
    if (action?.disabled) return
    setUidMenu(null)
    setRowActionError('')
    try { Promise.resolve(runGridRowAction(action)).catch(error => setRowActionError(error?.message || '操作失败')) }
    catch (error) { setRowActionError(error?.message || '操作失败') }
  }
  const openUidMenu = (row, event, index) => {
    event.preventDefault(); event.stopPropagation()
    const context = rowActionContext(row, index)
    const actions = actionsForRow(row, context)
    if (!actions.length) return
    const viewport = overlayViewport()
    setUidMenu({ x: Math.max(8, Math.min(event.clientX / viewport.scale, viewport.width - 220)), y: Math.max(8, Math.min(event.clientY / viewport.scale, viewport.height - Math.min(actions.length * 38 + 12, viewport.height - 16))), row, context })
  }
  const runRowDefaultAction = (row, event, displayIndex, originalIndex) => {
    if (event.target instanceof Element && event.target.closest('button,a,input,select,textarea')) return
    if (marqueeRef.current?.moved || suppressClickRef.current) return
    event.preventDefault(); event.stopPropagation()
    const context = rowActionContext(row, originalIndex)
    executeRowAction(actionsForRow(row, context)[0])
  }
  return <OverlayPageContext.Provider value={active}><div className={`yuntu-grid-shell ${className}`} style={style} data-grid-id={gridId}>
    <div className="yuntu-grid-toolbar">
      <div className="yuntu-grid-summary"><strong>{filteredItems.length === rows.length ? `${rows.length} 条` : `${filteredItems.length} / ${rows.length} 条`}</strong>{filterColumns.length > 0 && <button type="button" className="yuntu-grid-add-filter" onClick={toggleFilterEditor} aria-expanded={filterOpen}><Plus size={15} />添加筛选</button>}</div>
      <div className="yuntu-grid-actions">{filterEnabled && filters.length > 0 && <button type="button" className="yuntu-grid-reset" onClick={() => setFilters([])}>清除筛选</button>}{exportConfig && <Button tone="soft" icon={Download} disabled={!rows.length} onClick={() => executeRowAction({ run: () => api.exportRows({ title: exportConfig.title || '导出数据', rows: gridRows, columns: exportConfig.columns || exportColumns(gridColumns) }) })}>导出全部</Button>}{clearConfig && <Button tone="danger-soft" icon={Trash2} disabled={!rows.length || clearConfig.disabled} onClick={() => { setClearError(''); setClearOpen(true) }}>清空</Button>}</div>
      {filterEnabled && filterOpen && <ViewportOverlay><div className="yuntu-grid-filter-popover" style={filterPosition} role="dialog" aria-label="添加筛选条件"><label>字段<select aria-label="字段" value={filterDraft.columnKey} onChange={event => setFilterColumn(event.target.value)}>{filterColumns.map(column => <option key={column.key} value={column.key}>{column.label}</option>)}</select></label><label>条件<select aria-label="条件" value={filterDraft.operator} onChange={event => setFilterDraft(current => ({ ...current, operator: event.target.value }))}>{filterOperators.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>{gridFilterNeedsValue(filterDraft.operator) && <label>值{gridColumnType(selectedFilterColumn) === 'boolean' ? <select aria-label="值" value={filterDraft.value} onChange={event => setFilterDraft(current => ({ ...current, value: event.target.value }))}><option value="true">是</option><option value="false">否</option></select> : gridColumnType(selectedFilterColumn) === 'enum' ? <select aria-label="值" value={filterDraft.value} onChange={event => setFilterDraft(current => ({ ...current, value: event.target.value }))}><option value="">请选择</option>{(selectedFilterColumn?.options || []).map(option => <option key={String(option.value ?? option)} value={option.value ?? option}>{option.label ?? option}</option>)}</select> : <input aria-label="值" type={gridColumnType(selectedFilterColumn) === 'number' ? 'number' : gridColumnType(selectedFilterColumn) === 'datetime' ? 'datetime-local' : 'text'} value={filterDraft.value} onChange={event => setFilterDraft(current => ({ ...current, value: event.target.value }))} />}</label>}{gridFilterNeedsRange(filterDraft.operator) && <label>至<input aria-label="至" type={gridColumnType(selectedFilterColumn) === 'datetime' ? 'datetime-local' : 'number'} value={filterDraft.valueTo} onChange={event => setFilterDraft(current => ({ ...current, valueTo: event.target.value }))} /></label>}<div className="yuntu-grid-filter-buttons"><Button tone="soft" onClick={() => setFilterOpen(false)}>取消</Button><Button onClick={addFilter}>应用</Button></div></div></ViewportOverlay>}
    </div>
    {filterEnabled && filters.length > 0 && <div className="yuntu-grid-filter-chips">{filters.map(filter => <button type="button" key={filter.id} title="移除筛选" onClick={() => setFilters(current => current.filter(item => item.id !== filter.id))}>{labelForFilter(filter)}<X size={13} /></button>)}</div>}
    <div ref={tableRef} className={`table-wrap data-grid ${uidColumn ? 'uid-selectable-table' : ''}`} onPointerDown={beginMarquee} onPointerMove={moveMarquee} onPointerUp={endMarquee} onPointerCancel={endMarquee}>
    <table style={{ width: Math.max(tableWidth, 640), minWidth: '100%' }}><colgroup>{orderedColumns.map(column => <col key={column.key} data-column-key={String(column.key)} style={{ width: layout.widths[String(column.key)] }} />)}</colgroup><thead><tr>{orderedColumns.map(column => { const sequenceColumn = ['n', 'index'].includes(String(column.key)); const sortKey = String(column.key); const sortable = column.sortable !== false && column.key !== 'actions' && column.key !== 'avatar' && column.key !== 'selectedState'; const className = [draggedColumn === String(column.key) ? 'dragging-column' : '', column.sticky === 'right' ? 'sticky-right' : '', column.className || ''].filter(Boolean).join(' '); return <th key={column.key} aria-sort={!sequenceColumn && sort.key === sortKey ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'} onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = 'move' }} onDrop={event => { event.preventDefault(); const source = event.dataTransfer.getData('text/plain') || draggedColumn; if (source) saveLayout(reorderGridColumn(layoutRef.current, source, String(column.key))); setDraggedColumn('') }} className={className}><span className="column-heading" draggable title="拖动表头调整顺序" onDragStart={event => { event.stopPropagation(); setDraggedColumn(String(column.key)); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', String(column.key)) }} onDragEnd={() => setDraggedColumn('')}><button type="button" disabled={!sortable} title={sequenceColumn ? '清除排序并恢复原始顺序' : `按${column.label}排序`} onClick={event => { event.stopPropagation(); if (sortable) setSort(current => nextGridSort(current, column.key)) }}>{column.label}{!sequenceColumn && sort.key === sortKey && <span aria-hidden="true">{sort.direction === 'asc' ? ' ↑' : ' ↓'}</span>}</button></span><button type="button" draggable={false} className={`column-resizer ${column.sticky === 'right' ? 'column-resizer-left' : ''}`} aria-label={`调整${column.label || column.key}列宽`} title={column.sticky === 'right' ? '拖动左边界调整列宽；双击恢复默认宽度' : '拖动右边界调整列宽；双击恢复默认宽度'} onPointerDown={event => { event.preventDefault(); event.stopPropagation(); const tableElement = event.currentTarget.closest('table'); resizeRef.current = { key: String(column.key), column, startX: event.clientX, startWidth: layout.widths[String(column.key)], currentWidth: layout.widths[String(column.key)], startTableWidth: (tableElement?.getBoundingClientRect().width || tableWidth) / overlayViewport().scale, tableElement, columnElement: tableElement?.querySelector(`col[data-column-key="${CSS.escape(String(column.key))}"]`) }; document.body.classList.add('resizing-grid-column') }} onKeyDown={event => { if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return; event.preventDefault(); saveLayout(resizeGridColumn(layoutRef.current, String(column.key), layoutRef.current.widths[String(column.key)] + (event.key === 'ArrowRight' ? (column.sticky === 'right' ? -8 : 8) : (column.sticky === 'right' ? 8 : -8)), column)) }} onDoubleClick={event => { event.preventDefault(); event.stopPropagation(); saveLayout(resizeGridColumn(layoutRef.current, String(column.key), Number(column.width) || 160, column)) }} /></th>})}</tr></thead>
      <tbody>{sortedItems.length ? renderedItems.map(({ row, originalIndex }, displayIndex) => { const key = rowIdentity(row, originalIndex); return <tr data-row-index={originalIndex} key={`${row[rowKey] || 'row'}-${originalIndex}`} onClick={event => { if (suppressClickRef.current) { suppressClickRef.current = false; return } selectInternalRow(row, event, displayIndex, originalIndex); onRowClick?.(row, event, displayIndex, { displayRows: shownRows, originalIndex }) }} onDoubleClick={event => runRowDefaultAction(row, event, displayIndex, originalIndex)} onContextMenu={event => openUidMenu(row, event, originalIndex)} className={(selected != null && String(selected) === key) || effectiveSelectedKeys.has(key) ? 'selected' : ''}>
        {orderedColumns.map(column => <td key={column.key} className={[column.sticky === 'right' ? 'sticky-right' : '', column.className || ''].filter(Boolean).join(' ')} title={typeof row[column.key] === 'string' ? row[column.key] : ''}>{column.render ? column.render(row, displayIndex) : short(row[column.key], column.max || 28)}</td>)}
      </tr> }) : <tr className="empty-table-row"><td colSpan={orderedColumns.length}><Empty title={filterEnabled && filters.length ? '没有符合筛选条件的数据' : emptyText} /></td></tr>}{rowRenderBatch > 0 && renderLimit < sortedItems.length && <tr className="grid-load-more" ref={loadMoreRef}><td colSpan={orderedColumns.length}><button type="button" onClick={() => setRenderLimit(current => Math.min(sortedItems.length, current + rowRenderBatch))}>继续显示更多（{renderedItems.length}/{sortedItems.length}）</button></td></tr>}</tbody></table><ViewportOverlay><div ref={selectionBoxRef} className="yuntu-grid-selection-box" style={{ display: 'none' }} /></ViewportOverlay></div>
  </div>
    {rowActionError && <div role="alert" className="yuntu-grid-error">操作失败：{rowActionError}</div>}
    {uidMenu && <ViewportOverlay><div className="yuntu-grid-row-menu" role="menu" aria-label={`${gridId || '表格'}行操作`} style={{ left: uidMenu.x, top: uidMenu.y }} onPointerDown={event => event.stopPropagation()}>{actionsForRow(uidMenu.row, uidMenu.context).map((action, index) => { const Icon = action.icon; return <button key={action.id || index} role="menuitem" className={action.danger ? 'danger' : ''} disabled={Boolean(action.disabled)} onClick={() => executeRowAction(action)}>{Icon && <Icon size={15} />}{action.label}</button> })}</div></ViewportOverlay>}
    {clearOpen && (<ViewportOverlay><div className="yuntu-grid-clear-backdrop"><div className="yuntu-grid-clear-modal" role="dialog" aria-modal="true" aria-label="清空全部数据"><div className="modal-title"><div><Trash2 size={20} />清空全部数据</div><button type="button" aria-label="关闭" disabled={clearPending} onClick={() => setClearOpen(false)}><X size={20} /></button></div><p>{clearConfig?.description || `将清空当前表格的全部 ${rows.length} 条数据，不受筛选条件影响。此操作无法撤销。`}</p>{clearError && <p role="alert" className="yuntu-grid-error">{clearError}</p>}<div className="modal-footer"><Button tone="soft" disabled={clearPending} onClick={() => setClearOpen(false)}>取消</Button><Button tone="danger" icon={Trash2} disabled={clearPending} onClick={async () => { setClearPending(true); setClearError(''); try { await clearConfig.onClear(); setClearOpen(false); setFilters([]) } catch (error) { setClearError(error?.message || '清空失败，请重试') } finally { setClearPending(false) } }}>确认清空</Button></div></div></div></ViewportOverlay>)}
  </OverlayPageContext.Provider>
}

export default YuntuGrid
