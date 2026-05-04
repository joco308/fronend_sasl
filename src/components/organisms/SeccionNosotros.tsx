import Image              from 'next/image'
import AnimacionEntrada   from '@/components/AnimacionEntrada'
import EncabezadoSeccion  from '@/components/molecules/EncabezadoSeccion'
import ItemCaracteristica from '@/components/molecules/ItemCaracteristica'

const caracteristicas = [
  'Compromiso con la calidad del servicio',
  'Personal calificado y en constante capacitación',
  'Cumplimiento de normas laborales y de seguridad',
  'Uso de insumos adecuados y protocolos eficientes',
  'Supervisión continua y mejora permanente',
]

export default function SeccionNosotros() {
  return (
    <section id="nosotros" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Encabezado */}
        <AnimacionEntrada className="section-header">
          <EncabezadoSeccion
            etiqueta="Quiénes Somos"
            titulo={<>Sobre <span className="text-gradient">Nosotros</span></>}
          />
        </AnimacionEntrada>

        {/* Dos columnas */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mt-16">

          {/* Texto */}
          <AnimacionEntrada>
            <p className="body-text mb-6">
              En <strong className="text-navy-700">MARKA CHUXÑA MULTISERVICIOS S.R.L.</strong>, somos una empresa
              boliviana comprometida con la excelencia en la prestación de servicios integrales de limpieza,
              mantenimiento y apoyo logístico, orientados a satisfacer las necesidades de instituciones públicas y
              privadas a nivel nacional.
            </p>
            <p className="body-text mb-6">
              Desde nuestra creación, trabajamos con responsabilidad, eficiencia y ética profesional, brindando
              soluciones adaptadas a cada cliente. Nuestro principal objetivo es garantizar espacios limpios,
              seguros y saludables, contribuyendo al bienestar de las personas y al óptimo funcionamiento de las
              organizaciones.
            </p>
            <p className="body-text mb-10">
              Contamos con un equipo humano capacitado, equipado con herramientas modernas y con formación en
              bioseguridad, lo que nos permite atender tanto ambientes administrativos como áreas sensibles,
              incluyendo centros de salud y espacios de atención al público.
            </p>

            <div className="features-grid">
              {caracteristicas.map((texto) => (
                <ItemCaracteristica key={texto} texto={texto} />
              ))}
            </div>
          </AnimacionEntrada>

          {/* Imagen + cita */}
          <AnimacionEntrada className="flex flex-col gap-8" demora="delay-200">

            <div className="about-image-wrap">
              <div className="relative w-full h-72 lg:h-96 rounded-[1.75rem] overflow-hidden"
                   style={{ boxShadow: '0 12px 40px rgba(10,33,84,.16)' }}>
                <Image
                  src="/sobre_nosotros.png"
                  alt="Equipo Marka Ch'uxña"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="about-image-badge">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>

            {/* Tarjeta de cita */}
            <div className="quote-card">
              <div className="quote-mark"></div>
              <p className="quote-text">
                En <strong>MARKA CHUXÑA MULTISERVICIOS S.R.L.</strong>, entendemos que la limpieza no es solo una
                tarea operativa, sino un factor clave para la imagen, la salud y la productividad de nuestros
                clientes. Por ello, trabajamos cada día para consolidarnos como una empresa confiable, eficiente y
                líder en el sector multiservicios en Bolivia.
              </p>
              <p className="quote-footer">Su confianza es nuestro mayor compromiso.</p>
            </div>

          </AnimacionEntrada>
        </div>
      </div>
    </section>
  )
}