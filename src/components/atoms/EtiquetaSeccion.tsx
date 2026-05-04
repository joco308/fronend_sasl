import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  variante?: 'default' | 'blanca'
}

export default function EtiquetaSeccion({ children, variante = 'default' }: Props) {
  const clases =
    variante === 'blanca' ? 'section-tag section-tag-white' : 'section-tag'
  return <div className={clases}>{children}</div>
}