import { peticion, peticionBinaria, cookieHeader } from './client'
import type {
  ListarRoles,
  AñadirTelefonoTrabajadores,
  VerInfoUsuario,
} from './types'

export const TrabajadoresService = {
  listarRoles: (tokenSesion?: string) =>
    peticion<ListarRoles[]>('/Api/Trabajadores/roles', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),

  info: (id: number) =>
    peticion<VerInfoUsuario>(`/Api/Trabajadores/${id}`),

  agregarTelefono: (data: AñadirTelefonoTrabajadores) =>
    peticion<void>('/Api/Trabajadores/telefonos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  exportarCSV: () =>
    peticionBinaria('/Api/Trabajadores/exportar-csv'),
}
