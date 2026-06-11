'use client'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorAdministrador({ error, reset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg className="mb-4 h-16 w-16 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <h2 className="mb-2 font-display text-xl font-bold text-navy-900">Error en el panel</h2>
      <p className="mb-6 max-w-md text-sm text-gray-500">
        {error.message ?? 'Ocurrió un error inesperado.'}
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-navy-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
      >
        Intentar de nuevo
      </button>
    </div>
  )
}
