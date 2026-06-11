import { peticion, peticionBinaria, peticionFormData, cookieHeader } from './client'
import type {
  ListarCobro,
  InfoCobro,
  CrearCobro,
  RegistrarPago,
  ListarPago,
  PagoRealizado,
  ListarQr,
  CrearQr,
} from './types'

export const CobrosService = {
  listar: (tokenSesion?: string) =>
    peticion<ListarCobro[]>('/Api/Cobros', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),

  info: (id: number) =>
    peticion<InfoCobro>(`/Api/Cobros/${id}`),

  crear: (data: CrearCobro) =>
    peticion<void>('/Api/Cobros', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /* Pagos */
  registrarPago: (data: RegistrarPago) =>
    peticion<void>('/Api/Cobros/pagos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listarPagos: (idCobro: number) =>
    peticion<ListarPago[]>(`/Api/Cobros/${idCobro}/pagos`),

  /* QR */
  listarQrs: (tokenSesion?: string) =>
    peticion<ListarQr[]>('/Api/Cobros/qrs', tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),

  crearQr: (data: CrearQr, imgQr: File) => {
    const formData = new FormData()
    formData.append('Descripcion', data.Descripcion)
    formData.append('imgQr', imgQr)
    formData.append('FechaExpiracionQr', data.FechaExpiracionQr)
    return peticionFormData<void>('/Api/Cobros/qrs', formData)
  },

  obtenerImagenQr: (idQr: number) =>
    peticionBinaria(`/Api/Cobros/qrs/${idQr}/imagen`),

  /* Notificaciones cliente */
  notificarPago: (data: PagoRealizado) =>
    peticion<void>('/Api/Cobros/notificar-pago', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
