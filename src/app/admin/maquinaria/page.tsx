"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const C = {
  bg: '#060d1a', bgCard: '#0a1628', sidebar: '#070f1d',
  border: '#1e3a5f', borderLight: '#0f1e30',
  text: '#f1f5f9', textMuted: '#64748b', textSub: '#94a3b8',
  blueLight: '#60a5fa', green: '#4ade80', yellow: '#facc15', red: '#f87171',
};

type Maquina = { id: number; nombre: string; codigo: string; tipo: string; estado: string; proveedor: string; descripcion: string; ultimoMantenimiento: string };

const INIT: Maquina[] = [
  { id: 1, nombre: 'Aspiradora Industrial X200', codigo: 'MAQ-001', tipo: 'Aspirado',  estado: 'Operativo',       proveedor: 'CleanTech Bolivia', descripcion: 'Alta potencia 3000W',  ultimoMantenimiento: '2026-03-20' },
  { id: 2, nombre: 'Fregadora Automática F50',   codigo: 'MAQ-002', tipo: 'Fregado',   estado: 'Mantenimiento',   proveedor: 'Industrial SRL',    descripcion: 'En revisión de motor', ultimoMantenimiento: '2026-04-10' },
  { id: 3, nombre: 'Hidrolavadora H300',         codigo: 'MAQ-003', tipo: 'Presión',   estado: 'Operativo',       proveedor: 'CleanTech Bolivia', descripcion: 'Uso exterior',         ultimoMantenimiento: '2026-02-15' },
  { id: 4, nombre: 'Pulidora de Pisos P100',     codigo: 'MAQ-004', tipo: 'Pulido',    estado: 'Operativo',       proveedor: 'CleanStore',        descripcion: '1500 RPM',             ultimoMantenimiento: '2026-01-10' },
  { id: 5, nombre: 'Nebulizadora N50',           codigo: 'MAQ-005', tipo: 'Nebulizado',estado: 'Fuera de servicio', proveedor: 'MedClean SRL',    descripcion: 'Requiere reparación',  ultimoMantenimiento: '2025-12-01' },
];

const TIPOS = ['Aspirado', 'Fregado', 'Presión', 'Pulido', 'Nebulizado', 'Lavado', 'Secado'];
const ESTADOS = ['Operativo', 'Mantenimiento', 'Fuera de servicio', 'En reparación'];

const MODULES = [
  { label: 'Dashboard',   href: '/admin' },
  { label: 'Clientes',    href: '/admin/clientes' },
  { label: 'Maquinaria',  href: '/admin/maquinaria' },
  { label: 'Proveedores', href: '/admin/proveedores' },
  { label: 'Productos',   href: '/admin/productos' },
  { label: 'Cobros',      href: '/admin/cobros' },
];

const badgeColor = (estado: string) =>
  estado === 'Operativo' ? { bg: 'rgba(34,197,94,.15)', color: '#4ade80', border: 'rgba(34,197,94,.3)' } :
  estado === 'Mantenimiento' ? { bg: 'rgba(234,179,8,.15)', color: '#facc15', border: 'rgba(234,179,8,.3)' } :
  { bg: 'rgba(239,68,68,.15)', color: '#f87171', border: 'rgba(239,68,68,.3)' };

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

export default function ModuloMaquinaria() {
  const router = useRouter();
  const [data, setData] = useState<Maquina[]>(INIT);
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Maquina> } | null>(null);
  const [f, setF] = useState<Partial<Maquina>>({});

  const save = () => {
    if (modal?.mode === 'new') setData(p => [...p, { ...f, id: p.length + 1 } as Maquina]);
    else setData(p => p.map(m => m.id === f.id ? { ...m, ...f } as Maquina : m));
    setModal(null);
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <style>{`*, *::before, *::after { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; } select option { background: #1e293b; }`}</style>

      <nav style={{ background: C.sidebar, borderBottom: `1px solid ${C.borderLight}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 8, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🧹</div>
          <span style={{ color: C.text, fontWeight: 900, fontSize: 13, letterSpacing: 1 }}>SASL</span>
        </div>
        {MODULES.map(m => (
          <Link key={m.href} href={m.href} style={{ color: m.href === '/admin/maquinaria' ? '#60a5fa' : '#64748b', textDecoration: 'none', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 7, background: m.href === '/admin/maquinaria' ? 'rgba(0,112,243,.15)' : 'none', border: m.href === '/admin/maquinaria' ? '1px solid rgba(0,112,243,.3)' : '1px solid transparent' }}>{m.label}</Link>
        ))}
        <button onClick={handleLogout} style={{ marginLeft: 'auto', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Salir ⏻</button>
      </nav>

      <main style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p style={{ margin: 0, color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3 }}>MÓDULO</p>
            <h1 style={{ margin: '4px 0 0', color: C.text, fontSize: 24, fontWeight: 900 }}>⚙️ Maquinaria</h1>
          </div>
          <button onClick={() => { setF({ tipo: TIPOS[0], estado: 'Operativo', ultimoMantenimiento: new Date().toISOString().slice(0, 10) }); setModal({ mode: 'new', item: {} }); }}
            style={{ background: 'linear-gradient(135deg,#003066,#1d4ed8)', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            ＋ Nueva Máquina
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { l: 'Total equipos',      v: data.length },
            { l: 'Operativos',         v: data.filter(m => m.estado === 'Operativo').length },
            { l: 'En mantenimiento',   v: data.filter(m => m.estado === 'Mantenimiento').length },
            { l: 'Fuera de servicio',  v: data.filter(m => m.estado !== 'Operativo' && m.estado !== 'Mantenimiento').length },
          ].map(({ l, v }) => (
            <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
              <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
              <p style={{ margin: '6px 0 0', color: C.text, fontSize: 28, fontWeight: 900 }}>{v}</p>
            </div>
          ))}
        </div>

        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Código', 'Nombre', 'Tipo', 'Proveedor', 'Último Mantenimiento', 'Estado', 'Acciones'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 16px', textAlign: 'left', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {data.map(m => {
                  const bc = badgeColor(m.estado);
                  return (
                    <tr key={m.id} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                      <td style={{ padding: '13px 16px', color: C.blueLight, fontWeight: 700, fontSize: 12, fontFamily: 'monospace' }}>{m.codigo}</td>
                      <td style={{ padding: '13px 16px', color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{m.nombre}</td>
                      <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{m.tipo}</td>
                      <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{m.proveedor}</td>
                      <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{m.ultimoMantenimiento}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ background: bc.bg, color: bc.color, border: `1px solid ${bc.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{m.estado}</span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => { setF(m); setModal({ mode: 'edit', item: m }); }} style={{ background: 'rgba(148,163,184,.08)', border: '1px solid #1e3a5f', color: '#94a3b8', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>✏️</button>
                          <button onClick={() => setData(p => p.filter(x => x.id !== m.id))} style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 'min(560px,95vw)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, color: C.text, fontSize: 18, fontWeight: 800 }}>{modal.mode === 'new' ? 'Nueva Máquina' : 'Editar Máquina'}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 22 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Fld label="Nombre"><Inp value={f.nombre || ''} onChange={e => setF(p => ({ ...p, nombre: e.target.value }))} /></Fld>
              <Fld label="Código inventario"><Inp value={f.codigo || ''} onChange={e => setF(p => ({ ...p, codigo: e.target.value }))} /></Fld>
              <Fld label="Tipo"><Sel value={f.tipo} onChange={e => setF(p => ({ ...p, tipo: e.target.value }))}>{TIPOS.map(t => <option key={t}>{t}</option>)}</Sel></Fld>
              <Fld label="Estado"><Sel value={f.estado} onChange={e => setF(p => ({ ...p, estado: e.target.value }))}>{ESTADOS.map(s => <option key={s}>{s}</option>)}</Sel></Fld>
              <Fld label="Proveedor"><Inp value={f.proveedor || ''} onChange={e => setF(p => ({ ...p, proveedor: e.target.value }))} /></Fld>
              <Fld label="Último mantenimiento"><Inp type="date" value={f.ultimoMantenimiento || ''} onChange={e => setF(p => ({ ...p, ultimoMantenimiento: e.target.value }))} /></Fld>
            </div>
            <Fld label="Descripción"><Inp value={f.descripcion || ''} onChange={e => setF(p => ({ ...p, descripcion: e.target.value }))} /></Fld>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={() => setModal(null)} style={{ background: 'rgba(148,163,184,.08)', border: '1px solid #1e3a5f', color: '#94a3b8', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Cancelar</button>
              <button onClick={save} style={{ background: 'linear-gradient(135deg,#003066,#1d4ed8)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
