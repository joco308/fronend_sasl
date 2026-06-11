'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const titulos: Record<string, string> = {
  '/Administrador': 'Dashboard',
  '/Administrador/usuarios': 'Usuarios',
  '/Administrador/servicios': 'Servicios',
  '/Administrador/maquinaria': 'Maquinaria',
  '/Administrador/productos': 'Productos',
  '/Administrador/proveedores': 'Proveedores',
  '/Administrador/reportes': 'Reportes',
  '/Administrador/cobros': 'Cobros',
  '/Administrador/catalogos': 'Catálogos',
}

interface InfoToken {
  nombre?: string
  rol?: string
}

function decodificarToken(): InfoToken | null {
  try {
    const cookies = document.cookie.split('; ')
    const tokenCookie = cookies.find((c) => c.startsWith('token='))
    if (!tokenCookie) return null
    const payload = JSON.parse(atob(tokenCookie.value.split('.')[1]))
    return { nombre: payload.nombre ?? payload.sub, rol: payload.rol }
  } catch {
    return null
  }
}

export default function Header() {
  const pathname = usePathname()
  const [info, setInfo] = useState<InfoToken | null>(null)

  useEffect(() => {
    setInfo(decodificarToken())
  }, [])

  const titulo = Object.entries(titulos).find(([ruta]) =>
    ruta === '/Administrador' ? pathname === ruta : pathname.startsWith(ruta),
  )?.[1] ?? 'Panel'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md lg:px-8">
      <div>
        <h1 className="font-display text-lg font-bold text-navy-900">{titulo}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-100 text-sm font-bold text-navy-700">
            {info?.nombre?.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-navy-800">{info?.nombre ?? 'Administrador'}</p>
            <p className="text-xs text-navy-400">{info?.rol ?? 'Personal Autorizado'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
