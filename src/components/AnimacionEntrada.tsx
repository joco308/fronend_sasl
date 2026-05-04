'use client'

import { useEffect, useRef, type ReactNode, type ElementType } from 'react'


interface Props {
  children: ReactNode
  className?: string
  demora?:   '' | 'delay-150' | 'delay-200' | 'delay-300'
  etiqueta?: ElementType
}

export default function AnimacionEntrada({
  children,
  className = '',
  demora    = '',
  etiqueta: Etiqueta = 'div',
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    /* Fallback si el navegador no soporta IntersectionObserver */
    if (!('IntersectionObserver' in window)) {
      el.classList.add('visible')
      return
    }

    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visible')
            observer.unobserve(entrada.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const clases = ['fade-up', demora, className].filter(Boolean).join(' ')

  return (
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    <Etiqueta ref={ref as any} className={clases}>
      {children}
    </Etiqueta>
  )
}