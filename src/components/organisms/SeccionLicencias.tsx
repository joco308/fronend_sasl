//import type { ReactNode }  from 'react'
import AnimacionEntrada    from '@/components/AnimacionEntrada'
import EncabezadoSeccion   from '@/components/molecules/EncabezadoSeccion'
import TarjetaLicencia, { type DatosLicencia } from '@/components/molecules/TarjetaLicencia'

const IconoDocumento = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const IconoGlobo = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
  </svg>
)

const licencias: DatosLicencia[] = [
    {
    variante: 'azul',
    icono:    IconoDocumento,
    titulo:   'Licencias y Certificaciones',
    items: [
        'Registro de Empresa legalmente constituida',
        'Número de Identificación Tributaria (NIT) activo',
        'Matrícula de Comercio vigente (SEPREC)',
        'Cumplimiento de normativa laboral boliviana',
        'Capacitación en bioseguridad y manejo de sustancias químicas',
        'Protocolos alineados a estándares institucionales y de salud',
        ],
    },
    {
    variante: 'verde',
    icono:    IconoGlobo,
    titulo:   'Pólizas y Seguros',
    items: [
        'Seguro de Responsabilidad Civil (daños a terceros)',
        'Seguro contra Accidentes Personales del personal operativo',
        'Cobertura de riesgos laborales',
        'Compromiso de cumplimiento de condiciones contractuales',
        'Protección y resguardo de bienes dentro de las instalaciones intervenidas',
        ],
    },
]

export default function SeccionLicencias() {
return (
    <section id="licencias" className="section-pad bg-white flex flex-col items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-10"></div>
            <AnimacionEntrada className="section-header">
                <EncabezadoSeccion
                    etiqueta="Respaldo Legal"
                    titulo={<>Licencias <span className="text-gradient">y Pólizas</span></>}
                    subtitulo="Trabajamos cumpliendo todas las normativas vigentes en el Estado Plurinacional de Bolivia, garantizando un servicio seguro, confiable y respaldado legalmente."
                />
            </AnimacionEntrada>

        <div className="grid md:grid-cols-2 gap-8 mt-16 w-400">
        {licencias.map((licencia, indice) => (
            <AnimacionEntrada
            key={licencia.titulo}
            demora={indice === 1 ? 'delay-150' : ''}
            >
            <TarjetaLicencia licencia={licencia} />
            </AnimacionEntrada>
        ))}
        </div>

        {/* Banner de compromiso */}
        <AnimacionEntrada className="commitment-banner mt-10">
            <div className="commitment-icon">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </div>
            <div>
                <h4 className="font-display font-bold text-white text-lg mb-1">
                Nuestro Compromiso
                </h4>
                <p className="text-navy-100 text-sm leading-relaxed">
                Garantizamos que todo nuestro personal cuenta con la protección adecuada (EPPs), está debidamente
                capacitado y opera bajo estrictos controles de seguridad.
                </p>
            </div>
        </AnimacionEntrada>
    </section>
)}