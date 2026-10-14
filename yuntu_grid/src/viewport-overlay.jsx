import React, { createContext, useContext } from 'react'
import { createPortal } from 'react-dom'

// Pages remain mounted in the workspace. Portals must follow their visibility.
export const OverlayPageContext = createContext(true)

export function ViewportOverlay({ children }) {
  const active = useContext(OverlayPageContext)
  return active ? createPortal(children, document.body) : null
}

export function overlayViewport() {
  const scale = Number.parseFloat(getComputedStyle(document.documentElement).zoom) || 1
  return { scale, width: window.innerWidth / scale, height: window.innerHeight / scale }
}
