import type { ReactNode } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

export const metadata = {
  title: "Panel Administrativo — Marka Ch'uxña Multiservicios S.R.L.",
  description: 'Panel de administración del sistema SASL.',
}

export default function AdministradorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      <Sidebar />
      <div className="flex flex-1 flex-col lg:ml-64">
        <Header />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
