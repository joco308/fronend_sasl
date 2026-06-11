export default function EstadoCargando() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-100 border-t-navy-600" />
        <p className="text-sm text-gray-500">Cargando...</p>
      </div>
    </div>
  )
}
