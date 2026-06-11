import { peticion, peticionBinaria, cookieHeader } from './client'
import type {
  ListarServicio,
  AñadirServicio,
  InfoServicio,
  AsignarUsuariosServicios,
  AsignarMaquinariaServicios,
  AsignarRecursoServicios,
  HorarioDTO,
  AddServicioTerminado,
  ListarServicioTerminado,
  InfoServicioTerminado,
} from './types'

export const ServiciosService = {
  listar: (tokenSesion?: string) =>
    peticion<ListarServicio[]>('/Api/Servicios', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),

  crear: (data: AñadirServicio) =>
    peticion<void>('/Api/Servicios/Nuevo', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  info: (id: number) =>
    peticion<InfoServicio>(`/Api/Servicios/${id}`),

  asignarEmpleado: (data: AsignarUsuariosServicios) =>
    peticion<void>('/Api/Servicios/Asignar-empleado', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  asignarMaquinaria: (data: AsignarMaquinariaServicios) =>
    peticion<void>('/Api/Servicios/asignar-maquinaria', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  asignarRecurso: (data: AsignarRecursoServicios) =>
    peticion<void>('/Api/Servicios/asignar-recurso', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  exportarCSV: () =>
    peticionBinaria('/Api/Servicios/exportar-csv'),

  horarios: () =>
    peticion<HorarioDTO[]>('/Api/Servicios/horarios'),

  marcarTerminado: (data: AddServicioTerminado) =>
    peticion<void>('/Api/Servicios/ServicioTerminado/Nuevo', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listarTerminados: (tokenSesion?: string) =>
    peticion<ListarServicioTerminado[]>('/Api/Servicios/ServicioTerminado', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),

  infoTerminado: (id: number) =>
    peticion<InfoServicioTerminado>(`/Api/Servicios/ServicioTerminado/${id}`),
}
