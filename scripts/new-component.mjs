import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const id = process.argv[2]
if (!/^yuntu_[a-z][a-z0-9_]*$/.test(id || '')) throw new Error('用法：npm run component:new -- yuntu_button（小写字母、数字、下划线）')
const entries = JSON.parse(readFileSync(resolve(root, 'components.json'), 'utf8'))
const target = resolve(root, id)
if (existsSync(target) || entries.some(item => item.id === id)) throw new Error('组件目录或注册项已存在，未覆盖任何文件。')
for (const dir of ['src', 'demo', 'tests']) mkdirSync(resolve(target, dir), { recursive: true })
writeFileSync(resolve(target, 'package.json'), JSON.stringify({ name: '@yuntu/' + id.slice(6).replaceAll('_', '-'), version: '0.1.0', type: 'module', main: './dist/index.js', exports: { '.': './dist/index.js', './styles.css': './dist/style.css' }, sideEffects: ['**/*.css'], peerDependencies: { react: '>=18 <20', 'react-dom': '>=18 <20' } }, null, 2) + '\n')
writeFileSync(resolve(target, 'src/index.js'), `export { default } from './Component.jsx'\nimport './styles.css'\n`)
writeFileSync(resolve(target, 'src/Component.jsx'), `import React from 'react'\nexport default function Component({ children = '${id}' }) { return <div className="${id}">{children}</div> }\n`)
writeFileSync(resolve(target, 'src/styles.css'), `.${id} { padding: 16px; border: 1px solid #ddd3c7; border-radius: 8px; background: #fffdf9; color: #211c18; }\n`)
writeFileSync(resolve(target, 'demo/main.jsx'), `import React from 'react'\nimport { createRoot } from 'react-dom/client'\nimport Component from '../src/index.js'\nimport '../src/styles.css'\nexport function mountDemo(element) { const root = createRoot(element); root.render(<Component>请补充 ${id} 的真实交互演示。</Component>); return () => root.unmount() }\n`)
writeFileSync(resolve(target, 'demo/index.html'), `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${id} 演示</title><link rel="stylesheet" href="bundle/demo.css"></head><body><a href="../../index.html#${id}">返回组件库</a><div id="component-demo"></div><script src="bundle/demo.js"></script><script>YuntuDemo.mountDemo(document.getElementById('component-demo'))</script></body></html>\n`)
writeFileSync(resolve(target, 'README.md'), `# ${id}\n\n## 功能\n\n待填写：适用场景、已支持能力和限制。\n\n## 深复制接入\n\n将整个 ${id} 复制到业务项目的 src/components/${id}，从 ./src/index.js 导入并引用 ./src/styles.css。业务项目需安装 React 和 React DOM 18/19。不得使用指向组件库的绝对路径或符号链接。\n\n## 演示\n\n双击 demo/index.html。修改后在组件库根目录运行 npm run build 生成离线演示与 dist。\n\n## API\n\n待填写：参数、事件、样式定制与示例。\n\n## 验证与变更\n\n待填写：测试方法、版本号及兼容性。保持既有组件 UI，调整视觉前先取得用户授权。\n`)
entries.push({ id, title: id, category: '待分类', description: '待填写组件说明', version: '0.1.0', entry: `${id}/demo/main.jsx` })
writeFileSync(resolve(root, 'components.json'), JSON.stringify(entries, null, 2) + '\n')
console.log(`已创建 ${id}。补充实现、README 和 tests，然后运行 npm install、npm run build。`)
