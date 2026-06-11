import { cookies } from 'next/headers'
import { ReportesService } from '@/lib/api/reportes.service'
import { MaquinariaService } from '@/lib/api/maquinaria.service'
import MaquinariaHistorialClient from './components/MaquinariaHistorialClient'
import EstadoError from '../../components/EstadoError'
import type { ListHistorialEstadoMaquinaria, ListarMaquinaria } from '@/lib/api/types'

export const dynamic = 'force-dynamic'

export default async function PaginaHistorialMaquinaria() {
  const cookieStore = await cookies()
  const tokenSesion = cookieStore.get('token_sesion')?.value ?? ''

  let historial: ListHistorialEstadoMaquinaria[] = []
  let maquinarias: ListarMaquinaria[] = []
  let error = false

  try {
    const [h, m] = await Promise.all([
      ReportesService.listarHistorialEstado(tokenSesion),
      MaquinariaService.listar(tokenSesion),
    ])
    historial = h
    maquinarias = m
  } catch {
    error = true
  }

  if (error) return <EstadoError mensaje="No se pudo cargar la información." />

  return <MaquinariaHistorialClient historial={historial} maquinarias={maquinarias} />
}
