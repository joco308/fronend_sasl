'use client'

import { useState }   from 'react'
import InputCampo     from '@/components/InputCampo'
import BotonPrincipal from '@/components/BotonPrincipal'

interface Props {
  onSubmit:  (codigo: string) => Promise<void>
  onVolver:  () => void
  cargando:  boolean
  error:     string | null
}

export default function DobleFactor({ onSubmit, onVolver, cargando, error }: Props) {
  const [codigo, setCodigo] = useState('')

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(codigo)
  }

  const soloNumeros = (valor: string) => {
    const limpio = valor.replace(/\D/g, '').slice(0, 6)
    setCodigo(limpio)
  }

  return (
    <form className="login-form" onSubmit={manejarEnvio} noValidate>
      <div className="form-header">
        <h1>Verificación</h1>
        <p>Revisa tu correo e ingresa el código de 6 dígitos</p>
      </div>

      <InputCampo
        id="codigo2fa"
        label="Código de verificación"
        type="text"
        placeholder="_ _ _ _ _ _"
        value={codigo}
        onChange={soloNumeros}
        required
        disabled={cargando}
        maxLength={6}
      />

      <p className="codigo-hint">El código expira en 10 minutos.</p>

      {error && <p className="login-error">{error}</p>}

      <BotonPrincipal
        type="submit"
        cargando={cargando}
        disabled={codigo.length !== 6}
      >
        {cargando ? 'Verificando...' : 'Verificar Código'}
      </BotonPrincipal>

      <button
        type="button"
        className="btn-back"
        onClick={onVolver}
        disabled={cargando}
      >
        ← Volver al inicio de sesión
      </button>
    </form>
  )
}