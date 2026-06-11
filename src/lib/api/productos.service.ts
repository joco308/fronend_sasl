import { peticion, cookieHeader } from './client'
import type {
  AñadirRecurso,
  ListarRecurso,
  EditarNombre,
  EditarDescripcion,
} from './types'

export const ProductosService = {
  listar: (tokenSesion?: string) =>
    peticion<ListarRecurso[]>('/Api/Productos', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),

  crear: (data: AñadirRecurso) =>
    peticion<void>('/Api/Productos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  editarNombre: (data: EditarNombre) =>
    peticion<void>('/Api/Productos/editar/nombre', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  editarDescripcion: (data: EditarDescripcion) =>
    peticion<void>('/Api/Productos/editar/descripcion', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
}
