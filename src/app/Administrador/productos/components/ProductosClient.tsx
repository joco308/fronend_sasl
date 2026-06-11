'use client'

import { useState } from 'react'
import { ProductosService } from '@/lib/api/productos.service'
import TablaGenerica from '../../components/TablaGenerica'
import type { ListarRecurso, CatalogoDTO, ListarProveedores } from '@/lib/api/types'

function valorId(o: CatalogoDTO): number {
  const v = o as unknown as Record<string, unknown>
  return (v.Id ?? v.id ?? 0) as number
}
function valorDetalle(o: CatalogoDTO): string {
  const v = o as unknown as Record<string, unknown>
  return (v.Detalle ?? v.detalle ?? v.nombre ?? '') as string
}

interface Props {
  productos: ListarRecurso[]
  proveedores: ListarProveedores[]
  tipos: CatalogoDTO[]
}

export default function ProductosClient({ productos: datosIniciales, proveedores: datosProv, tipos: datosTipos }: Props) {
  const [datos, setDatos] = useState(datosIniciales)
  const [error, setError] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')

  const [modalCrear, setModalCrear] = useState(false)
  const [modalEditarNombre, setModalEditarNombre] = useState(false)
  const [modalEditarDesc, setModalEditarDesc] = useState(false)
  const [editando, setEditando] = useState<ListarRecurso | null>(null)

  async function refrescar() {
    const nueva = await ProductosService.listar()
    setDatos(nueva)
  }

  function mostrarError(msg: string) {
    setError(msg)
    setTimeout(() => setError(''), 4000)
  }

  function mostrarExito(msg: string) {
    setMensajeExito(msg)
    setTimeout(() => setMensajeExito(''), 3000)
  }

  function abrirEditarNombre(p: ListarRecurso) {
    setEditando(p)
    setModalEditarNombre(true)
  }

  function abrirEditarDesc(p: ListarRecurso) {
    setEditando(p)
    setModalEditarDesc(true)
  }

  async function crearProducto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      await ProductosService.crear({
        IdProvedor: Number(fd.get('proveedor')),
        IdTipo: Number(fd.get('tipo')),
        nombre: fd.get('nombre') as string,
        Descripcion: (fd.get('descripcion') as string) || null,
      })
      setModalCrear(false)
      mostrarExito('Producto creado.')
      await refrescar()
    } catch {
      mostrarError('Error al crear producto.')
    }
  }

  async function guardarNombre(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      await ProductosService.editarNombre({
        IdRecurso: Number(fd.get('id')),
        nombre: fd.get('nombre') as string,
      })
      setModalEditarNombre(false)
      setEditando(null)
      mostrarExito('Nombre actualizado.')
      await refrescar()
    } catch {
      mostrarError('Error al editar nombre.')
    }
  }

  async function guardarDesc(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      await ProductosService.editarDescripcion({
        IdRecurso: Number(fd.get('id')),
        Descripcion: fd.get('descripcion') as string,
      })
      setModalEditarDesc(false)
      setEditando(null)
      mostrarExito('Descripción actualizada.')
      await refrescar()
    } catch {
      mostrarError('Error al editar descripción.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{datos.length} producto(s) registrado(s)</p>
        <button onClick={() => setModalCrear(true)} className="rounded-xl bg-chuxna px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">
          + Nuevo Producto
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {mensajeExito && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{mensajeExito}</div>
      )}

      <TablaGenerica
        columnas={[
          { key: 'nombre', header: 'Nombre' },
          { key: 'tipo', header: 'Tipo' },
          { key: 'nombreProvedor', header: 'Proveedor' },
          { key: 'empresaProvedor', header: 'Empresa' },
          {
            key: 'descripcion',
            header: 'Descripción',
            render: (p) => p.descripcion ?? '-',
          },
          {
            key: 'acciones',
            header: 'Acciones',
            render: (p) => (
              <div className="flex gap-2">
                <button onClick={() => abrirEditarNombre(p)} className="rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:bg-navy-50 hover:border-navy-400">Editar nombre</button>
                <button onClick={() => abrirEditarDesc(p)} className="rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:bg-navy-50 hover:border-navy-400">Editar desc</button>
              </div>
            ),
          },
        ]}
        datos={datos}
        keyExtractor={(_, i) => i}
      />

      {/* Modal Crear */}
      {modalCrear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-navy-900">Nuevo Producto</h2>
              <button onClick={() => setModalCrear(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={crearProducto} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Proveedor</label>
                <select name="proveedor" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
                  <option value="">Seleccione</option>
                  {datosProv.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre} — {p.empresa}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Tipo</label>
                <select name="tipo" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
                  <option value="">Seleccione</option>
                  {datosTipos.map((t) => (
                    <option key={valorId(t)} value={valorId(t)}>{valorDetalle(t)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
                <input name="nombre" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
                <textarea name="descripcion" rows={3} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalCrear(false)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" className="rounded-xl bg-chuxna px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Nombre */}
      {modalEditarNombre && editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-navy-900">Editar Nombre</h2>
              <button onClick={() => { setModalEditarNombre(false); setEditando(null) }} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={guardarNombre} className="space-y-4">
              <input type="hidden" name="id" value={editando.idRecurso} />
              <div>
                <p className="mb-1 text-sm text-gray-500">Producto actual: <span className="font-semibold text-navy-900">{editando.nombre}</span></p>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nuevo nombre</label>
                <input name="nombre" defaultValue={editando.nombre} required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setModalEditarNombre(false); setEditando(null) }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" className="rounded-xl bg-chuxna px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Descripción */}
      {modalEditarDesc && editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-navy-900">Editar Descripción</h2>
              <button onClick={() => { setModalEditarDesc(false); setEditando(null) }} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={guardarDesc} className="space-y-4">
              <input type="hidden" name="id" value={editando.idRecurso} />
              <div>
                <p className="mb-1 text-sm text-gray-500">Producto: <span className="font-semibold text-navy-900">{editando.nombre}</span></p>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nueva descripción</label>
                <textarea name="descripcion" defaultValue={editando.descripcion ?? ''} rows={3} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setModalEditarDesc(false); setEditando(null) }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" className="rounded-xl bg-chuxna px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
