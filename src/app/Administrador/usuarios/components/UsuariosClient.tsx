'use client'

import { useState, useCallback, useEffect } from 'react'
import { UsuariosService } from '@/lib/api/usuarios.service'
import { TrabajadoresService } from '@/lib/api/trabajadores.service'
import type {
  UsuarioDatos,
  CatalogoDTO,
  VerInfoUsuario,
  DocumentosUsuarioTipo,
  NuevoUsuario,
  EditarDireccion,
} from '@/lib/api/types'

/* ─── Props ─── */
interface Props {
  usuarios: UsuarioDatos[]
  roles: CatalogoDTO[]
  estadosCiviles: CatalogoDTO[]
  gradosAcademicos: CatalogoDTO[]
  generos: CatalogoDTO[]
  paises: CatalogoDTO[]
  zonas: CatalogoDTO[]
  carreras: CatalogoDTO[]
}

export default function UsuariosClient({
  usuarios: usuariosIniciales,
  roles,
  estadosCiviles,
  gradosAcademicos,
  generos,
  paises,
  zonas,
  carreras,
}: Props) {
  const [usuarios, setUsuarios] = useState(usuariosIniciales)
  const [usuarioSel, setUsuarioSel] = useState<UsuarioDatos | null>(null)
  const [infoDetalle, setInfoDetalle] = useState<VerInfoUsuario | null>(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)
  const [errorDetalle, setErrorDetalle] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')

  const [filtroServicio, setFiltroServicio] = useState<'todos' | 'con' | 'sin'>('todos')
  const [cargandoFiltro, setCargandoFiltro] = useState(false)

  const [modalCrear, setModalCrear] = useState(false)
  const [modalEditarRol, setModalEditarRol] = useState(false)
  const [modalEditarDir, setModalEditarDir] = useState(false)
  const [modalSubirDoc, setModalSubirDoc] = useState(false)
  const [modalVerDocs, setModalVerDocs] = useState(false)
  const [modalAgregarCarr, setModalAgregarCarr] = useState(false)
  const [modalAgregarTel, setModalAgregarTel] = useState(false)
  const [cargandoCSV, setCargandoCSV] = useState(false)

  function mostrarMensaje(msg: string) {
    setMensajeExito(msg)
    setTimeout(() => setMensajeExito(''), 4000)
  }

  const abrirDetalle = useCallback(async (u: UsuarioDatos) => {
    setUsuarioSel(u)
    setInfoDetalle(null)
    setErrorDetalle('')
    setCargandoDetalle(true)

    try {
      setInfoDetalle(await UsuariosService.infoCompleta(u.ci))
    } catch (err: unknown) {
      setErrorDetalle(err instanceof Error ? err.message : 'Error al cargar información del usuario.')
    }

    setCargandoDetalle(false)
  }, [])

  function cerrarDetalle() {
    setUsuarioSel(null)
    setInfoDetalle(null)
    setErrorDetalle('')
  }

  async function refrescarUsuarios() {
    try {
      setUsuarios(await UsuariosService.listar())
    } catch { /* silencio */ }
  }

  async function aplicarFiltro(tipo: 'todos' | 'con' | 'sin') {
    setFiltroServicio(tipo)
    if (tipo === 'todos') {
      await refrescarUsuarios()
      return
    }
    setCargandoFiltro(true)
    try {
      setUsuarios(await UsuariosService.listarFiltrados(tipo === 'con'))
    } catch { /* silencio */ }
    setCargandoFiltro(false)
  }

  async function exportarCSV() {
    setCargandoCSV(true)
    try {
      const blob = await TrabajadoresService.exportarCSV()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'trabajadores.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setErrorDetalle('Error al exportar CSV.')
    }
    setCargandoCSV(false)
  }

  return (
    <div className="flex gap-6">
      {/* columna principal */}
      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(['todos', 'con', 'sin'] as const).map((t) => (
              <button
                key={t}
                onClick={() => aplicarFiltro(t)}
                disabled={cargandoFiltro}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                  filtroServicio === t
                    ? 'border-navy-200 bg-navy-50 text-navy-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t === 'todos' ? 'Todos' : t === 'con' ? 'Con Servicio' : 'Sin Servicio'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setModalCrear(true)}
            className="rounded-xl bg-navy-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
          >
            + Nuevo Usuario
          </button>
          <button
            onClick={exportarCSV}
            disabled={cargandoCSV}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-navy-200 hover:bg-navy-50 hover:text-navy-700"
          >
            {cargandoCSV ? 'Exportando…' : 'Exportar CSV'}
          </button>
        </div>

        {mensajeExito && (
          <div className="rounded-xl border border-chuxna-dark/20 bg-chuxna-light px-4 py-3 text-sm font-medium text-chuxna-dark">
            {mensajeExito}
          </div>
        )}

        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['ID', 'Nombre', 'CI', 'Correo', 'Rol', 'Salario', 'Creado'].map((h) => (
                  <th key={h} className="px-5 py-3.5 font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((u, i) => (
                  <tr
                    key={`${u.idUsuario}-${i}`}
                    className={`cursor-pointer border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/50 ${
                      usuarioSel?.idUsuario === u.idUsuario ? 'bg-navy-50/50' : ''
                    }`}
                    onClick={() => abrirDetalle(u)}
                  >
                    <td className="px-5 py-3.5 text-gray-700">{u.idUsuario}</td>
                    <td className="px-5 py-3.5 font-medium text-navy-900">{u.nombreUsuario}</td>
                    <td className="px-5 py-3.5 text-gray-700">{u.ci ?? '-'}</td>
                    <td className="px-5 py-3.5 text-gray-700">{u.correo ?? '-'}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block rounded-full bg-navy-50 px-3 py-0.5 text-xs font-semibold text-navy-600">
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">
                      {u.salario != null ? `$${u.salario.toLocaleString('es-BO')}` : '-'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {u.creado ? new Date(u.creado).toLocaleDateString('es-BO') : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* panel lateral de detalle */}
      {usuarioSel && (
        <div className="w-80 shrink-0 space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="font-display text-sm font-bold text-navy-900">Detalle del Usuario</h3>
              <button onClick={cerrarDetalle} className="text-gray-400 hover:text-gray-600" aria-label="Cerrar">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5">
              {cargandoDetalle ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-navy-600 border-t-transparent" />
                </div>
              ) : errorDetalle ? (
                <p className="text-sm text-red-600">{errorDetalle}</p>
              ) : infoDetalle ? (
                <div className="space-y-3 text-sm">
                  <CampoInfo label="Nombre" valor={infoDetalle.nombre} />
                  <CampoInfo label="CI" valor={String(infoDetalle.ci)} />
                  <CampoInfo label="Correo" valor={infoDetalle.correo} />
                  <CampoInfo label="Rol" valor={infoDetalle.rol} />
                  <CampoInfo label="Dirección" valor={infoDetalle.direccion || '-'} />
                  <CampoInfo label="Estado Civil" valor={infoDetalle.estadocivil} />
                  <CampoInfo label="Grado Académico" valor={infoDetalle.gradoacademico} />
                  <CampoInfo label="Género" valor={infoDetalle.genero} />
                  <CampoInfo label="País" valor={infoDetalle.pais} />
                  <CampoInfo
                    label="Fecha Nacimiento"
                    valor={infoDetalle.fechanacimiento ? new Date(infoDetalle.fechanacimiento).toLocaleDateString('es-BO') : '-'}
                  />
                  <CampoInfo label="Servicio Asignado" valor={infoDetalle.servicioAsignado ? 'Sí' : 'No'} />
                  {infoDetalle.carreras.length > 0 && (
                    <CampoInfo label="Carreras" valor={infoDetalle.carreras.join(', ')} />
                  )}
                  {infoDetalle.telefonos.length > 0 && (
                    <CampoInfo label="Teléfonos" valor={infoDetalle.telefonos.join(', ')} />
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Acciones</h4>
            <div className="flex flex-col gap-2">
              <BotonAccion label="Editar Rol" onClick={() => setModalEditarRol(true)} />
              <BotonAccion label="Editar Dirección" onClick={() => setModalEditarDir(true)} />
              <BotonAccion label="Subir Documento" onClick={() => setModalSubirDoc(true)} />
              <BotonAccion label="Ver Documentos" onClick={() => setModalVerDocs(true)} />
              <BotonAccion label="Agregar Teléfono" onClick={() => setModalAgregarTel(true)} />
              <BotonAccion label="Agregar Carrera" onClick={() => setModalAgregarCarr(true)} />
            </div>
          </div>
        </div>
      )}

      {/* ─── Modales ─── */}
      {modalCrear && (
        <ModalCrearUsuario
          roles={roles}
          estadosCiviles={estadosCiviles}
          gradosAcademicos={gradosAcademicos}
          generos={generos}
          paises={paises}
          zonas={zonas}
          cerrar={() => setModalCrear(false)}
          onCreado={async () => {
            setModalCrear(false)
            mostrarMensaje('Usuario creado correctamente.')
            await refrescarUsuarios()
          }}
        />
      )}

      {modalEditarRol && infoDetalle && (
        <ModalEditarRol
          ci={infoDetalle.ci}
          cerrar={() => setModalEditarRol(false)}
          onEditado={async () => {
            setModalEditarRol(false)
            mostrarMensaje('Rol actualizado correctamente.')
            abrirDetalle(usuarioSel!)
            await refrescarUsuarios()
          }}
        />
      )}

      {modalEditarDir && infoDetalle && (
        <ModalEditarDireccion
          ci={infoDetalle.ci}
          zonas={zonas}
          cerrar={() => setModalEditarDir(false)}
          onEditado={async () => {
            setModalEditarDir(false)
            mostrarMensaje('Dirección actualizada correctamente.')
            abrirDetalle(usuarioSel!)
          }}
        />
      )}

      {modalSubirDoc && (
        <ModalSubirDocumento
          idUsuario={usuarioSel!.idUsuario}
          cerrar={() => setModalSubirDoc(false)}
          onSubido={async () => {
            setModalSubirDoc(false)
            mostrarMensaje('Documento subido correctamente.')
            if (usuarioSel) abrirDetalle(usuarioSel)
          }}
        />
      )}

      {modalVerDocs && (
        <ModalVerDocumentos
          idUsuario={usuarioSel!.idUsuario}
          cerrar={() => setModalVerDocs(false)}
        />
      )}

      {modalAgregarTel && infoDetalle && (
        <ModalAgregarTelefono
          idUsuario={usuarioSel!.idUsuario}
          cerrar={() => setModalAgregarTel(false)}
          onAgregado={async () => {
            setModalAgregarTel(false)
            mostrarMensaje('Teléfono agregado correctamente.')
            if (usuarioSel) abrirDetalle(usuarioSel)
          }}
        />
      )}

      {modalAgregarCarr && (
        <ModalAgregarCarrera
          idUsuario={usuarioSel!.idUsuario}
          carreras={carreras}
          cerrar={() => setModalAgregarCarr(false)}
          onAgregado={async () => {
            setModalAgregarCarr(false)
            mostrarMensaje('Carrera agregada correctamente.')
          }}
        />
      )}
    </div>
  )
}

/* ─── Subcomponentes ─── */

function CampoInfo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</span>
      <p className="text-gray-700">{valor}</p>
    </div>
  )
}

function BotonAccion({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-gray-200 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:border-navy-200 hover:bg-navy-50 hover:text-navy-700"
    >
      {label}
    </button>
  )
}

function Overlay({ cerrar, children }: { cerrar: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) cerrar() }}
    >
      {children}
    </div>
  )
}

/* ─── Modal: Crear Usuario ─── */
function ModalCrearUsuario({
  roles: r,
  estadosCiviles: ec,
  gradosAcademicos: ga,
  generos: g,
  paises: p,
  zonas: z,
  cerrar,
  onCreado,
}: {
  roles: CatalogoDTO[]
  estadosCiviles: CatalogoDTO[]
  gradosAcademicos: CatalogoDTO[]
  generos: CatalogoDTO[]
  paises: CatalogoDTO[]
  zonas: CatalogoDTO[]
  cerrar: () => void
  onCreado: () => Promise<void>
}) {
  const [form, setForm] = useState<NuevoUsuario>({
    NombreUsuario: '',
    FechaNacimiento: '',
    Correo: '',
    IdRol: 0,
    IdEstadoCivil: 0,
    IdGradoAcademico: 0,
    IdGenero: 0,
    Calle: '',
    idZona: 0,
    NumeroCasa: 0,
    Contrasena: '',
    idPais: 0,
    CI: 0,
  })
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      await UsuariosService.crear(form)
      await onCreado()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <Overlay cerrar={cerrar}>
      <form onSubmit={handleSubmit} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <CabeceraModal titulo="Nuevo Usuario" cerrar={cerrar} />
        {error && <ErrorBanner msg={error} />}
        <div className="grid grid-cols-2 gap-4">
          <Campo id="nombre" label="Nombre" value={form.NombreUsuario} onChange={(v) => setForm({ ...form, NombreUsuario: v })} />
          <Campo id="ci" label="CI" type="number" value={String(form.CI)} onChange={(v) => setForm({ ...form, CI: Number(v) })} />
          <Campo id="fechaNac" label="Fecha Nacimiento" type="date" value={form.FechaNacimiento} onChange={(v) => setForm({ ...form, FechaNacimiento: v })} />
          <Campo id="correo" label="Correo" type="email" value={form.Correo} onChange={(v) => setForm({ ...form, Correo: v })} />
          <Campo id="pass" label="Contraseña" type="password" value={form.Contrasena} onChange={(v) => setForm({ ...form, Contrasena: v })} />
          <Select id="rol" label="Rol" value={form.IdRol} opciones={r} onChange={(v) => setForm({ ...form, IdRol: v })} />
          <Select id="estadoCivil" label="Estado Civil" value={form.IdEstadoCivil} opciones={ec} onChange={(v) => setForm({ ...form, IdEstadoCivil: v })} />
          <Select id="gradoAcad" label="Grado Académico" value={form.IdGradoAcademico} opciones={ga} onChange={(v) => setForm({ ...form, IdGradoAcademico: v })} />
          <Select id="genero" label="Género" value={form.IdGenero} opciones={g} onChange={(v) => setForm({ ...form, IdGenero: v })} />
          <Select id="pais" label="País" value={form.idPais} opciones={p} onChange={(v) => setForm({ ...form, idPais: v })} />
          <Select id="zona" label="Zona" value={form.idZona} opciones={z} onChange={(v) => setForm({ ...form, idZona: v })} />
          <Campo id="calle" label="Calle" value={form.Calle} onChange={(v) => setForm({ ...form, Calle: v })} />
          <Campo id="numCasa" label="Número Casa" type="number" value={String(form.NumeroCasa)} onChange={(v) => setForm({ ...form, NumeroCasa: Number(v) })} />
        </div>
        <BotonesModal cargando={cargando} cerrar={cerrar} />
      </form>
    </Overlay>
  )
}

/* ─── Modal: Editar Rol ─── */
function ModalEditarRol({
  ci,
  cerrar,
  onEditado,
}: {
  ci: number
  cerrar: () => void
  onEditado: () => Promise<void>
}) {
  const [rolId, setRolId] = useState(0)
  const [roles, setRoles] = useState<CatalogoDTO[]>([])
  const [cargandoLista, setCargandoLista] = useState(true)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    TrabajadoresService.listarRoles()
      .then((data) => setRoles(data.map((r) => ({ Id: r.id, Detalle: r.nombre }))))
      .catch(() => setError('No se pudieron cargar los roles.'))
      .finally(() => setCargandoLista(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rolId === 0) { setError('Selecciona un rol.'); return }
    setCargando(true)
    setError('')
    try {
      await UsuariosService.editarRol(ci, { CI: ci, Rol: rolId })
      await onEditado()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al editar rol.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <Overlay cerrar={cerrar}>
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <CabeceraModal titulo="Editar Rol" cerrar={cerrar} />
        {error && <ErrorBanner msg={error} />}
        {cargandoLista ? (
          <div className="flex justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-navy-600 border-t-transparent" />
          </div>
        ) : (
          <SelectSimple label="Nuevo Rol" value={rolId} opciones={roles} onChange={setRolId} />
        )}
        <BotonesModal cargando={cargando} cerrar={cerrar} />
      </form>
    </Overlay>
  )
}

/* ─── Modal: Editar Dirección ─── */
function ModalEditarDireccion({
  ci,
  zonas,
  cerrar,
  onEditado,
}: {
  ci: number
  zonas: CatalogoDTO[]
  cerrar: () => void
  onEditado: () => Promise<void>
}) {
  const [form, setForm] = useState<EditarDireccion>({ CI: ci, Zona: 0, Calle: '', NumeroCasa: 0 })
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.Zona === 0 || !form.Calle) { setError('Completa todos los campos.'); return }
    setCargando(true)
    setError('')
    try {
      await UsuariosService.editarDireccion(ci, form)
      await onEditado()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al editar dirección.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <Overlay cerrar={cerrar}>
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <CabeceraModal titulo="Editar Dirección" cerrar={cerrar} />
        {error && <ErrorBanner msg={error} />}
        <div className="space-y-4">
          <SelectSimple label="Zona" value={form.Zona} opciones={zonas} onChange={(v) => setForm({ ...form, Zona: v })} />
          <Campo id="dirCalle" label="Calle" value={form.Calle} onChange={(v) => setForm({ ...form, Calle: v })} />
          <Campo id="dirNum" label="Número Casa" type="number" value={String(form.NumeroCasa)} onChange={(v) => setForm({ ...form, NumeroCasa: Number(v) })} />
        </div>
        <BotonesModal cargando={cargando} cerrar={cerrar} />
      </form>
    </Overlay>
  )
}

/* ─── Modal: Subir Documento ─── */
function ModalSubirDocumento({
  idUsuario,
  cerrar,
  onSubido,
}: {
  idUsuario: number
  cerrar: () => void
  onSubido: () => Promise<void>
}) {
  const [tipoDocId, setTipoDocId] = useState(0)
  const [archivo, setArchivo] = useState<File | null>(null)
  const [tiposDocumento, setTiposDocumento] = useState<CatalogoDTO[]>([])
  const [cargandoLista, setCargandoLista] = useState(true)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    import('@/lib/api/catalogos.service').then(({ CatalogosService }) =>
        CatalogosService.obtener('Tipo Documento')
        .then((data) => setTiposDocumento(data as CatalogoDTO[]))
        .catch(() => setError('No se pudieron cargar los tipos de documento.'))
        .finally(() => setCargandoLista(false))
    )
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (tipoDocId === 0) { setError('Selecciona un tipo de documento.'); return }
    if (!archivo) { setError('Selecciona un archivo.'); return }
    setCargando(true)
    setError('')
    try {
      const tipoDoc = tiposDocumento.find((t) => valorId(t) === tipoDocId)
      await UsuariosService.subirArchivo(
        { idUSer: idUsuario, idtipoDoc: tipoDocId, detalleTipoDoc: tipoDoc ? valorDetalle(tipoDoc) : '' },
        archivo,
      )
      await onSubido()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al subir documento.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <Overlay cerrar={cerrar}>
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <CabeceraModal titulo="Subir Documento" cerrar={cerrar} />
        {error && <ErrorBanner msg={error} />}
        <div className="space-y-4">
          {cargandoLista ? (
            <div className="flex justify-center py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-navy-600 border-t-transparent" />
            </div>
          ) : (
            <SelectSimple label="Tipo de Documento" value={tipoDocId} opciones={tiposDocumento} onChange={setTipoDocId} />
          )}
          <div className="input-group">
            <label>Archivo</label>
            <input
              type="file"
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-navy-700 hover:file:bg-navy-100"
            />
          </div>
        </div>
        <BotonesModal cargando={cargando} cerrar={cerrar} />
      </form>
    </Overlay>
  )
}

/* ─── Modal: Ver Documentos ─── */
function ModalVerDocumentos({
  idUsuario,
  cerrar,
}: {
  idUsuario: number
  cerrar: () => void
}) {
  const [tipoDocId, setTipoDocId] = useState(0)
  const [tiposDocumento, setTiposDocumento] = useState<CatalogoDTO[]>([])
  const [documentos, setDocumentos] = useState<DocumentosUsuarioTipo[]>([])
  const [cargandoLista, setCargandoLista] = useState(true)
  const [cargandoDocs, setCargandoDocs] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [cargandoPreview, setCargandoPreview] = useState(false)

  const cargarDocumentos = useCallback((id: number, tipo: number) => {
    if (tipo === 0) { setDocumentos([]); return }
    setCargandoDocs(true)
    UsuariosService.listarDocumentos(id, tipo)
      .then(setDocumentos)
      .catch(() => setError('Error al cargar documentos.'))
      .finally(() => setCargandoDocs(false))
  }, [])

  useEffect(() => {
    import('@/lib/api/catalogos.service').then(({ CatalogosService }) =>
        CatalogosService.obtener('Tipo Documento')
        .then((data) => setTiposDocumento(data as CatalogoDTO[]))
        .catch(() => setError('No se pudieron cargar los tipos de documento.'))
        .finally(() => setCargandoLista(false))
    )
  }, [])

  if (previewUrl) {
    return (
      <Overlay cerrar={cerrar}>
        <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <button
              onClick={() => { URL.revokeObjectURL(previewUrl); setPreviewUrl('') }}
              className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              ← Volver
            </button>
            <button onClick={() => { URL.revokeObjectURL(previewUrl); cerrar() }} className="text-gray-400 hover:text-gray-600" aria-label="Cerrar">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <embed src={previewUrl} type="application/pdf" className="min-h-0 flex-1 rounded-xl border border-gray-200" />
        </div>
      </Overlay>
    )
  }

  return (
    <Overlay cerrar={cerrar}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <CabeceraModal titulo="Ver Documentos" cerrar={cerrar} />
        {error && <ErrorBanner msg={error} />}
        {cargandoLista ? (
          <div className="flex justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-navy-600 border-t-transparent" />
          </div>
        ) : (
          <SelectSimple label="Tipo de Documento" value={tipoDocId} opciones={tiposDocumento} onChange={(v) => { setTipoDocId(v); cargarDocumentos(idUsuario, v) }} />
        )}
        {cargandoDocs ? (
          <div className="mt-4 flex justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-navy-600 border-t-transparent" />
          </div>
        ) : documentos.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {documentos.map((d) => (
              <li key={d.idDoc} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-700">{d.nombre}</p>
                  <p className="text-xs text-gray-400">{new Date(d.fechaSubido).toLocaleDateString('es-BO')}</p>
                </div>
                <button
                  onClick={async () => {
                    setCargandoPreview(true)
                    try {
                      const blob = await UsuariosService.verArchivo(d.idDoc)
                      setPreviewUrl(URL.createObjectURL(blob))
                    } catch { /* silencio */ }
                    setCargandoPreview(false)
                  }}
                  disabled={cargandoPreview}
                  className="ml-3 shrink-0 rounded-lg bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:bg-navy-100 disabled:opacity-50"
                >
                  {cargandoPreview ? 'Cargando...' : 'Ver'}
                </button>
              </li>
            ))}
          </ul>
        ) : tipoDocId !== 0 ? (
          <p className="mt-4 text-center text-sm text-gray-400">No hay documentos de este tipo.</p>
        ) : null}
      </div>
    </Overlay>
  )
}

/* ─── Modal: Agregar Teléfono ─── */
function ModalAgregarTelefono({
  idUsuario,
  cerrar,
  onAgregado,
}: {
  idUsuario: number
  cerrar: () => void
  onAgregado: () => Promise<void>
}) {
  const [telefono, setTelefono] = useState('')
  const [detalleId, setDetalleId] = useState(0)
  const [detalleTexto, setDetalleTexto] = useState('')
  const [detallesCatalogo, setDetallesCatalogo] = useState<CatalogoDTO[]>([])
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true)
  const [usarTexto, setUsarTexto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    import('@/lib/api/catalogos.service').then(({ CatalogosService }) =>
        CatalogosService.obtener('Tipo Telefono')
        .then((data) => setDetallesCatalogo(data as CatalogoDTO[]))
        .catch(() => setError('No se pudieron cargar los detalles de teléfono.'))
        .finally(() => setCargandoCatalogo(false))
    )
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!telefono) return
    setGuardando(true)
    setError('')
    try {
      await TrabajadoresService.agregarTelefono({
        telefono: Number(telefono),
        idUsuario,
        idDetalle: usarTexto || detalleId === 0 ? null : detalleId,
        Detalle: usarTexto ? detalleTexto : null,
      })
      await onAgregado()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al agregar teléfono.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Overlay cerrar={cerrar}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <CabeceraModal titulo="Agregar Teléfono" cerrar={cerrar} />
        {error && <ErrorBanner msg={error} />}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Campo id="telNum" label="Teléfono" type="number" value={telefono} onChange={setTelefono} />
          {cargandoCatalogo ? (
            <div className="flex justify-center py-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-navy-600 border-t-transparent" />
            </div>
          ) : usarTexto ? (
            <Campo id="telDetText" label="Detalle (escribir)" value={detalleTexto} onChange={setDetalleTexto} />
          ) : (
            <SelectSimple label="Detalle" value={detalleId} opciones={detallesCatalogo} onChange={setDetalleId} />
          )}
          <button type="button" onClick={() => setUsarTexto(!usarTexto)} className="text-xs text-navy-600 hover:underline">
            {usarTexto ? 'Seleccionar del catálogo' : 'Escribir otro detalle'}
          </button>
          <BotonesModal cargando={guardando} cerrar={cerrar} />
        </form>
      </div>
    </Overlay>
  )
}

/* ─── Modal: Agregar Carrera ─── */
function ModalAgregarCarrera({
  idUsuario,
  carreras,
  cerrar,
  onAgregado,
}: {
  idUsuario: number
  carreras: CatalogoDTO[]
  cerrar: () => void
  onAgregado: () => Promise<void>
}) {
  const [carreraId, setCarreraId] = useState(0)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (carreraId === 0) { setError('Selecciona una carrera.'); return }
    setCargando(true)
    setError('')
    try {
      const carrera = carreras.find((c) => c.Id === carreraId)
      await UsuariosService.agregarCarrera({
        idUsuario,
        idCarrera: carreraId,
        Carrera: carrera?.Detalle ?? '',
      })
      await onAgregado()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al agregar carrera.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <Overlay cerrar={cerrar}>
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <CabeceraModal titulo="Agregar Carrera" cerrar={cerrar} />
        {error && <ErrorBanner msg={error} />}
        <SelectSimple label="Carrera" value={carreraId} opciones={carreras} onChange={setCarreraId} />
        <BotonesModal cargando={cargando} cerrar={cerrar} />
      </form>
    </Overlay>
  )
}

/* ─── Helpers UI ─── */
function CabeceraModal({ titulo, cerrar }: { titulo: string; cerrar: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-display text-lg font-bold text-navy-900">{titulo}</h3>
      <button type="button" onClick={cerrar} className="text-gray-400 hover:text-gray-600" aria-label="Cerrar">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {msg}
    </div>
  )
}

function BotonesModal({ cargando, cerrar }: { cargando: boolean; cerrar: () => void }) {
  return (
    <div className="mt-6 flex justify-end gap-3">
      <button
        type="button"
        onClick={cerrar}
        className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={cargando}
        className="rounded-xl bg-navy-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700 disabled:opacity-60"
      >
        {cargando ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  )
}

function Campo({ id, label, type = 'text', value, onChange }: {
  id: string; label: string; type?: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
      />
    </div>
  )
}

function valorId(o: CatalogoDTO): number {
  const v = o as unknown as Record<string, unknown>
  return (v.Id ?? v.id ?? v.idSubDominio ?? 0) as number
}
function valorDetalle(o: CatalogoDTO): string {
  const v = o as unknown as Record<string, unknown>
  return (v.Detalle ?? v.detalle ?? v.nombre ?? v.Nombre ?? v.Dominio1 ?? '') as string
}

function Select({ id, label, value, opciones, onChange }: {
  id: string; label: string; value: number; opciones: CatalogoDTO[]; onChange: (v: number) => void
}) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-black outline-none transition-colors focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
      >
        <option value={0}>Seleccionar...</option>
        {opciones.map((o, i) => (
          <option key={`${valorId(o)}-${i}`} value={valorId(o)}>{valorDetalle(o)}</option>
        ))}
      </select>
    </div>
  )
}

function SelectSimple({ label, value, opciones, onChange }: {
  label: string; value: number; opciones: CatalogoDTO[]; onChange: (v: number) => void
}) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-black outline-none transition-colors focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
      >
        <option value={0}>Seleccionar...</option>
        {opciones.map((o, i) => (
          <option key={`${valorId(o)}-${i}`} value={valorId(o)}>{valorDetalle(o)}</option>
        ))}
      </select>
    </div>
  )
}
