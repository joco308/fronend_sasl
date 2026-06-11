'use client'

import { useState, useCallback } from 'react'
import { ProveedoresService } from '@/lib/api/proveedores.service'
import { CatalogosService } from '@/lib/api/catalogos.service'
import TablaGenerica from '../../components/TablaGenerica'
import type { ListarProveedores, InformacionProveedor, CatalogoDTO } from '@/lib/api/types'

function valorId(o: CatalogoDTO): number {
  return (o as any).id ?? (o as any).Id ?? 0
}
function valorDetalle(o: CatalogoDTO): string {
  return (o as any).detalle ?? (o as any).Detalle ?? (o as any).nombre ?? ''
}

interface Props {
  proveedores: ListarProveedores[]
}

export default function ProveedoresClient({ proveedores: datosIniciales }: Props) {
  const [datos, setDatos] = useState(datosIniciales)
  const [error, setError] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')

  const [proveedorSel, setProveedorSel] = useState<ListarProveedores | null>(null)
  const [infoDetalle, setInfoDetalle] = useState<InformacionProveedor | null>(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)

  const [modalCrear, setModalCrear] = useState(false)
  const [empresas, setEmpresas] = useState<CatalogoDTO[]>([])
  const [cargandoCrear, setCargandoCrear] = useState(false)

  const [modalTelefono, setModalTelefono] = useState(false)
  const [detallesTelefono, setDetallesTelefono] = useState<CatalogoDTO[]>([])

  const [modalEditarNombre, setModalEditarNombre] = useState(false)

  async function refrescar() {
    const nueva = await ProveedoresService.listar()
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

  const verDetalle = useCallback(async (p: ListarProveedores) => {
    setProveedorSel(p)
    setCargandoDetalle(true)
    setError('')
    try {
      const info = await ProveedoresService.info(p.id)
      setInfoDetalle(info)
    } catch {
      setError('Error al cargar detalle.')
    } finally {
      setCargandoDetalle(false)
    }
  }, [])

  async function abrirModalCrear() {
    setModalCrear(true)
    setCargandoCrear(true)
    try {
      const lista = await CatalogosService.obtener('empresas')
      setEmpresas(lista)
    } catch {
      mostrarError('Error al cargar empresas.')
    } finally {
      setCargandoCrear(false)
    }
  }

  async function crearProveedor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      await ProveedoresService.crear({
        IDEmpresa: Number(fd.get('empresa')),
        NIT: Number(fd.get('nit')),
        nombre: fd.get('nombre') as string,
      })
      setModalCrear(false)
      mostrarExito('Proveedor creado.')
      await refrescar()
    } catch {
      mostrarError('Error al crear proveedor.')
    }
  }

  async function abrirModalTelefono() {
    setModalTelefono(true)
    try {
      const lista = await CatalogosService.obtener('detalle-telefono')
      setDetallesTelefono(lista)
    } catch {
      mostrarError('Error al cargar detalles.')
    }
  }

  async function agregarTelefono(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!proveedorSel) return
    const fd = new FormData(e.currentTarget)
    try {
      await ProveedoresService.agregarTelefono({
        telefono: Number(fd.get('telefono')),
        idDetalle: Number(fd.get('idDetalle')),
        Detalle: (fd.get('detalle') as string) || null,
        IdProveedor: proveedorSel.id,
      })
      setModalTelefono(false)
      mostrarExito('Teléfono agregado.')
      if (proveedorSel) await verDetalle(proveedorSel)
    } catch {
      mostrarError('Error al agregar teléfono.')
    }
  }

  async function abrirModalEditarNombre() {
    setModalEditarNombre(true)
  }

  async function guardarNombre(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!proveedorSel) return
    const fd = new FormData(e.currentTarget)
    try {
      await ProveedoresService.editarNombre({
        id: proveedorSel.id,
        norbre: fd.get('nombre') as string,
      })
      setModalEditarNombre(false)
      mostrarExito('Nombre actualizado.')
      await refrescar()
      if (proveedorSel) await verDetalle(proveedorSel)
    } catch {
      mostrarError('Error al editar nombre.')
    }
  }

  function cerrarDetalle() {
    setProveedorSel(null)
    setInfoDetalle(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{datos.length} proveedor(es) registrado(s)</p>
        <button onClick={abrirModalCrear} className="rounded-xl bg-chuxna px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">+ Nuevo Proveedor</button>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
      {mensajeExito && <div className="bg-green-50 text-green-700 p-3 rounded text-sm">{mensajeExito}</div>}

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <TablaGenerica
            columnas={[
              { key: 'id', header: 'ID' },
              { key: 'empresa', header: 'Empresa' },
              { key: 'nombre', header: 'Contacto' },
              {
                key: 'telefono',
                header: 'Teléfonos',
                render: (p) => p.telefono?.join(', ') || '-',
              },
            ]}
            datos={datos}
            keyExtractor={(p) => p.id}
            onRowClick={verDetalle}
          />
        </div>

        {proveedorSel && (
          <div className="w-80 shrink-0 rounded-2xl border border-gray-100 bg-white p-6 shadow-card max-h-[80vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Detalles</h3>
              <button onClick={cerrarDetalle} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>

            {cargandoDetalle ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : infoDetalle ? (
              <>
                <div>
                  <p className="text-xs text-gray-500">Empresa</p>
                  <p className="font-medium">{infoDetalle.empresa}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Contacto</p>
                  <p className="font-medium">{infoDetalle.nombre}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">NIT</p>
                  <p className="font-medium">{infoDetalle.nit}</p>
                </div>
                {infoDetalle.productos && infoDetalle.productos.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500">Productos</p>
                    <ul className="text-sm list-disc list-inside">
                      {infoDetalle.productos.map((pr, i) => (
                        <li key={i}>{pr.norbre} (ID: {pr.id})</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex flex-col gap-2 pt-2">
                  <button onClick={abrirModalTelefono} className="rounded-xl border border-gray-200 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:border-navy-200 hover:bg-navy-50 hover:text-navy-700">Agregar teléfono</button>
                  <button onClick={abrirModalEditarNombre} className="rounded-xl border border-gray-200 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:border-navy-200 hover:bg-navy-50 hover:text-navy-700">Editar nombre</button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Seleccione un proveedor</p>
            )}
          </div>
        )}
      </div>

      {/* Modal Crear */}
      {modalCrear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nuevo Proveedor</h2>
              <button onClick={() => setModalCrear(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            {cargandoCrear ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : (
              <form onSubmit={crearProveedor} className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Empresa</label>
                  <select name="empresa" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
                    <option value="">Seleccione</option>
                    {empresas.map(e => (
                      <option key={valorId(e)} value={valorId(e)}>{valorDetalle(e)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">NIT</label>
                  <input name="nit" type="number" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nombre de contacto</label>
                  <input name="nombre" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setModalCrear(false)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">Cancelar</button>
                  <button type="submit" className="rounded-xl bg-chuxna px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">Crear</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Teléfono */}
      {modalTelefono && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Agregar Teléfono</h2>
              <button onClick={() => setModalTelefono(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={agregarTelefono} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Teléfono</label>
                <input name="telefono" type="number" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Detalle</label>
                <select name="idDetalle" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
                  <option value="0">Seleccione</option>
                  {detallesTelefono.map(d => (
                    <option key={valorId(d)} value={valorId(d)}>{valorDetalle(d)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Otro detalle</label>
                <input name="detalle" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" placeholder="Especifique si no encontró en la lista" />
              </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setModalTelefono(false)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">Cancelar</button>
                  <button type="submit" className="rounded-xl bg-chuxna px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">Agregar</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Nombre */}
      {modalEditarNombre && proveedorSel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Editar Nombre de Contacto</h2>
              <button onClick={() => setModalEditarNombre(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={guardarNombre} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Proveedor: {proveedorSel.nombre} ({proveedorSel.empresa})</label>
                <input name="nombre" defaultValue={proveedorSel.nombre} required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
              </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setModalEditarNombre(false)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">Cancelar</button>
                  <button type="submit" className="rounded-xl bg-chuxna px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">Guardar</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
