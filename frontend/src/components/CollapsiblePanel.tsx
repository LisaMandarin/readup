import type { ReactNode } from 'react'

type CollapsiblePanelProps = {
  isOpen: boolean
  children: ReactNode
  className?: string
}

type CollapsiblePanelItemProps = {
  title: string
  description: string
  children?: ReactNode
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

export function CollapsiblePanelItem(props: CollapsiblePanelItemProps) {
  const { title, description, children, className = '' } = props

  return (
    <section
      className={[
        'space-y-4 rounded-xl border border-[rgba(24,57,57,0.18)] bg-white/80 p-4 shadow-sm backdrop-blur-sm',
        className,
      ].join(' ')}
    >
      <div>
        <h3 className="m-0 text-lg font-semibold text-[var(--text-main)]">{title}</h3>
        <p className="mt-1 mb-0 text-sm text-slate-600">{description}</p>
      </div>
      {children}
    </section>
  )
}
