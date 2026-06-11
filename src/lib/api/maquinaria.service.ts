import { peticion, cookieHeader } from './client'
import type {
  ListarMaquinaria,
  InfoMaquinaria,
  AgregarMaquinaria,
  MostrarMarcas,
  AgregarMarcaMaquinaria,
  Estado,
  InfoResumidaMaquinaria,
  ListarMantenimiento,
  AddMantenimientoMaquinaria,
  InfoMantenimiento,
} from './types'

export const MaquinariaService = {
  listar: (tokenSesion?: string) =>
    peticion<ListarMaquinaria[]>('/Api/Maquinaria', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),

  crear: (data: AgregarMaquinaria) =>
    peticion<void>('/Api/Maquinaria', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  info: (id: number) =>
    peticion<InfoMaquinaria>(`/Api/Maquinaria/${id}`),

  infoResumida: (id: number) =>
    peticion<InfoResumidaMaquinaria>(`/Api/Maquinaria/Short${id}`),

  marcas: () =>
    peticion<MostrarMarcas[]>('/Api/Maquinaria/marcas'),

  crearMarca: (data: AgregarMarcaMaquinaria) =>
    peticion<void>('/Api/Maquinaria/marcas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  estados: () =>
    peticion<Estado[]>('/Api/Maquinaria/estados'),

  listarMantenimientos: () =>
    peticion<ListarMantenimiento[]>('/Api/Maquinaria/mantenimiento'),

  crearMantenimiento: (data: AddMantenimientoMaquinaria) =>
    peticion<void>('/Api/Maquinaria/mantenimiento', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  infoMantenimiento: (id: number) =>
    peticion<InfoMantenimiento>(`/Api/Maquinaria/mantenimiento/${id}`),
}
