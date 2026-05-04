import Navbar              from '@/components/organisms/Navbar'
import SeccionHero         from '@/components/organisms/SeccionHero'
import SeccionNosotros     from '@/components/organisms/SeccionNosotros'
import SeccionServicios    from '@/components/organisms/SeccionServicios'
import SeccionLicencias    from '@/components/organisms/SeccionLicencias'
import PiePagina           from '@/components/organisms/PiePagina'
import BotonVolverArriba   from '@/components/BotonVolverArriba'

/* SSG por defecto en Next.js App Router — sin datos dinámicos */
export default function PaginaInicio() {
  return (
    <>
      <Navbar />
      <main>
        <SeccionHero />
        <SeccionNosotros />
        <SeccionServicios />
        <SeccionLicencias />
      </main>
      <PiePagina />
      <BotonVolverArriba />
    </>
  )
}