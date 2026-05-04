import type { ReactNode } from 'react'

interface Props {
  href:     string
  children: ReactNode
}

export default function BotonSecundario({ href, children }: Props) {
  return (
    <a href={href} className="btn-ghost">
      {children}
    </a>
  )
}