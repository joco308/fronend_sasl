"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const C = {
  bg: '#060d1a', bgCard: '#0a1628', sidebar: '#070f1d',
  border: '#1e3a5f', borderLight: '#0f1e30',
  text: '#f1f5f9', textMuted: '#64748b', textSub: '#94a3b8',
  blueLight: '#60a5fa', green: '#4ade80',
};

type Cliente = {
  id_cliente:          number;
  id_empresa:          number;
  id_direccion:        number;
  nombre_cliente:      string;
  contacto_emergencia: string | null;
  create_at:           string;
  update_at:           string;
};

type Form = {
  id_empresa:          string;
  id_direccion:        string;
  nombre_cliente:      string;
  contacto_emergencia: string;
};

const EMPTY_FORM: Form = { id_empresa: '', id_direccion: '', nombre_cliente: '', contacto_emergencia: '' };

const Inp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', ...props.style }} />
);
const Fld = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</label>
    {children}
  </div>
);

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

export default function ModuloClientes() {
  const router = useRouter();
  const [data, setData]     = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal]   = useState<{ mode: 'new' | 'edit'; id?: number } | null>(null);
  const [f, setF]           = useState<Form>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/clientes');
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json.message);
    } catch {
      setError('Error de red al cargar clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = data.filter(c =>
    c.nombre_cliente.toLowerCase().includes(search.toLowerCase()) ||
    String(c.id_empresa).includes(search)
  );

  const openNew = () => {
    setF(EMPTY_FORM);
    setModal({ mode: 'new' });
  };

  const openEdit = (c: Cliente) => {
    setF({
      id_empresa:          String(c.id_empresa),
      id_direccion:        String(c.id_direccion),
      nombre_cliente:      c.nombre_cliente,
      contacto_emergencia: c.contacto_emergencia ?? '',
    });
    setModal({ mode: 'edit', id: c.id_cliente });
  };

  const save = async () => {
    if (!f.nombre_cliente.trim() || !f.id_empresa || !f.id_direccion) {
      setError('Nombre, empresa y dirección son obligatorios.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const body = {
        id_empresa:          parseInt(f.id_empresa, 10),
        id_direccion:        parseInt(f.id_direccion, 10),
        nombre_cliente:      f.nombre_cliente.trim(),
        contacto_emergencia: f.contacto_emergencia.trim() || null,
      };

      const url    = modal?.mode === 'edit' ? `/api/clientes/${modal.id}` : '/api/clientes';
      const method = modal?.mode === 'edit' ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const json   = await res.json();

      if (json.success) {
        await load();
        setModal(null);
      } else {
        setError(json.message);
      }
    } catch {
      setError('Error de red al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm('¿Eliminar este cliente?')) return;
    try {
      const res  = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) setData(p => p.filter(c => c.id_cliente !== id));
      else setError(json.message);
    } catch {
      setError('Error de red al eliminar.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <style>{`*, *::before, *::after { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }`}</style>

      <nav style={{ background: C.sidebar, borderBottom: `1px solid ${C.borderLight}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 8, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🧹</div>
          <span style={{ color: C.text, fontWeight: 900, fontSize: 13, letterSpacing: 1 }}>SASL</span>
        </div>
        {MODULES.map(m => (
          <Link key={m.href} href={m.href} style={{
            color: m.href === '/admin/clientes' ? '#60a5fa' : '#64748b',
            textDecoration: 'none', fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 7,
            background: m.href === '/admin/clientes' ? 'rgba(0,112,243,.15)' : 'none',
            border: m.href === '/admin/clientes' ? '1px solid rgba(0,112,243,.3)' : '1px solid transparent',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>{m.label}</Link>
        ))}
        <button onClick={handleLogout} style={{ marginLeft: 'auto', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
          Salir ⏻
        </button>
      </nav>

      <main style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p style={{ margin: 0, color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3 }}>MÓDULO</p>
            <h1 style={{ margin: '4px 0 0', color: C.text, fontSize: 24, fontWeight: 900 }}>🏢 Clientes</h1>
          </div>
          <button onClick={openNew} style={{ background: 'linear-gradient(135deg,#003066,#1d4ed8)', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            ＋ Nuevo Cliente
          </button>
        </div>

        {/* Estadísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { l: 'Total clientes', v: data.length },
            { l: 'Con contacto',   v: data.filter(c => c.contacto_emergencia).length },
            { l: 'Sin contacto',   v: data.filter(c => !c.contacto_emergencia).length },
          ].map(({ l, v }) => (
            <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
              <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
              <p style={{ margin: '6px 0 0', color: C.text, fontSize: 28, fontWeight: 900 }}>{v}</p>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#f87171', fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Tabla */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o empresa..." style={{ background: 'none', border: 'none', color: C.text, fontSize: 14, outline: 'none', flex: 1 }} />
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>Cargando clientes...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['ID', 'Nombre / Empresa', 'ID Empresa', 'ID Dirección', 'Contacto Emergencia', 'Creado', 'Acciones'].map((h, i) => (
                    <th key={i} style={{ padding: '12px 16px', textAlign: 'left', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id_cliente} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                      <td style={{ padding: '13px 16px', color: C.blueLight, fontWeight: 700, fontSize: 13 }}>#{c.id_cliente}</td>
                      <td style={{ padding: '13px 16px', color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{c.nombre_cliente}</td>
                      <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{c.id_empresa}</td>
                      <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{c.id_direccion}</td>
                      <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{c.contacto_emergencia ?? '—'}</td>
                      <td style={{ padding: '13px 16px', color: '#64748b', fontSize: 12 }}>{new Date(c.create_at).toLocaleDateString('es-BO')}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => openEdit(c)} style={{ background: 'rgba(148,163,184,.08)', border: '1px solid #1e3a5f', color: '#94a3b8', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>✏️</button>
                          <button onClick={() => del(c.id_cliente)} style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && !loading && (
                <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>
                  {data.length === 0 ? 'No hay clientes registrados.' : 'Sin resultados para la búsqueda.'}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 'min(560px,95vw)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, color: C.text, fontSize: 18, fontWeight: 800 }}>{modal.mode === 'new' ? 'Nuevo Cliente' : 'Editar Cliente'}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 22 }}>×</button>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#f87171', fontSize: 13 }}>
                ⚠️ {error}
              </div>
            )}

            <Fld label="Nombre del cliente / empresa">
              <Inp required value={f.nombre_cliente} onChange={e => setF(p => ({ ...p, nombre_cliente: e.target.value }))} placeholder="Ej: Banco Nacional de Bolivia" />
            </Fld>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Fld label="ID Empresa">
                <Inp required type="number" min="1" value={f.id_empresa} onChange={e => setF(p => ({ ...p, id_empresa: e.target.value }))} placeholder="1" />
              </Fld>
              <Fld label="ID Dirección">
                <Inp required type="number" min="1" value={f.id_direccion} onChange={e => setF(p => ({ ...p, id_direccion: e.target.value }))} placeholder="1" />
              </Fld>
            </div>
            <Fld label="Contacto de emergencia (opcional)">
              <Inp value={f.contacto_emergencia} onChange={e => setF(p => ({ ...p, contacto_emergencia: e.target.value }))} placeholder="Ej: +591 70012345" />
            </Fld>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
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
