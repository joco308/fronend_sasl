'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const enlaces = [
  { href: '/Administrador', label: 'Dashboard', icono: IconoDashboard },
  { href: '/Administrador/usuarios', label: 'Usuarios', icono: IconoUsuarios },
  { href: '/Administrador/servicios', label: 'Servicios', icono: IconoServicios },
  { href: '/Administrador/maquinaria', label: 'Maquinaria', icono: IconoMaquinaria },
  { href: '/Administrador/productos', label: 'Productos', icono: IconoProductos },
  { href: '/Administrador/proveedores', label: 'Proveedores', icono: IconoProveedores },
  { href: '/Administrador/reportes', label: 'Reportes', icono: IconoReportes },
  { href: '/Administrador/cobros', label: 'Cobros', icono: IconoCobros },
  { href: '/Administrador/catalogos', label: 'Catálogos', icono: IconoCatalogos },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [abierto, setAbierto] = useState(false)

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-card lg:hidden"
        onClick={() => setAbierto(!abierto)}
        aria-label="Abrir menú"
      >
        <svg className="h-5 w-5 text-navy-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={abierto ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
        </svg>
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setAbierto(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-900 transition-transform duration-300 lg:translate-x-0 ${
          abierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chuxna text-sm font-bold text-white">
            S
          </div>
          <div>
            <p className="text-sm font-semibold text-white">SASL</p>
            <p className="text-[11px] text-white/60">Administración</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {enlaces.map(({ href, label, icono: Icono }) => {
              const activo = pathname === href || (href !== '/Administrador' && pathname.startsWith(href))
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setAbierto(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      activo
                        ? 'bg-chuxna/15 text-chuxna'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icono activo={activo} />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/50 transition-colors hover:text-white/80"
          >
            <IconoCerrarSesion />
            Cerrar sesión
          </Link>
        </div>
      </aside>
    </>
  )
}

function IconoDashboard({ activo }: { activo: boolean }) {
  return (
    <svg className={`h-5 w-5 flex-shrink-0 ${activo ? 'text-chuxna' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  )
}

function IconoUsuarios({ activo }: { activo: boolean }) {
  return (
    <svg className={`h-5 w-5 flex-shrink-0 ${activo ? 'text-chuxna' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

function IconoServicios({ activo }: { activo: boolean }) {
  return (
    <svg className={`h-5 w-5 flex-shrink-0 ${activo ? 'text-chuxna' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>
  )
}

function IconoMaquinaria({ activo }: { activo: boolean }) {
  return (
    <svg className={`h-5 w-5 flex-shrink-0 ${activo ? 'text-chuxna' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-4.12 4.12a2.25 2.25 0 01-3.18-3.18l4.12-4.12M15 5.25l3 3M8.25 4.5L4.5 8.25l3.75 3.75m6-10.5L6.75 18.75M18.75 6l-7.5 7.5" />
    </svg>
  )
}

function IconoProductos({ activo }: { activo: boolean }) {
  return (
    <svg className={`h-5 w-5 flex-shrink-0 ${activo ? 'text-chuxna' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  )
}

function IconoProveedores({ activo }: { activo: boolean }) {
  return (
    <svg className={`h-5 w-5 flex-shrink-0 ${activo ? 'text-chuxna' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    </svg>
  )
}

function IconoTrabajadores({ activo }: { activo: boolean }) {
  return (
    <svg className={`h-5 w-5 flex-shrink-0 ${activo ? 'text-chuxna' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

function IconoReportes({ activo }: { activo: boolean }) {
  return (
    <svg className={`h-5 w-5 flex-shrink-0 ${activo ? 'text-chuxna' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

function IconoCobros({ activo }: { activo: boolean }) {
  return (
    <svg className={`h-5 w-5 flex-shrink-0 ${activo ? 'text-chuxna' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconoCatalogos({ activo }: { activo: boolean }) {
  return (
    <svg className={`h-5 w-5 flex-shrink-0 ${activo ? 'text-chuxna' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

function IconoCerrarSesion() {
  return (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  )
}
