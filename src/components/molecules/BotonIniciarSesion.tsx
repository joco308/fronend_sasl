import Link from 'next/link'
import IconoCandado from '@/components/atoms/IconoCandado'

type Variante = 'solido' | 'verde' | 'contorno' | 'contorno-blanco'
type Tamaño   = 'md' | 'sm'

interface Props {
  variante?:  Variante
  tamaño?:    Tamaño
  className?: string
  children?:  string
}

const estiloVariante: Record<Variante, string> = {
  'solido':          'btn-login btn-login-solido',
  'verde':           'btn-login btn-login-verde',
  'contorno':        'btn-login btn-login-contorno',
  'contorno-blanco': 'btn-login btn-login-contorno-blanco',
}

export default function BotonIniciarSesion({
  variante  = 'solido',
  tamaño    = 'md',
  className = '',
  children  = 'Iniciar Sesión',
}: Props) {
  const clases = [
    estiloVariante[variante],
    tamaño === 'sm' ? 'btn-login-sm' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <Link href="/login" className={clases}>
      <IconoCandado className="icono-login h-4 w-4" />
      <span>{children}</span>
    </Link>
  )
}