import type { ReactNode } from 'react'

export interface DatosLicencia {
  variante: 'azul' | 'verde'
  icono:    ReactNode
  titulo:   string
  items:    string[]
}

interface Props {
  licencia:   DatosLicencia
  className?: string
}

export default function TarjetaLicencia({ licencia, className = '' }: Props) {
  const { variante, icono, titulo, items } = licencia
  const colorPunto   = variante === 'azul' ? 'blue' : 'green'
  const colorCabecera = variante === 'azul' ? 'license-header-blue' : 'license-header-green'

  return (
    <div className={`license-card ${className}`.trim()}>
      <div className={`license-card-header ${colorCabecera}`}>
        <div className="license-icon-wrap">{icono}</div>
        <h3 className="license-card-title">{titulo}</h3>
      </div>

      <ul className="license-list">
        {items.map((item) => (
          <li key={item}>
            <div className={`license-dot ${colorPunto}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}