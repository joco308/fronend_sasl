"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const C = {
  bg: '#060d1a', bgCard: '#0a1628', sidebar: '#070f1d',
  border: '#1e3a5f', borderLight: '#0f1e30',
  text: '#f1f5f9', textMuted: '#64748b', textSub: '#94a3b8',
  blueLight: '#60a5fa', green: '#4ade80', yellow: '#facc15', red: '#f87171',
};

type Maquina = {
  id_maquinaria: number; id_proveedor: number; id_tipo_maquinaria: number;
  id_estado_calidad: number; id_marca_maquinaria: number;
  nombre_maquinaria: string; codigo_inv: string; descripcion: string | null;
  estado_calidad: string | null; nombre_marca: string | null;
  create_at: string;
};
type Form = {
  nombre_maquinaria: string; codigo_inv: string; descripcion: string;
  id_proveedor: string; id_tipo_maquinaria: string; id_estado_calidad: string; id_marca_maquinaria: string;
};
const EMPTY: Form = { nombre_maquinaria: '', codigo_inv: '', descripcion: '', id_proveedor: '1', id_tipo_maquinaria: '1', id_estado_calidad: '1', id_marca_maquinaria: '1' };

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

const estadoColor = (e: string | null) => {
  if (!e) return { bg: 'rgba(100,116,139,.1)', color: '#64748b', border: '#1e3a5f' };
  if (e.toLowerCase().includes('oper')) return { bg: 'rgba(74,222,128,.1)', color: '#4ade80', border: 'rgba(74,222,128,.3)' };
  if (e.toLowerCase().includes('manten')) return { bg: 'rgba(250,204,21,.1)', color: '#facc15', border: 'rgba(250,204,21,.3)' };
  return { bg: 'rgba(248,113,113,.1)', color: '#f87171', border: 'rgba(248,113,113,.3)' };
};

export default function MaquinariaPage() {
  const router = useRouter();
  const [data, setData]     = useState<Maquina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal]   = useState<{ mode: 'new' | 'edit'; id?: number } | null>(null);
  const [f, setF]           = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/maquinaria');
      const j   = await res.json();
      if (j.success) setData(j.data); else setError(j.message);
    } catch { setError('Error de red.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = data.filter(m =>
    m.nombre_maquinaria.toLowerCase().includes(search.toLowerCase()) ||
    m.codigo_inv.toLowerCase().includes(search.toLowerCase()) ||
    (m.estado_calidad ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const openNew  = () => { setF(EMPTY); setModal({ mode: 'new' }); };
  const openEdit = (m: Maquina) => {
    setF({
      nombre_maquinaria:  m.nombre_maquinaria,
      codigo_inv:         m.codigo_inv,
      descripcion:        m.descripcion ?? '',
      id_proveedor:       String(m.id_proveedor),
      id_tipo_maquinaria: String(m.id_tipo_maquinaria),
      id_estado_calidad:  String(m.id_estado_calidad),
      id_marca_maquinaria:String(m.id_marca_maquinaria),
    });
    setModal({ mode: 'edit', id: m.id_maquinaria });
  };

  const save = async () => {
    if (!f.nombre_maquinaria.trim() || !f.codigo_inv.trim()) { setError('Nombre y código son obligatorios.'); return; }
    setSaving(true); setError('');
    try {
      const url    = modal?.mode === 'edit' ? `/api/maquinaria/${modal.id}` : '/api/maquinaria';
      const method = modal?.mode === 'edit' ? 'PUT' : 'POST';
      const body   = {
        nombre_maquinaria:   f.nombre_maquinaria.trim(),
        codigo_inv:          f.codigo_inv.trim(),
        descripcion:         f.descripcion.trim() || null,
        id_proveedor:        parseInt(f.id_proveedor, 10),
        id_tipo_maquinaria:  parseInt(f.id_tipo_maquinaria, 10),
        id_estado_calidad:   parseInt(f.id_estado_calidad, 10),
        id_marca_maquinaria: parseInt(f.id_marca_maquinaria, 10),
      };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const j   = await res.json();
      if (j.success) { await load(); setModal(null); } else setError(j.message);
    } catch { setError('Error de red.'); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm('¿Eliminar esta máquina?')) return;
    try {
      const res = await fetch(`/api/maquinaria/${id}`, { method: 'DELETE' });
      const j   = await res.json();
      if (j.success) setData(p => p.filter(m => m.id_maquinaria !== id)); else setError(j.message);
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
          <Link key={m.href} href={m.href} style={{ color: m.href === '/admin/maquinaria' ? '#60a5fa' : '#64748b', textDecoration: 'none', fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 7, background: m.href === '/admin/maquinaria' ? 'rgba(0,112,243,.15)' : 'none', border: m.href === '/admin/maquinaria' ? '1px solid rgba(0,112,243,.3)' : '1px solid transparent', whiteSpace: 'nowrap', flexShrink: 0 }}>{m.label}</Link>
        ))}
        <button onClick={async () => { await fetch('/api/logout', { method: 'POST' }); router.push('/login'); }} style={{ marginLeft: 'auto', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>Salir ⏻</button>
      </nav>

      <main style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p style={{ margin: 0, color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3 }}>MÓDULO</p>
            <h1 style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 900 }}>⚙️ Maquinaria</h1>
          </div>
          <button onClick={openNew} style={{ background: 'linear-gradient(135deg,#003066,#1d4ed8)', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>＋ Nueva Máquina</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { l: 'Total máquinas', v: data.length },
            { l: 'Operativas', v: data.filter(m => m.estado_calidad?.toLowerCase().includes('oper')).length },
            { l: 'En mantenimiento', v: data.filter(m => m.estado_calidad?.toLowerCase().includes('manten')).length },
          ].map(({ l, v }) => (
            <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
              <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
              <p style={{ margin: '6px 0 0', color: l === 'Operativas' ? C.green : l === 'En mantenimiento' ? C.yellow : C.text, fontSize: 26, fontWeight: 900 }}>{v}</p>
            </div>
          ))}
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#f87171', fontSize: 13 }}>⚠️ {error}</div>}

        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, código o estado..." style={{ background: 'none', border: 'none', color: C.text, fontSize: 14, outline: 'none', flex: 1 }} />
          </div>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>Cargando maquinaria...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['ID', 'Nombre', 'Código Inv.', 'Marca', 'Estado', 'Proveedor ID', 'Acciones'].map((h, i) => (
                    <th key={i} style={{ padding: '12px 16px', textAlign: 'left', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filtered.map(m => {
                    const ec = estadoColor(m.estado_calidad);
                    return (
                      <tr key={m.id_maquinaria} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                        <td style={{ padding: '13px 16px', color: C.blueLight, fontWeight: 700, fontSize: 13 }}>#{m.id_maquinaria}</td>
                        <td style={{ padding: '13px 16px', color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{m.nombre_maquinaria}</td>
                        <td style={{ padding: '13px 16px', color: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}>{m.codigo_inv}</td>
                        <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{m.nombre_marca ?? '—'}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{ background: ec.bg, color: ec.color, border: `1px solid ${ec.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                            {m.estado_calidad ?? '—'}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px', color: '#64748b', fontSize: 13 }}>#{m.id_proveedor}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => openEdit(m)} style={{ background: 'rgba(148,163,184,.08)', border: '1px solid #1e3a5f', color: '#94a3b8', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>✏️</button>
                            <button onClick={() => del(m.id_maquinaria)} style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && !loading && <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>{data.length === 0 ? 'No hay maquinaria registrada.' : 'Sin resultados.'}</div>}
            </div>
          )}
        </div>
      </main>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 'min(580px,95vw)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{modal.mode === 'new' ? 'Nueva Máquina' : 'Editar Máquina'}</h3>
              <button onClick={() => { setModal(null); setError(''); }} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 22 }}>×</button>
            </div>
            {error && <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#f87171', fontSize: 13 }}>⚠️ {error}</div>}
            <Fld label="Nombre de la máquina">
              <Inp required value={f.nombre_maquinaria} onChange={e => setF(p => ({ ...p, nombre_maquinaria: e.target.value }))} placeholder="Ej: Aspiradora Industrial X200" />
            </Fld>
            <Fld label="Código de inventario">
              <Inp required value={f.codigo_inv} onChange={e => setF(p => ({ ...p, codigo_inv: e.target.value }))} placeholder="MAQ-001" />
            </Fld>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Fld label="ID Proveedor">
                <Inp required type="number" min="1" value={f.id_proveedor} onChange={e => setF(p => ({ ...p, id_proveedor: e.target.value }))} placeholder="1" />
              </Fld>
              <Fld label="ID Tipo de máquina">
                <Inp required type="number" min="1" value={f.id_tipo_maquinaria} onChange={e => setF(p => ({ ...p, id_tipo_maquinaria: e.target.value }))} placeholder="1" />
              </Fld>
              <Fld label="ID Estado de calidad">
                <Inp required type="number" min="1" value={f.id_estado_calidad} onChange={e => setF(p => ({ ...p, id_estado_calidad: e.target.value }))} placeholder="1" />
              </Fld>
              <Fld label="ID Marca">
                <Inp required type="number" min="1" value={f.id_marca_maquinaria} onChange={e => setF(p => ({ ...p, id_marca_maquinaria: e.target.value }))} placeholder="1" />
              </Fld>
            </div>
            <Fld label="Descripción (opcional)">
              <textarea value={f.descripcion} onChange={e => setF(p => ({ ...p, descripcion: e.target.value }))} rows={3} placeholder="Detalles de la máquina..." style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
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
