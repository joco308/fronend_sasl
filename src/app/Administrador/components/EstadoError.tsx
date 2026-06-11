interface Props {
  mensaje?: string
  onReintentar?: () => void
}

export default function EstadoError({ mensaje = 'Ocurrió un error al cargar los datos.', onReintentar }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg className="mb-4 h-12 w-12 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <p className="mb-4 text-sm text-red-600">{mensaje}</p>
      {onReintentar && (
        <button
          onClick={onReintentar}
          className="rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
