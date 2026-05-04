'use client'

import { useState, useEffect } from 'react'

export default function BotonVolverArriba() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const manejarScroll = () => setVisible(window.scrollY > 300)
    manejarScroll()
    window.addEventListener('scroll', manejarScroll, { passive: true })
    return () => window.removeEventListener('scroll', manejarScroll)
  }, [])

  const irArriba = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      aria-label="Volver arriba"
      onClick={irArriba}
      className={`back-to-top-btn ${visible ? 'visible' : ''}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  )
}