/* Static registry + classic bundles work through file:// without a local server. */
(() => {
  const entries = window.YUNTU_COMPONENTS || []
  const list = document.getElementById('component-list')
  const host = document.getElementById('component-demo')
  let cleanup, css, script, loading = false, pendingId
  async function select(id) {
    if (loading) { pendingId = id; return }
    const item = entries.find(entry => entry.id === id) || entries[0]
    if (!item) { host.textContent = '暂无组件，请先添加组件并运行构建。'; return }
    loading = true
    cleanup?.(); cleanup = undefined; host.replaceChildren(); css?.remove(); script?.remove()
    for (const button of list.children) button.setAttribute('aria-current', button.dataset.id === item.id ? 'page' : 'false')
    document.getElementById('component-title').textContent = item.title
    document.getElementById('component-category').textContent = item.category
    document.getElementById('component-description').textContent = item.description
    document.getElementById('component-version').textContent = 'v' + item.version
    document.getElementById('component-readme').href = './' + item.id + '/README.md'
    document.getElementById('component-standalone').href = './' + item.id + '/demo/index.html'
    css = document.createElement('link'); css.rel = 'stylesheet'; css.href = './' + item.id + '/demo/bundle/demo.css'; document.head.append(css)
    script = document.createElement('script'); script.src = './' + item.id + '/demo/bundle/demo.js'
    try {
      await new Promise((resolve, reject) => { script.onload = resolve; script.onerror = reject; document.body.append(script) })
      cleanup = window.YuntuDemo.mountDemo(host)
    } catch { host.textContent = '演示文件未生成，请在组件库目录运行 npm install 和 npm run build。' }
    finally { loading = false; if (pendingId) { const next = pendingId; pendingId = null; select(next) } }
  }
  for (const item of entries) {
    const button = document.createElement('button'); button.type = 'button'; button.dataset.id = item.id; button.textContent = item.title
    button.onclick = () => { location.hash = item.id }; list.append(button)
  }
  window.addEventListener('hashchange', () => select(location.hash.slice(1)))
  select(location.hash.slice(1))
})()
