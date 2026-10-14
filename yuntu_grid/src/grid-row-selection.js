export function gridContextSelection(selectedKeys, targetKey) {
  const keys = new Set([...selectedKeys].map(String))
  return keys.has(String(targetKey)) ? keys : new Set([String(targetKey)])
}

export function gridClickSelection({ selectedKeys, targetKey, displayIndex, anchorIndex, displayKeys, shiftKey, ctrlKey, metaKey }) {
  const additive = ctrlKey || metaKey
  const keys = new Set([...selectedKeys].map(String))
  if (shiftKey && anchorIndex >= 0) {
    const next = new Set(additive ? keys : [])
    const [from, to] = [anchorIndex, displayIndex].sort((a, b) => a - b)
    for (let index = from; index <= to; index++) if (displayKeys[index] != null) next.add(String(displayKeys[index]))
    return { keys: next, anchorIndex }
  }
  if (additive) {
    if (keys.has(String(targetKey))) keys.delete(String(targetKey)); else keys.add(String(targetKey))
    return { keys, anchorIndex: displayIndex }
  }
  return { keys: new Set([String(targetKey)]), anchorIndex: displayIndex }
}
