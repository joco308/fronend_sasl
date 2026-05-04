interface Props {
  /** true → sólido verde (para fondos oscuros del footer) */
  verde?: boolean
}

export default function LineaDecorativa({ verde = false }: Props) {
  return (
    <div
      className="section-line"
      style={verde ? { background: '#22c55e' } : undefined}
    />
  )
}