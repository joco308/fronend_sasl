import { peticion, cookieHeader } from './client'
import type { CatalogoDTO } from './types'

export const CatalogosService = {
  obtener: (nombre: string, tokenSesion?: string) =>
    peticion<CatalogoDTO[]>(`/Api/Catalogos/${encodeURIComponent(nombre)}`, tokenSesion ? { headers: cookieHeader(tokenSesion) } : undefined),
}
