import Image from 'next/image'
import AnimacionEntrada  from '@/components/AnimacionEntrada'
import BadgePill         from '@/components/atoms/BadgePill'
import BotonPrimario     from '@/components/atoms/BotonPrimario'
import BotonSecundario   from '@/components/atoms/BotonSecundario'
import EstadisticasHero  from '@/components/molecules/EstadisticasHero'

export default function SeccionHero() {
  return (
    <section
      id="inicio"
      className="hero-section relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Círculos decorativos de fondo */}
      <div className="hero-bg-circles" aria-hidden="true">
        <div className="circle circle-1" />
        <div className="circle circle-2" />
        <div className="circle circle-3" />
      </div>

      {/* Patrón de cuadrícula */}
      <div className="hero-grid" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full pt-28 pb-16 grid lg:grid-cols-2 gap-12 items-center">

        {/* Texto */}
        <AnimacionEntrada className="hero-text">
          <BadgePill>Empresa Boliviana Certificada</BadgePill>

          <h1 className="hero-title">
            Espacios <span className="text-gradient">limpios</span>,<br />
            instituciones <span className="text-gradient">confiables</span>
          </h1>

          <p className="hero-subtitle">
            Soluciones integrales de limpieza, mantenimiento y bioseguridad
            para instituciones públicas y privadas a nivel nacional.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <BotonPrimario href="#servicios">
              Conoce nuestros servicios
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </BotonPrimario>

            <BotonSecundario href="#contacto">
              Solicitar cotización
            </BotonSecundario>
          </div>

          <EstadisticasHero />
        </AnimacionEntrada>

        {/* Imagen */}
        <AnimacionEntrada className="hero-image-wrap" demora="delay-200">
          <div className="hero-image-frame">
            <Image
              src="/hero.png"
              alt="Equipo de limpieza profesional Marka Ch'uxña"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />

            {/* Tarjetas flotantes */}
            <div className="float-card float-card-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-chuxna"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Bioseguridad certificada</span>
            </div>

            <div className="float-card float-card-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-navy-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Equipo especializado</span>
            </div>
          </div>
        </AnimacionEntrada>

      </div>

      {/* Divisor de olas */}
      <div className="wave-divider" aria-hidden="true">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}