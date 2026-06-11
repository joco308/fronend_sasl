'use client'

import { useState, useCallback } from 'react'
import { MaquinariaService } from '@/lib/api/maquinaria.service'
import { CatalogosService } from '@/lib/api/catalogos.service'
import { ProveedoresService } from '@/lib/api/proveedores.service'
import TablaGenerica from '../../components/TablaGenerica'
import type {
  ListarMaquinaria, InfoMaquinaria, CatalogoDTO,
  MostrarMarcas, Estado, ListarProveedores, ListarMantenimiento,
  InfoMantenimiento,
} from '@/lib/api/types'

interface Props {
  maquinarias: ListarMaquinaria[]
}

export default function MaquinariaClient({ maquinarias: datosIniciales }: Props) {
  const [tab, setTab] = useState<'maquinarias' | 'mantenimientos'>('maquinarias')

  const [datos, setDatos] = useState(datosIniciales)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')

  const [maquinariaSel, setMaquinariaSel] = useState<ListarMaquinaria | null>(null)
  const [infoDetalle, setInfoDetalle] = useState<InfoMaquinaria | null>(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)

  const [mantenimientos, setMantenimientos] = useState<ListarMantenimiento[]>([])
  const [cargandoMant, setCargandoMant] = useState(false)
  const yaCargoMant = useState(false)

  const [mantSel, setMantSel] = useState<ListarMantenimiento | null>(null)
  const [infoMantDetalle, setInfoMantDetalle] = useState<InfoMantenimiento | null>(null)
  const [cargandoMantDetalle, setCargandoMantDetalle] = useState(false)

  const [modalCrear, setModalCrear] = useState(false)
  const [proveedores, setProveedores] = useState<ListarProveedores[]>([])
  const [marcas, setMarcas] = useState<MostrarMarcas[]>([])
  const [estados, setEstados] = useState<Estado[]>([])
  const [tiposMaquinaria, setTiposMaquinaria] = useState<CatalogoDTO[]>([])
  const [cargandoCatalogs, setCargandoCatalogs] = useState(false)

  const [modalMantenimiento, setModalMantenimiento] = useState(false)
  const [infoMantenimientoSel, setInfoMantenimientoSel] = useState<InfoMantenimiento | null>(null)
  const [modalInfoMantenimiento, setModalInfoMantenimiento] = useState(false)
  const [maquinariasLista, setMaquinariasLista] = useState<ListarMaquinaria[]>([])

  const verDetalle = useCallback(async (m: ListarMaquinaria) => {
    setMaquinariaSel(m)
    setCargandoDetalle(true)
    setError('')
    try {
      const info = await MaquinariaService.info(m.idMaquinaria)
      setInfoDetalle(info)
    } catch {
      setError('Error al cargar detalle de maquinaria.')
    } finally {
      setCargandoDetalle(false)
    }
  }, [])

  const refrescar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const nuevos = await MaquinariaService.listar()
      setDatos(nuevos)
    } catch {
      setError('Error al recargar maquinaria.')
    } finally {
      setCargando(false)
    }
  }, [])

  async function cargarMantenimientos() {
    setCargandoMant(true)
    try {
      const lista = await MaquinariaService.listarMantenimientos()
      setMantenimientos(lista)
    } catch {
      setError('Error al cargar mantenimientos.')
    } finally {
      setCargandoMant(false)
    }
  }

  async function abrirModalCrear() {
    setModalCrear(true)
    setCargandoCatalogs(true)
    try {
      const [listaProv, listaMarcas, listaEstados, listaTipos] = await Promise.all([
        ProveedoresService.listar(),
        MaquinariaService.marcas(),
        MaquinariaService.estados(),
        CatalogosService.obtener('Tipo Maquinaria'),
      ])
      setProveedores(listaProv)
      setMarcas(listaMarcas)
      setEstados(listaEstados)
      setTiposMaquinaria(listaTipos)
    } catch {
      setError('Error al cargar datos.')
    } finally {
      setCargandoCatalogs(false)
    }
  }

  async function abrirModalMantenimiento() {
    setModalMantenimiento(true)
    try {
      const lista = await MaquinariaService.listar()
      setMaquinariasLista(lista)
    } catch {
      setError('Error al cargar maquinarias.')
    }
  }

  const verMantDetalle = useCallback(async (m: ListarMantenimiento) => {
    setMantSel(m)
    setCargandoMantDetalle(true)
    setError('')
    try {
      const info = await MaquinariaService.infoMantenimiento(m.idMantenimiento)
      setInfoMantDetalle(info)
    } catch {
      setError('Error al cargar detalle de mantenimiento.')
    } finally {
      setCargandoMantDetalle(false)
    }
  }, [])

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {mensajeExito && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{mensajeExito}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setTab('maquinarias')}
          className={`px-4 py-2 text-sm font-semibold transition-colors ${
            tab === 'maquinarias'
              ? 'border-b-2 border-chuxna text-chuxna'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Maquinarias
        </button>
        <button
          onClick={() => { setTab('mantenimientos'); cargarMantenimientos() }}
          className={`px-4 py-2 text-sm font-semibold transition-colors ${
            tab === 'mantenimientos'
              ? 'border-b-2 border-chuxna text-chuxna'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Mantenimientos
        </button>
      </div>

      {/* Tab: Maquinarias */}
      {tab === 'maquinarias' && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {cargando ? 'Cargando...' : `${datos.length} máquina(s) registrada(s)`}
            </p>
            <button onClick={abrirModalCrear} className="rounded-xl bg-chuxna px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">
              + Nueva Maquinaria
            </button>
          </div>

          <TablaGenerica
            columnas={[
              { key: 'idMaquinaria', header: 'ID' },
              { key: 'nombreMaquinaria', header: 'Nombre' },
              { key: 'codigoInventario', header: 'Código Inv.' },
              { key: 'tipoMaquinaria', header: 'Tipo' },
            ]}
            datos={datos}
            keyExtractor={(m) => m.idMaquinaria}
            onRowClick={verDetalle}
          />

          {maquinariaSel && infoDetalle && !cargandoDetalle && (
            <DetalleMaquinaria
              info={infoDetalle}
              onCerrar={() => { setMaquinariaSel(null); setInfoDetalle(null) }}
            />
          )}
        </>
      )}

      {/* Tab: Mantenimientos */}
      {tab === 'mantenimientos' && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {cargandoMant ? 'Cargando...' : `${mantenimientos.length} mantenimiento(s) registrado(s)`}
            </p>
            <button onClick={abrirModalMantenimiento} className="rounded-xl bg-chuxna px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">
              + Nuevo Mantenimiento
            </button>
          </div>

          <TablaGenerica
            columnas={[
              { key: 'idMantenimiento', header: 'ID' },
              { key: 'nombreMaquinaria', header: 'Maquinaria' },
              {
                key: 'costo',
                header: 'Costo',
                render: (m) => `$${m.costo.toLocaleString('es-BO')}`,
              },
            ]}
            datos={mantenimientos}
            keyExtractor={(m) => m.idMantenimiento}
            onRowClick={verMantDetalle}
          />

          {mantSel && infoMantDetalle && !cargandoMantDetalle && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-navy-900">Detalle de Mantenimiento</h3>
                <button onClick={() => { setMantSel(null); setInfoMantDetalle(null) }} className="text-sm text-gray-400 hover:text-gray-600">Cerrar</button>
              </div>
              <div className="space-y-3 text-sm">
                <div><span className="font-semibold text-gray-500">ID:</span> {infoMantDetalle.idMantenimiento}</div>
                <div><span className="font-semibold text-gray-500">Maquinaria:</span> {infoMantDetalle.nombreMaquinaria}</div>
                <div><span className="font-semibold text-gray-500">Fecha:</span> {new Date(infoMantDetalle.fechaMantenimiento).toLocaleDateString('es-BO')}</div>
                <div><span className="font-semibold text-gray-500">Costo:</span> ${infoMantDetalle.costo.toLocaleString('es-BO')}</div>
                <div><span className="font-semibold text-gray-500">Descripción:</span> {infoMantDetalle.descripcion ?? '-'}</div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modales Maquinaria */}
      {modalCrear && (
        <ModalCrearMaquinaria
          proveedores={proveedores}
          marcas={marcas}
          estados={estados}
          tiposMaquinaria={tiposMaquinaria}
          cargandoCatalogs={cargandoCatalogs}
          onCerrar={() => setModalCrear(false)}
          onCreado={() => {
            setModalCrear(false)
            setMensajeExito('Maquinaria creada correctamente.')
            refrescar()
          }}
          onError={(msg) => setError(msg)}
        />
      )}

      {/* Modal Nuevo Mantenimiento */}
      {modalMantenimiento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-navy-900">Nuevo Mantenimiento</h2>
              <button onClick={() => setModalMantenimiento(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <ModalCrearMantenimientoForm
              maquinarias={maquinariasLista}
              onCerrar={() => setModalMantenimiento(false)}
              onCreado={async () => {
                setModalMantenimiento(false)
                setMensajeExito('Mantenimiento agregado.')
                await cargarMantenimientos()
              }}
              onError={(msg) => setError(msg)}
            />
          </div>
        </div>
      )}

      {modalInfoMantenimiento && infoMantenimientoSel && (
        <ModalInfoMantenimiento
          info={infoMantenimientoSel}
          onCerrar={() => { setModalInfoMantenimiento(false); setInfoMantenimientoSel(null) }}
        />
      )}
    </div>
  )
}

function DetalleMaquinaria({
  info, onCerrar,
}: {
  info: InfoMaquinaria
  onCerrar: () => void
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-navy-900">Detalle de Maquinaria</h3>
        <button onClick={onCerrar} className="text-sm text-gray-400 hover:text-gray-600">Cerrar</button>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><span className="font-semibold text-gray-500">ID:</span> {info.idMaquinaria}</div>
        <div><span className="font-semibold text-gray-500">Nombre:</span> {info.nombreMaquinaria}</div>
        <div><span className="font-semibold text-gray-500">Código Inv.:</span> {info.codigoInventario}</div>
        <div><span className="font-semibold text-gray-500">Tipo:</span> {info.tipoMaquinaria}</div>
        <div><span className="font-semibold text-gray-500">Estado:</span> {info.estadoCalidad}</div>
        <div><span className="font-semibold text-gray-500">Proveedor:</span> {info.provedor?.nombre ?? '-'} ({info.provedor?.empresa ?? '-'})</div>
        <div><span className="font-semibold text-gray-500">NIT Proveedor:</span> {info.provedor?.nit ?? '-'}</div>
        <div><span className="font-semibold text-gray-500">Marca:</span> {info.marca?.nombreMarca ?? '-'} ({info.marca?.pais ?? '-'})</div>
        <div className="col-span-2"><span className="font-semibold text-gray-500">Descripción:</span> {info.descripcion ?? '-'}</div>
      </div>
    </div>
  )
}

function valorIdCatalogo(o: CatalogoDTO): number {
  const v = o as unknown as Record<string, unknown>
  return (v.Id ?? v.id ?? 0) as number
}
function valorDetalleCatalogo(o: CatalogoDTO): string {
  const v = o as unknown as Record<string, unknown>
  return (v.Detalle ?? v.detalle ?? v.nombre ?? '') as string
}

function getIdMarca(m: MostrarMarcas): number {
  const v = m as unknown as Record<string, unknown>
  return (v.idMarca ?? v.IdMarca ?? 0) as number
}
function getNombreMarca(m: MostrarMarcas): string {
  const v = m as unknown as Record<string, unknown>
  return (v.nombreMarca ?? v.NombreMarca ?? '') as string
}
function getPaisMarca(m: MostrarMarcas): string {
  const v = m as unknown as Record<string, unknown>
  return (v.pais ?? v.Pais ?? '') as string
}
function getIdEstado(e: Estado): number {
  const v = e as unknown as Record<string, unknown>
  return (v.idEstado ?? v.IdEstado ?? 0) as number
}
function getNombreEstado(e: Estado): string {
  return e.estado ?? ''
}

function ModalCrearMaquinaria({
  proveedores, marcas, estados, tiposMaquinaria, cargandoCatalogs,
  onCerrar, onCreado, onError,
}: {
  proveedores: ListarProveedores[]
  marcas: MostrarMarcas[]
  estados: Estado[]
  tiposMaquinaria: CatalogoDTO[]
  cargandoCatalogs: boolean
  onCerrar: () => void
  onCreado: () => void
  onError: (msg: string) => void
}) {
  const [enviando, setEnviando] = useState(false)
  const [form, setForm] = useState({
    NombreMaquinaria: '',
    CodigoInv: '',
    IdProvedor: 0,
    TipoMaquinaria: 0,
    EstadoCalidad: 0,
    IdMarcaMaquinaria: 0,
    Descripcion: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: ['IdProvedor', 'TipoMaquinaria', 'EstadoCalidad', 'IdMarcaMaquinaria'].includes(name)
        ? Number(value)
        : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await MaquinariaService.crear(form)
      onCreado()
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'Error al crear maquinaria.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy-900">Nueva Maquinaria</h2>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" name="NombreMaquinaria" value={form.NombreMaquinaria} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Código Inventario</label>
            <input type="text" name="CodigoInv" value={form.CodigoInv} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Proveedor</label>
            <select name="IdProvedor" value={form.IdProvedor} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
              <option value={0} disabled>Seleccionar proveedor</option>
              {proveedores.map((p) => (
                <option key={`prov-${p.id}`} value={p.id}>{p.nombre} - {p.empresa}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tipo Maquinaria</label>
            <select name="TipoMaquinaria" value={form.TipoMaquinaria} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
              <option value={0} disabled>Seleccionar tipo</option>
              {tiposMaquinaria.map((t, i) => (
                <option key={`tipo-${i}`} value={valorIdCatalogo(t)}>{valorDetalleCatalogo(t)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Estado de Calidad</label>
            <select name="EstadoCalidad" value={form.EstadoCalidad} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
              <option value={0} disabled>Seleccionar estado</option>
              {estados.map((e, i) => (
                <option key={`est-${i}`} value={getIdEstado(e)}>{getNombreEstado(e)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Marca</label>
            <select name="IdMarcaMaquinaria" value={form.IdMarcaMaquinaria} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
              <option value={0} disabled>Seleccionar marca</option>
              {marcas.map((m, i) => (
                <option key={`marca-${i}`} value={getIdMarca(m)}>{getNombreMarca(m)} ({getPaisMarca(m)})</option>
              ))}
            </select>
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

function ModalCrearMantenimientoForm({
  maquinarias, onCerrar, onCreado, onError,
}: {
  maquinarias: ListarMaquinaria[]
  onCerrar: () => void
  onCreado: () => void
  onError: (msg: string) => void
}) {
  const [enviando, setEnviando] = useState(false)
  const [form, setForm] = useState({
    IdMaquinaria: 0,
    FechaMantenimiento: '',
    Descripcion: '',
    Costo: 0,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: ['IdMaquinaria', 'Costo'].includes(name) ? Number(value) : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await MaquinariaService.crearMantenimiento(form)
      onCreado()
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'Error al crear mantenimiento.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Maquinaria</label>
        <select name="IdMaquinaria" value={form.IdMaquinaria} onChange={handleChange} required
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
          <option value={0} disabled>Seleccionar maquinaria</option>
          {maquinarias.map((m) => (
            <option key={m.idMaquinaria} value={m.idMaquinaria}>{m.nombreMaquinaria} ({m.codigoInventario})</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Fecha</label>
        <input type="date" name="FechaMantenimiento" value={form.FechaMantenimiento} onChange={handleChange} required
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
        <textarea name="Descripcion" value={form.Descripcion} onChange={handleChange} rows={3} required
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Costo ($)</label>
        <input type="number" name="Costo" value={form.Costo} onChange={handleChange} min={0} step="0.01" required
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
  )
}

function ModalInfoMantenimiento({
  info, onCerrar,
}: {
  info: InfoMantenimiento
  onCerrar: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy-900">Detalle de Mantenimiento</h2>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="space-y-3 text-sm">
          <div><span className="font-semibold text-gray-500">ID:</span> {info.idMantenimiento}</div>
          <div><span className="font-semibold text-gray-500">Maquinaria:</span> {info.nombreMaquinaria}</div>
          <div><span className="font-semibold text-gray-500">Fecha:</span> {new Date(info.fechaMantenimiento).toLocaleDateString('es-BO')}</div>
          <div><span className="font-semibold text-gray-500">Costo:</span> ${info.costo.toLocaleString('es-BO')}</div>
          <div><span className="font-semibold text-gray-500">Descripción:</span> {info.descripcion ?? '-'}</div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onCerrar}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
