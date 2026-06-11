import { cookies } from 'next/headers'
import { ProductosService } from '@/lib/api/productos.service'
import { CatalogosService } from '@/lib/api/catalogos.service'
import { ProveedoresService } from '@/lib/api/proveedores.service'
import ProductosClient from './components/ProductosClient'
import EstadoError from '../components/EstadoError'
import type { ListarRecurso, CatalogoDTO, ListarProveedores } from '@/lib/api/types'

export const dynamic = 'force-dynamic'

export default async function PaginaProductos() {
  const cookieStore = await cookies()
  const tokenSesion = cookieStore.get('token_sesion')?.value ?? ''

  let datos: ListarRecurso[] = []
  let proveedores: ListarProveedores[] = []
  let tipos: CatalogoDTO[] = []
  let error = false

  try {
    ;[datos, proveedores, tipos] = await Promise.all([
      ProductosService.listar(tokenSesion),
      ProveedoresService.listar(tokenSesion),
      CatalogosService.obtener('Tipo Recurso', tokenSesion),
    ])
  } catch {
    error = true
  }

  if (error) return <EstadoError mensaje="No se pudieron cargar los productos." />

  return <ProductosClient productos={datos} proveedores={proveedores} tipos={tipos} />
}
