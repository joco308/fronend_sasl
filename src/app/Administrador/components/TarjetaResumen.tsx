import type { ReactNode } from 'react'

interface Props {
  titulo: string
  valor: string | number
  icono: ReactNode
  color?: 'azul' | 'verde' | 'ambar' | 'rojo'
}

const colores: Record<string, string> = {
  azul: 'bg-navy-50 text-navy-600',
  verde: 'bg-chuxna-light text-chuxna-dark',
  ambar: 'bg-amber-50 text-amber-600',
  rojo: 'bg-red-50 text-red-600',
}

export default function TarjetaResumen({ titulo, valor, icono, color = 'azul' }: Props) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colores[color]}`}>
        {icono}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{titulo}</p>
        <p className="font-display text-2xl font-bold text-navy-900">{valor}</p>
      </div>
    </div>
  )
}
