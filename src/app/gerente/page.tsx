"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Toast = { id: number; type: 'success' | 'error' | 'info' | 'warning'; msg: string };
type NavId = 'dashboard' | 'reportes' | 'clientes' | 'servicios' | 'empleados';

const C = {
  bg: '#060d1a', bgCard: '#0a1628', sidebar: '#070f1d',
  border: '#1e3a5f', borderLight: '#0f1e30',
  text: '#f1f5f9', textMuted: '#64748b', textSub: '#94a3b8',
  blueLight: '#60a5fa', green: '#4ade80', yellow: '#facc15',
  red: '#f87171', purple: '#a78bfa', orange: '#fb923c',
};

const MONTHLY = [
  { mes: 'Nov', ingresos: 8200,  servicios: 4 },
  { mes: 'Dic', ingresos: 12400, servicios: 6 },
  { mes: 'Ene', ingresos: 9800,  servicios: 5 },
  { mes: 'Feb', ingresos: 15200, servicios: 7 },
  { mes: 'Mar', ingresos: 18900, servicios: 9 },
  { mes: 'Abr', ingresos: 13700, servicios: 8 },
];

const CLIENTES_DATA = [
  { id: 1, nombre: 'Banco Nacional de Bolivia', contacto: '77012345', direccion: 'Av. Camacho 1234, La Paz',      activo: true,  gasto: 4500 },
  { id: 2, nombre: 'Hotel Europa',              contacto: '77098765', direccion: 'Calle Sagárnaga 456, La Paz',  activo: true,  gasto: 8000 },
  { id: 3, nombre: 'Centro Médico Sur',         contacto: '77056789', direccion: 'Av. Hernando Siles 789, El Alto', activo: false, gasto: 1200 },
];

const SERVICIOS_DATA = [
  { id: 1, cliente: 'Banco Nacional', tipo: 'Limpieza Profunda', inicio: '2026-04-01', costo: 4500, estado: 'Activo'    },
  { id: 2, cliente: 'Hotel Europa',   tipo: 'Limpieza Diaria',   inicio: '2026-03-01', costo: 8000, estado: 'Activo'    },
  { id: 3, cliente: 'Centro Médico',  tipo: 'Desinfección',      inicio: '2026-04-15', costo: 1200, estado: 'Finalizado'},
];

const COBROS_DATA = [
  { id: 1, cliente: 'Banco Nacional', monto: 4500, emision: '2026-04-01', vencimiento: '2026-04-30', estado: 'Pagado'   },
  { id: 2, cliente: 'Hotel Europa',   monto: 8000, emision: '2026-05-01', vencimiento: '2026-05-31', estado: 'Pendiente'},
  { id: 3, cliente: 'Centro Médico',  monto: 1200, emision: '2026-04-15', vencimiento: '2026-04-20', estado: 'Pagado'   },
];

const EMPLEADOS_DATA = [
  { id: 1, nombre: 'Carlos Mamani', rol: 'Supervisor', correo: 'c.mamani@sasl.bo', servicios: 12, rendimiento: 95, activo: true  },
  { id: 2, nombre: 'Ana Torres',    rol: 'Limpieza',   correo: 'a.torres@sasl.bo', servicios: 8,  rendimiento: 88, activo: true  },
  { id: 3, nombre: 'Pedro Quispe',  rol: 'Limpieza',   correo: 'p.quispe@sasl.bo', servicios: 0,  rendimiento: 0,  activo: false },
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

// ── CSV Export ────────────────────────────────────────────────────────────────
function exportCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const content = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── UI helpers ────────────────────────────────────────────────────────────────
const Badge = ({ text, color = 'blue' }: { text: string; color?: string }) => {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    green:  { bg: 'rgba(34,197,94,.15)',   color: '#4ade80', border: 'rgba(34,197,94,.3)'   },
    yellow: { bg: 'rgba(234,179,8,.15)',   color: '#facc15', border: 'rgba(234,179,8,.3)'   },
    red:    { bg: 'rgba(239,68,68,.15)',   color: '#f87171', border: 'rgba(239,68,68,.3)'   },
    blue:   { bg: 'rgba(59,130,246,.15)',  color: '#60a5fa', border: 'rgba(59,130,246,.3)'  },
    purple: { bg: 'rgba(167,139,250,.15)', color: '#a78bfa', border: 'rgba(167,139,250,.3)' },
  };
  const s = map[color] || map.blue;
  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{text}</span>;
};

const Tabla = ({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>{headers.map((h, i) => <th key={i} style={{ padding: '12px 16px', textAlign: 'left', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}`, transition: 'background .15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.025)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            {row.map((cell, j) => <td key={j} style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
    {rows.length === 0 && <div style={{ padding: '48px', textAlign: 'center', color: C.textMuted }}>📭 Sin registros</div>}
  </div>
);

const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', transition: 'border-color .2s', ...style }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,112,243,.3)')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    {children}
  </div>
);

const Btn = ({ children, onClick, variant = 'primary', sm }: { children: React.ReactNode; onClick?: () => void; variant?: string; sm?: boolean }) => {
  const v: Record<string, React.CSSProperties> = {
    primary: { background: 'linear-gradient(135deg,#003066,#1d4ed8)', color: '#fff', border: 'none' },
    ghost:   { background: 'rgba(148,163,184,.08)', color: '#94a3b8', border: '1px solid #1e3a5f' },
    success: { background: 'rgba(34,197,94,.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,.3)' },
  };
  return (
    <button onClick={onClick} style={{ ...v[variant], padding: sm ? '6px 14px' : '9px 18px', borderRadius: 8, fontSize: sm ? 12 : 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all .15s' }}>
      {children}
    </button>
  );
};

// ── Charts ────────────────────────────────────────────────────────────────────
const BarChart = ({ data, color = '#0070f3', height = 160 }: { data: { label: string; value: number }[]; color?: string; height?: number }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  const bw = 100 / data.length;
  return (
    <svg width="100%" height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const bh = Math.max(4, (d.value / max) * (height - 28));
        return (
          <g key={i}>
            <rect x={`${i * bw + bw * 0.15}%`} y={height - 28 - bh} width={`${bw * 0.7}%`} height={bh} rx="4" fill="url(#barG)" />
            <text x={`${i * bw + bw / 2}%`} y={height - 6} textAnchor="middle" fill="#475569" fontSize="10">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

const DonutChart = ({ segments, size = 110 }: { segments: { value: number; color: string; label: string }[]; size?: number }) => {
  const total = segments.reduce((s, sg) => s + sg.value, 0) || 1;
  const r = 38, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let acc = 0;
  const els = segments.map((seg, i) => {
    const dash = (seg.value / total) * circ;
    const el = (
      <circle key={i} cx={cx} cy={cy} r={r} fill="none"
        stroke={seg.color} strokeWidth="16"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={-acc} />
    );
    acc += dash;
    return el;
  });
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {els}
      <circle cx={cx} cy={cy} r="26" fill={C.bgCard} />
    </svg>
  );
};

const ProgressBar = ({ value, max, color = '#0070f3' }: { value: number; max: number; color?: string }) => (
  <div style={{ background: '#0f1e30', borderRadius: 6, height: 6, overflow: 'hidden' }}>
    <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: '100%', background: color, borderRadius: 6, transition: 'width .6s ease' }} />
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ show }: { show: (t: Toast['type'], m: string) => void }) {
  const totalIngresos = COBROS_DATA.filter(c => c.estado === 'Pagado').reduce((s, c) => s + c.monto, 0);
  const pendiente     = COBROS_DATA.filter(c => c.estado === 'Pendiente').reduce((s, c) => s + c.monto, 0);
  const activos       = SERVICIOS_DATA.filter(s => s.estado === 'Activo').length;
  const tendencia     = ((MONTHLY[5].ingresos - MONTHLY[4].ingresos) / MONTHLY[4].ingresos * 100).toFixed(1);

  const kpis = [
    { l: 'Ingresos cobrados', v: `Bs ${totalIngresos.toLocaleString()}`, c: '#10b981', e: '💰', sub: `${Number(tendencia) >= 0 ? '▲' : '▼'} ${tendencia}% vs mes anterior` },
    { l: 'Cobros pendientes',  v: `Bs ${pendiente.toLocaleString()}`,    c: '#f59e0b', e: '⏳', sub: `${COBROS_DATA.filter(c => c.estado === 'Pendiente').length} factura(s)` },
    { l: 'Servicios activos',  v: activos,                                c: '#3b82f6', e: '🧹', sub: `${SERVICIOS_DATA.length} totales` },
    { l: 'Clientes activos',   v: CLIENTES_DATA.filter(c => c.activo).length, c: '#8b5cf6', e: '🏢', sub: `${CLIENTES_DATA.length} registrados` },
  ];

  const donutData = [
    { label: 'Lim. Profunda', value: 2, color: '#0070f3' },
    { label: 'Lim. Diaria',   value: 4, color: '#10b981' },
    { label: 'Desinfección',  value: 3, color: '#f59e0b' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: '0 0 4px', color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3 }}>PANEL GERENCIAL</p>
        <h2 style={{ margin: 0, color: C.text, fontSize: 22, fontWeight: 900 }}>Resumen Ejecutivo</h2>
        <p style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>Datos actualizados al 29 de Abril, 2026</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
        {kpis.map(({ l, v, c, e, sub }) => (
          <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 22px', position: 'relative', overflow: 'hidden', cursor: 'default', transition: 'all .2s' }}
            onMouseEnter={el => { el.currentTarget.style.transform = 'translateY(-3px)'; el.currentTarget.style.borderColor = c + '60'; }}
            onMouseLeave={el => { el.currentTarget.style.transform = 'none'; el.currentTarget.style.borderColor = C.border; }}>
            <div style={{ position: 'absolute', top: -16, right: -16, width: 72, height: 72, borderRadius: '50%', background: c, opacity: .1 }} />
            <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
            <p style={{ margin: '8px 0 4px', color: C.text, fontSize: 24, fontWeight: 900 }}>{e} {v}</p>
            <p style={{ margin: 0, color: '#475569', fontSize: 11 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card>
          <CardHeader>
            <strong style={{ color: C.textSub, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.07em' }}>📈 Ingresos últimos 6 meses</strong>
            <Btn sm onClick={() => { exportCSV('ingresos_mensual.csv', ['Mes','Ingresos','Servicios'], MONTHLY.map(m => [m.mes, m.ingresos, m.servicios])); show('success', 'Reporte exportado'); }}>⬇ CSV</Btn>
          </CardHeader>
          <div style={{ padding: '20px 20px 12px' }}>
            <BarChart data={MONTHLY.map(m => ({ label: m.mes, value: m.ingresos }))} color="#0070f3" height={150} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              {MONTHLY.map(m => (
                <div key={m.mes} style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, color: C.textMuted, fontSize: 10 }}>Bs {(m.ingresos / 1000).toFixed(1)}k</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <strong style={{ color: C.textSub, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.07em' }}>🧹 Tipos de Servicio</strong>
          </CardHeader>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <DonutChart segments={donutData} size={120} />
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {donutData.map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                    <span style={{ color: C.textSub, fontSize: 12 }}>{d.label}</span>
                  </div>
                  <span style={{ color: C.text, fontWeight: 700, fontSize: 12 }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Activity + Top Clients */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardHeader>
            <strong style={{ color: C.textSub, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.07em' }}>🏆 Top Clientes por Gasto</strong>
          </CardHeader>
          <div style={{ padding: 16 }}>
            {[...CLIENTES_DATA].sort((a, b) => b.gasto - a.gasto).map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 4px', borderBottom: i < 2 ? `1px solid ${C.borderLight}` : 'none' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: ['linear-gradient(135deg,#f59e0b,#d97706)', 'linear-gradient(135deg,#94a3b8,#64748b)', 'linear-gradient(135deg,#b45309,#92400e)'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 4px', color: '#e2e8f0', fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nombre}</p>
                  <ProgressBar value={c.gasto} max={Math.max(...CLIENTES_DATA.map(x => x.gasto))} color={['#f59e0b', '#94a3b8', '#b45309'][i]} />
                </div>
                <span style={{ color: C.green, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>Bs {c.gasto.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <strong style={{ color: C.textSub, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.07em' }}>📋 Estado Operativo</strong>
          </CardHeader>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { l: 'Empleados activos',     v: EMPLEADOS_DATA.filter(e => e.activo).length,     tot: EMPLEADOS_DATA.length, c: '#10b981' },
              { l: 'Servicios completados', v: SERVICIOS_DATA.filter(s => s.estado === 'Finalizado').length, tot: SERVICIOS_DATA.length, c: '#3b82f6' },
              { l: 'Cobros al día',          v: COBROS_DATA.filter(c => c.estado === 'Pagado').length, tot: COBROS_DATA.length, c: '#8b5cf6' },
            ].map(({ l, v, tot, c }) => (
              <div key={l}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: C.textSub, fontSize: 13 }}>{l}</span>
                  <span style={{ color: C.text, fontWeight: 700, fontSize: 13 }}>{v}/{tot}</span>
                </div>
                <ProgressBar value={v} max={tot} color={c} />
              </div>
            ))}
            <div style={{ marginTop: 8, padding: '12px 14px', background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 10 }}>
              <p style={{ margin: 0, color: '#4ade80', fontWeight: 700, fontSize: 12 }}>✅ Sistema operando con normalidad</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Reportes ──────────────────────────────────────────────────────────────────
function Reportes({ show }: { show: (t: Toast['type'], m: string) => void }) {
  const [periodo, setPeriodo] = useState<'mensual' | 'trimestral' | 'anual'>('mensual');

  const data = periodo === 'mensual' ? MONTHLY.slice(-1) : periodo === 'trimestral' ? MONTHLY.slice(-3) : MONTHLY;
  const totalIng = data.reduce((s, m) => s + m.ingresos, 0);
  const totalSvc = data.reduce((s, m) => s + m.servicios, 0);

  const handleExport = () => {
    exportCSV(
      `reporte_${periodo}.csv`,
      ['Período', 'Mes', 'Ingresos (Bs)', 'Servicios'],
      data.map(m => [periodo.toUpperCase(), m.mes, m.ingresos, m.servicios])
    );
    show('success', `Reporte ${periodo} exportado exitosamente`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <p style={{ margin: '0 0 4px', color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3 }}>REPORTES</p>
          <h2 style={{ margin: 0, color: C.text, fontSize: 22, fontWeight: 900 }}>Análisis y Exportación</h2>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: 3, gap: 2 }}>
            {(['mensual', 'trimestral', 'anual'] as const).map(p => (
              <button key={p} onClick={() => setPeriodo(p)} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: periodo === p ? '#1d4ed8' : 'none', color: periodo === p ? '#fff' : C.textMuted, fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all .15s', textTransform: 'capitalize' }}>{p}</button>
            ))}
          </div>
          <Btn onClick={handleExport}>⬇ Exportar CSV</Btn>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { l: 'Ingresos del período',  v: `Bs ${totalIng.toLocaleString()}`, c: '#10b981', e: '💰' },
          { l: 'Total servicios',        v: totalSvc,                           c: '#3b82f6', e: '🧹' },
          { l: 'Promedio mensual',       v: `Bs ${Math.round(totalIng / data.length).toLocaleString()}`, c: '#8b5cf6', e: '📊' },
          { l: 'Meses analizados',       v: data.length,                        c: '#f59e0b', e: '📅' },
        ].map(({ l, v, c, e }) => (
          <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px' }}>
            <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
            <p style={{ margin: '8px 0 0', color: C.text, fontSize: 22, fontWeight: 900 }}>{e} {v}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <Card style={{ marginBottom: 24 }}>
        <CardHeader>
          <strong style={{ color: C.textSub, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.07em' }}>📈 Ingresos por período — {periodo}</strong>
        </CardHeader>
        <div style={{ padding: '20px 24px 12px' }}>
          <BarChart data={data.map(m => ({ label: m.mes, value: m.ingresos }))} color="#8b5cf6" height={160} />
        </div>
      </Card>

      {/* Detail Table */}
      <Card>
        <CardHeader>
          <strong style={{ color: C.textSub, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.07em' }}>📋 Detalle por mes</strong>
          <Btn sm variant="ghost" onClick={handleExport}>⬇ Descargar</Btn>
        </CardHeader>
        <Tabla
          headers={['Mes', 'Ingresos (Bs)', 'Servicios', 'Promedio/Servicio', 'Variación']}
          rows={data.map((m, i) => {
            const prev = data[i - 1];
            const variacion = prev ? ((m.ingresos - prev.ingresos) / prev.ingresos * 100).toFixed(1) : '—';
            const varColor = prev ? (m.ingresos >= prev.ingresos ? '#4ade80' : '#f87171') : C.textMuted;
            return [
              <strong style={{ color: C.blueLight }}>{m.mes} 2026</strong>,
              <span style={{ color: C.green, fontWeight: 700 }}>Bs {m.ingresos.toLocaleString()}</span>,
              m.servicios,
              <span style={{ color: C.textSub }}>Bs {Math.round(m.ingresos / m.servicios).toLocaleString()}</span>,
              <span style={{ color: varColor, fontWeight: 700 }}>{prev ? `${Number(variacion) >= 0 ? '▲' : '▼'} ${Math.abs(Number(variacion))}%` : '—'}</span>,
            ];
          })}
        />
      </Card>
    </div>
  );
}

// ── Clientes ──────────────────────────────────────────────────────────────────
function Clientes({ show }: { show: (t: Toast['type'], m: string) => void }) {
  const [search, setSearch] = useState('');
  const filtered = CLIENTES_DATA.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: C.text, fontSize: 20, fontWeight: 800 }}>🏢 Clientes</h2>
        <Btn sm onClick={() => { exportCSV('clientes.csv', ['ID','Nombre','Contacto','Dirección','Estado'], CLIENTES_DATA.map(c => [c.id, c.nombre, c.contacto, c.direccion, c.activo ? 'Activo' : 'Inactivo'])); show('success', 'Listado exportado'); }}>⬇ Exportar</Btn>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { l: 'Total clientes', v: CLIENTES_DATA.length, c: '#3b82f6' },
          { l: 'Activos', v: CLIENTES_DATA.filter(c => c.activo).length, c: '#4ade80' },
          { l: 'Gasto total', v: `Bs ${CLIENTES_DATA.reduce((s, c) => s + c.gasto, 0).toLocaleString()}`, c: '#8b5cf6' },
        ].map(({ l, v, c }) => (
          <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: c, fontSize: 20, fontWeight: 900 }}>{v}</span>
            <span style={{ color: C.textMuted, fontSize: 12 }}>{l}</span>
          </div>
        ))}
      </div>
      <Card>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ color: C.textMuted }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..." style={{ background: 'none', border: 'none', color: C.text, fontSize: 14, outline: 'none', flex: 1 }} />
        </div>
        <Tabla
          headers={['ID', 'Empresa', 'Contacto', 'Dirección', 'Gasto (Bs)', 'Estado']}
          rows={filtered.map(c => [
            <span style={{ color: C.blueLight, fontWeight: 700 }}>#{c.id}</span>,
            <strong>{c.nombre}</strong>,
            c.contacto, c.direccion,
            <span style={{ color: C.green, fontWeight: 700 }}>Bs {c.gasto.toLocaleString()}</span>,
            <Badge text={c.activo ? 'Activo' : 'Inactivo'} color={c.activo ? 'green' : 'red'} />,
          ])}
        />
      </Card>
    </div>
  );
}

// ── Servicios ─────────────────────────────────────────────────────────────────
function Servicios({ show }: { show: (t: Toast['type'], m: string) => void }) {
  const [filtro, setFiltro] = useState<'Todos' | 'Activo' | 'Finalizado'>('Todos');
  const filtered = SERVICIOS_DATA.filter(s => filtro === 'Todos' || s.estado === filtro);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: C.text, fontSize: 20, fontWeight: 800 }}>🧹 Servicios</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: 3, gap: 2 }}>
            {(['Todos', 'Activo', 'Finalizado'] as const).map(f => (
              <button key={f} onClick={() => setFiltro(f)} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: filtro === f ? '#1d4ed8' : 'none', color: filtro === f ? '#fff' : C.textMuted, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>{f}</button>
            ))}
          </div>
          <Btn sm onClick={() => { exportCSV('servicios.csv', ['ID','Cliente','Tipo','Inicio','Costo','Estado'], filtered.map(s => [s.id, s.cliente, s.tipo, s.inicio, s.costo, s.estado])); show('success', 'Servicios exportados'); }}>⬇ Exportar</Btn>
        </div>
      </div>
      <Card>
        <Tabla
          headers={['ID', 'Cliente', 'Tipo de Servicio', 'Fecha Inicio', 'Costo (Bs)', 'Estado']}
          rows={filtered.map(s => [
            <span style={{ color: C.blueLight, fontWeight: 700 }}>#{s.id}</span>,
            <strong>{s.cliente}</strong>,
            s.tipo, s.inicio,
            <span style={{ color: C.green, fontWeight: 700 }}>Bs {s.costo.toLocaleString()}</span>,
            <Badge text={s.estado} color={s.estado === 'Activo' ? 'green' : 'yellow'} />,
          ])}
        />
      </Card>
    </div>
  );
}

// ── Empleados (vista parcial) ─────────────────────────────────────────────────
function Empleados({ show }: { show: (t: Toast['type'], m: string) => void }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: C.text, fontSize: 20, fontWeight: 800 }}>👥 Empleados</h2>
          <p style={{ margin: '4px 0 0', color: C.textMuted, fontSize: 12 }}>Vista de rendimiento — solo lectura</p>
        </div>
        <Btn sm onClick={() => { exportCSV('empleados_rendimiento.csv', ['ID','Nombre','Rol','Servicios','Rendimiento (%)','Estado'], EMPLEADOS_DATA.map(e => [e.id, e.nombre, e.rol, e.servicios, e.rendimiento, e.activo ? 'Activo' : 'Inactivo'])); show('success', 'Informe de rendimiento exportado'); }}>⬇ Exportar</Btn>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {EMPLEADOS_DATA.map(e => (
          <div key={e.id} style={{ background: C.bgCard, border: `1px solid ${e.activo ? C.border : 'rgba(239,68,68,.2)'}`, borderRadius: 14, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 18, transition: 'all .2s' }}
            onMouseEnter={el => { el.currentTarget.style.borderColor = e.activo ? 'rgba(0,112,243,.3)' : 'rgba(239,68,68,.4)'; }}
            onMouseLeave={el => { el.currentTarget.style.borderColor = e.activo ? C.border : 'rgba(239,68,68,.2)'; }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: e.activo ? 'linear-gradient(135deg,#003066,#0070f3)' : '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
              {e.nombre.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 700, fontSize: 14 }}>{e.nombre}</p>
                <Badge text={e.rol} color="blue" />
                {!e.activo && <Badge text="Inactivo" color="red" />}
              </div>
              <p style={{ margin: '0 0 8px', color: C.textMuted, fontSize: 12 }}>{e.correo} · {e.servicios} servicios completados</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <ProgressBar value={e.rendimiento} max={100} color={e.rendimiento >= 90 ? '#4ade80' : e.rendimiento >= 70 ? '#f59e0b' : '#f87171'} />
                </div>
                <span style={{ color: e.rendimiento >= 90 ? C.green : e.rendimiento >= 70 ? C.yellow : C.red, fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{e.rendimiento}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Nav config ────────────────────────────────────────────────────────────────
const NAV: { id: NavId; label: string; emoji: string }[] = [
  { id: 'dashboard', label: 'Dashboard',  emoji: '📊' },
  { id: 'reportes',  label: 'Reportes',   emoji: '📈' },
  { id: 'clientes',  label: 'Clientes',   emoji: '🏢' },
  { id: 'servicios', label: 'Servicios',  emoji: '🧹' },
  { id: 'empleados', label: 'Empleados',  emoji: '👥' },
];

// ── Componente principal ──────────────────────────────────────────────────────
export default function GerentePage() {
  const router = useRouter();
  const { toasts, show } = useToast();
  const [active, setActive] = useState<NavId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  const renderSection = () => {
    switch (active) {
      case 'dashboard': return <Dashboard show={show} />;
      case 'reportes':  return <Reportes show={show} />;
      case 'clientes':  return <Clientes show={show} />;
      case 'servicios': return <Servicios show={show} />;
      case 'empleados': return <Empleados show={show} />;
    }
  };

  const current = NAV.find(n => n.id === active)!;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: C.bg, color: C.text, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; } body { margin: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #060d1a; } ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
        select option { background: #0f1e30; } button, input, select { font-family: inherit; }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
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
                <p style={{ margin: 0, color: '#10b981', fontSize: 8.5, letterSpacing: 1.5, fontWeight: 700, textTransform: 'uppercase' }}>Multiservicios · Gerencia</p>
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
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
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
            </button>
          ))}
        </nav>

        <div style={{ padding: '10px 8px', borderTop: `1px solid ${C.borderLight}` }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.15)' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#065f46,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, fontWeight: 900, color: '#fff' }}>C</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, color: C.text, fontSize: 12, fontWeight: 700 }}>Carlos Mamani</p>
                <p style={{ margin: 0, color: '#10b981', fontSize: 10, fontWeight: 600 }}>Gerente</p>
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
            <p style={{ margin: 0, color: '#475569', fontSize: 11 }}>Panel Gerencia · SASL</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/" style={{ color: '#475569', fontSize: 11, textDecoration: 'none' }}>← Inicio</Link>
            <span style={{ background: 'rgba(16,185,129,.15)', color: '#4ade80', border: '1px solid rgba(16,185,129,.3)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>GERENTE</span>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
