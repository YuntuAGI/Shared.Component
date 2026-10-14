import React from 'react'
import { Archive } from 'lucide-react'
export function GridButton({ children, tone = 'primary', icon: Icon, className = '', ...props }) {
  return <button type="button" className={`yg-button yg-button-${tone} ${className}`} {...props}>{Icon && <Icon size={17} aria-hidden="true" />}{children}</button>
}
export function GridEmpty({ title }) {
  return <div className="yg-empty"><Archive size={38} aria-hidden="true" /><strong>{title}</strong><span>完成配置并开始运行后，结果会显示在这里。</span></div>
}
