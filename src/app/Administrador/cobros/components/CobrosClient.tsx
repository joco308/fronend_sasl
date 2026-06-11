'use client'

import { useState, useCallback } from 'react'
import { CobrosService } from '@/lib/api/cobros.service'
import TablaGenerica from '../../components/TablaGenerica'
import type {
  ListarCobro, InfoCobro, ListarPago, ListarQr,
} from '@/lib/api/types'

interface Props {
  cobros: ListarCobro[]
}

export default function CobrosClient({ cobros: datosIniciales }: Props) {
  const [datos, setDatos] = useState(datosIniciales)
  const [error, setError] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')

  const [cobroSel, setCobroSel] = useState<ListarCobro | null>(null)
  const [infoDetalle, setInfoDetalle] = useState<InfoCobro | null>(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)

  const [pagos, setPagos] = useState<ListarPago[]>([])
  const [cargandoPagos, setCargandoPagos] = useState(false)

  const [qrs, setQrs] = useState<ListarQr[]>([])
  const [cargandoQrs, setCargandoQrs] = useState(false)

  const [modalCrear, setModalCrear] = useState(false)
  const [modalPago, setModalPago] = useState(false)
  const [modalQrs, setModalQrs] = useState(false)
  const [modalCrearQr, setModalCrearQr] = useState(false)

  async function refrescar() {
    const nueva = await CobrosService.listar()
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

  const verDetalle = useCallback(async (c: ListarCobro) => {
    setCobroSel(c)
    setCargandoDetalle(true)
    setError('')
    try {
      const [info, listaPagos] = await Promise.all([
        CobrosService.info(c.IdCobro),
        CobrosService.listarPagos(c.IdCobro),
      ])
      setInfoDetalle(info)
      setPagos(listaPagos)
    } catch {
      setError('Error al cargar detalle.')
    } finally {
      setCargandoDetalle(false)
    }
  }, [])

  async function abrirQrs() {
    setModalQrs(true)
    setCargandoQrs(true)
    try {
      const lista = await CobrosService.listarQrs()
      setQrs(lista)
    } catch {
      mostrarError('Error al cargar QRs.')
    } finally {
      setCargandoQrs(false)
    }
  }

  async function crearCobro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      await CobrosService.crear({
        IdServicio: Number(fd.get('servicio')),
        IDQr: Number(fd.get('qr')),
        IdCliente: Number(fd.get('cliente')),
        DiaMesPagar: Number(fd.get('diaMesPagar')),
        Monto: fd.get('monto') ? Number(fd.get('monto')) : null,
      })
      setModalCrear(false)
      mostrarExito('Cobro creado.')
      await refrescar()
    } catch {
      mostrarError('Error al crear cobro.')
    }
  }

  async function registrarPago(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!cobroSel) return
    const fd = new FormData(e.currentTarget)
    try {
      await CobrosService.registrarPago({
        IdCobro: cobroSel.IdCobro,
        Descripcion: (fd.get('descripcion') as string) || null,
      })
      setModalPago(false)
      mostrarExito('Pago registrado.')
      if (cobroSel) await verDetalle(cobroSel)
      await refrescar()
    } catch {
      mostrarError('Error al registrar pago.')
    }
  }

  async function crearQr(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const imgFile = (fd.get('imgQr') as File)
    try {
      await CobrosService.crearQr({
        Descripcion: fd.get('descripcion') as string,
        imgQr: '',
        FechaExpiracionQr: fd.get('fechaExpiracion') as string,
      }, imgFile)
      setModalCrearQr(false)
      mostrarExito('QR creado.')
    } catch {
      mostrarError('Error al crear QR.')
    }
  }

  function cerrarDetalle() {
    setCobroSel(null)
    setInfoDetalle(null)
    setPagos([])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{datos.length} cobro(s) registrado(s)</p>
        <div className="flex gap-2">
          <button onClick={abrirQrs} className="btn-secundario">Ver QRs</button>
          <button onClick={() => setModalCrearQr(true)} className="btn-secundario">+ Nuevo QR</button>
          <button onClick={() => setModalCrear(true)} className="btn-primario">+ Nuevo Cobro</button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
      {mensajeExito && <div className="bg-green-50 text-green-700 p-3 rounded text-sm">{mensajeExito}</div>}

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <TablaGenerica
            columnas={[
              { key: 'IdCobro', header: 'ID' },
              { key: 'NombreCliente', header: 'Cliente' },
              {
                key: 'NombreEmpresa',
                header: 'Empresa',
                render: (c) => c.NombreEmpresa ?? '-',
              },
              {
                key: 'Monto',
                header: 'Monto',
                render: (c) => (c.Monto != null ? `$${c.Monto.toLocaleString()}` : '-'),
              },
              {
                key: 'Vigente',
                header: 'Estado',
                render: (c) =>
                  c.Vigente ? (
                    <span className="rounded-full bg-chuxna-light px-2.5 py-0.5 text-xs font-semibold text-chuxna-dark">
                      Vigente
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                      Pagado
                    </span>
                  ),
              },
              {
                key: 'DiaMesPagar',
                header: 'Día de Pago',
                render: (c) => `Día ${c.DiaMesPagar}`,
              },
            ]}
            datos={datos}
            keyExtractor={(c) => c.IdCobro}
            onRowClick={verDetalle}
          />
        </div>

        {cobroSel && (
          <div className="w-80 shrink-0 bg-white border rounded-lg p-4 space-y-3 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Detalle</h3>
              <button onClick={cerrarDetalle} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>

            {cargandoDetalle ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : infoDetalle ? (
              <>
                <div>
                  <p className="text-xs text-gray-500">Cliente</p>
                  <p className="font-medium">{infoDetalle.NomnreCliente}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Empresa</p>
                  <p className="font-medium">{infoDetalle.NombreEmpresa}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">NIT</p>
                  <p className="font-medium">{infoDetalle.Nit}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tipo Servicio</p>
                  <p className="font-medium">{infoDetalle.TipoServicio}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Monto</p>
                  <p className="font-medium">${infoDetalle.Monto?.toLocaleString('es-BO') ?? '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Día de Pago</p>
                  <p className="font-medium">Día {infoDetalle.DiaMesPagar}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Estado</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${infoDetalle.Vigente ? 'bg-chuxna-light text-chuxna-dark' : 'bg-gray-100 text-gray-500'}`}>
                    {infoDetalle.Vigente ? 'Vigente' : 'Pagado'}
                  </span>
                </div>

                {infoDetalle.InfoQrCobro && (
                  <div className="border-t pt-2">
                    <p className="text-xs text-gray-500 mb-1">QR Asociado</p>
                    <p className="text-sm">ID: {infoDetalle.InfoQrCobro.IDQr}</p>
                    <p className="text-sm">Usuario: {infoDetalle.InfoQrCobro.NombreUsuario}</p>
                    <p className="text-sm">Emisión: {new Date(infoDetalle.InfoQrCobro.FechaEmitida).toLocaleDateString('es-BO')}</p>
                    <p className="text-sm">Expira: {new Date(infoDetalle.InfoQrCobro.FechaExpiracion).toLocaleDateString('es-BO')}</p>
                  </div>
                )}

                {pagos.length > 0 && (
                  <div className="border-t pt-2">
                    <p className="text-xs text-gray-500 mb-1">Pagos ({pagos.length})</p>
                    {pagos.map((p, i) => (
                      <div key={i} className="text-sm border-b last:border-0 pb-1 mb-1">
                        <p>${p.IdPago} — {new Date(p.FechaPago).toLocaleDateString('es-BO')}</p>
                        {p.Descripcion && <p className="text-xs text-gray-500">{p.Descripcion}</p>}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-2">
                  <button onClick={() => setModalPago(true)} className="btn-primario text-sm">Registrar pago</button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Seleccione un cobro</p>
            )}
          </div>
        )}
      </div>

      {/* Modal Crear Cobro */}
      {modalCrear && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Nuevo Cobro</h2>
            <form onSubmit={crearCobro} className="space-y-3">
              <div>
                <label className="label">ID Servicio</label>
                <input name="servicio" type="number" required className="input" />
              </div>
              <div>
                <label className="label">ID QR</label>
                <input name="qr" type="number" required className="input" />
              </div>
              <div>
                <label className="label">ID Cliente</label>
                <input name="cliente" type="number" required className="input" />
              </div>
              <div>
                <label className="label">Día del Mes para Pagar</label>
                <input name="diaMesPagar" type="number" min={1} max={31} required className="input" />
              </div>
              <div>
                <label className="label">Monto (opcional)</label>
                <input name="monto" type="number" step="0.01" className="input" />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setModalCrear(false)} className="btn-secundario">Cancelar</button>
                <button type="submit" className="btn-primario">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Pago */}
      {modalPago && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Registrar Pago</h2>
            <form onSubmit={registrarPago} className="space-y-3">
              <div>
                <label className="label">Descripción (opcional)</label>
                <textarea name="descripcion" className="input" rows={3} />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setModalPago(false)} className="btn-secundario">Cancelar</button>
                <button type="submit" className="btn-primario">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Listar QRs */}
      {modalQrs && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Códigos QR</h2>
              <button onClick={() => setModalQrs(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            {cargandoQrs ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : qrs.length === 0 ? (
              <p className="text-sm text-gray-500">No hay QRs registrados.</p>
            ) : (
              <div className="space-y-2">
                {qrs.map((qr) => (
                  <div key={qr.IdQr} className="border rounded p-3 text-sm">
                    <p><strong>ID:</strong> {qr.IdQr}</p>
                    <p><strong>Descripción:</strong> {qr.Descripcion ?? '-'}</p>
                    <p><strong>Emisión:</strong> {new Date(qr.FechaEmitida).toLocaleDateString('es-BO')}</p>
                    <button
                      onClick={async () => {
                        try {
                          const blob = await CobrosService.obtenerImagenQr(qr.IdQr)
                          const url = window.URL.createObjectURL(blob)
                          window.open(url, '_blank')
                        } catch {
                          mostrarError('Error al obtener imagen QR.')
                        }
                      }}
                      className="text-xs text-blue-600 hover:underline mt-1"
                    >
                      Ver imagen
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Crear QR */}
      {modalCrearQr && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Nuevo Código QR</h2>
            <form onSubmit={crearQr} className="space-y-3">
              <div>
                <label className="label">Descripción</label>
                <input name="descripcion" required className="input" />
              </div>
              <div>
                <label className="label">Imagen QR</label>
                <input name="imgQr" type="file" accept="image/*" required className="input" />
              </div>
              <div>
                <label className="label">Fecha de Expiración</label>
                <input name="fechaExpiracion" type="date" required className="input" />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setModalCrearQr(false)} className="btn-secundario">Cancelar</button>
                <button type="submit" className="btn-primario">Crear QR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
