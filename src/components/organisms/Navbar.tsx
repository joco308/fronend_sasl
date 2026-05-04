'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import BotonCTA from '@/components/atoms/BotonCTA'

const enlaces = [
  { href: '#inicio',    etiqueta: 'Inicio' },
  { href: '#nosotros',  etiqueta: 'Sobre Nosotros' },
  { href: '#servicios', etiqueta: 'Servicios' },
  { href: '#licencias', etiqueta: 'Licencias' },
  { href: '#contacto',  etiqueta: 'Contacto' },
]

export default function Navbar() {
  const [desplazado,   setDesplazado]   = useState(false)
  const [menuAbierto,  setMenuAbierto]  = useState(false)
  const [seccionActiva, setSeccionActiva] = useState('')

  const refMenu  = useRef<HTMLDivElement>(null)
  const refBoton = useRef<HTMLButtonElement>(null)

  /* ── Scroll: fondo del navbar y enlace activo ── */
  useEffect(() => {
    const manejarScroll = () => {
      setDesplazado(window.scrollY > 40)

      const scrollY    = window.scrollY
      const alturaNav  = 80
      let actual       = ''

      document.querySelectorAll<HTMLElement>('section[id], footer[id]').forEach((seccion) => {
        const arriba = seccion.offsetTop - alturaNav - 60
        const abajo  = arriba + seccion.offsetHeight
        if (scrollY >= arriba && scrollY < abajo) actual = seccion.id
      })

      setSeccionActiva(actual)
    }

    manejarScroll()
    window.addEventListener('scroll', manejarScroll, { passive: true })
    return () => window.removeEventListener('scroll', manejarScroll)
  }, [])

  const cerrarMenu = () => {
    setMenuAbierto(false)
    document.body.style.overflow = ''
  }
  const abrirMenu = () => {
    setMenuAbierto(true)
    document.body.style.overflow = 'hidden'
  }

  /* ── Cerrar menú al hacer clic fuera ── */
  useEffect(() => {
    if (!menuAbierto) return

    const manejarClickFuera = (e: MouseEvent) => {
      if (
        refMenu.current  && !refMenu.current.contains(e.target  as Node) &&
        refBoton.current && !refBoton.current.contains(e.target as Node)
      ) {
        cerrarMenu()
      }
    }

    document.addEventListener('click', manejarClickFuera)
    return () => document.removeEventListener('click', manejarClickFuera)
  }, [menuAbierto])



  const alternarMenu = () => (menuAbierto ? cerrarMenu() : abrirMenu())

  return (
    <header
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300${desplazado ? ' scrolled' : ''}`}
    >
      <div className="navbar-inner">
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">

          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-3 group" aria-label="Inicio">
            <Image
              src="/logo.svg"
              alt="Marka Ch'uxña Multiservicios S.R.L."
              width={80}
              height={80}
              className="rounded-full object-contain"
            />
          </a>

          {/* Enlaces de escritorio */}
          <ul className="hidden lg:flex items-center gap-1">
            {enlaces.map(({ href, etiqueta }) => (
              <li key={href}>
                <a
                  href={href}
                  className={`nav-link${seccionActiva === href.slice(1) ? ' active-link' : ''}`}
                >
                  {etiqueta}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA escritorio */}
          <BotonCTA href="#contacto" className="hidden lg:inline-flex">
            Atención al Cliente
          </BotonCTA>

          {/* Botón hamburguesa */}
          <button
            id="menu-btn"
            ref={refBoton}
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={alternarMenu}
            className={`lg:hidden flex flex-col gap-[5px] p-2 z-50 relative${menuAbierto ? ' open' : ''}`}
          >
            <span className="ham-line" />
            <span className="ham-line" />
            <span className="ham-line" />
          </button>
        </nav>
      </div>

      {/* Menú móvil */}
      <div
        id="mobile-menu"
        ref={refMenu}
        aria-hidden={!menuAbierto}
        className={`mobile-menu-panel lg:hidden${menuAbierto ? ' open' : ''}`}
      >
        <ul className="flex flex-col gap-1 p-6">
          {enlaces.map(({ href, etiqueta }) => (
            <li key={href}>
              <a href={href} className="mobile-link" onClick={cerrarMenu}>
                {etiqueta}
              </a>
            </li>
          ))}
          <li className="pt-4">
            <BotonCTA href="#contacto" className="w-full justify-center" click={cerrarMenu}>
              Atención al Cliente
            </BotonCTA>
          </li>
        </ul>
      </div>
    </header>
  )
}