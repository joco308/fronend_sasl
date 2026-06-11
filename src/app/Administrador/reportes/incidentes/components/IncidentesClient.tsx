'use client'

import { useState, useCallback } from 'react'
import { ReportesService } from '@/lib/api/reportes.service'
import TablaGenerica from '../../../components/TablaGenerica'
import type { ListaIncidente, InfoIncidente } from '@/lib/api/types'

interface Props {
  incidentes: ListaIncidente[]
}

export default function IncidentesClient({ incidentes: datosIniciales }: Props) {
  const [datos, setDatos] = useState(datosIniciales)
  const [error, setError] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')

  const [incidenteSel, setIncidenteSel] = useState<ListaIncidente | null>(null)
  const [infoDetalle, setInfoDetalle] = useState<InfoIncidente | null>(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)

  const [modalCrear, setModalCrear] = useState(false)

  async function refrescar() {
    const nueva = await ReportesService.listarIncidentes()
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

  const verDetalle = useCallback(async (i: ListaIncidente) => {
    setIncidenteSel(i)
    setCargandoDetalle(true)
    setError('')
    try {
      const info = await ReportesService.infoIncidente(i.IdIncidente ?? i.idIncidente)
      setInfoDetalle(info)
    } catch {
      setError('Error al cargar detalle.')
    } finally {
      setCargandoDetalle(false)
    }
  }, [])

  async function crearIncidente(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      await ReportesService.crearIncidente({
        descripcion: fd.get('descripcion') as string,
        fecha: fd.get('fecha') as string,
      })
      setModalCrear(false)
      mostrarExito('Incidente creado.')
      await refrescar()
    } catch {
      mostrarError('Error al crear incidente.')
    }
  }

  function cerrarDetalle() {
    setIncidenteSel(null)
    setInfoDetalle(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{datos.length} incidente(s) registrado(s)</p>
        <button onClick={() => setModalCrear(true)} className="rounded-xl bg-chuxna px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">+ Nuevo Incidente</button>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
      {mensajeExito && <div className="bg-green-50 text-green-700 p-3 rounded text-sm">{mensajeExito}</div>}

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <TablaGenerica
            columnas={[
              { key: 'IdIncidente', header: 'ID', render: (i) => i.IdIncidente ?? i.idIncidente ?? '-' },
              { key: 'NombreCliente', header: 'Cliente', render: (i) => i.NombreCliente ?? i.nombreCliente ?? '-' },
              {
                key: 'fecha',
                header: 'Fecha',
                render: (i) => i.fecha ? new Date(i.fecha).toLocaleDateString('es-BO') : '-',
              },
            ]}
            datos={datos}
            keyExtractor={(i) => i.IdIncidente ?? i.idIncidente ?? i.fecha}
            onRowClick={verDetalle}
          />
        </div>

        {incidenteSel && (
          <div className="w-80 shrink-0 rounded-2xl border border-gray-100 bg-white p-6 shadow-card max-h-[80vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Detalles</h3>
              <button onClick={cerrarDetalle} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>

            {cargandoDetalle ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : infoDetalle ? (
              <>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Cliente</p>
                    <p className="font-medium">{infoDetalle.NombreCliente ?? infoDetalle.nombreCliente ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Empresa</p>
                    <p className="font-medium">{infoDetalle.Empresa ?? infoDetalle.empresa ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Dirección</p>
                    <p className="font-medium">{infoDetalle.DireccionServicio ?? infoDetalle.direccionServicio ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tipo Servicio</p>
                    <p className="font-medium">{infoDetalle.TipoServicio ?? infoDetalle.tipoServicio ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Descripción</p>
                    <p className="text-sm">{infoDetalle.descripcion ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fecha</p>
                    <p className="font-medium">{infoDetalle.fecha ? new Date(infoDetalle.fecha).toLocaleDateString('es-BO') : '-'}</p>
                  </div>
                  {(infoDetalle.ContectoEmergencia ?? infoDetalle.contectoEmergencia) && (
                    <div>
                      <p className="text-xs text-gray-500">Contacto Emergencia</p>
                      <p className="font-medium">{infoDetalle.ContectoEmergencia ?? infoDetalle.contectoEmergencia}</p>
                    </div>
                  )}
                  {(infoDetalle.Telefonos ?? infoDetalle.telefonos ?? []).length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500">Teléfonos</p>
                      {(infoDetalle.Telefonos ?? infoDetalle.telefonos ?? []).map((t, i) => (
                        <p key={i} className="text-sm">{(t.telefono ?? t.descripcion)} ({t.descripcion})</p>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Sin información</p>
            )}
          </div>
        )}
      </div>

      {/* Modal Crear */}
      {modalCrear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nuevo Incidente</h2>
              <button onClick={() => setModalCrear(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={crearIncidente} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Fecha</label>
                <input name="fecha" type="date" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
                <textarea name="descripcion" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" rows={4} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalCrear(false)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="rounded-xl bg-chuxna px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
