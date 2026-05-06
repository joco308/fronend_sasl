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

type Cobro = { id: number; cliente: string; concepto: string; monto: number; emision: string; vencimiento: string; estado: string; metodoPago: string };

const INIT: Cobro[] = [
  { id: 1001, cliente: 'Banco Nacional',     concepto: 'Limpieza Profunda – Abril 2026',   monto: 4500, emision: '2026-04-01', vencimiento: '2026-04-30', estado: 'Pagado',   metodoPago: 'Transferencia' },
  { id: 1002, cliente: 'Hotel Europa',        concepto: 'Limpieza Diaria – Abril 2026',     monto: 8000, emision: '2026-04-01', vencimiento: '2026-05-01', estado: 'Pendiente', metodoPago: '—' },
  { id: 1003, cliente: 'Centro Médico Sur',   concepto: 'Desinfección – Abril 2026',        monto: 1200, emision: '2026-04-15', vencimiento: '2026-04-20', estado: 'Pagado',   metodoPago: 'Efectivo' },
  { id: 1004, cliente: 'Plaza Shopping',      concepto: 'Mantenimiento – Abril 2026',       monto: 3200, emision: '2026-04-01', vencimiento: '2026-04-30', estado: 'Vencido',  metodoPago: '—' },
  { id: 1005, cliente: 'YPFB Refinería',      concepto: 'Higiene Industrial – Abril 2026',  monto: 9800, emision: '2026-04-01', vencimiento: '2026-05-15', estado: 'Pendiente', metodoPago: '—' },
  { id: 1006, cliente: 'Colegio San Agustín', concepto: 'Limpieza Profunda – Mayo 2026',    monto: 2200, emision: '2026-05-01', vencimiento: '2026-05-31', estado: 'Pendiente', metodoPago: '—' },
];

const ESTADOS = ['Pendiente', 'Pagado', 'Vencido', 'Anulado'];
const METODOS = ['Transferencia', 'Efectivo', 'QR', 'Cheque', '—'];
const CLIENTES = ['Banco Nacional', 'Hotel Europa', 'Centro Médico Sur', 'Plaza Shopping', 'YPFB Refinería', 'Colegio San Agustín'];

const MODULES = [
  { label: 'Dashboard',   href: '/admin' },
  { label: 'Clientes',    href: '/admin/clientes' },
  { label: 'Maquinaria',  href: '/admin/maquinaria' },
  { label: 'Proveedores', href: '/admin/proveedores' },
  { label: 'Productos',   href: '/admin/productos' },
  { label: 'Cobros',      href: '/admin/cobros' },
];

const estadoColor = (e: string) =>
  e === 'Pagado'   ? { bg: 'rgba(34,197,94,.15)',  color: '#4ade80', border: 'rgba(34,197,94,.3)' } :
  e === 'Vencido'  ? { bg: 'rgba(239,68,68,.15)',  color: '#f87171', border: 'rgba(239,68,68,.3)' } :
  e === 'Anulado'  ? { bg: 'rgba(148,163,184,.1)', color: '#94a3b8', border: 'rgba(148,163,184,.3)' } :
  { bg: 'rgba(234,179,8,.15)', color: '#facc15', border: 'rgba(234,179,8,.3)' };

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

export default function ModuloCobros() {
  const router = useRouter();
  const [data, setData] = useState<Cobro[]>(INIT);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Cobro> } | null>(null);
  const [f, setF] = useState<Partial<Cobro>>({});

  const filtered = filtroEstado === 'Todos' ? data : data.filter(c => c.estado === filtroEstado);

  const totalCobrado  = data.filter(c => c.estado === 'Pagado').reduce((s, c) => s + c.monto, 0);
  const totalPendiente = data.filter(c => c.estado === 'Pendiente').reduce((s, c) => s + c.monto, 0);
  const totalVencido  = data.filter(c => c.estado === 'Vencido').reduce((s, c) => s + c.monto, 0);

  const save = () => {
    if (modal?.mode === 'new') setData(p => [...p, { ...f, id: 1000 + p.length + 1 } as Cobro]);
    else setData(p => p.map(c => c.id === f.id ? { ...c, ...f } as Cobro : c));
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
          <Link key={m.href} href={m.href} style={{ color: m.href === '/admin/cobros' ? '#60a5fa' : '#64748b', textDecoration: 'none', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 7, background: m.href === '/admin/cobros' ? 'rgba(0,112,243,.15)' : 'none', border: m.href === '/admin/cobros' ? '1px solid rgba(0,112,243,.3)' : '1px solid transparent' }}>{m.label}</Link>
        ))}
        <button onClick={handleLogout} style={{ marginLeft: 'auto', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Salir ⏻</button>
      </nav>

      <main style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p style={{ margin: 0, color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3 }}>MÓDULO</p>
            <h1 style={{ margin: '4px 0 0', color: C.text, fontSize: 24, fontWeight: 900 }}>💰 Cobros</h1>
          </div>
          <button onClick={() => { setF({ cliente: CLIENTES[0], estado: 'Pendiente', metodoPago: '—', emision: new Date().toISOString().slice(0, 10), monto: 0 }); setModal({ mode: 'new', item: {} }); }}
            style={{ background: 'linear-gradient(135deg,#003066,#1d4ed8)', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            ＋ Nuevo Cobro
          </button>
        </div>

        {/* KPIs financieros */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { l: 'Total cobrado',   v: `Bs ${totalCobrado.toLocaleString()}`,  c: 'rgba(34,197,94,.15)',  tc: '#4ade80', bc: 'rgba(34,197,94,.3)' },
            { l: 'Por cobrar',      v: `Bs ${totalPendiente.toLocaleString()}`, c: 'rgba(234,179,8,.15)',  tc: '#facc15', bc: 'rgba(234,179,8,.3)' },
            { l: 'Vencido',         v: `Bs ${totalVencido.toLocaleString()}`,   c: 'rgba(239,68,68,.15)',  tc: '#f87171', bc: 'rgba(239,68,68,.3)' },
            { l: 'Total facturas',  v: data.length,                             c: 'rgba(59,130,246,.15)', tc: '#60a5fa', bc: 'rgba(59,130,246,.3)' },
          ].map(({ l, v, c, tc, bc }) => (
            <div key={l} style={{ background: C.bgCard, border: `1px solid ${bc}`, borderRadius: 12, padding: '16px 20px' }}>
              <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
              <p style={{ margin: '8px 0 0', color: tc, fontSize: 22, fontWeight: 900 }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {['Todos', ...ESTADOS].map(e => (
            <button key={e} onClick={() => setFiltroEstado(e)} style={{
              padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600,
              background: filtroEstado === e ? 'rgba(0,112,243,.2)' : 'rgba(255,255,255,.04)',
              border: filtroEstado === e ? '1px solid rgba(0,112,243,.5)' : `1px solid ${C.border}`,
              color: filtroEstado === e ? '#60a5fa' : '#64748b',
            }}>{e}</button>
          ))}
        </div>

        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['N° Factura', 'Cliente', 'Concepto', 'Monto (Bs)', 'Emisión', 'Vencimiento', 'Método', 'Estado', 'Acciones'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 16px', textAlign: 'left', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const bc = estadoColor(c.estado);
                  return (
                    <tr key={c.id} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                      <td style={{ padding: '13px 16px', color: C.blueLight, fontWeight: 700, fontSize: 13 }}>#{c.id}</td>
                      <td style={{ padding: '13px 16px', color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{c.cliente}</td>
                      <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 12, maxWidth: 200 }}>{c.concepto}</td>
                      <td style={{ padding: '13px 16px', color: c.estado === 'Pagado' ? '#4ade80' : c.estado === 'Vencido' ? '#f87171' : '#facc15', fontWeight: 700, fontSize: 13 }}>Bs {c.monto.toLocaleString()}</td>
                      <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{c.emision}</td>
                      <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{c.vencimiento}</td>
                      <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{c.metodoPago}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ background: bc.bg, color: bc.color, border: `1px solid ${bc.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{c.estado}</span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => { setF(c); setModal({ mode: 'edit', item: c }); }} style={{ background: 'rgba(148,163,184,.08)', border: '1px solid #1e3a5f', color: '#94a3b8', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>✏️</button>
                          <button onClick={() => setData(prev => prev.filter(x => x.id !== c.id))} style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>Sin registros para este filtro</div>}
          </div>
        </div>
      </main>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 'min(600px,95vw)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, color: C.text, fontSize: 18, fontWeight: 800 }}>{modal.mode === 'new' ? 'Nuevo Cobro' : 'Editar Cobro'}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 22 }}>×</button>
            </div>
            <Fld label="Concepto / Descripción"><Inp value={f.concepto || ''} onChange={e => setF(p => ({ ...p, concepto: e.target.value }))} /></Fld>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Fld label="Cliente"><Sel value={f.cliente} onChange={e => setF(p => ({ ...p, cliente: e.target.value }))}>{CLIENTES.map(c => <option key={c}>{c}</option>)}</Sel></Fld>
              <Fld label="Monto (Bs)"><Inp type="number" value={f.monto ?? ''} onChange={e => setF(p => ({ ...p, monto: Number(e.target.value) }))} /></Fld>
              <Fld label="Fecha emisión"><Inp type="date" value={f.emision || ''} onChange={e => setF(p => ({ ...p, emision: e.target.value }))} /></Fld>
              <Fld label="Fecha vencimiento"><Inp type="date" value={f.vencimiento || ''} onChange={e => setF(p => ({ ...p, vencimiento: e.target.value }))} /></Fld>
              <Fld label="Estado"><Sel value={f.estado} onChange={e => setF(p => ({ ...p, estado: e.target.value }))}>{ESTADOS.map(s => <option key={s}>{s}</option>)}</Sel></Fld>
              <Fld label="Método de pago"><Sel value={f.metodoPago} onChange={e => setF(p => ({ ...p, metodoPago: e.target.value }))}>{METODOS.map(m => <option key={m}>{m}</option>)}</Sel></Fld>
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
