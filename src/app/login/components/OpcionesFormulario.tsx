interface Props {
  recordarme:   boolean
  onChange:     (valor: boolean) => void
}

export default function OpcionesFormulario({ recordarme, onChange }: Props) {
  return (
    <div className="form-options">
      <label className="remember-me">
        <input
          type="checkbox"
          checked={recordarme}
          onChange={(e) => onChange(e.target.checked)}
        />
        Recordarme
      </label>
      <a href="#" className="forgot-pass">
        ¿Olvidaste tu contraseña?
      </a>
    </div>
  )
}