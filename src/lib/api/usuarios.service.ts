import { peticion, peticionFormData, peticionBinaria, cookieHeader } from './client'
import type {
  UsuarioDatos,
  NuevoUsuario,
  EditarDireccion,
  EditarRol,
  DatosParaSubirDoc,
  AñadirCarrera,
  DocumentosUsuarioTipo,
  VerInfoUsuario,
  AñadirCapacitacion,
  PonerUsuarioCapacitacion,
  ListarCapacitaciones,
  InfoCapacitacion,
  AñadirUniforme,
  ListarUniformes,
  AsignarUniformeEmpleado,
  UsuariosUniformes,
} from './types'

export const UsuariosService = {
  listar: (tokenSesion?: string) =>
    peticion<UsuarioDatos[]>('/Api/Usuarios', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),

  listarFiltrados: (servicio: boolean) =>
    peticion<UsuarioDatos[]>(`/Api/Usuarios/${servicio}`),

  crear: (data: NuevoUsuario) =>
    peticion<{ mensaje: string }>('/Api/Usuarios/nuevoUsuario', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  editarDireccion: (ci: number, data: EditarDireccion) =>
    peticion<void>(`/Api/Usuarios/${ci}/direccion`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  editarRol: (ci: number, data: EditarRol) =>
    peticion<void>(`/Api/Usuarios/${ci}/rol`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  subirArchivo: (dto: DatosParaSubirDoc, archivo: File) => {
    const formData = new FormData()
    formData.append('idUSer', String(dto.idUSer))
    formData.append('idtipoDoc', String(dto.idtipoDoc))
    formData.append('detalleTipoDoc', dto.detalleTipoDoc)
    formData.append('archivo', archivo)
    return peticionFormData<{ mensaje: string }>('/Api/Usuarios/SubirArchivo', formData)
  },

  verArchivo: (id: number) =>
    peticionBinaria(`/Api/Usuarios/VerArchivo/${id}`),

  agregarCarrera: (data: AñadirCarrera) =>
    peticion<void>('/Api/Usuarios/AgregarCarrera', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listarDocumentos: (id: number, idtipo: number) =>
    peticion<DocumentosUsuarioTipo[]>(`/Api/Usuarios/Docuemntos/Listar?id=${id}&idtipo=${idtipo}`),

  infoCompleta: (ci: number) =>
    peticion<VerInfoUsuario>(`/Api/Trabajadores/${ci}`),

  /* Capacitaciones */
  listarCapacitaciones: (tokenSesion?: string) =>
    peticion<ListarCapacitaciones[]>('/Api/Usuarios/Capacitaciones', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),

  crearCapacitacion: (data: AñadirCapacitacion) =>
    peticion<void>('/Api/Usuarios/Capacitaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  infoCapacitacion: (id: number) =>
    peticion<InfoCapacitacion>(`/Api/Usuarios/Capacitaciones/${id}`),

  inscribirCapacitacion: (data: PonerUsuarioCapacitacion) =>
    peticion<void>('/Api/Usuarios/Capacitaciones/inscribir', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /* Uniformes */
  listarUniformes: (tokenSesion?: string) =>
    peticion<ListarUniformes[]>('/Api/Usuarios/Uniformes', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),

  crearUniforme: (data: AñadirUniforme) =>
    peticion<void>('/Api/Usuarios/Uniformes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  asignarUniforme: (data: AsignarUniformeEmpleado) =>
    peticion<void>('/Api/Usuarios/Uniformes/asignar', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listarAsignacionesUniformes: (tokenSesion?: string) =>
    peticion<UsuariosUniformes[]>('/Api/Usuarios/Uniformes/asignaciones', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),
}
