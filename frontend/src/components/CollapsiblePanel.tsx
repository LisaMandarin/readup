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
        'min-h-0 overflow-hidden rounded-lg bg-[var(--card-bg)] transition-all duration-300 ease-out',
        isOpen
          ? 'h-full max-h-full w-full translate-y-0 p-4 opacity-100 lg:w-72 lg:translate-x-0 lg:translate-y-0'
          : 'max-h-0 w-full -translate-y-3 border-transparent p-0 opacity-0 lg:w-0 lg:min-w-0 lg:-translate-x-3 lg:translate-y-0',
        className,
      ].join(' ')}
    >
      <div className={isOpen ? 'block h-full min-h-0 max-h-full' : 'hidden'}>{children}</div>
    </div>
  )
}

export function CollapsiblePanelItem(props: CollapsiblePanelItemProps) {
  const { title, description, children, className = '' } = props

  return (
    <section
      className={[
        'grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4 rounded-xl border border-[rgba(24,57,57,0.18)] bg-white/80 p-4 shadow-sm backdrop-blur-sm',
        className,
      ].join(' ')}
    >
      <div className="shrink-0">
        <h3 className="m-0 text-lg font-semibold text-[var(--text-main)]">{title}</h3>
        <p className="mt-1 mb-0 text-sm text-slate-600">{description}</p>
      </div>
      {children}
    </section>
  )
}