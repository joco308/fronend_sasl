//import type { ReactNode }  from 'react'
import AnimacionEntrada    from '@/components/AnimacionEntrada'
import EncabezadoSeccion   from '@/components/molecules/EncabezadoSeccion'
import TarjetaServicio, { type DatosServicio } from '@/components/molecules/TarjetaServicio'

/* Icono de edificio */
const IconoEdificio = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

/* Icono de escudo */
const IconoEscudo = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

/* Icono de portapapeles */
const IconoPortapapeles = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)

const servicios: DatosServicio[] = [
  {
    imagen:      '/limpieza_industria.png',
    alt:         'Limpieza Institucional',
    icono:       IconoEdificio,
    numero:      '01',
    titulo:      'Limpieza Institucional y Corporativa',
    descripcion: 'Mantenimiento de oficinas, edificios corporativos, dependencias gubernamentales y espacios administrativos con protocolos de limpieza profunda y desinfección.',
    caracteristicas: ['Limpieza diaria y periódica', 'Desinfección de superficies', 'Manejo de residuos sólidos'],
  },
  {
    imagen:      '/bioseguridad.png',
    alt:         'Mantenimiento y Bioseguridad',
    icono:       IconoEscudo,
    numero:      '02',
    titulo:      'Mantenimiento y Bioseguridad',
    descripcion: 'Servicios especializados para centros de salud, clínicas, laboratorios y espacios sensibles que requieren protocolos estrictos de bioseguridad y control sanitario.',
    caracteristicas: ['Desinfección hospitalaria', 'Uso de EPPs certificados', 'Control de agentes patógenos'],
  },
  {
    imagen:      '/logistica.png',
    alt:         'Apoyo Logístico Integral',
    icono:       IconoPortapapeles,
    numero:      '03',
    titulo:      'Apoyo Logístico Integral',
    descripcion: 'Gestión de suministros, coordinación de personal y soporte operativo para eventos institucionales, mudanzas corporativas y proyectos de gran escala.',
    caracteristicas: ['Coordinación de equipos', 'Gestión de insumos', 'Soporte en eventos'],
  },
]

const demorasServicio = ['', 'delay-150', 'delay-300'] as const

export default function SeccionServicios() {
  return (
    <section id="servicios" className="section-pad services-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <AnimacionEntrada className="section-header">
          <EncabezadoSeccion
            etiqueta="Lo que hacemos"
            titulo={<>Nuestros <span className="text-gradient">Servicios</span></>}
            subtitulo="Soluciones adaptadas a cada institución, con los más altos estándares de calidad y bioseguridad."
          />
        </AnimacionEntrada>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {servicios.map((servicio, indice) => (
            <AnimacionEntrada
              key={servicio.numero}
              demora={demorasServicio[indice] as '' | 'delay-150' | 'delay-300'}
            >
              <TarjetaServicio servicio={servicio} />
            </AnimacionEntrada>
          ))}
        </div>

      </div>
    </section>
  )
}