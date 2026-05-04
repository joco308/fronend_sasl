import type { ReactNode } from 'react'

interface Props {
  href:     string
  children: ReactNode
}

export default function BotonPrimario({ href, children }: Props) {
  return (
    <a href={href} className="btn-primary">
      {children}
    </a>
  )
}