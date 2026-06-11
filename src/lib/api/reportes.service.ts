import { peticion, peticionBinaria, cookieHeader } from './client'
import type {
  ListaIncidente,
  AddIncidente,
  InfoIncidente,
  AddMemorandum,
  ListHistorialEstadoMaquinaria,
  EstadoMaquinaria,
  MemorandoDatos,
} from './types'

export const ReportesService = {
  /* Incidentes */
  listarIncidentes: (tokenSesion?: string) =>
    peticion<ListaIncidente[]>('/Api/Reportes/incidentes', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),

  infoIncidente: (id: number) =>
    peticion<InfoIncidente>(`/Api/Reportes/incidentes/${id}`),

  crearIncidente: (data: AddIncidente) =>
    peticion<void>('/Api/Reportes/incidentes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /* Memorándums */
  listarMemorandums: (tokenSesion?: string) =>
    peticion<MemorandoDatos[]>('/Api/Reportes/memorandums', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),

  crearMemorandum: (data: AddMemorandum) =>
    peticion<void>('/Api/Reportes/memorandums', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  descargarMemorandumPDF: (id: number) =>
    peticionBinaria(`/Api/Reportes/memorandums/${id}/pdf`),

  /* Estado maquinaria */
  listarHistorialEstado: (tokenSesion?: string) =>
    peticion<ListHistorialEstadoMaquinaria[]>('/Api/Reportes/estado-maquinaria', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),

  cambiarEstadoMaquinaria: (data: EstadoMaquinaria) =>
    peticion<void>('/Api/Reportes/estado-maquinaria', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  exportarCSV: () =>
    peticionBinaria('/Api/Reportes/exportar-csv'),
}
