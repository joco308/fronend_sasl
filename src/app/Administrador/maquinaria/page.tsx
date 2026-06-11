import { cookies } from 'next/headers'
import { MaquinariaService } from '@/lib/api/maquinaria.service'
import MaquinariaClient from './components/MaquinariaClient'
import EstadoError from '../components/EstadoError'
import type { ListarMaquinaria } from '@/lib/api/types'

export const dynamic = 'force-dynamic'

export default async function PaginaMaquinaria() {
  const cookieStore = await cookies()
  const tokenSesion = cookieStore.get('token_sesion')?.value ?? ''
  let datos: ListarMaquinaria[] = []
  let error = false

  try {
    datos = await MaquinariaService.listar(tokenSesion)
  } catch {
    error = true
  }

  if (error) {
    return <EstadoError mensaje="No se pudo cargar el inventario de maquinaria." />
  }

  return <MaquinariaClient maquinarias={datos} />
}
