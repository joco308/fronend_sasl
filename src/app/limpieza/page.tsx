"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ── Tipos ──────────────────────────────────────────────────────────────────
type Tarea = { id: number; cliente: string; tipo: string; zona: string; hora: string; estado: 'Pendiente' | 'En proceso' | 'Completado' };
type Uniforme = { nombre: string; talla: string; fechaEntrega: string };
type Capacitacion = { nombre: string; fecha: string; estado: 'Completado' | 'Pendiente' };

// ── Datos de muestra ───────────────────────────────────────────────────────
const TAREAS_HOY: Tarea[] = [
  { id: 1, cliente: 'Hotel Europa', tipo: 'Limpieza Habitaciones', zona: 'Sopocachi', hora: '07:00', estado: 'Completado' },
  { id: 2, cliente: 'Hotel Europa', tipo: 'Limpieza Áreas Comunes', zona: 'Sopocachi', hora: '09:30', estado: 'En proceso' },
  { id: 3, cliente: 'Banco Nacional', tipo: 'Limpieza Oficinas', zona: 'Centro', hora: '13:00', estado: 'Pendiente' },
];
const MIS_UNIFORMES: Uniforme[] = [
  { nombre: 'Camisa Operativa', talla: 'M (42)', fechaEntrega: '15/01/2026' },
  { nombre: 'Pantalón de Trabajo', talla: '40', fechaEntrega: '15/01/2026' },
  { nombre: 'Guantes de Nitrilo', talla: 'Caja x100', fechaEntrega: '01/04/2026' },
];
const MIS_CAPACITACIONES: Capacitacion[] = [
  { nombre: 'Manejo de Químicos', fecha: '10/03/2026', estado: 'Completado' },
  { nombre: 'Primeros Auxilios', fecha: '05/04/2026', estado: 'Completado' },
  { nombre: 'Protocolo Sanitario', fecha: '01/05/2026', estado: 'Pendiente' },
];

const C = {
  bg: '#060d1a', bgCard: '#0a1628', border: '#1e3a5f', borderLight: '#0f1e30',
  text: '#f1f5f9', muted: '#64748b', sub: '#94a3b8',
  blue: '#0070f3', blueLight: '#60a5fa',
  green: '#4ade80', yellow: '#facc15', red: '#f87171',
};

const Badge = ({ text, color }: { text: string; color: string }) => {
  const map: Record<string, [string, string]> = {
    green:  ['rgba(74,222,128,.12)', '#4ade80'],
    yellow: ['rgba(250,204,21,.12)', '#facc15'],
    blue:   ['rgba(96,165,250,.12)', '#60a5fa'],
    red:    ['rgba(248,113,113,.12)', '#f87171'],
  };
  const [bg, fg] = map[color] || map.blue;
  return <span style={{ background: bg, color: fg, border: `1px solid ${fg}30`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{text}</span>;
};

const estadoColor = (e: string) => e === 'Completado' ? 'green' : e === 'En proceso' ? 'blue' : 'yellow';

// ── Componente principal ───────────────────────────────────────────────────
export default function LimpiezaPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'inicio' | 'tareas' | 'uniformes' | 'capacitaciones'>('inicio');
  const [tareas, setTareas] = useState<Tarea[]>(TAREAS_HOY);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  const marcarTarea = (id: number) => {
    setTareas(p => p.map(t => t.id === id ? { ...t, estado: t.estado === 'Pendiente' ? 'En proceso' : t.estado === 'En proceso' ? 'Completado' : 'Completado' } : t));
  };

  const TABS = [
    { id: 'inicio' as const, label: 'Inicio', emoji: '🏠' },
    { id: 'tareas' as const, label: 'Mis tareas', emoji: '✅' },
    { id: 'uniformes' as const, label: 'Mis uniformes', emoji: '👕' },
    { id: 'capacitaciones' as const, label: 'Capacitaciones', emoji: '📚' },
  ];

  const completadas = tareas.filter(t => t.estado === 'Completado').length;
  const progreso = Math.round((completadas / tareas.length) * 100);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, color: C.text, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }`}</style>

      {/* Header */}
      <header style={{ height: 60, background: '#070f1d', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 14, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧹</div>
        <div>
          <p style={{ margin: 0, color: C.text, fontWeight: 900, fontSize: 14 }}>SASL Bolivia</p>
          <p style={{ margin: 0, color: C.muted, fontSize: 10 }}>Portal Operario</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, color: C.text, fontSize: 12, fontWeight: 700 }}>Ana Torres</p>
            <p style={{ margin: 0, color: C.muted, fontSize: 10 }}>Limpieza · Turno Mañana</p>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>
          <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Salir</button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ background: '#070f1d', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', padding: '0 24px', gap: 2, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '13px 18px', background: 'none', border: 'none',
            borderBottom: tab === t.id ? '2px solid #0070f3' : '2px solid transparent',
            color: tab === t.id ? '#60a5fa' : C.muted,
            cursor: 'pointer', fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
            display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
            transition: 'all .15s',
          }}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '28px 24px' }}>

        {/* ── INICIO ── */}
        {tab === 'inicio' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ margin: '0 0 6px', fontSize: '1.6rem', fontWeight: 900 }}>Buenos días, Ana 👋</h1>
              <p style={{ margin: 0, color: C.muted }}>Miércoles 22 de abril · Turno Mañana</p>
            </div>

            {/* Progreso del día */}
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{ margin: 0, color: C.text, fontWeight: 700 }}>Progreso del día</p>
                <p style={{ margin: 0, color: C.blueLight, fontWeight: 800 }}>{completadas}/{tareas.length} tareas</p>
              </div>
              <div style={{ background: '#1e3a5f', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg,#003066,#0070f3)', width: `${progreso}%`, height: '100%', borderRadius: 8, transition: 'width .4s ease' }} />
              </div>
              <p style={{ margin: '8px 0 0', color: C.muted, fontSize: 12 }}>{progreso}% completado</p>
            </div>

            {/* Horario del día */}
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
              <p style={{ margin: '0 0 16px', color: C.sub, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Mis tareas de hoy</p>
              {tareas.map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.borderLight}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.estado === 'Completado' ? 'rgba(74,222,128,.12)' : 'rgba(0,112,243,.12)', border: `1px solid ${t.estado === 'Completado' ? '#4ade80' : '#0070f3'}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      {t.estado === 'Completado' ? '✅' : '🧹'}
                    </div>
                    <div>
                      <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{t.cliente}</p>
                      <p style={{ margin: '2px 0 0', color: C.muted, fontSize: 11 }}>{t.tipo} · {t.hora}</p>
                    </div>
                  </div>
                  <Badge text={t.estado} color={estadoColor(t.estado)} />
                </div>
              ))}
            </div>

            {/* Info del turno */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { e: '🕐', l: 'Entrada', v: '06:00 AM' },
                { e: '🕑', l: 'Salida', v: '14:00 PM' },
                { e: '📍', l: 'Zona asignada', v: 'Sopocachi / Centro' },
                { e: '👤', l: 'Supervisor', v: 'Carlos Mamani' },
              ].map(({ e, l, v }) => (
                <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
                  <p style={{ margin: 0, color: C.muted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{l}</p>
                  <p style={{ margin: '6px 0 0', color: C.text, fontSize: 15, fontWeight: 700 }}>{e} {v}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAREAS ── */}
        {tab === 'tareas' && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '1.4rem', fontWeight: 900 }}>✅ Mis tareas</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {tareas.map(t => (
                <div key={t.id} style={{ background: C.bgCard, border: `1px solid ${t.estado === 'Completado' ? 'rgba(74,222,128,.25)' : C.border}`, borderRadius: 16, padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <p style={{ margin: 0, color: C.text, fontWeight: 800, fontSize: 15 }}>{t.cliente}</p>
                      <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 13 }}>{t.tipo} · {t.zona}</p>
                    </div>
                    <Badge text={t.estado} color={estadoColor(t.estado)} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, color: C.muted, fontSize: 12 }}>🕐 {t.hora}</p>
                    {t.estado !== 'Completado' && (
                      <button onClick={() => marcarTarea(t.id)} style={{
                        background: t.estado === 'Pendiente' ? 'rgba(0,112,243,0.12)' : 'rgba(74,222,128,0.12)',
                        border: `1px solid ${t.estado === 'Pendiente' ? 'rgba(0,112,243,0.3)' : 'rgba(74,222,128,0.3)'}`,
                        color: t.estado === 'Pendiente' ? C.blueLight : C.green,
                        borderRadius: 8, padding: '8px 16px', cursor: 'pointer',
                        fontSize: 12, fontWeight: 700,
                      }}>
                        {t.estado === 'Pendiente' ? '▶ Iniciar' : '✓ Completar'}
                      </button>
                    )}
                    {t.estado === 'Completado' && (
                      <span style={{ color: C.green, fontSize: 12, fontWeight: 700 }}>✅ Tarea completada</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── UNIFORMES ── */}
        {tab === 'uniformes' && (
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 900 }}>👕 Mis uniformes</h2>
            <p style={{ color: C.muted, margin: '0 0 24px', fontSize: 14 }}>Equipo de protección personal asignado a tu nombre.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {MIS_UNIFORMES.map(u => (
                <div key={u.nombre} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,112,243,0.1)', border: '1px solid rgba(0,112,243,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👕</div>
                    <div>
                      <p style={{ margin: 0, color: C.text, fontWeight: 700, fontSize: 14 }}>{u.nombre}</p>
                      <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 12 }}>Talla: {u.talla} · Entregado: {u.fechaEntrega}</p>
                    </div>
                  </div>
                  <Badge text="Entregado" color="green" />
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(250,204,21,0.05)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: 12, padding: 16, marginTop: 20 }}>
              <p style={{ margin: 0, color: '#facc15', fontSize: 12, fontWeight: 700 }}>ℹ️ Para solicitar reposición de uniformes, comuníquese con su supervisor Carlos Mamani.</p>
            </div>
          </div>
        )}

        {/* ── CAPACITACIONES ── */}
        {tab === 'capacitaciones' && (
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 900 }}>📚 Mis capacitaciones</h2>
            <p style={{ color: C.muted, margin: '0 0 24px', fontSize: 14 }}>Formaciones requeridas para el desempeño de tu rol.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {MIS_CAPACITACIONES.map(cap => (
                <div key={cap.nombre} style={{ background: C.bgCard, border: `1px solid ${cap.estado === 'Pendiente' ? 'rgba(250,204,21,0.25)' : C.border}`, borderRadius: 14, padding: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: cap.estado === 'Completado' ? 'rgba(74,222,128,0.1)' : 'rgba(250,204,21,0.1)', border: `1px solid ${cap.estado === 'Completado' ? 'rgba(74,222,128,0.25)' : 'rgba(250,204,21,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                      {cap.estado === 'Completado' ? '✅' : '📋'}
                    </div>
                    <div>
                      <p style={{ margin: 0, color: C.text, fontWeight: 700, fontSize: 14 }}>{cap.nombre}</p>
                      <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 12 }}>📅 {cap.fecha}</p>
                    </div>
                  </div>
                  <Badge text={cap.estado} color={cap.estado === 'Completado' ? 'green' : 'yellow'} />
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 12, padding: 16, marginTop: 20 }}>
              <p style={{ margin: 0, color: C.blueLight, fontSize: 12, fontWeight: 700 }}>📌 Las capacitaciones pendientes son obligatorias. Consulte las fechas con su supervisor.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
