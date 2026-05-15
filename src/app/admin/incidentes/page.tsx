"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const C = {
  bg: '#060d1a', bgCard: '#0a1628', sidebar: '#070f1d',
  border: '#1e3a5f', borderLight: '#0f1e30',
  text: '#f1f5f9', textMuted: '#64748b', textSub: '#94a3b8',
  blueLight: '#60a5fa', red: '#f87171', yellow: '#facc15',
};

type Incidente = { id_incidente: number; id_servicio: number; descripcion: string; fecha: string; create_at: string };
type Form      = { id_servicio: string; descripcion: string; fecha: string };
const EMPTY: Form = { id_servicio: '', descripcion: '', fecha: '' };

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

export default function IncidentesPage() {
  const router = useRouter();
  const [data, setData]     = useState<Incidente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal]   = useState<{ mode: 'new' | 'edit'; id?: number } | null>(null);
  const [f, setF]           = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/incidentes');
      const j   = await res.json();
      if (j.success) setData(j.data); else setError(j.message);
    } catch { setError('Error de red.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = data.filter(i =>
    i.descripcion.toLowerCase().includes(search.toLowerCase()) ||
    String(i.id_servicio).includes(search)
  );

  const openNew  = () => { setF(EMPTY); setModal({ mode: 'new' }); };
  const openEdit = (i: Incidente) => {
    setF({ id_servicio: String(i.id_servicio), descripcion: i.descripcion, fecha: i.fecha.substring(0, 10) });
    setModal({ mode: 'edit', id: i.id_incidente });
  };

  const save = async () => {
    if (!f.id_servicio || !f.descripcion.trim() || !f.fecha) { setError('Todos los campos son obligatorios.'); return; }
    setSaving(true); setError('');
    try {
      const url    = modal?.mode === 'edit' ? `/api/incidentes/${modal.id}` : '/api/incidentes';
      const method = modal?.mode === 'edit' ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_servicio: parseInt(f.id_servicio, 10), descripcion: f.descripcion.trim(), fecha: f.fecha }) });
      const j      = await res.json();
      if (j.success) { await load(); setModal(null); } else setError(j.message);
    } catch { setError('Error de red.'); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm('¿Eliminar este incidente?')) return;
    try {
      const res = await fetch(`/api/incidentes/${id}`, { method: 'DELETE' });
      const j   = await res.json();
      if (j.success) setData(p => p.filter(i => i.id_incidente !== id)); else setError(j.message);
    } catch { setError('Error de red.'); }
  };

  const today = new Date().toISOString().substring(0, 10);
  const thisMonth = data.filter(i => i.fecha.substring(0, 7) === today.substring(0, 7)).length;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <style>{`*, *::before, *::after { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }`}</style>

      <nav style={{ background: C.sidebar, borderBottom: `1px solid ${C.borderLight}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 6, position: 'sticky', top: 0, zIndex: 50, overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12, flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🧹</div>
          <span style={{ color: C.text, fontWeight: 900, fontSize: 13, letterSpacing: 1 }}>SASL</span>
        </div>
        {MODULES.map(m => (
          <Link key={m.href} href={m.href} style={{ color: m.href === '/admin/incidentes' ? '#60a5fa' : '#64748b', textDecoration: 'none', fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 7, background: m.href === '/admin/incidentes' ? 'rgba(0,112,243,.15)' : 'none', border: m.href === '/admin/incidentes' ? '1px solid rgba(0,112,243,.3)' : '1px solid transparent', whiteSpace: 'nowrap', flexShrink: 0 }}>{m.label}</Link>
        ))}
        <button onClick={async () => { await fetch('/api/logout', { method: 'POST' }); router.push('/login'); }} style={{ marginLeft: 'auto', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>Salir ⏻</button>
      </nav>

      <main style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p style={{ margin: 0, color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3 }}>MÓDULO</p>
            <h1 style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 900 }}>⚠️ Incidentes</h1>
          </div>
          <button onClick={openNew} style={{ background: 'linear-gradient(135deg,#7f1d1d,#dc2626)', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>＋ Registrar Incidente</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 24 }}>
          {[{ l: 'Total', v: data.length }, { l: 'Este mes', v: thisMonth }].map(({ l, v }) => (
            <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
              <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
              <p style={{ margin: '6px 0 0', color: l === 'Este mes' ? C.yellow : C.text, fontSize: 26, fontWeight: 900 }}>{v}</p>
            </div>
          ))}
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#f87171', fontSize: 13 }}>⚠️ {error}</div>}

        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por descripción o ID servicio..." style={{ background: 'none', border: 'none', color: C.text, fontSize: 14, outline: 'none', flex: 1 }} />
          </div>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>Cargando incidentes...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['ID', 'ID Servicio', 'Descripción', 'Fecha', 'Registrado', 'Acciones'].map((h, i) => (
                    <th key={i} style={{ padding: '12px 16px', textAlign: 'left', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filtered.map(i => (
                    <tr key={i.id_incidente} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                      <td style={{ padding: '13px 16px', color: C.red, fontWeight: 700, fontSize: 13 }}>#{i.id_incidente}</td>
                      <td style={{ padding: '13px 16px', color: C.blueLight, fontWeight: 600, fontSize: 13 }}>#{i.id_servicio}</td>
                      <td style={{ padding: '13px 16px', color: '#e2e8f0', fontSize: 13, maxWidth: 300 }}>{i.descripcion}</td>
                      <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{new Date(i.fecha).toLocaleDateString('es-BO')}</td>
                      <td style={{ padding: '13px 16px', color: '#64748b', fontSize: 12 }}>{new Date(i.create_at).toLocaleDateString('es-BO')}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => openEdit(i)} style={{ background: 'rgba(148,163,184,.08)', border: '1px solid #1e3a5f', color: '#94a3b8', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>✏️</button>
                          <button onClick={() => del(i.id_incidente)} style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && !loading && <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>{data.length === 0 ? 'No hay incidentes registrados.' : 'Sin resultados.'}</div>}
            </div>
          )}
        </div>
      </main>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 'min(500px,95vw)', boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{modal.mode === 'new' ? 'Registrar Incidente' : 'Editar Incidente'}</h3>
              <button onClick={() => { setModal(null); setError(''); }} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 22 }}>×</button>
            </div>
            {error && <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#f87171', fontSize: 13 }}>⚠️ {error}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Fld label="ID Servicio">
                <Inp required type="number" min="1" value={f.id_servicio} onChange={e => setF(p => ({ ...p, id_servicio: e.target.value }))} placeholder="1" />
              </Fld>
              <Fld label="Fecha del incidente">
                <Inp required type="date" value={f.fecha} onChange={e => setF(p => ({ ...p, fecha: e.target.value }))} />
              </Fld>
            </div>
            <Fld label="Descripción">
              <textarea value={f.descripcion} onChange={e => setF(p => ({ ...p, descripcion: e.target.value }))} rows={4} placeholder="Descripción detallada del incidente..." style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </Fld>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={() => { setModal(null); setError(''); }} style={{ background: 'rgba(148,163,184,.08)', border: '1px solid #1e3a5f', color: '#94a3b8', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Cancelar</button>
              <button onClick={save} disabled={saving} style={{ background: 'linear-gradient(135deg,#7f1d1d,#dc2626)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, opacity: saving ? .7 : 1 }}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
