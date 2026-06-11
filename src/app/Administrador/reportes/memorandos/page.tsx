'use client'

import { useState, useEffect } from 'react'
import { ReportesService } from '@/lib/api/reportes.service'
import { UsuariosService } from '@/lib/api/usuarios.service'
import type { UsuarioDatos, MemorandoDatos } from '@/lib/api/types'

export default function PaginaMemorandos() {
  const [error, setError] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')
  const [cargando, setCargando] = useState(false)

  const [usuarios, setUsuarios] = useState<UsuarioDatos[]>([])
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [pdfId, setPdfId] = useState('')

  const [memorandums, setMemorandums] = useState<MemorandoDatos[]>([])
  const [cargandoMemorandums, setCargandoMemorandums] = useState(false)

  function mostrarError(msg: string) {
    setError(msg)
    setTimeout(() => setError(''), 4000)
  }

  function mostrarExito(msg: string) {
    setMensajeExito(msg)
    setTimeout(() => setMensajeExito(''), 3000)
  }

  async function abrirFormulario() {
    setShowForm(true)
    setCargandoUsuarios(true)
    try {
      const lista = await UsuariosService.listar()
      setUsuarios(lista)
    } catch {
      mostrarError('Error al cargar usuarios.')
    } finally {
      setCargandoUsuarios(false)
    }
  }

  async function cargarMemorandums() {
    setCargandoMemorandums(true)
    try {
      const lista = await ReportesService.listarMemorandums()
      setMemorandums(lista)
    } catch {
      mostrarError('Error al cargar memorandums.')
    } finally {
      setCargandoMemorandums(false)
    }
  }

  // Cargar memorandums al montar el componente
  useEffect(() => {
    cargarMemorandums()
  }, [])

  async function crearMemorandum(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setCargando(true)
    try {
      await ReportesService.crearMemorandum({
        IdTrabajador: Number(fd.get('trabajador')),
        Descripcion: fd.get('descripcion') as string,
      })
      mostrarExito('Memorándum creado.')
      setShowForm(false)
    } catch {
      mostrarError('Error al crear memorándum.')
    } finally {
      setCargando(false)
    }
  }

  async function descargarPDF() {
    setShowPDFModal(true)
  }

  async function confirmarDescargarPDF() {
    if (!pdfId) {
      mostrarError('Por favor ingrese un ID')
      return
    }
    setCargando(true)
    try {
      const blob = await ReportesService.descargarMemorandumPDF(Number(pdfId))
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `memorandum-${pdfId}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      mostrarExito('PDF descargado correctamente.')
      setShowPDFModal(false)
      setPdfId('')
    } catch {
      mostrarError('Error al descargar PDF.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
      {mensajeExito && <div className="bg-green-50 text-green-700 p-3 rounded text-sm">{mensajeExito}</div>}

      <div className="flex gap-4">
        <button onClick={abrirFormulario} className="rounded-xl bg-chuxna px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">+ Nuevo Memorándum</button>
        <button onClick={descargarPDF} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">Descargar PDF</button>
      </div>

      {cargandoMemorandums ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-gray-500">Cargando memorandums...</div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {memorandums.map((m, i) => {
            const id = m.IdMemorial ?? m.idMemorial ?? i
            return (
              <div key={id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card hover:shadow-card-hover transition-shadow">
                <h3 className="font-semibold text-navy-900 mb-2">ID: {m.IdMemorial ?? m.idMemorial}</h3>
                <p className="text-sm text-gray-600 mb-1">Empleado: {m.NombreEmpleado ?? m.nombreEmpleado}</p>
                <p className="text-sm text-gray-500 line-clamp-2">Descripción: {m.descripcion}</p>
              </div>
            )
          })}
        </div>
      )}

      {showPDFModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Descargar Memorándum PDF</h2>
              <button onClick={() => setShowPDFModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">ID del Memorándum</label>
                <input
                  type="number"
                  value={pdfId}
                  onChange={(e) => setPdfId(e.target.value)}
                  placeholder="Ingrese el ID"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPDFModal(false)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmarDescargarPDF}
                  disabled={cargando || !pdfId}
                  className="rounded-xl bg-chuxna px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cargando ? 'Descargando...' : 'Descargar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card max-w-lg">
          <h3 className="font-bold text-lg mb-4">Crear Memorándum</h3>
          {cargandoUsuarios ? (
            <p className="text-sm text-gray-500">Cargando trabajadores...</p>
          ) : (
            <form onSubmit={crearMemorandum} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Trabajador</label>
                <select name="trabajador" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
                  <option value="">Seleccione</option>
                  {usuarios.map(u => (
                    <option key={u.idUsuario} value={u.idUsuario}>
                      {u.nombreUsuario} (CI: {u.ci})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
                <textarea name="descripcion" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-navy-400 focus:outline-none" rows={4} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={cargando} className="rounded-xl bg-chuxna px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-chuxna-dark">
                  {cargando ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
