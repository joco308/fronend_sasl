import type { Metadata } from 'next'
import { Outfit, DM_Sans } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Marka Ch'uxña Multiservicios S.R.L. — La limpieza empieza con nosotros",
  description:
    'Empresa boliviana de limpieza institucional, mantenimiento y bioseguridad. Servicios integrales para instituciones públicas y privadas.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${dmSans.variable} scroll-smooth`}
    >
      <body className="font-body bg-white text-navy-900 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}