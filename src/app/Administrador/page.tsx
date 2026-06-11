import { cookies } from 'next/headers'
import { UsuariosService } from '@/lib/api/usuarios.service'
import { ServiciosService } from '@/lib/api/servicios.service'
import { MaquinariaService } from '@/lib/api/maquinaria.service'
import { ProveedoresService } from '@/lib/api/proveedores.service'
import { CobrosService } from '@/lib/api/cobros.service'
import type { ListarCobro } from '@/lib/api/types'
import TarjetaResumen from './components/TarjetaResumen'
import EstadoError from './components/EstadoError'

export const dynamic = 'force-dynamic'

async function obtenerResumen(tokenSesion: string) {
  const resultados = await Promise.allSettled([
    UsuariosService.listar(tokenSesion),
    ServiciosService.listar(tokenSesion),
    MaquinariaService.listar(tokenSesion),
    ProveedoresService.listar(tokenSesion),
    CobrosService.listar(tokenSesion),
    ServiciosService.listarTerminados(tokenSesion),
  ])

  const [rUsuarios, rServicios, rMaquinaria, rProveedores, rCobros, rTerminados] = resultados

  const usuarios = rUsuarios.status === 'fulfilled' ? rUsuarios.value : []
  const servicios = rServicios.status === 'fulfilled' ? rServicios.value : []
  const maquinaria = rMaquinaria.status === 'fulfilled' ? rMaquinaria.value : []
  const proveedores = rProveedores.status === 'fulfilled' ? rProveedores.value : []
  const cobros = rCobros.status === 'fulfilled' ? rCobros.value : []
  const serviciosTerminados = rTerminados.status === 'fulfilled' ? rTerminados.value : []

  const cobrosPendientes = (cobros as ListarCobro[] | undefined)?.filter((c) => c.Vigente) ?? []

  return {
    totalUsuarios: usuarios?.length ?? 0,
    totalServicios: servicios?.length ?? 0,
    totalMaquinaria: maquinaria?.length ?? 0,
    totalProveedores: proveedores?.length ?? 0,
    totalTerminados: serviciosTerminados?.length ?? 0,
    cobrosPendientes: cobrosPendientes.length,
    error: resultados.every((r) => r.status === 'rejected'),
  }
}

export default async function PaginaDashboard() {
  const cookieStore = await cookies()
  const tokenSesion = cookieStore.get('token_sesion')?.value ?? ''
  const resumen = await obtenerResumen(tokenSesion)

  if (resumen.error) {
    return (
      <EstadoError mensaje="No se pudieron cargar los datos del dashboard. Verifique que el servidor API esté funcionando." />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <TarjetaResumen
          titulo="Usuarios"
          valor={resumen.totalUsuarios}
          color="azul"
          icono={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
        <TarjetaResumen
          titulo="Servicios"
          valor={resumen.totalServicios}
          color="verde"
          icono={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          }
        />
        <TarjetaResumen
          titulo="Maquinaria"
          valor={resumen.totalMaquinaria}
          color="ambar"
          icono={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-4.12 4.12a2.25 2.25 0 01-3.18-3.18l4.12-4.12M15 5.25l3 3M8.25 4.5L4.5 8.25l3.75 3.75m6-10.5L6.75 18.75M18.75 6l-7.5 7.5" />
            </svg>
          }
        />
        <TarjetaResumen
          titulo="Proveedores"
          valor={resumen.totalProveedores}
          color="azul"
          icono={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614" />
            </svg>
          }
        />
        <TarjetaResumen
          titulo="Cobros Pendientes"
          valor={resumen.cobrosPendientes}
          color="rojo"
          icono={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <TarjetaResumen
          titulo="Servicios Terminados"
          valor={resumen.totalTerminados}
          color="verde"
          icono={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>
    </div>
  )
}
