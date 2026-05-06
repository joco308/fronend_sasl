'use client'

import { useAutenticacion }        from '../hooks/useAutenticacion'
import VisualLogin                 from './VisualLogin'
import FormularioCredenciales      from './FormularioCredenciales'
import DobleFactor                 from './DobleFactor'

export default function ContenedorLogin() {
  const {
    paso,
    cargando,
    error,
    verificarCredenciales,
    verificarCodigo,
    volverACredenciales,
  } = useAutenticacion()

  return (
    <div className="login-container">
      <VisualLogin />

      <div className="login-form-section">
        {paso === 'credenciales' ? (
          <FormularioCredenciales
            onSubmit={verificarCredenciales}
            cargando={cargando}
            error={error}
          />
        ) : (
          <DobleFactor
            onSubmit={verificarCodigo}
            onVolver={volverACredenciales}
            cargando={cargando}
            error={error}
          />
        )}
      </div>
    </div>
  )
}