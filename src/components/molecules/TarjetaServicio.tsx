import type { ReactNode } from 'react'
import Image from 'next/image'

export interface DatosServicio {
  imagen:          string
  alt:             string
  icono:           ReactNode
  numero:          string
  titulo:          string
  descripcion:     string
  caracteristicas: string[]
}

interface Props {
  servicio:   DatosServicio
  className?: string
}

export default function TarjetaServicio({ servicio, className = '' }: Props) {
  const { imagen, alt, icono, numero, titulo, descripcion, caracteristicas } = servicio

  return (
    <div className={`service-card ${className}`.trim()}>
      <div className="service-card-img">
        <Image src={imagen} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="service-card-overlay" />
        <div className="service-icon-wrap">{icono}</div>
      </div>

      <div className="service-card-body">
        <span className="service-number">{numero}</span>
        <h3 className="service-title">{titulo}</h3>
        <p className="service-desc">{descripcion}</p>
        <ul className="service-list">
          {caracteristicas.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}