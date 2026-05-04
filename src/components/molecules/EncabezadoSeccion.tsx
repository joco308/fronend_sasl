import type { ReactNode } from 'react'
import EtiquetaSeccion from '@/components/atoms/EtiquetaSeccion'
import LineaDecorativa from '@/components/atoms/LineaDecorativa'

interface Props {
  etiqueta:   string
  titulo:     ReactNode
  subtitulo?: ReactNode
  variante?:  'default' | 'oscuro'
}

export default function EncabezadoSeccion({
  etiqueta,
  titulo,
  subtitulo,
  variante = 'default',
}: Props) {
  const esOscuro = variante === 'oscuro'

  return (
    <>
      <EtiquetaSeccion variante={esOscuro ? 'blanca' : 'default'}>
        {etiqueta}
      </EtiquetaSeccion>

      <h2 className={`section-title${esOscuro ? ' text-white' : ''}`}>
        {titulo}
      </h2>

      <LineaDecorativa verde={esOscuro} />

      {subtitulo && (
        <p className={`section-subtitle${esOscuro ? ' text-navy-200' : ''}`}>
          {subtitulo}
        </p>
      )}
    </>
  )
}