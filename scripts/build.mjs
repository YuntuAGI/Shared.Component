import { build } from 'vite'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const components = JSON.parse(readFileSync(resolve(root, 'components.json'), 'utf8'))
for (const item of components) {
  if (!/^yuntu_[a-z0-9_]+$/.test(item.id)) throw new Error('Invalid component ID')
  const componentRoot = resolve(root, item.id)
  await build({ configFile: false, root: componentRoot, build: {
    outDir: 'dist', emptyOutDir: true, cssCodeSplit: false,
    lib: { entry: resolve(componentRoot, 'src/index.js'), formats: ['es'], fileName: () => 'index.js', cssFileName: 'style' },
    rolldownOptions: { external: [/^react($|\/)/, /^react-dom($|\/)/] }
  } })
  await build({ configFile: false, root: componentRoot, base: './', define: { 'process.env.NODE_ENV': JSON.stringify('production') }, build: {
    outDir: 'demo/bundle', emptyOutDir: true, cssCodeSplit: false,
    lib: { entry: resolve(root, item.entry), formats: ['iife'], name: 'YuntuDemo', fileName: () => 'demo.js', cssFileName: 'demo' }
  } })
  console.log(`Ready: ${item.id}/demo/index.html`)
}
mkdirSync(resolve(root, 'assets'), { recursive: true })
writeFileSync(resolve(root, 'assets/catalog.js'), `// Generated from components.json by npm run build.\nwindow.YUNTU_COMPONENTS = ${JSON.stringify(components, null, 2)};\n`)
