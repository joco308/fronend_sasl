import { peticion, cookieHeader } from './client'
import type { InfoClienteCorto, AñadirCliente, InfoCliente } from './types'

export const ClientesService = {
  listar: (tokenSesion?: string) =>
    peticion<InfoClienteCorto[]>('/Api/Clientes', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),

  crear: (data: AñadirCliente) =>
    peticion<void>('/Api/Clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  info: (id: number) =>
    peticion<InfoCliente>(`/Api/Clientes/${id}`),
}
