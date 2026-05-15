"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ServicioDB  = { id_servicio: number; nombre_cliente: string; tipo_servicio: number; fecha_inicio: string; fecha_final: string | null; descripcion: string | null };
type Uniforme    = { id_uniforme: number; nombre_uniforme: string; talla: number; descripcion: string | null; create_at: string };
type Capacitacion = { id_capacitacion: number; nombre: string; descripcion: string | null; fecha: string };
type HoraDB      = { id_horario: number; hora_entrada: string; hora_salida: string };

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

export default function LimpiezaPage() {
  const router = useRouter();
  const [tab, setTab]             = useState<'inicio' | 'tareas' | 'uniformes' | 'capacitaciones'>('inicio');
  const [servicios, setServicios] = useState<ServicioDB[]>([]);
  const [uniformes, setUniformes] = useState<Uniforme[]>([]);
  const [caps, setCaps]           = useState<Capacitacion[]>([]);
  const [horarios, setHorarios]   = useState<HoraDB[]>([]);
  const [loadingS, setLoadingS]   = useState(true);
  const [loadingU, setLoadingU]   = useState(false);
  const [loadingC, setLoadingC]   = useState(false);
  const [localEstados, setLocalEstados] = useState<Record<number, 'Pendiente' | 'En proceso' | 'Completado'>>({});

  useEffect(() => {
    setLoadingS(true);
    fetch('/api/servicios').then(r => r.json()).then(j => { if (j.success) setServicios(j.data); }).catch(() => {}).finally(() => setLoadingS(false));
    fetch('/api/horarios').then(r => r.json()).then(j => { if (j.success) setHorarios(j.data); }).catch(() => {});
    setLoadingU(true);
    fetch('/api/uniformes').then(r => r.json()).then(j => { if (j.success) setUniformes(j.data); }).catch(() => {}).finally(() => setLoadingU(false));
    setLoadingC(true);
    fetch('/api/capacitaciones').then(r => r.json()).then(j => { if (j.success) setCaps(j.data); }).catch(() => {}).finally(() => setLoadingC(false));
  }, []);

  const getEstado = (s: ServicioDB): 'Pendiente' | 'En proceso' | 'Completado' =>
    localEstados[s.id_servicio] || (s.fecha_final ? 'Completado' : new Date(s.fecha_inicio) <= new Date() ? 'En proceso' : 'Pendiente');

  const marcarServicio = (id: number, current: 'Pendiente' | 'En proceso' | 'Completado') => {
    const next: 'Pendiente' | 'En proceso' | 'Completado' = current === 'Pendiente' ? 'En proceso' : 'Completado';
    setLocalEstados(p => ({ ...p, [id]: next }));
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  const TABS = [
    { id: 'inicio' as const,         label: 'Inicio',         emoji: '🏠' },
    { id: 'tareas' as const,         label: 'Mis tareas',     emoji: '✅' },
    { id: 'uniformes' as const,      label: 'Mis uniformes',  emoji: '👕' },
    { id: 'capacitaciones' as const, label: 'Capacitaciones', emoji: '📚' },
  ];

  const completadas = servicios.filter(s => getEstado(s) === 'Completado').length;
  const progreso    = servicios.length > 0 ? Math.round((completadas / servicios.length) * 100) : 0;
  const horario0    = horarios[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, color: C.text, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }`}</style>

      <header style={{ height: 60, background: '#070f1d', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 14, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧹</div>
        <div>
          <p style={{ margin: 0, color: C.text, fontWeight: 900, fontSize: 14 }}>SASL Bolivia</p>
          <p style={{ margin: 0, color: C.muted, fontSize: 10 }}>Portal Operario</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, color: C.text, fontSize: 12, fontWeight: 700 }}>Operario</p>
            <p style={{ margin: 0, color: C.muted, fontSize: 10 }}>Limpieza</p>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>
          <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Salir</button>
        </div>
      </header>

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

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '28px 24px' }}>

        {/* ── INICIO ── */}
        {tab === 'inicio' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ margin: '0 0 6px', fontSize: '1.6rem', fontWeight: 900 }}>Buenos días 👋</h1>
              <p style={{ margin: 0, color: C.muted }}>{new Date().toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>

            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{ margin: 0, color: C.text, fontWeight: 700 }}>Progreso del día</p>
                <p style={{ margin: 0, color: C.blueLight, fontWeight: 800 }}>{completadas}/{servicios.length} servicios</p>
              </div>
              <div style={{ background: '#1e3a5f', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg,#003066,#0070f3)', width: `${progreso}%`, height: '100%', borderRadius: 8, transition: 'width .4s ease' }} />
              </div>
              <p style={{ margin: '8px 0 0', color: C.muted, fontSize: 12 }}>{progreso}% completado</p>
            </div>

            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
              <p style={{ margin: '0 0 16px', color: C.sub, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Mis servicios de hoy</p>
              {loadingS ? (
                <p style={{ color: C.muted, textAlign: 'center', padding: 20 }}>Cargando...</p>
              ) : servicios.length === 0 ? (
                <p style={{ color: C.muted, textAlign: 'center', padding: 20 }}>No hay servicios registrados.</p>
              ) : servicios.map(s => {
                const estado = getEstado(s);
                return (
                  <div key={s.id_servicio} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.borderLight}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: estado === 'Completado' ? 'rgba(74,222,128,.12)' : 'rgba(0,112,243,.12)', border: `1px solid ${estado === 'Completado' ? '#4ade80' : '#0070f3'}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                        {estado === 'Completado' ? '✅' : '🧹'}
                      </div>
                      <div>
                        <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{s.nombre_cliente}</p>
                        <p style={{ margin: '2px 0 0', color: C.muted, fontSize: 11 }}>Tipo #{s.tipo_servicio} · {new Date(s.fecha_inicio).toLocaleDateString('es-BO')}</p>
                      </div>
                    </div>
                    <Badge text={estado} color={estadoColor(estado)} />
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { e: '🕐', l: 'Entrada',          v: horario0 ? horario0.hora_entrada.slice(0, 5) : '--:--' },
                { e: '🕑', l: 'Salida',            v: horario0 ? horario0.hora_salida.slice(0, 5)  : '--:--' },
                { e: '📍', l: 'Zona asignada',     v: 'Ver con supervisor' },
                { e: '📋', l: 'Servicios activos', v: String(servicios.filter(s => !s.fecha_final).length) },
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
            <h2 style={{ margin: '0 0 24px', fontSize: '1.4rem', fontWeight: 900 }}>✅ Mis servicios</h2>
            {loadingS ? (
              <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>Cargando servicios...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {servicios.length === 0 && <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>No hay servicios registrados.</p>}
                {servicios.map(s => {
                  const estado = getEstado(s);
                  return (
                    <div key={s.id_servicio} style={{ background: C.bgCard, border: `1px solid ${estado === 'Completado' ? 'rgba(74,222,128,.25)' : C.border}`, borderRadius: 16, padding: 22 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div>
                          <p style={{ margin: 0, color: C.text, fontWeight: 800, fontSize: 15 }}>{s.nombre_cliente}</p>
                          <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 13 }}>Tipo #{s.tipo_servicio}{s.descripcion ? ` · ${s.descripcion}` : ''}</p>
                        </div>
                        <Badge text={estado} color={estadoColor(estado)} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ margin: 0, color: C.muted, fontSize: 12 }}>📅 {new Date(s.fecha_inicio).toLocaleDateString('es-BO')}</p>
                        {estado !== 'Completado' && (
                          <button onClick={() => marcarServicio(s.id_servicio, estado)} style={{
                            background: estado === 'Pendiente' ? 'rgba(0,112,243,0.12)' : 'rgba(74,222,128,0.12)',
                            border: `1px solid ${estado === 'Pendiente' ? 'rgba(0,112,243,0.3)' : 'rgba(74,222,128,0.3)'}`,
                            color: estado === 'Pendiente' ? C.blueLight : C.green,
                            borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                          }}>
                            {estado === 'Pendiente' ? '▶ Iniciar' : '✓ Completar'}
                          </button>
                        )}
                        {estado === 'Completado' && <span style={{ color: C.green, fontSize: 12, fontWeight: 700 }}>✅ Completado</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── UNIFORMES ── */}
        {tab === 'uniformes' && (
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 900 }}>👕 Mis uniformes</h2>
            <p style={{ color: C.muted, margin: '0 0 24px', fontSize: 14 }}>Equipo de protección personal asignado a tu nombre.</p>
            {loadingU ? (
              <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>Cargando uniformes...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {uniformes.length === 0 && <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>No hay uniformes registrados.</p>}
                {uniformes.map(u => (
                  <div key={u.id_uniforme} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,112,243,0.1)', border: '1px solid rgba(0,112,243,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👕</div>
                      <div>
                        <p style={{ margin: 0, color: C.text, fontWeight: 700, fontSize: 14 }}>{u.nombre_uniforme}</p>
                        <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 12 }}>Talla: {u.talla}{u.descripcion ? ` · ${u.descripcion}` : ''}</p>
                      </div>
                    </div>
                    <Badge text="Disponible" color="green" />
                  </div>
                ))}
              </div>
            )}
            <div style={{ background: 'rgba(250,204,21,0.05)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: 12, padding: 16, marginTop: 20 }}>
              <p style={{ margin: 0, color: '#facc15', fontSize: 12, fontWeight: 700 }}>ℹ️ Para solicitar reposición de uniformes, comuníquese con su supervisor.</p>
            </div>
          </div>
        )}

        {/* ── CAPACITACIONES ── */}
        {tab === 'capacitaciones' && (
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 900 }}>📚 Mis capacitaciones</h2>
            <p style={{ color: C.muted, margin: '0 0 24px', fontSize: 14 }}>Formaciones requeridas para el desempeño de tu rol.</p>
            {loadingC ? (
              <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>Cargando capacitaciones...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {caps.length === 0 && <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>No hay capacitaciones registradas.</p>}
                {caps.map(cap => {
                  const esPasada = new Date(cap.fecha) < new Date();
                  return (
                    <div key={cap.id_capacitacion} style={{ background: C.bgCard, border: `1px solid ${!esPasada ? 'rgba(250,204,21,0.25)' : C.border}`, borderRadius: 14, padding: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: esPasada ? 'rgba(74,222,128,0.1)' : 'rgba(250,204,21,0.1)', border: `1px solid ${esPasada ? 'rgba(74,222,128,0.25)' : 'rgba(250,204,21,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                          {esPasada ? '✅' : '📋'}
                        </div>
                        <div>
                          <p style={{ margin: 0, color: C.text, fontWeight: 700, fontSize: 14 }}>{cap.nombre}</p>
                          <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 12 }}>📅 {cap.fecha}{cap.descripcion ? ` · ${cap.descripcion}` : ''}</p>
                        </div>
                      </div>
                      <Badge text={esPasada ? 'Completado' : 'Pendiente'} color={esPasada ? 'green' : 'yellow'} />
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 12, padding: 16, marginTop: 20 }}>
              <p style={{ margin: 0, color: C.blueLight, fontSize: 12, fontWeight: 700 }}>📌 Las capacitaciones pendientes son obligatorias. Consulte las fechas con su supervisor.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
