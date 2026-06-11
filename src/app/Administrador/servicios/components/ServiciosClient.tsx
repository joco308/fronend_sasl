'use client'

import { useState, useCallback, useRef } from 'react'
import { ServiciosService } from '@/lib/api/servicios.service'
import { ClientesService } from '@/lib/api/clientes.service'
import { CatalogosService } from '@/lib/api/catalogos.service'
import { UsuariosService } from '@/lib/api/usuarios.service'
import { MaquinariaService } from '@/lib/api/maquinaria.service'
import { ProductosService } from '@/lib/api/productos.service'
import TablaGenerica from '../../components/TablaGenerica'
import type {
  ListarServicio, InfoServicio, InfoClienteCorto, CatalogoDTO,
  ListarServicioTerminado, InfoServicioTerminado,
  HorarioDTO, UsuarioDatos, ListarMaquinaria, ListarRecurso,
} from '@/lib/api/types'

interface Props {
  servicios: ListarServicio[]
}

export default function ServiciosClient({ servicios: datosIniciales }: Props) {
  const [tab, setTab] = useState<'activos' | 'terminados'>('activos')

  const [datos, setDatos] = useState(datosIniciales)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')

  const [servicioSel, setServicioSel] = useState<ListarServicio | null>(null)
  const [infoDetalle, setInfoDetalle] = useState<InfoServicio | null>(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)

  const [datosTerminados, setDatosTerminados] = useState<ListarServicioTerminado[] | null>(null)
  const [cargandoTerminados, setCargandoTerminados] = useState(false)
  const [terminadoSel, setTerminadoSel] = useState<ListarServicioTerminado | null>(null)
  const [infoTerminadoDetalle, setInfoTerminadoDetalle] = useState<InfoServicioTerminado | null>(null)
  const [cargandoTerminadoDetalle, setCargandoTerminadoDetalle] = useState(false)
  const yaCargoTerminados = useRef(false)

  const [modalCrear, setModalCrear] = useState(false)
  const [clientes, setClientes] = useState<InfoClienteCorto[]>([])
  const [zonas, setZonas] = useState<CatalogoDTO[]>([])
  const [tiposServicio, setTiposServicio] = useState<CatalogoDTO[]>([])
  const [cargandoCatalogs, setCargandoCatalogs] = useState(false)

  const [modalTerminado, setModalTerminado] = useState(false)
  const [satisfacciones, setSatisfacciones] = useState<CatalogoDTO[]>([])

  const [modalAsignarEmpleado, setModalAsignarEmpleado] = useState(false)
  const [usuarios, setUsuarios] = useState<UsuarioDatos[]>([])
  const [horarios, setHorarios] = useState<HorarioDTO[]>([])
  const [diasLaborales, setDiasLaborales] = useState<CatalogoDTO[]>([])

  const [modalAsignarMaquinaria, setModalAsignarMaquinaria] = useState(false)
  const [maquinarias, setMaquinarias] = useState<ListarMaquinaria[]>([])

  const [modalAsignarRecurso, setModalAsignarRecurso] = useState(false)
  const [recursos, setRecursos] = useState<ListarRecurso[]>([])

  async function abrirModalCrear() {
    setModalCrear(true)
    setCargandoCatalogs(true)
    try {
      const [listaClientes, listaZonas, listaTipos] = await Promise.all([
        ClientesService.listar(),
        CatalogosService.obtener('zonas'),
        CatalogosService.obtener('Tipo Servicio'),
      ])
      setClientes(listaClientes)
      setZonas(listaZonas)
      setTiposServicio(listaTipos)
    } catch {
      setError('Error al cargar datos.')
    } finally {
      setCargandoCatalogs(false)
    }
  }

  async function exportarCSV() {
    try {
      const blob = await ServiciosService.exportarCSV()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'servicios.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      setError('Error al exportar CSV.')
    }
  }

  const verDetalle = useCallback(async (s: ListarServicio) => {
    setServicioSel(s)
    setTerminadoSel(null)
    setInfoTerminadoDetalle(null)
    setCargandoDetalle(true)
    setError('')
    try {
      const info = await ServiciosService.info(s.idServicio)
      setInfoDetalle(info)
    } catch {
      setError('Error al cargar detalle del servicio.')
    } finally {
      setCargandoDetalle(false)
    }
  }, [])

  const verDetalleTerminado = useCallback(async (t: ListarServicioTerminado) => {
    setTerminadoSel(t)
    setServicioSel(null)
    setInfoDetalle(null)
    setCargandoTerminadoDetalle(true)
    setError('')
    try {
      const info = await ServiciosService.infoTerminado(t.idServicioTerminado)
      setInfoTerminadoDetalle(info)
    } catch {
      setError('Error al cargar detalle del servicio terminado.')
    } finally {
      setCargandoTerminadoDetalle(false)
    }
  }, [])

  const refrescar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const nuevos = await ServiciosService.listar()
      setDatos(nuevos)
    } catch {
      setError('Error al recargar servicios.')
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarTerminados = useCallback(async () => {
    setCargandoTerminados(true)
    setError('')
    try {
      const lista = await ServiciosService.listarTerminados()
      setDatosTerminados(lista)
      yaCargoTerminados.current = true
    } catch {
      setError('Error al cargar servicios terminados.')
    } finally {
      setCargandoTerminados(false)
    }
  }, [])

  function cambiarTab(nuevo: 'activos' | 'terminados') {
    setTab(nuevo)
    setServicioSel(null)
    setInfoDetalle(null)
    setTerminadoSel(null)
    setInfoTerminadoDetalle(null)
    if (nuevo === 'terminados' && !yaCargoTerminados.current) {
      cargarTerminados()
    }
  }

  async function abrirModalTerminado() {
    setModalTerminado(true)
    try {
      const listaSat = await CatalogosService.obtener('satisfaccion')
      setSatisfacciones(listaSat)
    } catch {
      setSatisfacciones([])
    }
  }

  async function abrirModalAsignarEmpleado() {
    setModalAsignarEmpleado(true)
    try {
      const [listaUsuarios, listaHorarios, listaDias] = await Promise.all([
        UsuariosService.listar(),
        ServiciosService.horarios(),
        CatalogosService.obtener('Dias Laborales'),
      ])
      setUsuarios(listaUsuarios)
      setHorarios(listaHorarios)
      setDiasLaborales(listaDias)
    } catch {
      setError('Error al cargar datos para asignación.')
    }
  }

  async function abrirModalAsignarMaquinaria() {
    setModalAsignarMaquinaria(true)
    try {
      const lista = await MaquinariaService.listar()
      setMaquinarias(lista)
    } catch {
      setError('Error al cargar maquinaria.')
    }
  }

  async function abrirModalAsignarRecurso() {
    setModalAsignarRecurso(true)
    try {
      const lista = await ProductosService.listar()
      setRecursos(lista)
    } catch {
      setError('Error al cargar recursos.')
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {mensajeExito && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{mensajeExito}</div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => cambiarTab('activos')}
            className={`text-sm font-semibold transition-colors ${
              tab === 'activos'
                ? 'text-navy-900 underline decoration-chuxna decoration-2 underline-offset-4'
                : 'text-gray-400 hover:text-navy-600'
            }`}
          >
            Activos
          </button>
          <button
            onClick={() => cambiarTab('terminados')}
            className={`text-sm font-semibold transition-colors ${
              tab === 'terminados'
                ? 'text-navy-900 underline decoration-chuxna decoration-2 underline-offset-4'
                : 'text-gray-400 hover:text-navy-600'
            }`}
          >
            Terminados
          </button>
        </div>
        <div className="flex gap-2">
          {tab === 'activos' && (
            <>
              <button
                onClick={abrirModalCrear}
                className="rounded-xl bg-chuxna px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark"
              >
                + Nuevo Servicio
              </button>
              <button
                onClick={exportarCSV}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Exportar CSV
              </button>
            </>
          )}
        </div>
      </div>

      {tab === 'activos' && (
        <>
          <p className="text-sm text-gray-500">
            {cargando ? 'Cargando...' : `${datos.length} servicio(s) activo(s)`}
          </p>
          <TablaGenerica
            columnas={[
              { key: 'idServicio', header: 'ID' },
              { key: 'cliente', header: 'Cliente' },
              { key: 'direccion', header: 'Dirección' },
              { key: 'tipoServicio', header: 'Tipo' },
              { key: 'fechaInicio', header: 'Inicio' },
              { key: 'fechaFinal', header: 'Fin' },
              { key: 'costo', header: 'Costo' },
            ]}
            datos={datos}
            keyExtractor={(s) => s.idServicio}
            onRowClick={verDetalle}
          />
        </>
      )}

      {tab === 'terminados' && (
        <>
          <p className="text-sm text-gray-500">
            {cargandoTerminados
              ? 'Cargando...'
              : `${datosTerminados?.length ?? 0} servicio(s) terminado(s)`}
          </p>
          {datosTerminados === null && !cargandoTerminados ? (
            <button onClick={cargarTerminados} className="text-sm text-chuxna underline">
              Cargar servicios terminados
            </button>
          ) : (
            <TablaGenerica
              columnas={[
                { key: 'idServicioTerminado', header: 'ID' },
                { key: 'nombreCliente', header: 'Cliente' },
                { key: 'nombreEmpresa', header: 'Empresa', render: (t) => empresaTexto(t) },
              ]}
              datos={datosTerminados ?? []}
              keyExtractor={(t) => t.idServicioTerminado}
              onRowClick={verDetalleTerminado}
            />
          )}
        </>
      )}

      {servicioSel && infoDetalle && !cargandoDetalle && (
        <DetalleServicio
          info={infoDetalle}
          onCerrar={() => { setServicioSel(null); setInfoDetalle(null) }}
          onMarcarTerminado={abrirModalTerminado}
          onAsignarEmpleado={abrirModalAsignarEmpleado}
          onAsignarMaquinaria={abrirModalAsignarMaquinaria}
          onAsignarRecurso={abrirModalAsignarRecurso}
        />
      )}

      {terminadoSel && infoTerminadoDetalle && !cargandoTerminadoDetalle && (
        <DetalleServicioTerminado
          info={infoTerminadoDetalle}
          onCerrar={() => { setTerminadoSel(null); setInfoTerminadoDetalle(null) }}
        />
      )}

      {modalCrear && (
        <ModalCrearServicio
          clientes={clientes}
          zonas={zonas}
          tiposServicio={tiposServicio}
          cargandoCatalogs={cargandoCatalogs}
          onCerrar={() => setModalCrear(false)}
          onCreado={() => {
            setModalCrear(false)
            setMensajeExito('Servicio creado correctamente.')
            refrescar()
          }}
          onError={(msg) => setError(msg)}
        />
      )}

      {modalTerminado && servicioSel && (
        <ModalMarcarTerminado
          idServicio={servicioSel.idServicio}
          satisfacciones={satisfacciones}
          onCerrar={() => setModalTerminado(false)}
          onTerminado={() => {
            setModalTerminado(false)
            setServicioSel(null)
            setInfoDetalle(null)
            setMensajeExito('Servicio marcado como terminado.')
            refrescar()
            yaCargoTerminados.current = false
          }}
          onError={(msg) => setError(msg)}
        />
      )}

      {modalAsignarEmpleado && servicioSel && (
        <ModalAsignarEmpleado
          idServicio={servicioSel.idServicio}
          usuarios={usuarios}
          horarios={horarios}
          diasLaborales={diasLaborales}
          onCerrar={() => setModalAsignarEmpleado(false)}
          onAsignado={() => {
            setModalAsignarEmpleado(false)
            setMensajeExito('Empleado asignado correctamente.')
          }}
          onError={(msg) => setError(msg)}
        />
      )}

      {modalAsignarMaquinaria && servicioSel && (
        <ModalAsignarMaquinaria
          idServicio={servicioSel.idServicio}
          maquinarias={maquinarias}
          onCerrar={() => setModalAsignarMaquinaria(false)}
          onAsignado={() => {
            setModalAsignarMaquinaria(false)
            setMensajeExito('Maquinaria asignada correctamente.')
          }}
          onError={(msg) => setError(msg)}
        />
      )}

      {modalAsignarRecurso && servicioSel && (
        <ModalAsignarRecurso
          idServicio={servicioSel.idServicio}
          recursos={recursos}
          onCerrar={() => setModalAsignarRecurso(false)}
          onAsignado={() => {
            setModalAsignarRecurso(false)
            setMensajeExito('Recurso asignado correctamente.')
          }}
          onError={(msg) => setError(msg)}
        />
      )}
    </div>
  )
}

function DetalleServicio({
  info, onCerrar,
  onMarcarTerminado, onAsignarEmpleado, onAsignarMaquinaria, onAsignarRecurso,
}: {
  info: InfoServicio
  onCerrar: () => void
  onMarcarTerminado: () => void
  onAsignarEmpleado: () => void
  onAsignarMaquinaria: () => void
  onAsignarRecurso: () => void
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-navy-900">Detalle del Servicio</h3>
        <button onClick={onCerrar} className="text-sm text-gray-400 hover:text-gray-600">Cerrar</button>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><span className="font-semibold text-gray-500">ID:</span> {info.idServicio}</div>
        <div><span className="font-semibold text-gray-500">Empresa:</span> {info.nombreEmpresa ?? '-'}</div>
        <div><span className="font-semibold text-gray-500">Cliente:</span> {info.nombreCliente ?? '-'}</div>
        <div><span className="font-semibold text-gray-500">Contacto:</span> {info.contacto ?? '-'}</div>
        <div><span className="font-semibold text-gray-500">Dirección:</span> {info.calle ?? '-'} #{info.numeroCasa}, {info.zona ?? '-'}</div>
        <div><span className="font-semibold text-gray-500">Tipo:</span> {info.tipoServicio ?? '-'}</div>
        <div><span className="font-semibold text-gray-500">Inicio:</span> {info.fechaInicio ? new Date(info.fechaInicio).toLocaleDateString('es-BO') : '-'}</div>
        <div><span className="font-semibold text-gray-500">Fin:</span> {info.fechaFinal ? new Date(info.fechaFinal).toLocaleDateString('es-BO') : '-'}</div>
        <div><span className="font-semibold text-gray-500">Costo:</span> {info.costo != null ? `$${info.costo.toLocaleString('es-BO')}` : '-'}</div>
        <div className="col-span-2"><span className="font-semibold text-gray-500">Descripción:</span> {info.descripcion ?? '-'}</div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        <button onClick={onMarcarTerminado}
          className="rounded-xl bg-navy-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800">
          Marcar como terminado
        </button>
        <button onClick={onAsignarEmpleado}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
          Asignar empleado
        </button>
        <button onClick={onAsignarMaquinaria}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
          Asignar maquinaria
        </button>
        <button onClick={onAsignarRecurso}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
          Asignar recurso
        </button>
      </div>
    </div>
  )
}

function empresaTexto(o: { nombreEmpresa?: string; nomnreEmpresa?: string }): string {
  return o.nombreEmpresa ?? o.nomnreEmpresa ?? '-'
}

function DetalleServicioTerminado({ info, onCerrar }: { info: InfoServicioTerminado; onCerrar: () => void }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-navy-900">Servicio Terminado</h3>
        <button onClick={onCerrar} className="text-sm text-gray-400 hover:text-gray-600">Cerrar</button>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><span className="font-semibold text-gray-500">ID:</span> {info.idServicioTerminado}</div>
        <div><span className="font-semibold text-gray-500">Cliente:</span> {info.nombreCliente ?? '-'}</div>
        <div><span className="font-semibold text-gray-500">Empresa:</span> {empresaTexto(info)}</div>
        <div><span className="font-semibold text-gray-500">NIT:</span> {info.nit}</div>
        <div><span className="font-semibold text-gray-500">Dirección:</span> {info.direccion ?? '-'}</div>
        <div><span className="font-semibold text-gray-500">Tipo:</span> {info.tipoServicio ?? '-'}</div>
        <div><span className="font-semibold text-gray-500">Inicio:</span> {info.fechaInicio ? new Date(info.fechaInicio).toLocaleDateString('es-BO') : '-'}</div>
        <div><span className="font-semibold text-gray-500">Fin:</span> {info.fechaFinal ? new Date(info.fechaFinal).toLocaleDateString('es-BO') : '-'}</div>
        <div><span className="font-semibold text-gray-500">Costo:</span> {info.costo != null ? `$${info.costo.toLocaleString('es-BO')}` : '-'}</div>
        <div><span className="font-semibold text-gray-500">Satisfacción:</span> {info.satisfaccion ?? '-'}</div>
        <div className="col-span-2"><span className="font-semibold text-gray-500">Descripción:</span> {info.descripcion ?? '-'}</div>
        <div className="col-span-2"><span className="font-semibold text-gray-500">Comentarios:</span> {info.comentarios ?? '-'}</div>
      </div>
    </div>
  )
}

function valorId(o: CatalogoDTO): number {
  const v = o as unknown as Record<string, unknown>
  return (v.Id ?? v.id ?? 0) as number
}
function valorDetalle(o: CatalogoDTO): string {
  const v = o as unknown as Record<string, unknown>
  return (v.Detalle ?? v.detalle ?? v.nombre ?? '') as string
}

function ModalCrearServicio({
  clientes, zonas, tiposServicio, cargandoCatalogs,
  onCerrar, onCreado, onError,
}: {
  clientes: InfoClienteCorto[]
  zonas: CatalogoDTO[]
  tiposServicio: CatalogoDTO[]
  cargandoCatalogs: boolean
  onCerrar: () => void
  onCreado: () => void
  onError: (msg: string) => void
}) {
  const [enviando, setEnviando] = useState(false)
  const [form, setForm] = useState({
    IdCliente: 0,
    calle: '',
    NumeroCasa: 0,
    IdZona: 0,
    IdTipoServicio: 0,
    Fechainicio: '',
    FechaFinal: '',
    costo: 0,
    Descripcion: '',
  })

  const opcionesClientes = cargandoCatalogs
    ? [<option key="cargando-cli" value={0} disabled>Cargando...</option>]
    : clientes.map((c) => (
        <option key={`cli-${c.idCliente}`} value={c.idCliente}>{c.nombreCliente}</option>
      ))

  const opcionesZonas = cargandoCatalogs
    ? [<option key="cargando-zon" value={0} disabled>Cargando...</option>]
    : zonas.map((z, i) => (
        <option key={`zon-${i}`} value={valorId(z)}>{valorDetalle(z)}</option>
      ))

  const opcionesTiposServicio = cargandoCatalogs
    ? [<option key="cargando-tipo" value={0} disabled>Cargando...</option>]
    : tiposServicio.map((t, i) => (
        <option key={`tipo-${i}`} value={valorId(t)}>{valorDetalle(t)}</option>
      ))

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: ['IdCliente', 'NumeroCasa', 'IdZona', 'IdTipoServicio', 'costo'].includes(name)
        ? Number(value)
        : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await ServiciosService.crear({
        ...form,
        FechaFinal: form.FechaFinal || null,
        Fechainicio: form.Fechainicio,
      })
      onCreado()
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'Error al crear servicio.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy-900">Nuevo Servicio</h2>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Cliente</label>
            <select name="IdCliente" value={form.IdCliente} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
              <option value={0} disabled>Seleccionar cliente</option>
              {opcionesClientes}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Calle</label>
            <input type="text" name="calle" value={form.calle} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Número de Casa</label>
            <input type="number" name="NumeroCasa" value={form.NumeroCasa} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Zona</label>
            <select name="IdZona" value={form.IdZona} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
              <option value={0} disabled>Seleccionar zona</option>
              {opcionesZonas}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tipo Servicio</label>
            <select name="IdTipoServicio" value={form.IdTipoServicio} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
              <option value={0} disabled>Seleccionar tipo</option>
              {opcionesTiposServicio}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Fecha Inicio</label>
            <input type="date" name="Fechainicio" value={form.Fechainicio} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Fecha Final</label>
            <input type="date" name="FechaFinal" value={form.FechaFinal} onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Costo</label>
            <input type="number" step="0.01" name="costo" value={form.costo} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
            <textarea name="Descripcion" value={form.Descripcion} onChange={handleChange} rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCerrar}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={enviando}
              className="rounded-xl bg-chuxna px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark disabled:opacity-50">
              {enviando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalMarcarTerminado({
  idServicio, satisfacciones, onCerrar, onTerminado, onError,
}: {
  idServicio: number
  satisfacciones: CatalogoDTO[]
  onCerrar: () => void
  onTerminado: () => void
  onError: (msg: string) => void
}) {
  const [enviando, setEnviando] = useState(false)
  const [idSatisfaccion, setIdSatisfaccion] = useState(0)
  const [comentarios, setComentarios] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await ServiciosService.marcarTerminado({
        idServicio,
        IdSatidfaccion: idSatisfaccion,
        Comentarios: comentarios,
      })
      onTerminado()
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'Error al marcar servicio como terminado.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy-900">Marcar como terminado</h2>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Satisfacción</label>
            <select value={idSatisfaccion} onChange={(e) => setIdSatisfaccion(Number(e.target.value))} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
              <option value={0} disabled>Seleccionar nivel</option>
              {satisfacciones.map((s, i) => (
                <option key={`sat-${i}`} value={valorId(s)}>{valorDetalle(s)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Comentarios</label>
            <textarea value={comentarios} onChange={(e) => setComentarios(e.target.value)} rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCerrar}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={enviando}
              className="rounded-xl bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-50">
              {enviando ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalAsignarEmpleado({
  idServicio, usuarios, horarios, diasLaborales,
  onCerrar, onAsignado, onError,
}: {
  idServicio: number
  usuarios: UsuarioDatos[]
  horarios: HorarioDTO[]
  diasLaborales: CatalogoDTO[]
  onCerrar: () => void
  onAsignado: () => void
  onError: (msg: string) => void
}) {
  const [enviando, setEnviando] = useState(false)
  const [idUsuario, setIdUsuario] = useState(0)
  const [idHorario, setIdHorario] = useState(0)
  const [idDiasLaborales, setIdDiasLaborales] = useState(0)
  const [horaEntrada, setHoraEntrada] = useState('')
  const [horaSalida, setHoraSalida] = useState('')
  const [diasTexto, setDiasTexto] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await ServiciosService.asignarEmpleado({
        idUsuario,
        IdServicio: idServicio,
        idHorario,
        idDiasLaborales,
        HoraDeEntrada: horaEntrada || null,
        HoraDeSalida: horaSalida || null,
        DiasLaborales: diasTexto || null,
      })
      onAsignado()
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'Error al asignar empleado.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy-900">Asignar empleado</h2>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Empleado</label>
            <select value={idUsuario} onChange={(e) => setIdUsuario(Number(e.target.value))} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
              <option value={0} disabled>Seleccionar empleado</option>
              {usuarios.map((u) => (
                <option key={`usr-${u.idUsuario}`} value={u.idUsuario}>{u.nombreUsuario} (CI: {u.ci})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Horario</label>
            <select value={idHorario} onChange={(e) => setIdHorario(Number(e.target.value))} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
              <option value={0} disabled>Seleccionar horario</option>
              {horarios.map((h) => (
                <option key={`hor-${h.idhorario}`} value={h.idhorario}>
                  Hora entrada: {h.horaEntrada} Hora salida: {h.horaSalida}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Días laborales</label>
            <select value={idDiasLaborales} onChange={(e) => setIdDiasLaborales(Number(e.target.value))} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
              <option value={0} disabled>Seleccionar días</option>
              {diasLaborales.map((d, i) => (
                <option key={`dl-${i}`} value={valorId(d)}>{valorDetalle(d)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Hora entrada (opcional)</label>
            <input type="time" value={horaEntrada} onChange={(e) => setHoraEntrada(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Hora salida (opcional)</label>
            <input type="time" value={horaSalida} onChange={(e) => setHoraSalida(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Días (texto, opcional)</label>
            <input type="text" value={diasTexto} onChange={(e) => setDiasTexto(e.target.value)}
              placeholder="Ej: Lunes a Viernes"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCerrar}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={enviando}
              className="rounded-xl bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-50">
              {enviando ? 'Asignando...' : 'Asignar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalAsignarMaquinaria({
  idServicio, maquinarias, onCerrar, onAsignado, onError,
}: {
  idServicio: number
  maquinarias: ListarMaquinaria[]
  onCerrar: () => void
  onAsignado: () => void
  onError: (msg: string) => void
}) {
  const [enviando, setEnviando] = useState(false)
  const [idMaquinaria, setIdMaquinaria] = useState(0)
  const [cantidad, setCantidad] = useState(1)
  const [descripcion, setDescripcion] = useState('')

  function getNombreMaquinaria(m: ListarMaquinaria): string {
    const v = m as unknown as Record<string, unknown>
    return (v.NombreMaquinaria ?? v.nombreMaquinaria ?? '') as string
  }

  function getIdMaquinaria(m: ListarMaquinaria): number {
    const v = m as unknown as Record<string, unknown>
    return (v.IdMaquinaria ?? v.idMaquinaria ?? 0) as number
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await ServiciosService.asignarMaquinaria({
        IdServicio: idServicio,
        IdMaquinaria: idMaquinaria,
        CantidadMaquinaria: cantidad,
        DescripcionMaquinaria: descripcion,
      })
      onAsignado()
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'Error al asignar maquinaria.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy-900">Asignar maquinaria</h2>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Maquinaria</label>
            <select value={idMaquinaria} onChange={(e) => setIdMaquinaria(Number(e.target.value))} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
              <option value={0} disabled>Seleccionar maquinaria</option>
              {maquinarias.map((m, i) => (
                <option key={`maq-${i}`} value={getIdMaquinaria(m)}>{getNombreMaquinaria(m)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Cantidad</label>
            <input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCerrar}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={enviando}
              className="rounded-xl bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-50">
              {enviando ? 'Asignando...' : 'Asignar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalAsignarRecurso({
  idServicio, recursos, onCerrar, onAsignado, onError,
}: {
  idServicio: number
  recursos: ListarRecurso[]
  onCerrar: () => void
  onAsignado: () => void
  onError: (msg: string) => void
}) {
  const [enviando, setEnviando] = useState(false)
  const [idRecurso, setIdRecurso] = useState(0)
  const [cantidad, setCantidad] = useState(1)

  function getNombreRecurso(r: ListarRecurso): string {
    const v = r as unknown as Record<string, unknown>
    return (v.Nombre ?? v.nombre ?? '') as string
  }

  function getIdRecurso(r: ListarRecurso): number {
    const v = r as unknown as Record<string, unknown>
    return (v.IdRecurso ?? v.idRecurso ?? v.id ?? 0) as number
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await ServiciosService.asignarRecurso({
        idServicio,
        IdRecurso: idRecurso,
        CantidadRecursos: cantidad,
      })
      onAsignado()
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'Error al asignar recurso.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy-900">Asignar recurso</h2>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Recurso</label>
            <select value={idRecurso} onChange={(e) => setIdRecurso(Number(e.target.value))} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
              <option value={0} disabled>Seleccionar recurso</option>
              {recursos.map((r, i) => (
                <option key={`rec-${i}`} value={getIdRecurso(r)}>{getNombreRecurso(r)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Cantidad</label>
            <input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCerrar}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={enviando}
              className="rounded-xl bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-50">
              {enviando ? 'Asignando...' : 'Asignar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
