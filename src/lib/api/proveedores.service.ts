import { peticion, cookieHeader } from './client'
import type {
  ListarProveedores,
  InformacionProveedor,
  AñadirProveedor,
  AgregarTelefonoProveedor,
  IdmasNombre,
} from './types'

export const ProveedoresService = {
  listar: (tokenSesion?: string) =>
    peticion<ListarProveedores[]>('/Api/Proveedores', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),

  info: (id: number) =>
    peticion<InformacionProveedor>(`/Api/Proveedores/${id}`),

  crear: (data: AñadirProveedor) =>
    peticion<void>('/Api/Proveedores', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  agregarTelefono: (data: AgregarTelefonoProveedor) =>
    peticion<void>('/Api/Proveedores/telefono', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  editarNombre: (data: IdmasNombre) =>
    peticion<void>('/Api/Proveedores/nombre', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
}
