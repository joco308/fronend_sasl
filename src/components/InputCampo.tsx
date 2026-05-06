interface Props {
  id:           string
  label:        string
  type?:        string
  placeholder?: string
  value:        string
  onChange:     (valor: string) => void
  required?:    boolean
  disabled?:    boolean
  maxLength?:   number
}

export default function InputCampo({
  id,
  label,
  type        = 'text',
  placeholder = '',
  value,
  onChange,
  required    = false,
  disabled    = false,
  maxLength,
}: Props) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete={type === 'password' ? 'current-password' : 'username'}
      />
    </div>
  )
}