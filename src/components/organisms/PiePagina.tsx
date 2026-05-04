//import type { ReactNode } from 'react'
import AnimacionEntrada from '@/components/AnimacionEntrada'
import EncabezadoSeccion from '@/components/molecules/EncabezadoSeccion'
import TarjetaContacto from '@/components/molecules/TarjetaContacto'

const IconoUbicacion = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const IconoCorreo = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const IconoWhatsApp = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const IconoWhatsAppPequeno = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-chuxna" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function PiePagina() {
  return (
    <footer id="contacto" className="contact-section">

      {/* Ola superior */}
      <div className="wave-top" aria-hidden="true">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,40 C360,0 1080,80 1440,40 L1440,0 L0,0 Z" fill="white" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-12">

        {/* Encabezado de contacto */}
        <AnimacionEntrada className="section-header mb-16">
          <EncabezadoSeccion
            etiqueta="Estamos aquí para ti"
            titulo="Contáctanos"
            subtitulo={
              <>
                Para cotizaciones, contrataciones o consultas sobre nuestros métodos de pago{' '}
                <strong className="text-white">(Cheque, Efectivo o Transferencia Bancaria)</strong>,
                comuníquese directamente con nuestra línea de atención al cliente.
              </>
            }
            variante="oscuro"
          />
        </AnimacionEntrada>

        {/* Tarjetas de contacto */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">

          {/* Ubicación */}
          <AnimacionEntrada>
            <TarjetaContacto icono={IconoUbicacion} titulo="Ubicación">
              <p className="contact-card-text">
                Zona Alto Lima<br />
                Av. Pacífico, Calle San Antonio Nro. 70<br />
                La Paz, Bolivia
              </p>
            </TarjetaContacto>
          </AnimacionEntrada>

          {/* Correo */}
          <AnimacionEntrada demora="delay-150">
            <TarjetaContacto icono={IconoCorreo} titulo="Correo Electrónico">
              <a
                href="mailto:markachuxnamultiservicios@gmail.com"
                className="contact-card-link break-all"
              >
                markachuxnamultiservicios<br />@gmail.com
              </a>
            </TarjetaContacto>
          </AnimacionEntrada>

          {/* Teléfonos */}
          <AnimacionEntrada demora="delay-300">
            <TarjetaContacto icono={IconoWhatsApp} titulo="WhatsApp / Teléfono">
              <div className="flex flex-col gap-2 mt-1">
                <a
                  href="https://wa.me/59175816331"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-phone-link"
                >
                  {IconoWhatsAppPequeno}
                  75816331
                </a>
                <a
                  href="https://wa.me/59164255484"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-phone-link"
                >
                  {IconoWhatsAppPequeno}
                  64255484
                </a>
              </div>
            </TarjetaContacto>
          </AnimacionEntrada>

        </div>

        {/* Barra inferior */}
        <div className="footer-bottom">
          <div className="footer-logo-area">
            <p className="text-navy-300 text-sm mt-2">La limpieza empieza con nosotros</p>
          </div>
          <div className="footer-copy">
            <p className="text-navy-400 text-xs">
              © 2025 MARKA CHUXÑA MULTISERVICIOS S.R.L. — Bolivia. Todos los derechos reservados.
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}