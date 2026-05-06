"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Toast = { id: number; type: 'success' | 'error' | 'info' | 'warning'; msg: string };
type NavId = 'panel' | 'servicios' | 'facturas' | 'soporte';

const C = {
  bg: '#060d1a', bgCard: '#0a1628', sidebar: '#070f1d',
  border: '#1e3a5f', borderLight: '#0f1e30',
  text: '#f1f5f9', textMuted: '#64748b', textSub: '#94a3b8',
  blueLight: '#60a5fa', green: '#4ade80', yellow: '#facc15', red: '#f87171',
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const MIS_SERVICIOS = [
  {   
    id: 1, tipo: 'Limpieza Profunda', inicio: '2026-04-01', fin: '2026-04-30',
    costo: 4500, estado: 'Activo', descripcion: 'Limpieza completa mensual de instalaciones bancarias.',
    supervisor: 'Carlos Mamani', progreso: 70,
    pasos: [
      { label: 'Contratado',  done: true,  fecha: '2026-04-01' },
      { label: 'Planificado', done: true,  fecha: '2026-04-03' },
      { label: 'En ejecución', done: true, fecha: '2026-04-05' },
      { label: 'Completado',  done: false, fecha: null },
    ],
  },
  {
    id: 2, tipo: 'Desinfección',       inicio: '2026-03-15', fin: '2026-03-15',
    costo: 1200, estado: 'Completado', descripcion: 'Desinfección de emergencia de instalaciones.',
    supervisor: 'Ana Torres', progreso: 100,
    pasos: [
      { label: 'Contratado',   done: true, fecha: '2026-03-14' },
      { label: 'Planificado',  done: true, fecha: '2026-03-14' },
      { label: 'En ejecución', done: true, fecha: '2026-03-15' },
      { label: 'Completado',   done: true, fecha: '2026-03-15' },
    ],
  },
];

const MIS_COBROS = [
  { id: 101, concepto: 'Limpieza Profunda – Abril 2026',  monto: 4500, emision: '2026-04-01', vencimiento: '2026-04-30', estado: 'Pendiente' },
  { id: 102, concepto: 'Desinfección – Marzo 2026',       monto: 1200, emision: '2026-03-15', vencimiento: '2026-03-30', estado: 'Pagado'   },
  { id: 103, concepto: 'Limpieza Profunda – Marzo 2026',  monto: 4500, emision: '2026-03-01', vencimiento: '2026-03-31', estado: 'Pagado'   },
];

const NOTIFS = [
  { id: 1, tipo: 'warning', msg: 'Factura #101 vence el 30/04/2026 — Bs 4,500', fecha: '2026-04-29', leida: false },
  { id: 2, tipo: 'success', msg: 'Servicio de Desinfección completado satisfactoriamente.', fecha: '2026-03-15', leida: false },
  { id: 3, tipo: 'info',    msg: 'Su supervisor para este mes es Carlos Mamani.', fecha: '2026-04-01', leida: true  },
];

// ── Toast ─────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = (type: Toast['type'], msg: string) => {
    const id = Date.now();
    setToasts(p => [...p, { id, type, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };
  return { toasts, show };
}
const TCFG: Record<Toast['type'], { bg: string; icon: string }> = {
  success: { bg: 'linear-gradient(135deg,#065f46,#059669)', icon: '✅' },
  error:   { bg: 'linear-gradient(135deg,#7f1d1d,#dc2626)', icon: '❌' },
  warning: { bg: 'linear-gradient(135deg,#78350f,#d97706)', icon: '⚠️' },
  info:    { bg: 'linear-gradient(135deg,#1e3a8a,#2563eb)', icon: 'ℹ️' },
};
const ToastContainer = ({ toasts }: { toasts: Toast[] }) => (
  <div style={{ position: 'fixed', top: 72, right: 20, zIndex: 9000, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
    {toasts.map(t => {
      const cfg = TCFG[t.type];
      return (
        <div key={t.id} style={{ background: cfg.bg, color: '#fff', padding: '12px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', gap: 10, animation: 'slideInRight .3s ease', maxWidth: 340 }}>
          <span style={{ fontSize: 16 }}>{cfg.icon}</span>{t.msg}
        </div>
      );
    })}
  </div>
);

// ── UI helpers ────────────────────────────────────────────────────────────────
const Badge = ({ text, color = 'blue' }: { text: string; color?: string }) => {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    green:  { bg: 'rgba(34,197,94,.15)',  color: '#4ade80', border: 'rgba(34,197,94,.3)'  },
    yellow: { bg: 'rgba(234,179,8,.15)',  color: '#facc15', border: 'rgba(234,179,8,.3)'  },
    red:    { bg: 'rgba(239,68,68,.15)',  color: '#f87171', border: 'rgba(239,68,68,.3)'  },
    blue:   { bg: 'rgba(59,130,246,.15)', color: '#60a5fa', border: 'rgba(59,130,246,.3)' },
  };
  const s = map[color] || map.blue;
  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{text}</span>;
};

const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)', animation: 'fadeIn .2s ease' }}>
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 18, padding: 32, width: 'min(560px,95vw)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 40px 100px rgba(0,0,0,.6)', animation: 'slideUp .25s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ margin: 0, color: C.text, fontSize: 18, fontWeight: 800 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#f87171', cursor: 'pointer', fontSize: 18, width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const Fld = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</label>
    {children}
  </div>
);
const Inp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} style={{ width: '100%', background: '#0f1e30', border: '1px solid #1e3a5f', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', ...props.style }}
    onFocus={e => (e.target.style.borderColor = '#0070f3')}
    onBlur={e  => (e.target.style.borderColor = '#1e3a5f')}
  />
);
const Sel = ({ children, ...p }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
  <select {...p} style={{ width: '100%', background: '#0f1e30', border: '1px solid #1e3a5f', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>{children}</select>
);
const ProgressBar = ({ value, color = '#0070f3' }: { value: number; color?: string }) => (
  <div style={{ background: '#0f1e30', borderRadius: 999, height: 6, overflow: 'hidden' }}>
    <div style={{ width: `${Math.min(value, 100)}%`, height: '100%', background: color, borderRadius: 999, transition: 'width .8s ease' }} />
  </div>
);

// ── Panel (overview) ──────────────────────────────────────────────────────────
function Panel({ notifs, setNotifs, show, setActive }: { notifs: typeof NOTIFS; setNotifs: React.Dispatch<React.SetStateAction<typeof NOTIFS>>; show: (t: Toast['type'], m: string) => void; setActive: (id: NavId) => void }) {
  const pendiente = MIS_COBROS.filter(c => c.estado === 'Pendiente').reduce((s, c) => s + c.monto, 0);
  const activos   = MIS_SERVICIOS.filter(s => s.estado === 'Activo').length;
  const unread    = notifs.filter(n => !n.leida).length;

  const markRead = (id: number) => {
    setNotifs(p => p.map(n => n.id === id ? { ...n, leida: true } : n));
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: '0 0 4px', color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3 }}>PORTAL CLIENTE</p>
        <h2 style={{ margin: 0, color: C.text, fontSize: 22, fontWeight: 900 }}>Bienvenido, Banco Nacional</h2>
        <p style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>Panel de seguimiento de servicios contratados</p>
      </div>

      {/* Alert banner */}
      {pendiente > 0 && (
        <div style={{ background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.3)', borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'fadeIn .3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>⚠️</span>
            <div>
              <p style={{ margin: 0, color: C.yellow, fontWeight: 800, fontSize: 14 }}>Pago pendiente</p>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: 12 }}>Tiene facturas por un total de <strong style={{ color: C.yellow }}>Bs {pendiente.toLocaleString()}</strong> sin cancelar.</p>
            </div>
          </div>
          <button onClick={() => setActive('facturas')} style={{ background: 'rgba(245,158,11,.15)', border: '1px solid rgba(245,158,11,.4)', color: C.yellow, padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>Ver facturas →</button>
        </div>
      )}

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { l: 'Servicios activos',    v: activos,                                     c: '#3b82f6', e: '🧹' },
          { l: 'Total servicios',      v: MIS_SERVICIOS.length,                         c: '#10b981', e: '✅' },
          { l: 'Cobros pendientes',    v: `Bs ${pendiente.toLocaleString()}`,            c: '#f59e0b', e: '💰' },
          { l: 'Notificaciones',       v: unread,                                        c: '#8b5cf6', e: '🔔' },
        ].map(({ l, v, c, e }) => (
          <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px', position: 'relative', overflow: 'hidden', transition: 'all .2s' }}
            onMouseEnter={el => { el.currentTarget.style.borderColor = c + '55'; el.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={el => { el.currentTarget.style.borderColor = C.border; el.currentTarget.style.transform = 'none'; }}>
            <div style={{ position: 'absolute', top: -12, right: -12, width: 60, height: 60, borderRadius: '50%', background: c, opacity: .1 }} />
            <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
            <p style={{ margin: '8px 0 0', color: C.text, fontSize: 26, fontWeight: 900 }}>{e} {v}</p>
          </div>
        ))}
      </div>

      {/* Services progress */}
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderLight}` }}>
          <strong style={{ color: C.textSub, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.07em' }}>🧹 Mis Servicios — Estado</strong>
        </div>
        {MIS_SERVICIOS.map(s => (
          <div key={s.id} style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderLight}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 14 }}>{s.tipo}</span>
                <span style={{ color: C.textMuted, fontSize: 12, marginLeft: 10 }}>Supervisor: {s.supervisor}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: s.progreso === 100 ? C.green : C.blueLight, fontWeight: 800, fontSize: 14 }}>{s.progreso}%</span>
                <Badge text={s.estado} color={s.estado === 'Activo' ? 'blue' : 'green'} />
              </div>
            </div>
            <ProgressBar value={s.progreso} color={s.progreso === 100 ? '#4ade80' : '#0070f3'} />
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ color: C.textSub, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.07em' }}>🔔 Notificaciones {unread > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', padding: '2px 7px', fontSize: 10, fontWeight: 900, marginLeft: 8 }}>{unread}</span>}</strong>
          {unread > 0 && <button onClick={() => { setNotifs(p => p.map(n => ({ ...n, leida: true }))); show('info', 'Todas las notificaciones marcadas como leídas'); }} style={{ background: 'none', border: 'none', color: C.blueLight, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Marcar todas como leídas</button>}
        </div>
        {notifs.map(n => {
          const notifColor = n.tipo === 'warning' ? C.yellow : n.tipo === 'success' ? C.green : C.blueLight;
          return (
            <div key={n.id} onClick={() => markRead(n.id)} style={{ padding: '14px 20px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'flex-start', gap: 14, cursor: 'pointer', background: n.leida ? 'transparent' : 'rgba(59,130,246,.04)', transition: 'background .15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.025)')}
              onMouseLeave={e => (e.currentTarget.style.background = n.leida ? 'transparent' : 'rgba(59,130,246,.04)')}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.leida ? 'transparent' : notifColor, marginTop: 4, flexShrink: 0, border: n.leida ? `1px solid ${C.border}` : 'none' }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 3px', color: n.leida ? C.textSub : '#e2e8f0', fontSize: 13, fontWeight: n.leida ? 400 : 600 }}>{n.msg}</p>
                <p style={{ margin: 0, color: C.textMuted, fontSize: 11 }}>{n.fecha}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Servicios ─────────────────────────────────────────────────────────────────
function Servicios() {
  const [selected, setSelected] = useState<number | null>(null);
  const detail = MIS_SERVICIOS.find(s => s.id === selected);

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', color: C.text, fontSize: 20, fontWeight: 800 }}>🧹 Mis Servicios Contratados</h2>
      <div style={{ display: 'grid', gap: 16 }}>
        {MIS_SERVICIOS.map(s => (
          <div key={s.id} style={{ background: C.bgCard, border: `1px solid ${s.id === selected ? '#0070f3' : C.border}`, borderRadius: 16, padding: 24, cursor: 'pointer', transition: 'all .2s' }}
            onClick={() => setSelected(s.id === selected ? null : s.id)}
            onMouseEnter={e => { if (s.id !== selected) e.currentTarget.style.borderColor = 'rgba(0,112,243,.3)'; }}
            onMouseLeave={e => { if (s.id !== selected) e.currentTarget.style.borderColor = C.border; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: '0 0 4px', color: C.text, fontWeight: 800, fontSize: 16 }}>{s.tipo}</p>
                <p style={{ margin: 0, color: C.textMuted, fontSize: 12 }}>#{s.id} · {s.inicio} → {s.fin} · Supervisor: {s.supervisor}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: s.progreso === 100 ? C.green : C.blueLight, fontWeight: 800, fontSize: 16 }}>{s.progreso}%</span>
                <Badge text={s.estado} color={s.estado === 'Activo' ? 'blue' : 'green'} />
              </div>
            </div>

            <p style={{ margin: '0 0 14px', color: C.textSub, fontSize: 13 }}>{s.descripcion}</p>

            {/* Progress bar */}
            <div style={{ marginBottom: 16 }}>
              <ProgressBar value={s.progreso} color={s.progreso === 100 ? '#4ade80' : '#0070f3'} />
            </div>

            {/* Timeline */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
              {s.pasos.map((paso, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  {i < s.pasos.length - 1 && (
                    <div style={{ position: 'absolute', top: 14, left: '50%', width: '100%', height: 2, background: s.pasos[i + 1].done ? '#0070f3' : '#1e3a5f', zIndex: 0 }} />
                  )}
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: paso.done ? (i === s.pasos.filter(p => p.done).length - 1 && s.estado !== 'Completado' ? 'linear-gradient(135deg,#003066,#0070f3)' : '#065f46') : '#1e293b', border: `2px solid ${paso.done ? (i === s.pasos.filter(p => p.done).length - 1 && s.estado !== 'Completado' ? '#0070f3' : '#4ade80') : '#334155'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, zIndex: 1, position: 'relative', flexShrink: 0, transition: 'all .3s', boxShadow: paso.done ? '0 0 12px rgba(0,112,243,.3)' : 'none' }}>
                    {paso.done ? '✓' : <span style={{ color: '#475569', fontSize: 10 }}>{i + 1}</span>}
                  </div>
                  <p style={{ margin: '6px 0 2px', color: paso.done ? '#e2e8f0' : C.textMuted, fontSize: 10, fontWeight: 600, textAlign: 'center' }}>{paso.label}</p>
                  {paso.fecha && <p style={{ margin: 0, color: '#475569', fontSize: 9, textAlign: 'center' }}>{paso.fecha}</p>}
                </div>
              ))}
            </div>

            {/* Expandable detail */}
            {s.id === selected && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.borderLight}`, animation: 'fadeIn .2s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ background: '#0f1e30', borderRadius: 10, padding: '12px 16px' }}>
                    <p style={{ margin: '0 0 4px', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Fecha inicio</p>
                    <p style={{ margin: 0, color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>📅 {s.inicio}</p>
                  </div>
                  <div style={{ background: '#0f1e30', borderRadius: 10, padding: '12px 16px' }}>
                    <p style={{ margin: '0 0 4px', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Fecha fin</p>
                    <p style={{ margin: 0, color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>📅 {s.fin}</p>
                  </div>
                  <div style={{ background: '#0f1e30', borderRadius: 10, padding: '12px 16px' }}>
                    <p style={{ margin: '0 0 4px', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Costo total</p>
                    <p style={{ margin: 0, color: C.green, fontSize: 18, fontWeight: 900 }}>Bs {s.costo.toLocaleString()}</p>
                  </div>
                  <div style={{ background: '#0f1e30', borderRadius: 10, padding: '12px 16px' }}>
                    <p style={{ margin: '0 0 4px', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Supervisor</p>
                    <p style={{ margin: 0, color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>👤 {s.supervisor}</p>
                  </div>
                </div>
              </div>
            )}

            <p style={{ margin: '12px 0 0', color: s.id === selected ? C.blueLight : C.textMuted, fontSize: 11, textAlign: 'center' }}>
              {s.id === selected ? '▲ Ocultar detalles' : '▼ Ver detalles'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Facturas ──────────────────────────────────────────────────────────────────
function Facturas({ show }: { show: (t: Toast['type'], m: string) => void }) {
  const pendiente = MIS_COBROS.filter(c => c.estado === 'Pendiente').reduce((s, c) => s + c.monto, 0);
  const pagado    = MIS_COBROS.filter(c => c.estado === 'Pagado').reduce((s, c) => s + c.monto, 0);

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', color: C.text, fontSize: 20, fontWeight: 800 }}>💰 Mis Facturas</h2>

      {pendiente > 0 && (
        <div style={{ background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.3)', borderRadius: 12, padding: '14px 20px', marginBottom: 20 }}>
          <p style={{ margin: 0, color: C.yellow, fontWeight: 700, fontSize: 13 }}>⚠️ Tiene cobros pendientes de <strong>Bs {pendiente.toLocaleString()}</strong>. Contáctenos para coordinar el pago.</p>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 20 }}>
        {[
          { l: 'Total pagado',   v: `Bs ${pagado.toLocaleString()}`,    c: '#4ade80', e: '✅' },
          { l: 'Por pagar',     v: `Bs ${pendiente.toLocaleString()}`,  c: '#facc15', e: '⏳' },
          { l: 'Facturas',      v: MIS_COBROS.length,                   c: '#60a5fa', e: '🧾' },
        ].map(({ l, v, c, e }) => (
          <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
            <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
            <p style={{ margin: '6px 0 0', color: c, fontSize: 20, fontWeight: 900 }}>{e} {v}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['N° Factura', 'Concepto', 'Monto', 'Emisión', 'Vencimiento', 'Estado', 'Acción'].map((h, i) => (
              <th key={i} style={{ padding: '12px 16px', textAlign: 'left', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {MIS_COBROS.map(f => (
              <tr key={f.id} style={{ borderBottom: `1px solid ${C.borderLight}`, transition: 'background .15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ padding: '14px 16px', color: C.blueLight, fontWeight: 700, fontSize: 13 }}>#{f.id}</td>
                <td style={{ padding: '14px 16px', color: '#e2e8f0', fontSize: 13 }}><strong>{f.concepto}</strong></td>
                <td style={{ padding: '14px 16px' }}><span style={{ color: f.estado === 'Pagado' ? C.green : C.yellow, fontWeight: 700, fontSize: 13 }}>Bs {f.monto.toLocaleString()}</span></td>
                <td style={{ padding: '14px 16px', color: '#cbd5e1', fontSize: 13 }}>{f.emision}</td>
                <td style={{ padding: '14px 16px', color: '#cbd5e1', fontSize: 13 }}>{f.vencimiento}</td>
                <td style={{ padding: '14px 16px' }}><Badge text={f.estado} color={f.estado === 'Pagado' ? 'green' : 'yellow'} /></td>
                <td style={{ padding: '14px 16px' }}>
                  <button onClick={() => show('info', `Descargando factura #${f.id}...`)} style={{ background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.2)', color: C.blueLight, padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>⬇ PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Soporte ───────────────────────────────────────────────────────────────────
function Soporte({ show }: { show: (t: Toast['type'], m: string) => void }) {
  const [modal, setModal] = useState(false);
  const [tipo, setTipo] = useState('Consulta general');
  const [asunto, setAsunto] = useState('');
  const [detalle, setDetalle] = useState('');

  const enviar = () => {
    if (!asunto.trim() || !detalle.trim()) { show('error', 'Complete todos los campos'); return; }
    show('success', 'Solicitud enviada. Le contactaremos en 24–48 horas.');
    setAsunto(''); setDetalle(''); setModal(false);
  };

  const faqs = [
    { q: '¿Cómo puedo reprogramar un servicio?',      a: 'Contáctenos con al menos 48 horas de anticipación a través de este formulario o llamando al número de emergencias.' },
    { q: '¿Qué incluye el servicio de Limpieza Profunda?', a: 'Incluye limpieza de superficies, ventanas, sanitarios, pisos y áreas de difícil acceso. Usamos productos certificados.' },
    { q: '¿Cómo puedo realizar el pago de mis facturas?', a: 'Aceptamos transferencias bancarias, depósito y cheque. Contáctenos para coordinar el método de pago.' },
    { q: '¿Con cuánta anticipación debo solicitar un servicio?', a: 'Recomendamos solicitarlo con 5 días hábiles de anticipación para garantizar disponibilidad.' },
  ];

  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: C.text, fontSize: 20, fontWeight: 800 }}>🎧 Soporte y Consultas</h2>
        <button onClick={() => setModal(true)} style={{ background: 'linear-gradient(135deg,#003066,#1d4ed8)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          ✉️ Nueva solicitud
        </button>
      </div>

      {/* Contact info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Teléfono emergencias', value: '+591 77-SASL-BO', icon: '📞', color: '#10b981' },
          { label: 'Correo atención',      value: 'clientes@sasl.bo', icon: '✉️', color: '#0070f3' },
          { label: 'Horario de atención',  value: 'Lun–Vie 08:00–18:00', icon: '🕐', color: '#f59e0b' },
          { label: 'Tiempo de respuesta',  value: '24–48 horas hábiles', icon: '⚡', color: '#8b5cf6' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color + '55'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; }}>
            <span style={{ fontSize: 24 }}>{icon}</span>
            <p style={{ margin: '8px 0 4px', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{label}</p>
            <p style={{ margin: 0, color: color, fontWeight: 700, fontSize: 14 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderLight}` }}>
          <strong style={{ color: C.textSub, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.07em' }}>❓ Preguntas frecuentes</strong>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: i < faqs.length - 1 ? `1px solid ${C.borderLight}` : 'none' }}>
            <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', padding: '16px 20px', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>
              {faq.q}
              <span style={{ color: C.textMuted, fontSize: 16, flexShrink: 0, transition: 'transform .2s', transform: faqOpen === i ? 'rotate(180deg)' : 'none' }}>▼</span>
            </button>
            {faqOpen === i && (
              <div style={{ padding: '0 20px 16px', animation: 'fadeIn .2s ease' }}>
                <p style={{ margin: 0, color: C.textSub, fontSize: 13, lineHeight: 1.6, padding: '12px 16px', background: '#0f1e30', borderRadius: 10 }}>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {modal && (
        <Modal title="✉️ Nueva Solicitud de Soporte" onClose={() => setModal(false)}>
          <Fld label="Tipo de solicitud">
            <Sel value={tipo} onChange={e => setTipo(e.target.value)}>
              {['Consulta general', 'Reprogramación de servicio', 'Queja o reclamo', 'Solicitar nuevo servicio', 'Problema de facturación'].map(t => <option key={t}>{t}</option>)}
            </Sel>
          </Fld>
          <Fld label="Asunto">
            <Inp value={asunto} onChange={e => setAsunto(e.target.value)} placeholder="Resumen breve de su consulta..." />
          </Fld>
          <Fld label="Detalle">
            <textarea value={detalle} onChange={e => setDetalle(e.target.value)} placeholder="Describa su consulta con el mayor detalle posible..." style={{ width: '100%', background: '#0f1e30', border: '1px solid #1e3a5f', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', minHeight: 100, resize: 'vertical', fontFamily: 'inherit' }} />
          </Fld>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setModal(false)} style={{ background: 'rgba(148,163,184,.08)', border: '1px solid #1e3a5f', color: '#94a3b8', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Cancelar</button>
            <button onClick={enviar} style={{ background: 'linear-gradient(135deg,#003066,#1d4ed8)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>✉️ Enviar solicitud</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Nav config ────────────────────────────────────────────────────────────────
const NAV: { id: NavId; label: string; emoji: string }[] = [
  { id: 'panel',     label: 'Mi Panel',    emoji: '🏠' },
  { id: 'servicios', label: 'Servicios',   emoji: '🧹' },
  { id: 'facturas',  label: 'Facturas',    emoji: '💰' },
  { id: 'soporte',   label: 'Soporte',     emoji: '🎧' },
];

// ── Componente principal ──────────────────────────────────────────────────────
export default function ClientePage() {
  const router = useRouter();
  const { toasts, show } = useToast();
  const [active, setActive] = useState<NavId>('panel');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifs, setNotifs] = useState(NOTIFS);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  const unread = notifs.filter(n => !n.leida).length;
  const current = NAV.find(n => n.id === active)!;

  const renderSection = () => {
    switch (active) {
      case 'panel':     return <Panel notifs={notifs} setNotifs={setNotifs} show={show} setActive={setActive} />;
      case 'servicios': return <Servicios />;
      case 'facturas':  return <Facturas show={show} />;
      case 'soporte':   return <Soporte show={show} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: C.bg, color: C.text, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; } body { margin: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #060d1a; } ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
        select option { background: #0f1e30; } button, input, textarea, select { font-family: inherit; }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        @keyframes slideInRight { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:none; } }
      `}</style>

      <ToastContainer toasts={toasts} />

      {/* Sidebar */}
      <aside style={{ width: sidebarOpen ? 230 : 62, flexShrink: 0, background: C.sidebar, borderRight: `1px solid ${C.borderLight}`, display: 'flex', flexDirection: 'column', transition: 'width .25s ease', overflow: 'hidden' }}>
        <div style={{ padding: sidebarOpen ? '10px 14px' : '10px 8px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', minHeight: 70, gap: 10 }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#e8edf5', boxShadow: '0 2px 8px rgba(0,0,0,.3)' }}>
                <img src="/logo-icon.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 900, fontSize: 13, lineHeight: 1.2 }}>Markach'uxña</p>
                <p style={{ margin: 0, color: '#10b981', fontSize: 8.5, letterSpacing: 1.5, fontWeight: 700, textTransform: 'uppercase' }}>Multiservicios · Cliente</p>
              </div>
            </div>
          ) : (
            <div style={{ width: 38, height: 38, borderRadius: 9, overflow: 'hidden', background: '#e8edf5', boxShadow: '0 2px 8px rgba(0,0,0,.3)', flexShrink: 0 }}>
              <img src="/logo-icon.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, position: 'relative',
              padding: sidebarOpen ? '9px 12px' : '9px', borderRadius: 9, border: 'none',
              background: active === item.id ? 'linear-gradient(135deg,rgba(0,112,243,.18),rgba(0,48,102,.18))' : 'none',
              color: active === item.id ? '#60a5fa' : '#475569',
              cursor: 'pointer', fontSize: 13, fontWeight: active === item.id ? 700 : 500,
              marginBottom: 2, justifyContent: sidebarOpen ? 'flex-start' : 'center',
              borderLeft: active === item.id ? '2px solid #0070f3' : '2px solid transparent',
              transition: 'all .15s',
            }}
              onMouseEnter={e => { if (active !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,.04)'; }}
              onMouseLeave={e => { if (active !== item.id) e.currentTarget.style.background = 'none'; }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{item.emoji}</span>
              {sidebarOpen && item.label}
              {item.id === 'panel' && unread > 0 && (
                <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', padding: '1px 6px', fontSize: 10, fontWeight: 900, marginLeft: 'auto', flexShrink: 0 }}>{unread}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '10px 8px', borderTop: `1px solid ${C.borderLight}` }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.15)' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#065f46,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, fontWeight: 900, color: '#fff' }}>B</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, color: C.text, fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Banco Nacional</p>
                <p style={{ margin: 0, color: '#10b981', fontSize: 10, fontWeight: 600 }}>Cliente</p>
              </div>
              <button onClick={handleLogout} title="Cerrar sesión" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 15 }}>⏻</button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 17, padding: 8 }}>⏻</button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ height: 64, background: C.sidebar, borderBottom: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(p => !p)} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 20 }}>☰</button>
          <div>
            <h1 style={{ margin: 0, color: C.text, fontSize: 16, fontWeight: 800 }}>{current.emoji} {current.label}</h1>
            <p style={{ margin: 0, color: '#475569', fontSize: 11 }}>Portal Cliente · Banco Nacional de Bolivia</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/" style={{ color: '#475569', fontSize: 11, textDecoration: 'none' }}>← Inicio</Link>
            <span style={{ background: 'rgba(16,185,129,.15)', color: '#4ade80', border: '1px solid rgba(16,185,129,.3)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>CLIENTE</span>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
