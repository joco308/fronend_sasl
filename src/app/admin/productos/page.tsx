"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const C = {
  bg: '#060d1a', bgCard: '#0a1628', sidebar: '#070f1d',
  border: '#1e3a5f', borderLight: '#0f1e30',
  text: '#f1f5f9', textMuted: '#64748b',
  blueLight: '#60a5fa', green: '#4ade80', yellow: '#facc15', red: '#f87171',
};

type Producto = { id: number; nombre: string; categoria: string; proveedor: string; stock: number; unidad: string; precio: number; estado: string };

const INIT: Producto[] = [
  { id: 1, nombre: 'Detergente Multiusos 5L',       categoria: 'Químico',     proveedor: 'SupliLimp SA',      stock: 48,  unidad: 'bidón',  precio: 85,  estado: 'Disponible' },
  { id: 2, nombre: 'Desinfectante Hospitalario 1L',  categoria: 'Químico',     proveedor: 'MedClean SRL',      stock: 30,  unidad: 'litro',  precio: 55,  estado: 'Disponible' },
  { id: 3, nombre: 'Trapeador de Microfibra',        categoria: 'Utensilio',   proveedor: 'CleanStore',        stock: 22,  unidad: 'unidad', precio: 38,  estado: 'Disponible' },
  { id: 4, nombre: 'Guantes de Nitrilo (caja×100)',  categoria: 'EPP',         proveedor: 'UniForm Bolivia',   stock: 10,  unidad: 'caja',   precio: 120, estado: 'Bajo stock' },
  { id: 5, nombre: 'Bolsas de Basura Industrial',    categoria: 'Consumible',  proveedor: 'CleanStore',        stock: 0,   unidad: 'rollo',  precio: 25,  estado: 'Agotado' },
  { id: 6, nombre: 'Mascarilla N95 (caja×20)',       categoria: 'EPP',         proveedor: 'UniForm Bolivia',   stock: 15,  unidad: 'caja',   precio: 95,  estado: 'Disponible' },
  { id: 7, nombre: 'Escoba Industrial',              categoria: 'Utensilio',   proveedor: 'CleanStore',        stock: 18,  unidad: 'unidad', precio: 45,  estado: 'Disponible' },
];

const CATEGORIAS = ['Químico', 'Utensilio', 'EPP', 'Consumible', 'Maquinaria', 'Otro'];
const ESTADOS_P = ['Disponible', 'Bajo stock', 'Agotado', 'Descontinuado'];
const UNIDADES = ['unidad', 'litro', 'bidón', 'caja', 'rollo', 'kg', 'par'];

const MODULES = [
  { label: 'Dashboard',   href: '/admin' },
  { label: 'Clientes',    href: '/admin/clientes' },
  { label: 'Maquinaria',  href: '/admin/maquinaria' },
  { label: 'Proveedores', href: '/admin/proveedores' },
  { label: 'Productos',   href: '/admin/productos' },
  { label: 'Cobros',      href: '/admin/cobros' },
];

const estadoColor = (e: string) =>
  e === 'Disponible' ? { bg: 'rgba(34,197,94,.15)', color: '#4ade80', border: 'rgba(34,197,94,.3)' } :
  e === 'Bajo stock'  ? { bg: 'rgba(234,179,8,.15)', color: '#facc15', border: 'rgba(234,179,8,.3)' } :
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

export default function ModuloProductos() {
  const router = useRouter();
  const [data, setData] = useState<Producto[]>(INIT);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Producto> } | null>(null);
  const [f, setF] = useState<Partial<Producto>>({});

  const filtered = data.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) || p.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const save = () => {
    if (modal?.mode === 'new') setData(p => [...p, { ...f, id: p.length + 1 } as Producto]);
    else setData(p => p.map(pr => pr.id === f.id ? { ...pr, ...f } as Producto : pr));
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
          <Link key={m.href} href={m.href} style={{ color: m.href === '/admin/productos' ? '#60a5fa' : '#64748b', textDecoration: 'none', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 7, background: m.href === '/admin/productos' ? 'rgba(0,112,243,.15)' : 'none', border: m.href === '/admin/productos' ? '1px solid rgba(0,112,243,.3)' : '1px solid transparent' }}>{m.label}</Link>
        ))}
        <button onClick={handleLogout} style={{ marginLeft: 'auto', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Salir ⏻</button>
      </nav>

      <main style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p style={{ margin: 0, color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3 }}>MÓDULO</p>
            <h1 style={{ margin: '4px 0 0', color: C.text, fontSize: 24, fontWeight: 900 }}>📦 Productos</h1>
          </div>
          <button onClick={() => { setF({ categoria: CATEGORIAS[0], estado: 'Disponible', unidad: 'unidad', stock: 0, precio: 0 }); setModal({ mode: 'new', item: {} }); }}
            style={{ background: 'linear-gradient(135deg,#003066,#1d4ed8)', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            ＋ Nuevo Producto
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { l: 'Total productos',  v: data.length },
            { l: 'Disponibles',      v: data.filter(p => p.estado === 'Disponible').length },
            { l: 'Bajo stock',       v: data.filter(p => p.estado === 'Bajo stock').length },
            { l: 'Agotados',         v: data.filter(p => p.estado === 'Agotado').length },
          ].map(({ l, v }) => (
            <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
              <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
              <p style={{ margin: '6px 0 0', color: C.text, fontSize: 28, fontWeight: 900 }}>{v}</p>
            </div>
          ))}
        </div>

        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..." style={{ background: 'none', border: 'none', color: C.text, fontSize: 14, outline: 'none', flex: 1 }} />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['ID', 'Nombre', 'Categoría', 'Proveedor', 'Stock', 'Precio (Bs)', 'Estado', 'Acciones'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 16px', textAlign: 'left', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const bc = estadoColor(p.estado);
                  return (
                    <tr key={p.id} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                      <td style={{ padding: '13px 16px', color: C.blueLight, fontWeight: 700, fontSize: 13 }}>#{p.id}</td>
                      <td style={{ padding: '13px 16px', color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{p.nombre}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ background: 'rgba(59,130,246,.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,.3)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{p.categoria}</span>
                      </td>
                      <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{p.proveedor}</td>
                      <td style={{ padding: '13px 16px', color: p.stock === 0 ? '#f87171' : p.stock < 15 ? '#facc15' : '#4ade80', fontWeight: 700, fontSize: 13 }}>{p.stock} {p.unidad}</td>
                      <td style={{ padding: '13px 16px', color: '#4ade80', fontWeight: 700, fontSize: 13 }}>Bs {p.precio}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ background: bc.bg, color: bc.color, border: `1px solid ${bc.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{p.estado}</span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => { setF(p); setModal({ mode: 'edit', item: p }); }} style={{ background: 'rgba(148,163,184,.08)', border: '1px solid #1e3a5f', color: '#94a3b8', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>✏️</button>
                          <button onClick={() => setData(prev => prev.filter(x => x.id !== p.id))} style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>🗑️</button>
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
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 'min(580px,95vw)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, color: C.text, fontSize: 18, fontWeight: 800 }}>{modal.mode === 'new' ? 'Nuevo Producto' : 'Editar Producto'}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 22 }}>×</button>
            </div>
            <Fld label="Nombre del producto"><Inp value={f.nombre || ''} onChange={e => setF(p => ({ ...p, nombre: e.target.value }))} /></Fld>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Fld label="Categoría"><Sel value={f.categoria} onChange={e => setF(p => ({ ...p, categoria: e.target.value }))}>{CATEGORIAS.map(c => <option key={c}>{c}</option>)}</Sel></Fld>
              <Fld label="Estado"><Sel value={f.estado} onChange={e => setF(p => ({ ...p, estado: e.target.value }))}>{ESTADOS_P.map(s => <option key={s}>{s}</option>)}</Sel></Fld>
              <Fld label="Proveedor"><Inp value={f.proveedor || ''} onChange={e => setF(p => ({ ...p, proveedor: e.target.value }))} /></Fld>
              <Fld label="Unidad de medida"><Sel value={f.unidad} onChange={e => setF(p => ({ ...p, unidad: e.target.value }))}>{UNIDADES.map(u => <option key={u}>{u}</option>)}</Sel></Fld>
              <Fld label="Stock actual"><Inp type="number" value={f.stock ?? ''} onChange={e => setF(p => ({ ...p, stock: Number(e.target.value) }))} /></Fld>
              <Fld label="Precio unitario (Bs)"><Inp type="number" value={f.precio ?? ''} onChange={e => setF(p => ({ ...p, precio: Number(e.target.value) }))} /></Fld>
            </div>
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
