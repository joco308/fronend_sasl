/* ───── Error ───── */
export interface ErrorResponse {
  error?: string
  mensaje?: string
}

/* ───── Usuarios ───── */
export interface UsuarioLogin {
  correo: string
  password: string
}

export interface Login2FA {
  email: string
  codigoIngresado: string
}

export interface NuevoUsuario {
  NombreUsuario: string
  FechaNacimiento: string
  Correo: string
  IdRol: number
  IdEstadoCivil: number
  IdGradoAcademico: number
  IdGenero: number
  Calle: string
  IdZona: number
  NumeroCasa: number
  Contrasena: string
  IdPais: number
  CI: number
}

export interface EditarDireccion {
  CI: number
  Zona: number
  Calle: string
  NumeroCasa: number
}

export interface EditarRol {
  CI: number
  Rol: number
}

export interface UsuarioDatos {
  IdUsuario: number
  nombreUsuario: string
  ci: number
  correo: string
  rol: string
  salario: number
  creado: string
}

export interface DatosParaSubirDoc {
  IdUSer: number
  IdtipoDoc: number
  detalleTipoDoc: string
}

export interface AñadirCarrera {
  IdUsuario: number
  IdCarrera: number
  Carrera: string
}

export interface DocumentosUsuarioTipo {
  IdDoc: number
  nombre: string
  fechaSubido: string
  Idtipo: number
}

export interface VerInfoUsuario {
  Id: number
  estadocivil: string
  gradoacademico: string
  genero: string
  direccion: string
  rol: string
  pais: string
  correo: string
  ci: number
  nombre: string
  fechanacimiento: string
  servicioAsignado: boolean
  carreras: string[]
  telefonos: number[]
}

/* ───── Servicios ───── */
export interface AñadirServicio {
  IdCliente: number
  calle: string
  NumeroCasa: number
  IdZona: number
  IdTipoServicio: number
  Fechainicio: string
  FechaFinal?: string | null
  costo: number
  Descripcion: string
}

export interface ListarServicio {
  IdServicio: number
  cliente: string
  direccion: string
  tipoServicio: string
  fechaInicio: string
  fechaFinal?: string | null
  costo: number
}

export interface InfoServicio {
  IdServicio: number
  nombreEmpresa: string
  nombreCliente: string
  contacto?: string | null
  numeroCasa: number
  calle: string
  zona: string
  tipoServicio: string
  fechaInicio: string
  fechaFinal?: string | null
  Costo: number
  Descripcion?: string | null
  Create_at: string
}

export interface AsignarUsuariosServicios {
  IdUsuario: number
  IdServicio: number
  IdHorario: number
  IdDiasLaborales: number
  HoraDeEntrada?: string | null
  HoraDeSalida?: string | null
  DiasLaborales?: string | null
}

export interface AsignarMaquinariaServicios {
  IdServicio: number
  IdMaquinaria: number
  CantidadMaquinaria: number
  DescripcionMaquinaria: string
}

export interface AsignarRecursoServicios {
  IdServicio: number
  IdRecurso: number
  CantidadRecursos: number
}

export interface HorarioDTO {
  Idhorario: number
  HoraEntrada: string
  HoraSalida: string
}

export interface AddServicioTerminado {
  IdServicio: number
  IdSatidfaccion: number
  Comentarios: string
}

export interface ListarServicioTerminado {
  IdServicioTerminado: number
  nombreCliente: string
  nombreEmpresa?: string
  nomnreEmpresa?: string
}

export interface InfoServicioTerminado {
  IdServicioTerminado: number
  nombreCliente: string
  nombreEmpresa?: string
  nomnreEmpresa?: string
  Nit: number
  Direccion: string
  TipoServicio: string
  FechaInicio: string
  FechaFinal?: string | null
  Costo: number
  descripcion?: string | null
  Satisfaccion: string
  comentarios?: string | null
}

/* ───── Maquinaria ───── */
export interface ListarMaquinaria {
  idMaquinaria: number
  nombreMaquinaria: string
  codigoInventario: string
  tipoMaquinaria: string
}

export interface ProvedorInfo {
  nombre: string
  empresa: string
  nit: number
}

export interface MaquinariaMarca {
  nombreMarca: string
  pais: string
}

export interface InfoMaquinaria {
  idMaquinaria: number
  nombreMaquinaria: string
  codigoInventario: string
  provedor: ProvedorInfo
  tipoMaquinaria: string
  estadoCalidad: string
  marca: MaquinariaMarca
  descripcion?: string | null
}

export interface AgregarMaquinaria {
  NombreMaquinaria: string
  CodigoInventario: string
  IdProvedor: number
  TipoMaquinaria: number
  EstadoCalidad: number
  IdMarcaMaquinaria: number
  Descripcion: string
}

export interface AgregarMarcaMaquinaria {
  IdPais: number
  NombreMarca: string
}

export interface MostrarMarcas {
  idMarca: number
  pais: string
  nombreMarca: string
}

export interface Estado {
  idEstado: number
  estado: string
}

export interface InfoResumidaMaquinaria {
  nombreMAquinaria: string
  marca: string
  descripcion?: string | null
}

export interface AddMantenimientoMaquinaria {
  IdMaquinaria: number
  FechaMantenimiento: string
  Descripcion: string
  Costo: number
}

export interface InfoMantenimiento {
  idMantenimiento: number
  fechaMantenimiento: string
  descripcion?: string | null
  costo: number
  idMaquinaria: number
  nombreMaquinaria: string
}

export interface ListarMantenimiento {
  idMantenimiento: number
  costo: number
  nombreMaquinaria: string
}

/* ───── Recursos / Productos ───── */
export interface AñadirRecurso {
  IdProvedor: number
  IdTipo: number
  nombre: string
  Descripcion?: string | null
}

export interface ListarRecurso {
  IdRecurso: number
  NombreProvedor: string
  EmpresaProvedor: string
  tipo: string
  nombre: string
  descripcion?: string | null
}

export interface EditarNombre {
  IdRecurso: number
  nombre: string
}

export interface EditarDescripcion {
  IdRecurso: number
  Descripcion: string
}

/* ───── Proveedores ───── */
export interface ListarProveedores {
  id: number
  empresa: string
  nombre: string
  telefono: number[]
}

export interface InformacionProveedor {
  empresa: string
  productos?: IdmasNombre[] | null
  nit: number
  nombre: string
}

export interface AñadirProveedor {
  IDEmpresa: number
  NIT: number
  nombre: string
}

export interface AgregarTelefonoProveedor {
  Telefono: number
  idDetalle: number
  Detalle?: string | null
  IdProveedor: number
}

export interface IdmasNombre {
  Id: number
  norbre: string
}

/* ───── Trabajadores ───── */
export interface ListarRoles {
  Id: number
  nombre: string
  salario: number
}

export interface AñadirTelefonoTrabajadores {
  Telefono: number
  idUsuario: number
  idDetalle?: number | null
  Detalle?: string | null
}

/* ───── Reportes ───── */
export interface AddIncidente {
  Descripcion: string
  Fecha: string
}

export interface ListaIncidente {
  IdIncidente?: number
  idIncidente?: number
  NombreCliente?: string
  nombreCliente?: string
  Fecha?: string
}

export interface InfoIncidente {
  IdIncidente?: number
  idIncidente?: number
  NombreCliente?: string
  nombreCliente?: string
  Empresa?: string
  empresa?: string
  DireccionServicio?: string
  direccionServicio?: string
  ContectoEmergencia?: string | null
  contectoEmergencia?: string | null
  Telefonos?: TelefonosCliente[]
  telefonos?: TelefonosCliente[]
  TipoServicio?: string
  tipoServicio?: string
  descripcion?: string
  fecha?: string
}

export interface TelefonosCliente {
  Telefono?: number
  descripcion?: string
}

export interface AddMemorandum {
  IdTrabajador: number
  Descripcion: string
}

export interface MemorandoDatos {
  IdMemorial?: number
  idMemorial?: number
  NombreEmpleado?: string
  nombreEmpleado?: string
  Descripcion?: string
}

export interface EstadoMaquinaria {
  IdMaquinaria: number
  idEstadoCalidad: number
  descripcion?: string | null
}

export interface ListHistorialEstadoMaquinaria {
  idHistorial: number
  idMaquinaria: number
  nombreMaquinaria: string
  codigoINV: string
  estadoCalidad: string
  fechaCambio: string
  descripcion?: string | null
}

/* ───── Clientes ───── */
export interface ClienteLogin {
  correo: string
  contraseña: string
}

export interface Cliente2FA {
  correo: string
  Codigo: string
}

export interface InfoCliente {
  IdCliente: number
  Empresa: string
  nombreCliente: string
  Direccion: string
  correo?: string | null
  contraseña: string
  nit: number
}

export interface InfoClienteCorto {
  IdCliente: number
  nombreCliente: string
  nit: number
}

export interface AñadirCliente {
  nombreCliente: string
  calle: string
  ncasa: number
  correo: string
  contraseña: string
  nit: number
  idEmpresa?: number | null
  empresa?: string | null
  idZona?: number | null
  Zona?: string | null
}

/* ───── Cobros ───── */
export interface CrearCobro {
  IdServicio: number
  IDQr: number
  IdCliente: number
  DiaMesPagar: number
  Monto?: number | null
}

export interface ListarCobro {
  IdCobro: number
  NombreCliente: string
  NombreEmpresa?: string | null
  Monto?: number | null
  Vigente: boolean
  DiaMesPagar: number
}

export interface InfoQr {
  IDQr: number
  IdUsuario: number
  NombreUsuario: string
  FechaEmitida: string
  FechaExpiracion: string
  Descripcion?: string | null
}

export interface InfoCobro {
  IdCobro: number
  NombreCliente: string
  NombreEmpresa: string
  Monto?: number | null
  Vigente: boolean
  DiaMesPagar: number
  Nit: number
  TipoServicio: string
  InfoQrCobro?: InfoQr | null
}

export interface RegistrarPago {
  IdCobro: number
  Descripcion?: string | null
}

export interface ListarPago {
  IdPago: number
  FechaPago: string
  Descripcion?: string | null
}

export interface CrearQr {
  Descripcion: string
  ImgQr: string
  FechaExpiracionQr: string
}

export interface ListarQr {
  IdQr: number
  Descripcion?: string | null
  FechaEmitida: string
}

export interface PagoRealizado {
  IdCliente: number
  IdCobro: number
}

/* ───── Capacitaciones ───── */
export interface AñadirCapacitacion {
  Nombre: string
  Descripcion: string
  Fecha: string
}

export interface PonerUsuarioCapacitacion {
  IdUsuario: number
  IdCapacitacion: number
  Estado: string
}

export interface ListarCapacitaciones {
  IdCapacitacion: number
  Nombre: string
  Descripcion: string
  Fecha: string
  inscritos: number
}

export interface UsuarioInscrito {
  IdUsuario: number
  Nombre: string
  Estado: string
}

export interface InfoCapacitacion {
  IdCapacitacion: number
  Nombre: string
  Descripcion: string
  Fecha: string
  Inscritos: UsuarioInscrito[]
}

/* ───── Uniformes ───── */
export interface AñadirUniforme {
  NombreUniforme: string
  Talla: number
  Descripcion: string
}

export interface ListarUniformes {
  IdUniforme: number
  NombreUniforme: string
  Talla: number
  Descripcion: string
}

export interface AsignarUniformeEmpleado {
  IdUsuario: number
  IdUniforme: number
  FechaEntrega: string
  FechaDevolucion: string
  Estado: string
}

export interface UsuariosUniformes {
  IdAsignacionUniforme: number
  NombreEmpleado: string
  NombreUniforme: string
  Talla: number
  FechaEntrega: string
  FechaDevolucion: string | null
}

/* ───── Catálogos ───── */
export interface CatalogoDTO {
  id: number
  detalle: string
}
