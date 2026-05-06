"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const C = {
  bg: '#060d1a', bgCard: '#0a1628', sidebar: '#070f1d',
  border: '#1e3a5f', borderLight: '#0f1e30',
  text: '#f1f5f9', textMuted: '#64748b', textSub: '#94a3b8',
  blueLight: '#60a5fa', green: '#4ade80',
};

type Cliente = { id: number; nombre: string; contacto: string; direccion: string; tipo: string; desde: string };

const INIT: Cliente[] = [
  { id: 1, nombre: 'Banco Nacional de Bolivia', contacto: '77012345', direccion: 'Av. Camacho 1234, La Paz',        tipo: 'Financiero', desde: '2018' },
  { id: 2, nombre: 'Hotel Europa La Paz',        contacto: '77098765', direccion: 'Calle Sagárnaga 456, La Paz',    tipo: 'Hotelería',  desde: '2019' },
  { id: 3, nombre: 'Centro Médico Sur',          contacto: '77056789', direccion: 'Av. Hernando Siles 789, El Alto', tipo: 'Salud',      desde: '2020' },
  { id: 4, nombre: 'Plaza Shopping Center',      contacto: '77034567', direccion: 'Av. Montes 567, La Paz',         tipo: 'Comercial',  desde: '2017' },
  { id: 5, nombre: 'Colegio San Agustín',        contacto: '77078901', direccion: 'Calle Colón 890, La Paz',        tipo: 'Educación',  desde: '2021' },
  { id: 6, nombre: 'YPFB Refinería',             contacto: '77090123', direccion: 'Av. Beni km 4, El Alto',         tipo: 'Industrial', desde: '2016' },
];

const Badge = ({ text }: { text: string }) => (
  <span style={{ background: 'rgba(59,130,246,.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,.3)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{text}</span>
);

const Inp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', ...props.style }} />
);

const Fld = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</label>
    {children}
  </div>
);

const Sel = ({ children, ...p }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
  <select {...p} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>{children}</select>
);

const TIPOS = ['Financiero', 'Hotelería', 'Salud', 'Comercial', 'Educación', 'Industrial', 'Gobierno', 'Otro'];

const MODULES = [
  { label: 'Dashboard',   href: '/admin' },
  { label: 'Clientes',    href: '/admin/clientes' },
  { label: 'Maquinaria',  href: '/admin/maquinaria' },
  { label: 'Proveedores', href: '/admin/proveedores' },
  { label: 'Productos',   href: '/admin/productos' },
  { label: 'Cobros',      href: '/admin/cobros' },
];

export default function ModuloClientes() {
  const router = useRouter();
  const [data, setData] = useState<Cliente[]>(INIT);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Cliente> } | null>(null);
  const [f, setF] = useState<Partial<Cliente>>({});

  const filtered = data.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) || c.tipo.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setF({ tipo: TIPOS[0], desde: '2026' }); setModal({ mode: 'new', item: {} }); };
  const openEdit = (c: Cliente) => { setF(c); setModal({ mode: 'edit', item: c }); };

  const save = () => {
    if (modal?.mode === 'new') {
      setData(p => [...p, { ...f, id: p.length + 1 } as Cliente]);
    } else {
      setData(p => p.map(c => c.id === f.id ? { ...c, ...f } as Cliente : c));
    }
    setModal(null);
  };

  const del = (id: number) => setData(p => p.filter(c => c.id !== id));

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <style>{`*, *::before, *::after { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; } select option { background: #1e293b; }`}</style>

      {/* Top nav */}
      <nav style={{ background: C.sidebar, borderBottom: `1px solid ${C.borderLight}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 8, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🧹</div>
          <span style={{ color: C.text, fontWeight: 900, fontSize: 13, letterSpacing: 1 }}>SASL</span>
        </div>
        {MODULES.map(m => (
          <Link key={m.href} href={m.href} style={{
            color: m.href === '/admin/clientes' ? '#60a5fa' : '#64748b',
            textDecoration: 'none', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 7,
            background: m.href === '/admin/clientes' ? 'rgba(0,112,243,.15)' : 'none',
            border: m.href === '/admin/clientes' ? '1px solid rgba(0,112,243,.3)' : '1px solid transparent',
          }}>{m.label}</Link>
        ))}
        <button onClick={handleLogout} style={{ marginLeft: 'auto', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
          Salir ⏻
        </button>
      </nav>

      <main style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
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
            { l: 'Total clientes',    v: data.length },
            { l: 'Sector Financiero', v: data.filter(c => c.tipo === 'Financiero').length },
            { l: 'Sector Salud',      v: data.filter(c => c.tipo === 'Salud').length },
            { l: 'Nuevos 2026',       v: data.filter(c => c.desde >= '2025').length },
          ].map(({ l, v }) => (
            <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
              <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
              <p style={{ margin: '6px 0 0', color: C.text, fontSize: 28, fontWeight: 900 }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o sector..." style={{ background: 'none', border: 'none', color: C.text, fontSize: 14, outline: 'none', flex: 1 }} />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['ID', 'Nombre / Empresa', 'Sector', 'Contacto', 'Dirección', 'Desde', 'Acciones'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 16px', textAlign: 'left', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                    <td style={{ padding: '13px 16px', color: C.blueLight, fontWeight: 700, fontSize: 13 }}>#{c.id}</td>
                    <td style={{ padding: '13px 16px', color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{c.nombre}</td>
                    <td style={{ padding: '13px 16px' }}><Badge text={c.tipo} /></td>
                    <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{c.contacto}</td>
                    <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{c.direccion}</td>
                    <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{c.desde}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(c)} style={{ background: 'rgba(148,163,184,.08)', border: '1px solid #1e3a5f', color: '#94a3b8', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>✏️</button>
                        <button onClick={() => del(c.id)} style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>Sin registros</div>}
          </div>
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
            <Fld label="Nombre del cliente / empresa">
              <Inp value={f.nombre || ''} onChange={e => setF(p => ({ ...p, nombre: e.target.value }))} />
            </Fld>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Fld label="Sector / Tipo">
                <Sel value={f.tipo} onChange={e => setF(p => ({ ...p, tipo: e.target.value }))}>
                  {TIPOS.map(t => <option key={t}>{t}</option>)}
                </Sel>
              </Fld>
              <Fld label="Año de inicio">
                <Inp value={f.desde || ''} onChange={e => setF(p => ({ ...p, desde: e.target.value }))} placeholder="2026" />
              </Fld>
              <Fld label="Teléfono de contacto">
                <Inp value={f.contacto || ''} onChange={e => setF(p => ({ ...p, contacto: e.target.value }))} />
              </Fld>
              <Fld label="Dirección">
                <Inp value={f.direccion || ''} onChange={e => setF(p => ({ ...p, direccion: e.target.value }))} />
              </Fld>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <button onClick={() => setModal(null)} style={{ background: 'rgba(148,163,184,.08)', border: '1px solid #1e3a5f', color: '#94a3b8', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Cancelar</button>
              <button onClick={save} style={{ background: 'linear-gradient(135deg,#003066,#1d4ed8)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
