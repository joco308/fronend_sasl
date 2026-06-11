import { cookies } from 'next/headers'
import { ReportesService } from '@/lib/api/reportes.service'
import IncidentesClient from './components/IncidentesClient'
import EstadoError from '../../components/EstadoError'
import type { ListaIncidente } from '@/lib/api/types'

export const dynamic = 'force-dynamic'

export default async function PaginaIncidentes() {
  const cookieStore = await cookies()
  const tokenSesion = cookieStore.get('token_sesion')?.value ?? ''
  let datos: ListaIncidente[] = []
  let error = false

  try {
    datos = await ReportesService.listarIncidentes(tokenSesion)
  } catch {
    error = true
  }

  if (error) return <EstadoError mensaje="No se pudieron cargar los incidentes." />

  return <IncidentesClient incidentes={datos} />
}
