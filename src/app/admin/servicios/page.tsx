"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const C = {
  bg: '#060d1a', bgCard: '#0a1628', sidebar: '#070f1d',
  border: '#1e3a5f', borderLight: '#0f1e30',
  text: '#f1f5f9', textMuted: '#64748b', textSub: '#94a3b8',
  blueLight: '#60a5fa', green: '#4ade80', yellow: '#facc15',
};

type Servicio = {
  id_servicio: number; id_cliente: number; id_direccion: number;
  tipo_servicio: number; fecha_inicio: string; fecha_final: string | null;
  costo: number; descripcion: string | null; nombre_cliente: string | null;
  create_at: string;
};
type Form = { id_cliente: string; id_direccion: string; tipo_servicio: string; fecha_inicio: string; fecha_final: string; costo: string; descripcion: string };
const EMPTY: Form = { id_cliente: '', id_direccion: '', tipo_servicio: '1', fecha_inicio: '', fecha_final: '', costo: '', descripcion: '' };

const MODULES = [
  { label: 'Dashboard',      href: '/admin' },
  { label: 'Clientes',       href: '/admin/clientes' },
  { label: 'Servicios',      href: '/admin/servicios' },
  { label: 'Maquinaria',     href: '/admin/maquinaria' },
  { label: 'Proveedores',    href: '/admin/proveedores' },
  { label: 'Incidentes',     href: '/admin/incidentes' },
  { label: 'Horarios',       href: '/admin/horarios' },
  { label: 'Roles',          href: '/admin/roles' },
  { label: 'Mantenimientos', href: '/admin/mantenimientos' },
];

const Inp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
);
const Fld = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</label>
    {children}
  </div>
);

export default function ServiciosPage() {
  const router = useRouter();
  const [data, setData]     = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal]   = useState<{ mode: 'new' | 'edit'; id?: number } | null>(null);
  const [f, setF]           = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/servicios');
      const j   = await res.json();
      if (j.success) setData(j.data); else setError(j.message);
    } catch { setError('Error de red.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = data.filter(s =>
    (s.nombre_cliente ?? '').toLowerCase().includes(search.toLowerCase()) ||
    String(s.id_servicio).includes(search) ||
    (s.descripcion ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const activos   = data.filter(s => !s.fecha_final).length;
  const totalCosto = data.reduce((a, b) => a + Number(b.costo), 0);

  const openNew  = () => { setF(EMPTY); setModal({ mode: 'new' }); };
  const openEdit = (s: Servicio) => {
    setF({
      id_cliente:    String(s.id_cliente),
      id_direccion:  String(s.id_direccion),
      tipo_servicio: String(s.tipo_servicio),
      fecha_inicio:  s.fecha_inicio.substring(0, 10),
      fecha_final:   s.fecha_final ? s.fecha_final.substring(0, 10) : '',
      costo:         String(s.costo),
      descripcion:   s.descripcion ?? '',
    });
    setModal({ mode: 'edit', id: s.id_servicio });
  };

  const save = async () => {
    if (!f.id_cliente || !f.id_direccion || !f.tipo_servicio || !f.fecha_inicio || !f.costo) {
      setError('Cliente, dirección, tipo, fecha de inicio y costo son obligatorios.'); return;
    }
    setSaving(true); setError('');
    try {
      const url    = modal?.mode === 'edit' ? `/api/servicios/${modal.id}` : '/api/servicios';
      const method = modal?.mode === 'edit' ? 'PUT' : 'POST';
      const body   = {
        id_cliente:    parseInt(f.id_cliente, 10),
        id_direccion:  parseInt(f.id_direccion, 10),
        tipo_servicio: parseInt(f.tipo_servicio, 10),
        fecha_inicio:  f.fecha_inicio,
        fecha_final:   f.fecha_final || null,
        costo:         parseFloat(f.costo),
        descripcion:   f.descripcion.trim() || null,
      };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const j   = await res.json();
      if (j.success) { await load(); setModal(null); } else setError(j.message);
    } catch { setError('Error de red.'); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    try {
      const res = await fetch(`/api/servicios/${id}`, { method: 'DELETE' });
      const j   = await res.json();
      if (j.success) setData(p => p.filter(s => s.id_servicio !== id)); else setError(j.message);
    } catch { setError('Error de red.'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <style>{`*, *::before, *::after { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }`}</style>

      <nav style={{ background: C.sidebar, borderBottom: `1px solid ${C.borderLight}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 6, position: 'sticky', top: 0, zIndex: 50, overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12, flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🧹</div>
          <span style={{ color: C.text, fontWeight: 900, fontSize: 13, letterSpacing: 1 }}>SASL</span>
        </div>
        {MODULES.map(m => (
          <Link key={m.href} href={m.href} style={{ color: m.href === '/admin/servicios' ? '#60a5fa' : '#64748b', textDecoration: 'none', fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 7, background: m.href === '/admin/servicios' ? 'rgba(0,112,243,.15)' : 'none', border: m.href === '/admin/servicios' ? '1px solid rgba(0,112,243,.3)' : '1px solid transparent', whiteSpace: 'nowrap', flexShrink: 0 }}>{m.label}</Link>
        ))}
        <button onClick={async () => { await fetch('/api/logout', { method: 'POST' }); router.push('/login'); }} style={{ marginLeft: 'auto', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>Salir ⏻</button>
      </nav>

      <main style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p style={{ margin: 0, color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3 }}>MÓDULO</p>
            <h1 style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 900 }}>🧹 Servicios</h1>
          </div>
          <button onClick={openNew} style={{ background: 'linear-gradient(135deg,#003066,#1d4ed8)', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>＋ Nuevo Servicio</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { l: 'Total servicios', v: data.length },
            { l: 'En curso',        v: activos },
            { l: 'Finalizados',     v: data.length - activos },
            { l: 'Ingresos totales', v: `Bs ${totalCosto.toLocaleString('es-BO', { minimumFractionDigits: 2 })}` },
          ].map(({ l, v }) => (
            <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
              <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
              <p style={{ margin: '6px 0 0', color: l === 'Ingresos totales' ? C.yellow : l === 'En curso' ? C.green : C.text, fontSize: l === 'Ingresos totales' ? 18 : 26, fontWeight: 900 }}>{v}</p>
            </div>
          ))}
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#f87171', fontSize: 13 }}>⚠️ {error}</div>}

        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por cliente, ID o descripción..." style={{ background: 'none', border: 'none', color: C.text, fontSize: 14, outline: 'none', flex: 1 }} />
          </div>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>Cargando servicios...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['ID', 'Cliente', 'Tipo (ID)', 'Inicio', 'Final', 'Costo (Bs)', 'Estado', 'Acciones'].map((h, i) => (
                    <th key={i} style={{ padding: '12px 16px', textAlign: 'left', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id_servicio} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                      <td style={{ padding: '13px 16px', color: C.blueLight, fontWeight: 700, fontSize: 13 }}>#{s.id_servicio}</td>
                      <td style={{ padding: '13px 16px', color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{s.nombre_cliente ?? `#${s.id_cliente}`}</td>
                      <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>#{s.tipo_servicio}</td>
                      <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{new Date(s.fecha_inicio).toLocaleDateString('es-BO')}</td>
                      <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{s.fecha_final ? new Date(s.fecha_final).toLocaleDateString('es-BO') : '—'}</td>
                      <td style={{ padding: '13px 16px', color: C.yellow, fontWeight: 700, fontSize: 13 }}>Bs {Number(s.costo).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ background: s.fecha_final ? 'rgba(148,163,184,.1)' : 'rgba(74,222,128,.12)', color: s.fecha_final ? '#94a3b8' : C.green, border: `1px solid ${s.fecha_final ? '#1e3a5f' : 'rgba(74,222,128,.3)'}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                          {s.fecha_final ? 'Finalizado' : 'En curso'}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => openEdit(s)} style={{ background: 'rgba(148,163,184,.08)', border: '1px solid #1e3a5f', color: '#94a3b8', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>✏️</button>
                          <button onClick={() => del(s.id_servicio)} style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && !loading && <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>{data.length === 0 ? 'No hay servicios registrados.' : 'Sin resultados.'}</div>}
            </div>
          )}
        </div>
      </main>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 'min(580px,95vw)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{modal.mode === 'new' ? 'Nuevo Servicio' : 'Editar Servicio'}</h3>
              <button onClick={() => { setModal(null); setError(''); }} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 22 }}>×</button>
            </div>
            {error && <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#f87171', fontSize: 13 }}>⚠️ {error}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Fld label="ID Cliente">
                <Inp required type="number" min="1" value={f.id_cliente} onChange={e => setF(p => ({ ...p, id_cliente: e.target.value }))} placeholder="1" />
              </Fld>
              <Fld label="ID Dirección">
                <Inp required type="number" min="1" value={f.id_direccion} onChange={e => setF(p => ({ ...p, id_direccion: e.target.value }))} placeholder="1" />
              </Fld>
              <Fld label="Tipo de servicio (ID sub-dominio)">
                <Inp required type="number" min="1" value={f.tipo_servicio} onChange={e => setF(p => ({ ...p, tipo_servicio: e.target.value }))} placeholder="1" />
              </Fld>
              <Fld label="Costo (Bs)">
                <Inp required type="number" min="0" step="0.01" value={f.costo} onChange={e => setF(p => ({ ...p, costo: e.target.value }))} placeholder="0.00" />
              </Fld>
              <Fld label="Fecha de inicio">
                <Inp required type="date" value={f.fecha_inicio} onChange={e => setF(p => ({ ...p, fecha_inicio: e.target.value }))} />
              </Fld>
              <Fld label="Fecha final (opcional)">
                <Inp type="date" value={f.fecha_final} onChange={e => setF(p => ({ ...p, fecha_final: e.target.value }))} />
              </Fld>
            </div>
            <Fld label="Descripción (opcional)">
              <textarea value={f.descripcion} onChange={e => setF(p => ({ ...p, descripcion: e.target.value }))} rows={3} placeholder="Detalles del servicio..." style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </Fld>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={() => { setModal(null); setError(''); }} style={{ background: 'rgba(148,163,184,.08)', border: '1px solid #1e3a5f', color: '#94a3b8', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Cancelar</button>
              <button onClick={save} disabled={saving} style={{ background: 'linear-gradient(135deg,#003066,#1d4ed8)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, opacity: saving ? .7 : 1 }}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
