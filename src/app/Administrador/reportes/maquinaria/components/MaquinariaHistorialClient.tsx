'use client'

import { useState } from 'react'
import { ReportesService } from '@/lib/api/reportes.service'
import TablaGenerica from '../../../components/TablaGenerica'
import type { ListHistorialEstadoMaquinaria, ListarMaquinaria } from '@/lib/api/types'

interface Props {
  historial: ListHistorialEstadoMaquinaria[]
  maquinarias: ListarMaquinaria[]
}

export default function MaquinariaHistorialClient({ historial: datosIniciales, maquinarias: maqs }: Props) {
  const [datos, setDatos] = useState(datosIniciales)
  const [error, setError] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')
  const [modalCambiar, setModalCambiar] = useState(false)

  function mostrarError(msg: string) {
    setError(msg)
    setTimeout(() => setError(''), 4000)
  }

  function mostrarExito(msg: string) {
    setMensajeExito(msg)
    setTimeout(() => setMensajeExito(''), 3000)
  }

  async function refrescar() {
    try {
      const nueva = await ReportesService.listarHistorialEstado()
      setDatos(nueva)
    } catch {
      mostrarError('Error al refrescar.')
    }
  }

  async function exportarCSV() {
    try {
      const blob = await ReportesService.exportarCSV()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'historial-maquinaria.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      mostrarError('Error al exportar CSV.')
    }
  }

  async function cambiarEstado(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      await ReportesService.cambiarEstadoMaquinaria({
        IdMaquinaria: Number(fd.get('maquinaria')),
        
        idEstadoCalidad: Number(fd.get('estado')),
        descripcion: (fd.get('descripcion') as string) || null,
      })
      setModalCambiar(false)
      mostrarExito('Estado actualizado.')
      await refrescar()
    } catch {
      mostrarError('Error al cambiar estado.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{datos.length} cambio(s) registrado(s)</p>
        <div className="flex gap-2">
          <button onClick={exportarCSV} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">Exportar CSV</button>
          <button onClick={() => setModalCambiar(true)} className="rounded-xl bg-chuxna px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">+ Cambiar Estado</button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
      {mensajeExito && <div className="bg-green-50 text-green-700 p-3 rounded text-sm">{mensajeExito}</div>}

      <TablaGenerica
        columnas={[
          { key: 'idHistorial', header: 'ID' },
          { key: 'nombreMaquinaria', header: 'Maquinaria' },
          { key: 'codigoINV', header: 'Código Inv.' },
          { key: 'estadoCalidad', header: 'Estado' },
          {
            key: 'fechaCambio',
            header: 'Fecha Cambio',
            render: (h) => new Date(h.fechaCambio).toLocaleDateString('es-BO'),
          },
          {
            key: 'descripcion',
            header: 'Descripción',
            render: (h) => h.descripcion ?? '-',
          },
        ]}
        datos={datos}
        keyExtractor={(h) => h.idHistorial}
      />

      {modalCambiar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Cambiar Estado de Maquinaria</h2>
              <button onClick={() => setModalCambiar(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={cambiarEstado} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Maquinaria</label>
                <select name="maquinaria" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
                  <option value="">Seleccione</option>
                  {maqs.map(m => (
                    <option key={m.idMaquinaria} value={m.idMaquinaria}>
                      {m.nombreMaquinaria} ({m.codigoInventario})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nuevo Estado</label>
                <select name="estado" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
                  <option value="">Seleccione</option>
                  <option key="1" value="1">Bueno</option>
                  <option key="2" value="2">Regular</option>
                  <option key="3" value="3">Malo</option>
                  <option key="4" value="4">En reparación</option>
                  <option key="5" value="5">Dado de baja</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Descripción (opcional)</label>
                <textarea name="descripcion" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" rows={3} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalCambiar(false)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="rounded-xl bg-chuxna px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
