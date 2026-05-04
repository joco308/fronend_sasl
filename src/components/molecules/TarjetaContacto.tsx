import type { ReactNode } from 'react'

interface Props {
  icono:      ReactNode
  titulo:     string
  children:   ReactNode
  className?: string
}

export default function TarjetaContacto({ icono, titulo, children, className = '' }: Props) {
  return (
    <div className={`contact-card ${className}`.trim()}>
      <div className="contact-icon-wrap">{icono}</div>
      <h4 className="contact-card-title">{titulo}</h4>
      {children}
    </div>
  )
}