import { cookies } from 'next/headers'
import { ProveedoresService } from '@/lib/api/proveedores.service'
import ProveedoresClient from './components/ProveedoresClient'
import EstadoError from '../components/EstadoError'
import type { ListarProveedores } from '@/lib/api/types'

export const dynamic = 'force-dynamic'

export default async function PaginaProveedores() {
  const cookieStore = await cookies()
  const tokenSesion = cookieStore.get('token_sesion')?.value ?? ''
  let datos: ListarProveedores[] = []
  let error = false

  try {
    datos = await ProveedoresService.listar(tokenSesion)
  } catch {
    error = true
  }

  if (error) return <EstadoError mensaje="No se pudieron cargar los proveedores." />

  return <ProveedoresClient proveedores={datos} />
}
