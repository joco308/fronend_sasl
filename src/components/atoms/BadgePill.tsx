import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function BadgePill({ children }: Props) {
  return (
    <div className="badge-pill mb-6">
      <span className="badge-dot" />
      {children}
    </div>
  )
}