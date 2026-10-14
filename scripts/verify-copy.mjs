import { build } from 'vite'
import { chromium } from 'playwright'
import { cpSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve, sep } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { execFileSync, spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const project = mkdtempSync(join(tmpdir(), 'yuntu-grid-copy-'))
let browser
try {
  cpSync(resolve(root, 'yuntu_grid'), join(project, 'components/yuntu_grid'), { recursive: true })
  // Actual copies of host dependencies: no workspace links or cross-repo imports.
  for (const name of ['react', 'react-dom', 'scheduler', 'lucide-react']) cpSync(resolve(root, 'node_modules', name), join(project, 'node_modules', name), { recursive: true, dereference: true })
  writeFileSync(join(project, 'package.json'), '{"type":"module","private":true}')
  const fixtures = []
  for (const kind of ['src', 'dist']) {
    const entry = join(project, `${kind}.jsx`)
    writeFileSync(entry, `import React from 'react'; import { createRoot } from 'react-dom/client'; import { YuntuGrid } from './components/yuntu_grid/${kind}/index.js'; import './components/yuntu_grid/${kind}/${kind === 'src' ? 'styles.css' : 'style.css'}'; createRoot(document.getElementById('root')).render(<YuntuGrid gridId="copy-${kind}" columns={[{key:'name',label:'名称'}]} rows={[{id:'1',name:'独立复制成功'}]} />)`)
    await build({ configFile: false, root: project, logLevel: 'error', define: { 'process.env.NODE_ENV': JSON.stringify('production') }, plugins: [{
      name: 'assert-independent-modules', generateBundle() {
        for (const id of this.getModuleIds()) if (/^[A-Z]:[/\\]/i.test(id)) assert.ok(resolve(id).startsWith(project + sep), `External source dependency: ${id}`)
      }
    }], build: { outDir: `output-${kind}`, lib: { entry, name: 'CopyDemo', formats: ['iife'], fileName: () => 'app.js', cssFileName: 'app' } } })
    const html = join(project, `output-${kind}/index.html`)
    writeFileSync(html, '<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="app.css"><div id="root"></div><script src="app.js"></script>')
    fixtures.push(html)
  }
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  for (const file of fixtures) { await page.goto(pathToFileURL(file).href); await page.getByText('独立复制成功', { exact: true }).waitFor({ timeout: 5000 }) }
  // Exercise the add-component generator in an isolated miniature repository.
  const scaffold = join(project, 'scaffold'); mkdirSync(join(scaffold, 'scripts'), { recursive: true })
  cpSync(resolve(root, 'scripts/new-component.mjs'), join(scaffold, 'scripts/new-component.mjs'))
  writeFileSync(join(scaffold, 'components.json'), '[]')
  execFileSync(process.execPath, [join(scaffold, 'scripts/new-component.mjs'), 'yuntu_example'], { timeout: 10000 })
  assert.equal(JSON.parse(readFileSync(join(scaffold, 'components.json')))[0].id, 'yuntu_example')
  const duplicate = spawnSync(process.execPath, [join(scaffold, 'scripts/new-component.mjs'), 'yuntu_example'], { timeout: 10000 })
  assert.notEqual(duplicate.status, 0)
  const traversal = spawnSync(process.execPath, [join(scaffold, 'scripts/new-component.mjs'), '../outside'], { timeout: 10000 })
  assert.notEqual(traversal.status, 0)
  const results = { sourceCopyBuildAndRender: true, distCopyBuildAndRender: true, noCrossRepositoryImports: true, componentScaffold: true, duplicateAndTraversalRejected: true }
  mkdirSync(resolve(root, 'test-results'), { recursive: true })
  writeFileSync(resolve(root, 'test-results/copy-report.json'), JSON.stringify(results, null, 2))
  console.log(JSON.stringify(results, null, 2))
} finally {
  await browser?.close()
  const resolved = realpathSync(project)
  assert.ok(resolved.startsWith(realpathSync(tmpdir()) + sep + 'yuntu-grid-copy-'))
  rmSync(resolved, { recursive: true, force: true })
}
