"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Toast = { id: number; type: 'success' | 'error' | 'info' | 'warning'; msg: string };
type NavId = 'inicio' | 'servicios' | 'horarios' | 'capacitaciones';
type ServicioDB = { id_servicio: number; nombre_cliente: string | null; tipo_servicio: number; fecha_inicio: string; fecha_final: string | null; costo: number; descripcion: string | null };
type HoraDB    = { id_horario: number; hora_entrada: string; hora_salida: string };

const C = {
  bg: '#060d1a', bgCard: '#0a1628', sidebar: '#070f1d',
  border: '#1e3a5f', borderLight: '#0f1e30',
  text: '#f1f5f9', textMuted: '#64748b', textSub: '#94a3b8',
  blueLight: '#60a5fa', green: '#4ade80', yellow: '#facc15', red: '#f87171',
};

const SERVICIOS_INIT = [
  { id: 1, cliente: 'Banco Nacional',  tipo: 'Limpieza Profunda', fecha: '2026-04-29', hora: '08:00–14:00', supervisor: 'Carlos Mamani', estado: 'En curso',   ubicacion: 'Av. Camacho 1234, La Paz'    },
  { id: 2, cliente: 'Hotel Europa',    tipo: 'Limpieza Diaria',   fecha: '2026-04-30', hora: '06:00–14:00', supervisor: 'Carlos Mamani', estado: 'Pendiente',  ubicacion: 'Calle Sagárnaga 456, La Paz' },
  { id: 3, cliente: 'Centro Médico',   tipo: 'Desinfección',      fecha: '2026-04-28', hora: '14:00–20:00', supervisor: 'Carlos Mamani', estado: 'Completado', ubicacion: 'Av. Hernando Siles 789'      },
];

const HORARIOS_INIT = [
  { id: 1, turno: 'Turno Mañana', entrada: '06:00', salida: '14:00', dias: 'Lun – Vie', activo: true  },
  { id: 2, turno: 'Turno Tarde',  entrada: '14:00', salida: '22:00', dias: 'Lun – Sáb', activo: false },
  { id: 3, turno: 'Turno Noche',  entrada: '22:00', salida: '06:00', dias: 'Lun – Vie', activo: false },
];

type CapDB = { id_capacitacion: number; nombre: string; descripcion: string | null; fecha: string };
type Cap   = { id: number; nombre: string; descripcion: string; fecha: string; completada: boolean; certificado: boolean };

const NOTIFS_INIT = [
  { id: 1, tipo: 'info',    msg: 'Nuevo servicio asignado para el 30/04/2026 — Hotel Europa.',  fecha: '2026-04-28', leida: false },
  { id: 2, tipo: 'success', msg: 'Capacitación de Primeros Auxilios completada. ¡Bien hecho!', fecha: '2026-04-05', leida: false },
  { id: 3, tipo: 'warning', msg: 'Recuerda presentarte a tiempo para el turno del 30/04.',      fecha: '2026-04-27', leida: true  },
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
    green:  { bg: 'rgba(34,197,94,.15)',   color: '#4ade80', border: 'rgba(34,197,94,.3)'   },
    yellow: { bg: 'rgba(234,179,8,.15)',   color: '#facc15', border: 'rgba(234,179,8,.3)'   },
    red:    { bg: 'rgba(239,68,68,.15)',   color: '#f87171', border: 'rgba(239,68,68,.3)'   },
    blue:   { bg: 'rgba(59,130,246,.15)',  color: '#60a5fa', border: 'rgba(59,130,246,.3)'  },
    purple: { bg: 'rgba(167,139,250,.15)', color: '#a78bfa', border: 'rgba(167,139,250,.3)' },
  };
  const s = map[color] || map.blue;
  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{text}</span>;
};

const statusColor = (e: string) => e === 'Completado' ? 'green' : e === 'En curso' ? 'blue' : 'yellow';

// ── Inicio ────────────────────────────────────────────────────────────────────
function Inicio({ notifs, setNotifs, setActive, caps, servicios, horarios }: {
  notifs: typeof NOTIFS_INIT;
  setNotifs: React.Dispatch<React.SetStateAction<typeof NOTIFS_INIT>>;
  setActive: (id: NavId) => void;
  caps: Cap[];
  servicios: ServicioDB[];
  horarios: HoraDB[];
}) {
  const activos        = servicios.filter(s => !s.fecha_final).length;
  const terminados     = servicios.filter(s => !!s.fecha_final).length;
  const capCompletadas = caps.filter(c => c.completada).length;
  const unread         = notifs.filter(n => !n.leida).length;
  const turnoActual    = horarios[0] ?? null;
  const hoy            = servicios[0] ?? null;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: '0 0 4px', color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3 }}>PORTAL EMPLEADO</p>
        <h2 style={{ margin: 0, color: C.text, fontSize: 22, fontWeight: 900 }}>Hola, Ana Torres 👋</h2>
        <p style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>Martes 29 de Abril, 2026</p>
      </div>

      {/* Today's service banner */}
      {hoy && (
        <div style={{ background: 'linear-gradient(135deg,rgba(0,48,102,.4),rgba(0,112,243,.2))', border: '1px solid rgba(0,112,243,.3)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ margin: '0 0 4px', color: '#60a5fa', fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>🔵 Último servicio</p>
            <p style={{ margin: '0 0 4px', color: C.text, fontWeight: 800, fontSize: 18 }}>Tipo #{hoy.tipo_servicio} — {hoy.nombre_cliente ?? 'Cliente'}</p>
            <p style={{ margin: 0, color: C.textSub, fontSize: 13 }}>📅 {new Date(hoy.fecha_inicio).toLocaleDateString('es-BO')} · Bs {Number(hoy.costo).toLocaleString('es-BO')}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Badge text={hoy.fecha_final ? 'Finalizado' : 'En curso'} color={hoy.fecha_final ? 'blue' : 'green'} />
            <button onClick={() => setActive('servicios')} style={{ background: 'rgba(0,112,243,.15)', border: '1px solid rgba(0,112,243,.3)', color: '#60a5fa', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>Ver detalle →</button>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { l: 'Terminados', v: terminados, c: '#4ade80', e: '✅' },
          { l: 'En curso',   v: activos,   c: '#60a5fa', e: '🧹' },
          { l: 'Capacitaciones', v: `${capCompletadas}/${caps.length}`, c: '#a78bfa', e: '📚' },
          { l: 'Avisos nuevos', v: unread,     c: '#facc15', e: '🔔' },
        ].map(({ l, v, c, e }) => (
          <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px', position: 'relative', overflow: 'hidden', transition: 'all .2s', cursor: 'default' }}
            onMouseEnter={el => { el.currentTarget.style.borderColor = c + '55'; el.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={el => { el.currentTarget.style.borderColor = C.border; el.currentTarget.style.transform = 'none'; }}>
            <div style={{ position: 'absolute', top: -12, right: -12, width: 56, height: 56, borderRadius: '50%', background: c, opacity: .1 }} />
            <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
            <p style={{ margin: '8px 0 0', color: C.text, fontSize: 24, fontWeight: 900 }}>{e} {v}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Turno actual */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <p style={{ margin: '0 0 16px', color: C.textSub, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em' }}>🕐 Mi turno actual</p>
          {turnoActual ? (
            <>
              <p style={{ margin: '0 0 4px', color: C.text, fontSize: 28, fontWeight: 900 }}>{String(turnoActual.hora_entrada).substring(0,5)} – {String(turnoActual.hora_salida).substring(0,5)}</p>
              <p style={{ margin: '0 0 12px', color: C.textSub, fontSize: 13 }}>Horario #{turnoActual.id_horario}</p>
              <Badge text="Turno activo" color="blue" />
            </>
          ) : (
            <p style={{ color: C.textMuted, fontSize: 14 }}>Sin turno asignado</p>
          )}
        </div>

        {/* Progreso capacitaciones */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <p style={{ margin: '0 0 16px', color: C.textSub, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em' }}>📚 Mis capacitaciones</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {caps.length === 0 && <p style={{ margin: 0, color: C.textMuted, fontSize: 13 }}>Sin capacitaciones.</p>}
            {caps.map(cap => (
              <div key={cap.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: cap.completada ? '#e2e8f0' : C.textMuted, fontSize: 13 }}>{cap.nombre}</span>
                  <span style={{ color: cap.completada ? C.green : C.yellow, fontSize: 12, fontWeight: 700 }}>{cap.completada ? '✓' : 'Pendiente'}</span>
                </div>
                <div style={{ background: '#0f1e30', borderRadius: 999, height: 5, overflow: 'hidden' }}>
                  <div style={{ width: cap.completada ? '100%' : '0%', height: '100%', background: cap.completada ? '#4ade80' : '#334155', borderRadius: 999, transition: 'width .8s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ color: C.textSub, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.07em' }}>
            🔔 Avisos {unread > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: 10, fontWeight: 900, marginLeft: 6 }}>{unread}</span>}
          </strong>
          {unread > 0 && (
            <button onClick={() => setNotifs(p => p.map(n => ({ ...n, leida: true })))} style={{ background: 'none', border: 'none', color: C.blueLight, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Marcar todas leídas</button>
          )}
        </div>
        {notifs.map(n => {
          const nColor = n.tipo === 'warning' ? C.yellow : n.tipo === 'success' ? C.green : C.blueLight;
          return (
            <div key={n.id} onClick={() => setNotifs(p => p.map(x => x.id === n.id ? { ...x, leida: true } : x))}
              style={{ padding: '14px 20px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'flex-start', gap: 14, cursor: 'pointer', background: n.leida ? 'transparent' : 'rgba(59,130,246,.04)', transition: 'background .15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.025)')}
              onMouseLeave={e => (e.currentTarget.style.background = n.leida ? 'transparent' : 'rgba(59,130,246,.04)')}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.leida ? 'transparent' : nColor, marginTop: 4, flexShrink: 0, border: n.leida ? `1px solid ${C.border}` : 'none' }} />
              <div>
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

// ── Mis Servicios ─────────────────────────────────────────────────────────────
function MisServicios({ servicios }: { servicios: ServicioDB[] }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 8px', color: C.text, fontSize: 20, fontWeight: 800 }}>🧹 Servicios</h2>
      <p style={{ margin: '0 0 20px', color: C.textMuted, fontSize: 13 }}>Registro de servicios del sistema</p>
      {servicios.length === 0 && <p style={{ color: C.textMuted, textAlign: 'center', padding: 40 }}>No hay servicios registrados.</p>}
      <div style={{ display: 'grid', gap: 14 }}>
        {servicios.map(s => {
          const activo = !s.fecha_final;
          const borderC = activo ? 'rgba(74,222,128,.3)' : 'rgba(59,130,246,.3)';
          return (
            <div key={s.id_servicio} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = borderC; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ color: C.blueLight, fontWeight: 700, fontSize: 12 }}>#{s.id_servicio}</span>
                    <Badge text={activo ? 'En curso' : 'Finalizado'} color={activo ? 'green' : 'blue'} />
                  </div>
                  <p style={{ margin: 0, color: C.text, fontWeight: 800, fontSize: 16 }}>Tipo #{s.tipo_servicio} — {s.nombre_cliente ?? 'Cliente'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 2px', color: C.textMuted, fontSize: 11 }}>📅 {new Date(s.fecha_inicio).toLocaleDateString('es-BO')}</p>
                  <p style={{ margin: 0, color: '#4ade80', fontSize: 13, fontWeight: 700 }}>Bs {Number(s.costo).toLocaleString('es-BO')}</p>
                </div>
              </div>
              {s.descripcion && (
                <div style={{ background: '#0f1e30', borderRadius: 10, padding: '10px 14px' }}>
                  <p style={{ margin: '0 0 3px', color: C.textMuted, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Descripción</p>
                  <p style={{ margin: 0, color: '#e2e8f0', fontSize: 13 }}>{s.descripcion}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Horarios ──────────────────────────────────────────────────────────────────
function MisHorarios({ horarios }: { horarios: HoraDB[] }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 8px', color: C.text, fontSize: 20, fontWeight: 800 }}>🕐 Horarios</h2>
      <p style={{ margin: '0 0 20px', color: C.textMuted, fontSize: 13 }}>Turnos de trabajo registrados en el sistema</p>
      {horarios.length === 0 && <p style={{ color: C.textMuted, textAlign: 'center', padding: 40 }}>No hay horarios registrados.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16, marginBottom: 24 }}>
        {horarios.map((h, i) => (
          <div key={h.id_horario} style={{ background: C.bgCard, border: `1px solid ${i === 0 ? 'rgba(0,112,243,.4)' : C.border}`, borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
            {i === 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#003066,#0070f3)' }} />}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Turno #{h.id_horario}</p>
              {i === 0 && <Badge text="Principal" color="blue" />}
            </div>
            <p style={{ margin: '0 0 8px', color: C.text, fontSize: 26, fontWeight: 800 }}>{String(h.hora_entrada).substring(0,5)} – {String(h.hora_salida).substring(0,5)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Capacitaciones ────────────────────────────────────────────────────────────
function MisCapacitaciones({ show, caps, loading }: { show: (t: Toast['type'], m: string) => void; caps: Cap[]; loading: boolean }) {
  const completadas = caps.filter(c => c.completada).length;
  const total       = caps.length;

  return (
    <div>
      <h2 style={{ margin: '0 0 8px', color: C.text, fontSize: 20, fontWeight: 800 }}>📚 Mis Capacitaciones</h2>
      <p style={{ margin: '0 0 20px', color: C.textMuted, fontSize: 13 }}>Capacitaciones asignadas por el administrador</p>

      {loading ? (
        <p style={{ color: C.textMuted, textAlign: 'center', padding: 40 }}>Cargando capacitaciones...</p>
      ) : (
        <>
          {/* Progress summary */}
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: C.text, fontWeight: 800, fontSize: 16 }}>Progreso general</p>
                <p style={{ margin: '4px 0 0', color: C.textMuted, fontSize: 13 }}>{completadas} de {total} completadas</p>
              </div>
              <span style={{ color: C.green, fontWeight: 900, fontSize: 28 }}>{total > 0 ? Math.round((completadas / total) * 100) : 0}%</span>
            </div>
            <div style={{ background: '#0f1e30', borderRadius: 999, height: 8, overflow: 'hidden' }}>
              <div style={{ width: `${total > 0 ? (completadas / total) * 100 : 0}%`, height: '100%', background: 'linear-gradient(90deg,#003066,#4ade80)', borderRadius: 999, transition: 'width 1s ease' }} />
            </div>
          </div>

          {caps.length === 0 && (
            <p style={{ color: C.textMuted, textAlign: 'center', padding: 40 }}>No hay capacitaciones registradas.</p>
          )}

          <div style={{ display: 'grid', gap: 14 }}>
            {caps.map(cap => (
              <div key={cap.id} style={{ background: C.bgCard, border: `1px solid ${cap.completada ? 'rgba(34,197,94,.2)' : C.border}`, borderRadius: 16, padding: 22, transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = cap.completada ? 'rgba(34,197,94,.4)' : 'rgba(0,112,243,.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = cap.completada ? 'rgba(34,197,94,.2)' : C.border; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: cap.completada ? 'rgba(34,197,94,.15)' : '#1e293b', border: `2px solid ${cap.completada ? '#4ade80' : '#334155'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                        {cap.completada ? '✓' : '○'}
                      </div>
                      <p style={{ margin: 0, color: cap.completada ? '#e2e8f0' : C.textSub, fontWeight: 800, fontSize: 15 }}>{cap.nombre}</p>
                    </div>
                    <p style={{ margin: 0, color: C.textMuted, fontSize: 12, paddingLeft: 42 }}>{cap.descripcion}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <Badge text={cap.completada ? 'Completada' : 'Pendiente'} color={cap.completada ? 'green' : 'yellow'} />
                    {cap.certificado && <Badge text="Certificado" color="purple" />}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: `1px solid ${C.borderLight}` }}>
                  <p style={{ margin: 0, color: C.textMuted, fontSize: 12 }}>📅 Fecha: {cap.fecha}</p>
                  {cap.certificado && (
                    <button onClick={() => show('info', `Descargando certificado: ${cap.nombre}`)} style={{ background: 'rgba(167,139,250,.1)', border: '1px solid rgba(167,139,250,.3)', color: '#a78bfa', padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>⬇ Certificado</button>
                  )}
                  {!cap.completada && <Badge text="Próximamente" color="yellow" />}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
const NAV: { id: NavId; label: string; emoji: string }[] = [
  { id: 'inicio',         label: 'Inicio',         emoji: '🏠' },
  { id: 'servicios',      label: 'Mis Servicios',  emoji: '🧹' },
  { id: 'horarios',       label: 'Horarios',       emoji: '🕐' },
  { id: 'capacitaciones', label: 'Capacitaciones', emoji: '📚' },
];

// ── Componente principal ──────────────────────────────────────────────────────
export default function UsuarioPage() {
  const router = useRouter();
  const { toasts, show } = useToast();
  const [active, setActive]       = useState<NavId>('inicio');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifs, setNotifs]       = useState(NOTIFS_INIT);
  const [caps, setCaps]               = useState<Cap[]>([]);
  const [loadingCaps, setLoadingCaps] = useState(false);
  const [servicios, setServicios]     = useState<ServicioDB[]>([]);
  const [horarios, setHorarios]       = useState<HoraDB[]>([]);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  useEffect(() => {
    setLoadingCaps(true);
    fetch('/api/capacitaciones')
      .then(r => r.json())
      .then(j => {
        if (j.success) setCaps(j.data.map((c: CapDB) => ({
          id:          c.id_capacitacion,
          nombre:      c.nombre,
          descripcion: c.descripcion ?? '',
          fecha:       c.fecha,
          completada:  new Date(c.fecha) < new Date(),
          certificado: false,
        })));
      })
      .catch(() => {})
      .finally(() => setLoadingCaps(false));

    fetch('/api/servicios')
      .then(r => r.json())
      .then(j => { if (j.success) setServicios(j.data); })
      .catch(() => {});

    fetch('/api/horarios')
      .then(r => r.json())
      .then(j => { if (j.success) setHorarios(j.data); })
      .catch(() => {});
  }, []);

  const unread  = notifs.filter(n => !n.leida).length;
  const current = NAV.find(n => n.id === active)!;

  const renderSection = () => {
    switch (active) {
      case 'inicio':         return <Inicio notifs={notifs} setNotifs={setNotifs} setActive={setActive} caps={caps} servicios={servicios} horarios={horarios} />;
      case 'servicios':      return <MisServicios servicios={servicios} />;
      case 'horarios':       return <MisHorarios horarios={horarios} />;
      case 'capacitaciones': return <MisCapacitaciones show={show} caps={caps} loading={loadingCaps} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: C.bg, color: C.text, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; } body { margin: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #060d1a; } ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
        button, input, select, textarea { font-family: inherit; }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
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
                <p style={{ margin: 0, color: '#60a5fa', fontSize: 8.5, letterSpacing: 1.5, fontWeight: 700, textTransform: 'uppercase' }}>Multiservicios · Empleado</p>
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
              {item.id === 'inicio' && unread > 0 && (
                <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', padding: '1px 6px', fontSize: 10, fontWeight: 900, marginLeft: 'auto', flexShrink: 0 }}>{unread}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '10px 8px', borderTop: `1px solid ${C.borderLight}` }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'rgba(0,112,243,.06)', border: '1px solid rgba(0,112,243,.1)' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, fontWeight: 900, color: '#fff' }}>A</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, color: C.text, fontSize: 12, fontWeight: 700 }}>Ana Torres</p>
                <p style={{ margin: 0, color: '#60a5fa', fontSize: 10, fontWeight: 600 }}>Empleado · Limpieza</p>
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
            <p style={{ margin: 0, color: '#475569', fontSize: 11 }}>Portal Empleado · SASL</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/" style={{ color: '#475569', fontSize: 11, textDecoration: 'none' }}>← Inicio</Link>
            <span style={{ background: 'rgba(59,130,246,.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,.3)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>EMPLEADO</span>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
