# 云途 Grid · yuntu_grid

版本：1.0.0。来源：`yuntu_claw` 的 YuntuGrid、布局/筛选/选择辅助模块，以及原表格 CSS。保留现有 UI，不套用 Shared VI 改配色或尺寸。

## 能力

- 文本、数字、时间、布尔、枚举筛选，可叠加条件并逐项移除。
- 点击表头排序；点击序号恢复原始顺序。
- 拖动表头调整列顺序；拖动分隔线、键盘左右键调整列宽，双击分隔线恢复默认宽度；布局按 `gridId` 持久化。
- 单选、Ctrl/⌘ 多选、Shift 连选、拖拽框选、可选复选框列。
- 自定义单元格、右侧固定操作列、右键菜单；双击执行第一项可见菜单动作。首项禁用时不会落到第二项。
- 复制选中行（TSV，可粘贴到表格软件）、导出全部（默认 CSV）、清空确认、空状态、分批渲染。
- 筛选、菜单、框选和清空弹窗通过 Portal 放在 body，避免长页面或毛玻璃容器导致弹窗出现在页面底部。

IP 属地查询、平台账号、发送任务、打开抖音视频等业务能力不放入通用组件。业务项目通过 `columns`、`rowActions`、`services` 和回调扩展；组件不访问 `window.yuntu`，也不会自动请求网络。

## 打开演示

双击本目录 `demo/index.html`，或使用组件库根目录 `index.html`。现成离线包不依赖 CDN、开发服务器和 npm。

## 接入方式一：深复制源码

完整复制本目录到业务项目的 `src/components/yuntu_grid/`。不使用软链接或指向原组件库的绝对路径。业务项目需要 React / React DOM 18 或 19，以及 `lucide-react`（此版本构建使用 1.45.0）。

```jsx
import React, { useState } from 'react'
import { YuntuGrid } from './components/yuntu_grid/src/index.js'
import './components/yuntu_grid/src/styles.css'

export default function Tasks() {
  const [rows, setRows] = useState([
    { id: '1', name: '任务一', progress: 25 },
    { id: '2', name: '任务二', progress: 80 }
  ])
  const [selectedKeys, setSelectedKeys] = useState(new Set())
  return <YuntuGrid
    gridId="my-project-tasks"
    columns={[
      { key: 'name', label: '任务名称', width: 220 },
      { key: 'progress', label: '进度', dataType: 'number', width: 100 }
    ]}
    rows={rows}
    selectedKeys={selectedKeys}
    onSelectionChange={setSelectedKeys}
    selectionColumn
    exportConfig={{ title: '任务列表' }}
    clearConfig={{ onClear: () => { setRows([]); setSelectedKeys(new Set()) } }}
    rowActions={(row, context) => [
      { id: 'open', label: '查看记录', run: () => alert(row.name) },
      { id: 'copy', label: '复制选中行', run: context.copyAllRows }
    ]}
  />
}
```

## 接入方式二：深复制构建产物

复制整个目录后，从其 `dist/index.js` 导入组件，并显式引入 `dist/style.css`。构建产物已经包含所需图标，只需业务项目安装 React 和 React DOM，不需要 lucide-react，也无需读取本组件库的任何目录。

```jsx
import { YuntuGrid } from './components/yuntu_grid/dist/index.js'
import './components/yuntu_grid/dist/style.css'
```

不要把 demo/bundle 当作组件导入：它包含演示专用的 React 与模拟数据。业务项目应使用 src 或 dist。

## Props

| 参数 | 说明 |
| --- | --- |
| `gridId` | 稳定、唯一的字符串，用作列布局存储键。同一页面多个表格使用不同 ID。 |
| `columns` | 列定义，见下表。 |
| `rows` | 数据数组；组件不修改原数据。 |
| `rowKey` | 唯一行键，默认 `id`。建议每行提供稳定且唯一的 ID，不依赖索引。 |
| `selectedKeys` / `onSelectionChange` | 受控选择，值为 Set；回调返回新的 `Set<string>`。不传时组件内部管理。 |
| `selectionColumn` | 默认 false，显示复选框列。 |
| `selectionDisabled` | 默认 false，禁用选择操作。 |
| `selected` | 单行高亮 ID，不替代多选状态。 |
| `rowActions` | 动作数组或 `(row, context) => actions`；默认提供复制选中行。 |
| `onRowClick` | `(row, event, displayIndex, { displayRows, originalIndex })`。 |
| `filterEnabled` | 默认 true，false 时隐藏并清除筛选。 |
| `exportConfig` | 提供即显示导出按钮：`{ title, columns? }`。导出完整 rows，不受筛选影响。 |
| `clearConfig` | 提供即显示清空：`{ disabled?, description?, onClear }`；组件弹窗确认，调用方删除数据。支持 Promise，失败保留弹窗并显示错误。 |
| `services` | 可替换浏览器能力：`{ copyText(text), exportRows({ title, rows, columns }) }`。 |
| `emptyText` | 默认“暂无数据”。 |
| `rowRenderBatch` | 默认 0 全部渲染；正数分批追加，不是虚拟滚动。 |
| `active` | 默认 true；页面隐藏但未卸载时传 false，隐藏 body 上的浮层。 |
| `className` / `style` | 作用于表格外壳。需要限制高度时可用 `style={{ height: 480 }}`。 |

| 列属性 | 说明 |
| --- | --- |
| `key`, `label` | 字段名和表头文案。 |
| `width`, `minWidth`, `maxWidth` | 初始列宽和范围，默认限制在 64–640 px。 |
| `render(row, displayIndex)` | 自定义显示，不决定复制和导出值。 |
| `dataType` | `text / number / datetime / boolean / enum`，建议显式提供。 |
| `options` | 枚举筛选选项：值数组或 `{ value, label }` 数组。 |
| `filterValue`, `sortValue`, `value` | 取值回调；当前继承原实现优先级为 `filterValue → sortValue → value → row[key]`，筛选与排序共用。 |
| `filterable`, `sortable`, `exportable` | 对应能力开关，默认开启；头像、操作、选择列有默认排除。 |
| `hidden` | 隐藏显示与筛选；导出是否包含由 `exportable` / exportConfig.columns 决定。 |
| `sticky: 'right'` | 右侧固定列，目前建议仅设置一列。 |
| `className`, `max` | 单元格类名与默认文本截断长度（默认 28）。 |

行操作包含 `id / label / icon? / disabled? / hidden? / danger? / run()`。`context` 包含本次右键对应选择的 `keys`、`selectedRows`、`copyAllRows()`。`run()` 支持 Promise，异常显示在表格下方。

## 业务扩展示例

```jsx
// 在调用方打开视频，不让通用组件依赖某个平台。
const rowActions = row => [{
  id: 'open-video', label: '打开对应视频',
  disabled: !/^\d+$/.test(String(row.awemeId || '')),
  run: () => desktopApi.openExternal(`https://www.douyin.com/video/${row.awemeId}`)
}]

// Electron 可以保持既有剪贴板和文件保存链路。
const services = {
  copyText: text => desktopApi.copyText(text),
  exportRows: payload => desktopApi.exportRows(payload)
}
```

IP 查询由调用方获取并更新 `rows`，通过列显示结果、通过右键动作调用查询。组件本身不保存账号、Cookie、平台 UID 映射或查询缓存。

## 样式与限制

样式从原项目表格及毛玻璃主题中抽取，选择器限制在 `.yuntu-grid-*` / 组件内部，不引入原项目整份全局 CSS。不因抽取而重设计 UI。浮层始终在 body 上；需要改主题时应同时覆盖表格外壳与各个浮层，不只覆盖业务父容器。

`localStorage` 不可用时列布局仍可操作，但不会保存。默认复制会尝试剪贴板 API，再尝试兼容复制；权限均拒绝时显示错误。CSV 带 UTF-8 BOM，并处理引号、换行和公式开头，避免导出文本被表格软件当成公式。默认导出复制的是原始字段值，自定义渲染值需在调用方预先准备。

React 客户端组件，使用浏览器 DOM；服务端渲染应仅在客户端挂载。未提供行编辑、服务端分页或虚拟滚动，不把这些能力包含在当前版本承诺中。

## 验证与版本

在组件库根目录运行 `npm test`、`npm run build`、`npm run test:ui`。验证包含原有排序/筛选/布局/选择逻辑、离线入口、交互、弹窗、以及复制后的独立编译。

1.0.0：从获客项目抽取通用表格与原样式；浏览器复制/导出默认实现和可注入适配器；独立演示、API 类型与深复制说明。原获客项目没有被替换或修改。
