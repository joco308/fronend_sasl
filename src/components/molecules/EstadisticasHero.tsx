const estadisticas = [
  { numero: '100%', etiqueta: 'Personal capacitado' },
  { numero: 'NIT',  etiqueta: 'Empresa certificada' },
  { numero: '24/7', etiqueta: 'Atención al cliente' },
]

export default function EstadisticasHero() {
  return (
    <div className="hero-stats mt-14">
      {estadisticas.map((stat, indice) => (
        <div key={stat.numero} className="contents">
          <div className="stat-item">
            <span className="stat-num">{stat.numero}</span>
            <span className="stat-label">{stat.etiqueta}</span>
          </div>
          {indice < estadisticas.length - 1 && (
            <div className="stat-divider" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  )
}