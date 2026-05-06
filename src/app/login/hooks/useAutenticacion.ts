'use client'

import { useState }    from 'react'
import { useRouter }   from 'next/navigation'

type Paso = 'credenciales' | 'doble-factor'

interface EstadoAuth {
  paso:      Paso
  cargando:  boolean
  error:     string | null
}

export function useAutenticacion() {
  const router = useRouter()

  const [estado, setEstado] = useState<EstadoAuth>({
    paso:     'credenciales',
    cargando: false,
    error:    null,
  })

  const verificarCredenciales = async (
    usuario:    string,
    contraseña: string,
    recordarme: boolean,
  ) => {
    setEstado((e) => ({ ...e, cargando: true, error: null }))

    try {
      const respuesta = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ usuario, contraseña, recordarme }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        setEstado((e) => ({
          ...e,
          cargando: false,
          error: datos.mensaje ?? 'Credenciales incorrectas.',
        }))
        return
      }

      /* Credenciales correctas → mostrar 2FA */
      setEstado({ paso: 'doble-factor', cargando: false, error: null })
    } catch {
      setEstado((e) => ({
        ...e,
        cargando: false,
        error: 'Error de conexión. Intente de nuevo.',
      }))
    }
  }

  const verificarCodigo = async (codigo: string) => {
    setEstado((e) => ({ ...e, cargando: true, error: null }))

    try {
      const respuesta = await fetch('/api/auth/verificar', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ codigo }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        setEstado((e) => ({
          ...e,
          cargando: false,
          error: datos.mensaje ?? 'Código incorrecto o expirado.',
        }))
        return
      }

      /* Código correcto → redirigir según rol */
      router.push(datos.redireccion ?? '/admin')
    } catch {
      setEstado((e) => ({
        ...e,
        cargando: false,
        error: 'Error de conexión. Intente de nuevo.',
      }))
    }
  }

  const volverACredenciales = () => {
    setEstado({ paso: 'credenciales', cargando: false, error: null })
  }

  return {
    paso:                 estado.paso,
    cargando:             estado.cargando,
    error:                estado.error,
    verificarCredenciales,
    verificarCodigo,
    volverACredenciales,
  }
}