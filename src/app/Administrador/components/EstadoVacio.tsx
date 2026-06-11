interface Props {
  mensaje?: string
}

export default function EstadoVacio({ mensaje = 'No hay datos disponibles.' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg className="mb-4 h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25-2.25M12 11.625v-2.25" />
      </svg>
      <p className="text-sm text-gray-400">{mensaje}</p>
    </div>
  )
}
