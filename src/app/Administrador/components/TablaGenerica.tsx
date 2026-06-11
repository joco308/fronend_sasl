import type { ReactNode } from 'react'

export interface Columna<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => ReactNode
  className?: string
}

interface Props<T> {
  columnas: Columna<T>[]
  datos: T[]
  keyExtractor: (item: T) => string | number
  vacio?: string
  onRowClick?: (item: T) => void
}

export default function TablaGenerica<T>({
  columnas,
  datos,
  keyExtractor,
  vacio = 'No hay registros.',
  onRowClick,
}: Props<T>) {
  if (datos.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-gray-400">
        {vacio}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            {columnas.map((col) => (
              <th
                key={String(col.key)}
                className={`px-5 py-3.5 font-semibold text-gray-600 ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.map((item, i) => (
            <tr
              key={`${keyExtractor(item)}-${i}`}
              onClick={() => onRowClick?.(item)}
              className={`border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/30 ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columnas.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-5 py-3.5 text-gray-700 ${col.className ?? ''}`}
                >
                  {col.render
                    ? col.render(item)
                    : (item[col.key as keyof T] as ReactNode) ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
