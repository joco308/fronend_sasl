'use client'

import { useState }          from 'react'
import InputCampo            from '@/components/InputCampo'
import BotonPrincipal        from '@/components/BotonPrincipal'
import Link from 'next/link'

interface Props {
  onSubmit:  (usuario: string, contraseña: string) => Promise<void>
  cargando:  boolean
  error:     string | null
}

export default function FormularioCredenciales({ onSubmit, cargando, error }: Props) {
  const [usuario,    setUsuario]    = useState('')
  const [contraseña, setContraseña] = useState('')

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(usuario, contraseña)
  }

  return (
    <form id="loginForm" className="login-form" onSubmit={manejarEnvio} noValidate>
      <div className="form-header">
        <h1>Iniciar Sesión</h1>
        <p>Ingresa tus credenciales para acceder</p>
      </div>

      <InputCampo
        id="username"
        label="Usuario o Correo"
        type="text"
        placeholder="ejemplo@markachuxna.com"
        value={usuario}
        onChange={setUsuario}
        required
        disabled={cargando}
      />

      <InputCampo
        id="password"
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={contraseña}
        onChange={setContraseña}
        required
        disabled={cargando}
      />

      {error && <p className="login-error">{error}</p>}

      <BotonPrincipal type="submit" cargando={cargando}>
        {cargando ? 'Verificando...' : 'Entrar al Sistema'}
      </BotonPrincipal>

      <Link href="/" className="btn-back">← Volver al inicio</Link>
    </form>
  )
}