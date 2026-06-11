import { cookies } from 'next/headers'
import { ServiciosService } from '@/lib/api/servicios.service'
import ServiciosClient from './components/ServiciosClient'
import EstadoError from '../components/EstadoError'
import type { ListarServicio } from '@/lib/api/types'

export const dynamic = 'force-dynamic'

export default async function PaginaServicios() {
  const cookieStore = await cookies()
  const tokenSesion = cookieStore.get('token_sesion')?.value ?? ''
  let datos: ListarServicio[] = []
  let error = false

  try {
    datos = await ServiciosService.listar(tokenSesion)
  } catch {
    error = true
  }

  if (error) {
    return <EstadoError mensaje="No se pudieron cargar los servicios." />
  }

  return <ServiciosClient servicios={datos} />
}
