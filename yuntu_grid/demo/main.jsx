import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ExternalLink, Copy } from 'lucide-react'
import { YuntuGrid, browserServices } from '../src/index.js'
import '../src/styles.css'
import './demo.css'

const sampleRows = count => Array.from({ length: count }, (_, i) => ({
  id: `demo-${i + 1}`, name: ['示例任务 A', '示例任务 B', '示例任务 C', '示例任务 D'][i % 4] + (i >= 4 ? ` · ${i + 1}` : ''),
  category: ['数据整理', '内容审核', '客户跟进'][i % 3], owner: ['成员一', '成员二', '成员三'][i % 3],
  progress: (i * 17 + 35) % 101, status: ['待处理', '进行中', '已完成'][i % 3], enabled: i % 4 !== 0,
  createdAt: Date.UTC(2026, 9, 14, 8, i), description: '这是一条用于展示表格交互的模拟数据，不会访问任何业务账号。'
}))
function Demo() {
  const [rows, setRows] = useState(() => sampleRows(12))
  const [selection, setSelection] = useState(new Set())
  const [logs, setLogs] = useState([])
  const [detail, setDetail] = useState(null)
  const [failClear, setFailClear] = useState(false)
  const [gridKey, setGridKey] = useState(0)
  const report = text => setLogs(current => [text, ...current].slice(0, 5))
  const restore = count => { setRows(sampleRows(count)); setSelection(new Set()); setDetail(null); report(`已加载 ${count} 条演示数据`) }
  const columns = [
    { key: 'index', label: '序号', width: 70, render: (_row, index) => index + 1 },
    { key: 'name', label: '任务名称', width: 190 },
    { key: 'category', label: '类型', width: 130, dataType: 'enum', options: ['数据整理', '内容审核', '客户跟进'] },
    { key: 'owner', label: '负责人', width: 100 },
    { key: 'progress', label: '进度', width: 100, dataType: 'number', render: row => `${row.progress}%` },
    { key: 'status', label: '状态', width: 120, dataType: 'enum', options: ['待处理', '进行中', '已完成'], render: row => <span className={`demo-status status-${row.status}`}><i />{row.status}</span> },
    { key: 'enabled', label: '启用', width: 90, dataType: 'boolean', render: row => row.enabled ? '是' : '否' },
    { key: 'createdAt', label: '创建时间', width: 190, dataType: 'datetime', render: row => new Date(row.createdAt).toLocaleString('zh-CN', { hour12: false }) },
    { key: 'actions', label: '操作', width: 100, sticky: 'right', render: row => <button className="demo-row-button" onClick={() => { setDetail(row); report(`查看 ${row.name}`) }}>查看</button> }
  ]
  const actions = (row, context) => [
    { id: 'view', label: '查看对应记录', icon: ExternalLink, run: () => { setDetail(row); report(`打开 ${row.name}`) } },
    { id: 'copy', label: `复制全部信息（${context.keys.size} 行）`, icon: Copy, run: context.copyAllRows }
  ]
  return <div className="grid-demo">
    <section className="demo-intro"><p>从获客项目抽取的原有表格，保留原来的配色、尺寸和操作方式。</p><p>点击表头排序；拖动表头换列、拖动分隔线改列宽；Ctrl / ⌘ 多选、Shift 连选，也可以拖拽框选。双击一行执行右键菜单的第一项。</p></section>
    <div className="demo-controls"><div><button onClick={() => restore(12)}>恢复示例数据</button><button onClick={() => restore(300)}>加载 300 条</button><button onClick={() => restore(0)}>查看空表格</button><button onClick={() => { localStorage.removeItem('yuntu-grid-layout:shared-grid-demo'); setGridKey(x => x + 1); report('列布局已重置') }}>重置列布局</button></div><span className="demo-selection" aria-live="polite">已选择 {selection.size} 条</span></div>
    <div className="demo-grid-frame"><YuntuGrid key={gridKey} gridId="shared-grid-demo" columns={columns} rows={rows} rowActions={actions} selectionColumn selectedKeys={selection} onSelectionChange={setSelection} rowRenderBatch={60} exportConfig={{ title: '云途Grid演示数据' }} clearConfig={{ onClear: async () => { if (failClear) throw new Error('演示：清空失败，数据仍保留'); setRows([]); setSelection(new Set()); report('已清空全部演示数据') } }} services={{ copyText: async text => { await browserServices.copyText(text); report('已复制选中行') }, exportRows: async options => { await browserServices.exportRows(options); report(`已导出全部 ${options.rows.length} 条数据`) } }} /></div>
    <div className="demo-bottom"><section><h2>操作反馈</h2><div className="demo-log" aria-live="polite">{logs.length ? logs.map((log, i) => <p key={i}>{log}</p>) : <p>操作表格后，这里会显示结果。</p>}</div></section><section><h2>记录详情</h2>{detail ? <dl><dt>任务</dt><dd>{detail.name}</dd><dt>类型</dt><dd>{detail.category}</dd><dt>状态</dt><dd>{detail.status}</dd></dl> : <p>双击一行，或右键选择“查看对应记录”。</p>}</section></div>
    <details className="demo-checks"><summary>其他验收场景</summary><label><input type="checkbox" checked={failClear} onChange={e => setFailClear(e.target.checked)} />模拟清空失败（验证错误提示与数据保留）</label><p>列宽和列顺序保存到当前浏览器；刷新页面可验证。导出全部不受筛选影响。所有数据都是本地演示数据。</p></details>
  </div>
}
export function mountDemo(element) { const root = createRoot(element); root.render(<Demo />); return () => root.unmount() }
