import Link from 'next/link'

const secciones = [
  {
    titulo: 'Incidentes',
    descripcion: 'Gestión de incidentes reportados por clientes.',
    href: '/Administrador/reportes/incidentes',
    icono: IconoIncidentes,
    color: 'bg-red-50 text-red-600',
  },
  {
    titulo: 'Memorándums',
    descripcion: 'Creación y descarga de memorándums para trabajadores.',
    href: '/Administrador/reportes/memorandos',
    icono: IconoMemorandums,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    titulo: 'Estado de Maquinaria',
    descripcion: 'Historial de cambios de estado y calidad de maquinaria.',
    href: '/Administrador/reportes/maquinaria',
    icono: IconoMaquinaria,
    color: 'bg-navy-50 text-navy-600',
  },
]

export default function PaginaReportes() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {secciones.map((seccion) => (
        <Link
          key={seccion.href}
          href={seccion.href}
          className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
        >
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${seccion.color}`}>
            <seccion.icono />
          </div>
          <h3 className="mb-1 font-display text-base font-bold text-navy-900 group-hover:text-navy-700">
            {seccion.titulo}
          </h3>
          <p className="text-sm leading-relaxed text-gray-500">{seccion.descripcion}</p>
        </Link>
      ))}
    </div>
  )
}

function IconoIncidentes() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  )
}

function IconoMemorandums() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

function IconoMaquinaria() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-4.12 4.12a2.25 2.25 0 01-3.18-3.18l4.12-4.12M15 5.25l3 3M8.25 4.5L4.5 8.25l3.75 3.75m6-10.5L6.75 18.75M18.75 6l-7.5 7.5" />
    </svg>
  )
}
