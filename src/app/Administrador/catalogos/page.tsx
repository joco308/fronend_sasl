import { cookies } from 'next/headers'
import { CatalogosService } from '@/lib/api/catalogos.service'
import TablaGenerica from '../components/TablaGenerica'
import EstadoError from '../components/EstadoError'
import EstadoVacio from '../components/EstadoVacio'
import type { CatalogoDTO } from '@/lib/api/types'

export const dynamic = 'force-dynamic'

const catalogosDisponibles = [
  { nombre: 'roles', etiqueta: 'Roles' },
  { nombre: 'estados-civiles', etiqueta: 'Estados Civiles' },
  { nombre: 'grados-academicos', etiqueta: 'Grados Académicos' },
  { nombre: 'generos', etiqueta: 'Géneros' },
  { nombre: 'paises', etiqueta: 'Países' },
  { nombre: 'zonas', etiqueta: 'Zonas' },
  { nombre: 'empresas', etiqueta: 'Empresas' },
  { nombre: 'tipos-servicio', etiqueta: 'Tipos de Servicio' },
  { nombre: 'tipos-maquinaria', etiqueta: 'Tipos de Maquinaria' },
  { nombre: 'estados-calidad', etiqueta: 'Estados de Calidad' },
  { nombre: 'marcas-maquinaria', etiqueta: 'Marcas de Maquinaria' },
  { nombre: 'tipos-recurso', etiqueta: 'Tipos de Recurso' },
  { nombre: 'tipos-documento', etiqueta: 'Tipos de Documento' },
  { nombre: 'satisfaccion', etiqueta: 'Satisfacción' },
  { nombre: 'detalle-telefono', etiqueta: 'Detalles de Teléfono' },
  { nombre: 'dias-laborales', etiqueta: 'Días Laborales' },
  { nombre: 'carreras', etiqueta: 'Carreras' },
]

export default async function PaginaCatalogos() {
  const cookieStore = await cookies()
  const tokenSesion = cookieStore.get('token_sesion')?.value ?? ''
  const resultados = await Promise.allSettled(
    catalogosDisponibles.map((c) =>
      CatalogosService.obtener(c.nombre, tokenSesion).then((data) => ({ ...c, data })),
    ),
  )

  const catalogos = resultados
    .filter((r) => r.status === 'fulfilled')
    .map((r) => (r as PromiseFulfilledResult<{ nombre: string; etiqueta: string; data: CatalogoDTO[] }>).value)

  const errores = resultados.filter((r) => r.status === 'rejected').length

  if (catalogos.length === 0) {
    return <EstadoError mensaje="No se pudieron cargar los catálogos." />
  }

  return (
    <div className="space-y-8">
      {errores > 0 && (
        <p className="text-sm text-amber-600">
          {errores} catálogo(s) no pudieron cargarse.
        </p>
      )}

      {catalogos.map(({ nombre, etiqueta, data }) => (
        <div key={nombre}>
          <h2 className="mb-3 font-display text-base font-bold text-navy-900">{etiqueta}</h2>
          {data.length === 0 ? (
            <EstadoVacio mensaje={`No hay registros en ${etiqueta.toLowerCase()}.`} />
          ) : (
            <TablaGenerica
              columnas={[
                { key: 'Id', header: 'ID' },
                { key: 'Detalle', header: 'Detalle' },
              ]}
              datos={data}
              keyExtractor={(d) => d.Id}
            />
          )}
        </div>
      ))}
    </div>
  )
}
