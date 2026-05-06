import type { ReactNode } from 'react'

interface Props {
  children:   ReactNode
  type?:      'button' | 'submit' | 'reset'
  disabled?:  boolean
  cargando?:  boolean
  onClick?:   () => void
  className?: string
}

export default function BotonPrincipal({
  children,
  type      = 'submit',
  disabled  = false,
  cargando  = false,
  onClick,
  className = 'btn-acceder',
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || cargando}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  )
}