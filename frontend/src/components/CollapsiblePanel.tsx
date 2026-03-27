import type { ReactNode } from 'react'

type CollapsiblePanelProps = {
  isOpen: boolean
  children: ReactNode
  className?: string
}

export default function CollapsiblePanel(props: CollapsiblePanelProps) {
  const { isOpen, children, className = '' } = props

  return (
    <div
      aria-hidden={!isOpen}
      className={[
        'overflow-hidden rounded-lg border-4 border-[var(--card-border)] bg-[var(--card-bg)] transition-all duration-300 ease-out',
        isOpen
          ? 'w-72 translate-x-0 p-4 opacity-100'
          : 'w-0 min-w-0 -translate-x-3 border-transparent p-0 opacity-0',
        className,
      ].join(' ')}
    >
      <div className={isOpen ? 'block' : 'hidden'}>{children}</div>
    </div>
  )
}
