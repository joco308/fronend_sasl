"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ── Tipos ──────────────────────────────────────────────────────────────────
type Servicio = { id: number; cliente: string; tipo: string; fecha: string; zona: string; estado: 'Pendiente' | 'En proceso' | 'Finalizado'; equipo: string[] };
type Incidente = { id: number; servicio: string; descripcion: string; fecha: string; gravedad: 'Leve' | 'Moderado' | 'Grave' };
type Empleado  = { id: number; nombre: string; turno: string; estado: 'Presente' | 'Ausente' | 'Permiso' };

// ── Datos de muestra ───────────────────────────────────────────────────────
const SERVICIOS_HOY: Servicio[] = [
  { id: 1, cliente: 'Hotel Europa', tipo: 'Limpieza Diaria', fecha: '2026-04-22', zona: 'Sopocachi', estado: 'En proceso', equipo: ['Ana Torres', 'Pedro Quispe'] },
  { id: 2, cliente: 'Banco Nacional', tipo: 'Limpieza Profunda', fecha: '2026-04-22', zona: 'Centro', estado: 'Pendiente', equipo: ['Luis Flores'] },
  { id: 3, cliente: 'Centro Médico Sur', tipo: 'Desinfección', fecha: '2026-04-22', zona: 'El Alto', estado: 'Finalizado', equipo: ['Maria Quispe', 'Juan Alvarez'] },
];
const EQUIPO: Empleado[] = [
  { id: 1, nombre: 'Ana Torres',    turno: '06:00 – 14:00', estado: 'Presente' },
  { id: 2, nombre: 'Pedro Quispe',  turno: '06:00 – 14:00', estado: 'Presente' },
  { id: 3, nombre: 'Luis Flores',   turno: '14:00 – 22:00', estado: 'Permiso' },
  { id: 4, nombre: 'Maria Quispe',  turno: '06:00 – 14:00', estado: 'Presente' },
  { id: 5, nombre: 'Juan Alvarez',  turno: '22:00 – 06:00', estado: 'Ausente' },
];
const INCIDENTES_INIT: Incidente[] = [
  { id: 1, servicio: 'Hotel Europa', descripcion: 'Derrame de químico en pasillo 3', fecha: '2026-04-20', gravedad: 'Leve' },
];

const C = {
  bg: '#060d1a', bgCard: '#0a1628', border: '#1e3a5f', borderLight: '#0f1e30',
  text: '#f1f5f9', muted: '#64748b', sub: '#94a3b8',
  blue: '#0070f3', blueDark: '#003066', blueLight: '#60a5fa',
  green: '#4ade80', yellow: '#facc15', red: '#f87171', orange: '#fb923c',
};

const Badge = ({ text, color }: { text: string; color: string }) => {
  const map: Record<string, [string, string]> = {
    green:  ['rgba(74,222,128,.12)', '#4ade80'],
    yellow: ['rgba(250,204,21,.12)', '#facc15'],
    red:    ['rgba(248,113,113,.12)', '#f87171'],
    blue:   ['rgba(96,165,250,.12)', '#60a5fa'],
    orange: ['rgba(251,146,60,.12)', '#fb923c'],
  };
  const [bg, fg] = map[color] || map.blue;
  return <span style={{ background: bg, color: fg, border: `1px solid ${fg}30`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{text}</span>;
};

const estadoColor = (e: string) => e === 'Finalizado' ? 'green' : e === 'En proceso' ? 'blue' : 'yellow';
const gravedadColor = (g: string) => g === 'Grave' ? 'red' : g === 'Moderado' ? 'orange' : 'yellow';
const presenciaColor = (e: string) => e === 'Presente' ? 'green' : e === 'Ausente' ? 'red' : 'yellow';

// ── Componente principal ───────────────────────────────────────────────────
export default function SupervisorPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'inicio' | 'servicios' | 'equipo' | 'incidentes'>('inicio');
  const [servicios, setServicios] = useState<Servicio[]>(SERVICIOS_HOY);
  const [incidentes, setIncidentes] = useState<Incidente[]>(INCIDENTES_INIT);
  const [modalInc, setModalInc] = useState(false);
  const [nuevoInc, setNuevoInc] = useState<Partial<Incidente>>({});

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  const cambiarEstado = (id: number, nuevoEstado: Servicio['estado']) => {
    setServicios(p => p.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s));
  };

  const guardarIncidente = () => {
    if (!nuevoInc.descripcion || !nuevoInc.servicio) return;
    setIncidentes(p => [...p, {
      id: p.length + 1,
      servicio: nuevoInc.servicio!,
      descripcion: nuevoInc.descripcion!,
      fecha: new Date().toISOString().slice(0, 10),
      gravedad: (nuevoInc.gravedad as Incidente['gravedad']) || 'Leve',
    }]);
    setModalInc(false);
    setNuevoInc({});
  };

  const TABS = [
    { id: 'inicio' as const, label: 'Inicio', emoji: '🏠' },
    { id: 'servicios' as const, label: 'Servicios del día', emoji: '🧹' },
    { id: 'equipo' as const, label: 'Mi equipo', emoji: '👥' },
    { id: 'incidentes' as const, label: 'Incidentes', emoji: '⚠️' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, color: C.text, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }`}</style>

      {/* Header */}
      <header style={{ height: 60, background: '#070f1d', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', padding: '0 32px', gap: 16, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧹</div>
        <div>
          <p style={{ margin: 0, color: C.text, fontWeight: 900, fontSize: 14 }}>SASL Bolivia</p>
          <p style={{ margin: 0, color: C.muted, fontSize: 10 }}>Portal Supervisor</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, color: C.text, fontSize: 12, fontWeight: 700 }}>Carlos Mamani</p>
            <p style={{ margin: 0, color: C.muted, fontSize: 10 }}>Supervisor · Turno Mañana</p>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👤</div>
          <button onClick={handleLogout} title="Cerrar sesión" style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Salir</button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ background: '#070f1d', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', padding: '0 32px', gap: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '14px 20px', background: 'none', border: 'none',
            borderBottom: tab === t.id ? '2px solid #0070f3' : '2px solid transparent',
            color: tab === t.id ? '#60a5fa' : C.muted,
            cursor: 'pointer', fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
            display: 'flex', alignItems: 'center', gap: 6, transition: 'all .15s',
          }}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 32px' }}>

        {/* ── INICIO ── */}
        {tab === 'inicio' && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ margin: '0 0 6px', fontSize: '1.8rem', fontWeight: 900 }}>Buen día, Carlos 👋</h1>
              <p style={{ margin: 0, color: C.muted }}>Miércoles 22 de abril · Turno Mañana (06:00 – 14:00)</p>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { l: 'Servicios hoy', v: servicios.length, c: '#3b82f6', e: '🧹' },
                { l: 'Finalizados', v: servicios.filter(s => s.estado === 'Finalizado').length, c: '#10b981', e: '✅' },
                { l: 'En proceso', v: servicios.filter(s => s.estado === 'En proceso').length, c: '#f59e0b', e: '⚙️' },
                { l: 'Personal presente', v: EQUIPO.filter(e => e.estado === 'Presente').length + '/' + EQUIPO.length, c: '#8b5cf6', e: '👥' },
                { l: 'Incidentes', v: incidentes.length, c: '#ef4444', e: '⚠️' },
              ].map(({ l, v, c, e }) => (
                <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -16, right: -16, width: 60, height: 60, borderRadius: '50%', background: c, opacity: .1 }} />
                  <p style={{ margin: 0, color: C.muted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
                  <p style={{ margin: '8px 0 0', color: C.text, fontSize: 24, fontWeight: 800 }}>{e} {v}</p>
                </div>
              ))}
            </div>

            {/* Resumen servicios del día */}
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: C.sub, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.07em' }}>Servicios de hoy</strong>
                <button onClick={() => setTab('servicios')} style={{ background: 'none', border: 'none', color: C.blueLight, fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>Ver todos →</button>
              </div>
              {servicios.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: `1px solid ${C.borderLight}` }}>
                  <div>
                    <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 700, fontSize: 13 }}>{s.cliente}</p>
                    <p style={{ margin: '3px 0 0', color: C.muted, fontSize: 11 }}>{s.tipo} · {s.zona} · {s.equipo.join(', ')}</p>
                  </div>
                  <Badge text={s.estado} color={estadoColor(s.estado)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SERVICIOS ── */}
        {tab === 'servicios' && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '1.4rem', fontWeight: 900 }}>🧹 Servicios del día</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {servicios.map(s => (
                <div key={s.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <p style={{ margin: 0, color: C.text, fontWeight: 800, fontSize: 16 }}>{s.cliente}</p>
                      <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 13 }}>{s.tipo} · {s.zona}</p>
                    </div>
                    <Badge text={s.estado} color={estadoColor(s.estado)} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ margin: '0 0 6px', color: C.muted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Equipo asignado</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {s.equipo.map(e => (
                        <span key={e} style={{ background: 'rgba(0,112,243,0.1)', border: '1px solid rgba(0,112,243,0.25)', color: C.blueLight, borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>👤 {e}</span>
                      ))}
                    </div>
                  </div>
                  {/* Cambiar estado */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <p style={{ margin: 0, color: C.muted, fontSize: 12, fontWeight: 700 }}>Cambiar estado:</p>
                    {(['Pendiente', 'En proceso', 'Finalizado'] as const).map(est => (
                      <button key={est} onClick={() => cambiarEstado(s.id, est)} style={{
                        padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: s.estado === est ? 'rgba(0,112,243,0.2)' : 'rgba(255,255,255,0.04)',
                        color: s.estado === est ? '#60a5fa' : C.muted,
                        fontSize: 12, fontWeight: s.estado === est ? 800 : 600,
                        transition: 'all .15s',
                      }}>{est}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EQUIPO ── */}
        {tab === 'equipo' && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '1.4rem', fontWeight: 900 }}>👥 Mi equipo</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {EQUIPO.map(emp => (
                <div key={emp.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>👤</div>
                    <div>
                      <p style={{ margin: 0, color: C.text, fontWeight: 800, fontSize: 14 }}>{emp.nombre}</p>
                      <p style={{ margin: '3px 0 0', color: C.muted, fontSize: 12 }}>🕐 {emp.turno}</p>
                    </div>
                  </div>
                  <Badge text={emp.estado} color={presenciaColor(emp.estado)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── INCIDENTES ── */}
        {tab === 'incidentes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>⚠️ Incidentes</h2>
              <button onClick={() => setModalInc(true)} style={{ background: 'linear-gradient(135deg,#003066,#0070f3)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
                + Reportar incidente
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {incidentes.length === 0 && (
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '40px', textAlign: 'center', color: C.muted }}>Sin incidentes registrados</div>
              )}
              {incidentes.map(inc => (
                <div key={inc.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <p style={{ margin: 0, color: C.text, fontWeight: 800, fontSize: 14 }}>{inc.servicio}</p>
                      <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 12 }}>📅 {inc.fecha}</p>
                    </div>
                    <Badge text={inc.gravedad} color={gravedadColor(inc.gravedad)} />
                  </div>
                  <p style={{ margin: 0, color: C.sub, fontSize: 13, lineHeight: 1.5 }}>{inc.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Modal nuevo incidente */}
      {modalInc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 'min(520px,95vw)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontWeight: 800, fontSize: 18 }}>Reportar Incidente</h3>
              <button onClick={() => setModalInc(false)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 22 }}>×</button>
            </div>
            {[
              { k: 'servicio', l: 'Servicio relacionado', t: 'text', ph: 'Ej: Hotel Europa' },
              { k: 'descripcion', l: 'Descripción del incidente', t: 'text', ph: 'Describa lo ocurrido...' },
            ].map(({ k, l, t, ph }) => (
              <div key={k} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{l}</label>
                <input type={t} value={(nuevoInc as Record<string, string>)[k] || ''} onChange={e => setNuevoInc(p => ({ ...p, [k]: e.target.value }))} placeholder={ph}
                  style={{ width: '100%', background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Gravedad</label>
              <select value={nuevoInc.gravedad || 'Leve'} onChange={e => setNuevoInc(p => ({ ...p, gravedad: e.target.value as Incidente['gravedad'] }))}
                style={{ width: '100%', background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                {['Leve', 'Moderado', 'Grave'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setModalInc(false)} style={{ padding: '10px 20px', background: 'rgba(148,163,184,.08)', color: C.sub, border: '1px solid #1e3a5f', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={guardarIncidente} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#003066,#0070f3)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
