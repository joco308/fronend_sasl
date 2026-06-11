import { cookies } from 'next/headers'
import { UsuariosService } from '@/lib/api/usuarios.service'
import { CatalogosService } from '@/lib/api/catalogos.service'
import UsuariosClient from './components/UsuariosClient'
import EstadoError from '../components/EstadoError'
import type { UsuarioDatos, CatalogoDTO } from '@/lib/api/types'

export const dynamic = 'force-dynamic'

const catalogosACargar = [
  'roles',
  'estados-civiles',
  'grados-academicos',
  'generos',
  'paises',
  'zonas',
  'carreras',
] as const

type NombreCatalogo = (typeof catalogosACargar)[number]

export default async function PaginaUsuarios() {
  const cookieStore = await cookies()
  const tokenSesion = cookieStore.get('token_sesion')?.value ?? ''

  let usuarios: UsuarioDatos[] = []
  let errorUsuarios = false

  try {
    usuarios = await UsuariosService.listar(tokenSesion)
  } catch {
    errorUsuarios = true
  }

  if (errorUsuarios) {
    return <EstadoError mensaje="No se pudieron cargar los usuarios." />
  }

  const catalogos = new Map<NombreCatalogo, CatalogoDTO[]>()
  const promesas = catalogosACargar.map(async (nombre) => {
    try {
      const data = await CatalogosService.obtener(nombre, tokenSesion)
      catalogos.set(nombre, data.map((item) => ({
        Id: (item as any).Id ?? (item as any).id ?? (item as any).idSubDominio ?? 0,
        Detalle: (item as any).Detalle ?? (item as any).detalle ?? (item as any).nombre ?? (item as any).Nombre ?? '',
      })))
    } catch {
      catalogos.set(nombre, [])
    }
  })

  await Promise.allSettled(promesas)

  return (
    <UsuariosClient
      usuarios={usuarios}
      roles={catalogos.get('roles') ?? []}
      estadosCiviles={catalogos.get('estados-civiles') ?? []}
      gradosAcademicos={catalogos.get('grados-academicos') ?? []}
      generos={catalogos.get('generos') ?? []}
      paises={catalogos.get('paises') ?? []}
      zonas={catalogos.get('zonas') ?? []}
      carreras={catalogos.get('carreras') ?? []}
    />
  )
}
