"use client";
import { useState } from 'react';
import Link from 'next/link';

// ── Datos de contenido ──────────────────────────────────────────────────────
const EMPRESA = {
  nombre: 'marka chuxña multiservicios',
  slogan: 'empresa de limpieza marka chuxña',
  descripcion: 'Empresa boliviana especializada en higiene industrial, limpieza profesional y saneamiento de espacios de trabajo. Más de 10 años brindando soluciones integrales a empresas, hospitales, hoteles y entidades públicas en La Paz y El Alto.',
  mision: 'Proveer servicios de limpieza e higiene industrial con los más altos estándares de calidad, garantizando ambientes saludables y seguros para nuestros clientes, utilizando productos certificados y personal altamente capacitado.',
  vision: 'Ser la empresa líder en servicios de higiene industrial en Bolivia, reconocida por nuestra excelencia operativa, compromiso medioambiental y desarrollo del talento humano.',
  valores: ['Responsabilidad', 'Calidad', 'Puntualidad', 'Confianza', 'Seguridad', 'Innovación'],
  fundacion: '2014',
  empleados: '80+',
  clientes: '120+',
  ciudades: 'La Paz, El Alto, Cochabamba',
};

const SERVICIOS = [
  { emoji: '🧹', titulo: 'Limpieza Profunda', desc: 'Limpieza exhaustiva de instalaciones comerciales e industriales, incluyendo áreas de difícil acceso, fachadas y espacios técnicos.' },
  { emoji: '🏥', titulo: 'Saneamiento Hospitalario', desc: 'Protocolos especializados para clínicas, laboratorios y centros médicos con productos de nivel hospitalario certificados.' },
  { emoji: '🏢', titulo: 'Mantenimiento de Edificios', desc: 'Servicio continuo para oficinas, centros comerciales y edificios corporativos, con supervisión diaria y reportes de gestión.' },
  { emoji: '⚗️', titulo: 'Desinfección Especializada', desc: 'Tratamientos con nebulizadores y productos EPA aprobados para eliminar virus, bacterias y hongos en todo tipo de superficies.' },
  { emoji: '🪟', titulo: 'Limpieza de Vidrios y Fachadas', desc: 'Servicio de limpieza en altura con equipos certificados para edificios de hasta 20 pisos en La Paz y El Alto.' },
  { emoji: '🏭', titulo: 'Higiene Industrial', desc: 'Gestión integral de residuos, control de plagas y auditorías de salubridad para plantas industriales y almacenes.' },
];

const COBERTURA = [
  { ciudad: 'La Paz', zonas: ['Miraflores', 'San Pedro', 'Sopocachi', 'Calacoto', 'Achumani', 'Obrajes', 'Centro', 'Zona Sur', 'Max Paredes', 'Villa Fátima'], activa: true },
  { ciudad: 'El Alto', zonas: ['Ciudad Satélite', 'Villa Adela', 'Río Seco', 'Senkata', '16 de Julio', 'Mercado Ferial', 'Ballivián', 'Villa Bolivia'], activa: true },
  { ciudad: 'Cochabamba', zonas: ['Cercado', 'Quillacollo', 'Sacaba', 'Tiquipaya'], activa: false },
];

const CLIENTES = [
  { nombre: 'Banco Nacional de Bolivia', tipo: 'Financiero', desde: '2018' },
  { nombre: 'Hotel Europa La Paz', tipo: 'Hotelería', desde: '2019' },
  { nombre: 'Centro Médico Sur', tipo: 'Salud', desde: '2020' },
  { nombre: 'Plaza Shopping Center', tipo: 'Comercial', desde: '2017' },
  { nombre: 'Colegio San Agustín', tipo: 'Educación', desde: '2021' },
  { nombre: 'YPFB Refinería', tipo: 'Industrial', desde: '2016' },
];

// ── Componentes ─────────────────────────────────────────────────────────────
function Nav({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  const links = ['inicio', 'empresa', 'servicios', 'cobertura', 'clientes', 'contacto'];
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(7,15,29,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(30,58,95,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: 64,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧹</div>
        <div>
          <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 900, fontSize: 15, letterSpacing: 1 }}>SASL</p>
          <p style={{ margin: 0, color: '#475569', fontSize: 9, letterSpacing: 2 }}>BOLIVIA</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {links.map(l => (
          <button key={l} onClick={() => setActive(l)} style={{
            background: active === l ? 'rgba(0,112,243,0.15)' : 'none',
            border: active === l ? '1px solid rgba(0,112,243,0.4)' : '1px solid transparent',
            color: active === l ? '#60a5fa' : '#64748b',
            padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
            fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
            transition: 'all .15s',
          }}>
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>
      <Link href="/login" style={{
        background: 'linear-gradient(135deg,#003066,#0070f3)',
        color: 'white', padding: '9px 20px', borderRadius: 8,
        textDecoration: 'none', fontSize: 12, fontWeight: 800, letterSpacing: 1,
      }}>
        ACCEDER →
      </Link>
    </nav>
  );
}

// ── Secciones ────────────────────────────────────────────────────────────────
function SecInicio({ setActive }: { setActive: (s: string) => void }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '120px 48px 80px', position: 'relative',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(0,48,102,0.35) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <span style={{ background: 'rgba(0,112,243,0.12)', border: '1px solid rgba(0,112,243,0.3)', color: '#60a5fa', padding: '6px 18px', borderRadius: 20, fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: 32, display: 'inline-block' }}>
        LA PAZ · EL ALTO · COCHABAMBA
      </span>
      <h1 style={{ margin: '0 0 24px', color: '#f1f5f9', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.08, maxWidth: 780 }}>
        Higiene Industrial<br />
        <span style={{ background: 'linear-gradient(90deg,#0070f3,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          de Alto Estándar
        </span>
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: 560, lineHeight: 1.7, margin: '0 0 48px' }}>
        Empresa boliviana especializada en limpieza profesional, saneamiento y gestión de higiene para empresas, hospitales e instituciones.
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => setActive('servicios')} style={{ background: 'linear-gradient(135deg,#003066,#0070f3)', color: 'white', padding: '14px 32px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>
          VER SERVICIOS
        </button>
        <button onClick={() => setActive('contacto')} style={{ background: 'rgba(255,255,255,.06)', color: '#94a3b8', padding: '14px 32px', borderRadius: 10, border: '1px solid #1e3a5f', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Contactar
        </button>
      </div>
      <div style={{ display: 'flex', gap: 48, marginTop: 72, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { v: EMPRESA.empleados, l: 'Empleados activos' },
          { v: EMPRESA.clientes, l: 'Clientes satisfechos' },
          { v: '10+ años', l: 'De experiencia' },
          { v: '3', l: 'Ciudades' },
        ].map(({ v, l }) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#f1f5f9', fontSize: 28, fontWeight: 900 }}>{v}</p>
            <p style={{ margin: '4px 0 0', color: '#475569', fontSize: 12 }}>{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecEmpresa() {
  return (
    <div style={{ padding: '100px 48px', maxWidth: 1100, margin: '0 auto' }}>
      <p style={{ color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>SOBRE NOSOTROS</p>
      <h2 style={{ color: '#f1f5f9', fontSize: '2.4rem', fontWeight: 900, marginBottom: 48, margin: '0 0 56px' }}>Quiénes somos</h2>

      {/* Descripción */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, marginBottom: 64, alignItems: 'center' }}>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.8, marginBottom: 24 }}>{EMPRESA.descripcion}</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { l: 'Fundación', v: EMPRESA.fundacion },
              { l: 'Personal', v: EMPRESA.empleados },
              { l: 'Clientes', v: EMPRESA.clientes },
            ].map(({ l, v }) => (
              <div key={l} style={{ background: 'rgba(0,112,243,0.08)', border: '1px solid rgba(0,112,243,0.2)', borderRadius: 10, padding: '14px 20px', flex: 1, minWidth: 100, textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#60a5fa', fontSize: 22, fontWeight: 900 }}>{v}</p>
                <p style={{ margin: '4px 0 0', color: '#475569', fontSize: 11 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid #1e3a5f', borderRadius: 16, padding: 32 }}>
          <p style={{ color: '#60a5fa', fontWeight: 800, fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>NUESTROS VALORES</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {EMPRESA.valores.map(v => (
              <span key={v} style={{ background: 'rgba(0,48,102,0.4)', border: '1px solid #1e3a5f', color: '#94a3b8', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600 }}>✓ {v}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Misión y Visión */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {[
          { t: '🎯 Misión', c: EMPRESA.mision, accent: '#0070f3' },
          { t: '🔭 Visión', c: EMPRESA.vision, accent: '#10b981' },
        ].map(({ t, c, accent }) => (
          <div key={t} style={{ background: 'rgba(10,22,40,0.8)', border: `1px solid ${accent}30`, borderRadius: 16, padding: 28, borderLeft: `3px solid ${accent}` }}>
            <p style={{ margin: '0 0 12px', color: '#f1f5f9', fontWeight: 800, fontSize: 15 }}>{t}</p>
            <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.7, fontSize: 14 }}>{c}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecServicios() {
  return (
    <div style={{ padding: '100px 48px', maxWidth: 1100, margin: '0 auto' }}>
      <p style={{ color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>NUESTROS SERVICIOS</p>
      <h2 style={{ color: '#f1f5f9', fontSize: '2.4rem', fontWeight: 900, margin: '0 0 16px' }}>Soluciones integrales de higiene</h2>
      <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 56px' }}>Personal certificado, equipos industriales y productos de primera categoría.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
        {SERVICIOS.map(s => (
          <div key={s.titulo} style={{
            background: 'rgba(10,22,40,0.8)', border: '1px solid #1e3a5f',
            borderRadius: 16, padding: 28,
            transition: 'border-color .2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#0070f3')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e3a5f')}
          >
            <div style={{ fontSize: 32, marginBottom: 16 }}>{s.emoji}</div>
            <p style={{ margin: '0 0 10px', color: '#f1f5f9', fontWeight: 800, fontSize: 16 }}>{s.titulo}</p>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecCobertura() {
  const [ciudadActiva, setCiudadActiva] = useState(0);
  const ciudad = COBERTURA[ciudadActiva];
  return (
    <div style={{ padding: '100px 48px', maxWidth: 1100, margin: '0 auto' }}>
      <p style={{ color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>COBERTURA GEOGRÁFICA</p>
      <h2 style={{ color: '#f1f5f9', fontSize: '2.4rem', fontWeight: 900, margin: '0 0 16px' }}>¿Dónde operamos?</h2>
      <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 48px' }}>Seleccione una ciudad para ver las zonas de cobertura disponibles.</p>

      {/* Selector de ciudad */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
        {COBERTURA.map((c, i) => (
          <button key={c.ciudad} onClick={() => setCiudadActiva(i)} style={{
            padding: '12px 28px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14,
            border: ciudadActiva === i ? '1px solid #0070f3' : '1px solid #1e3a5f',
            background: ciudadActiva === i ? 'rgba(0,112,243,0.15)' : 'rgba(10,22,40,0.8)',
            color: ciudadActiva === i ? '#60a5fa' : '#64748b',
            transition: 'all .15s',
            opacity: c.activa ? 1 : 0.5,
          }}>
            {c.ciudad}
            {!c.activa && <span style={{ marginLeft: 8, fontSize: 10, color: '#f59e0b' }}>Próximamente</span>}
          </button>
        ))}
      </div>

      {/* Detalle de zonas */}
      <div style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid #1e3a5f', borderRadius: 16, padding: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: ciudad.activa ? 'rgba(0,112,243,0.15)' : 'rgba(245,158,11,0.1)', border: `1px solid ${ciudad.activa ? '#0070f3' : '#f59e0b'}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            📍
          </div>
          <div>
            <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 900, fontSize: 20 }}>{ciudad.ciudad}</p>
            <p style={{ margin: '4px 0 0', color: ciudad.activa ? '#4ade80' : '#f59e0b', fontSize: 12, fontWeight: 700 }}>
              {ciudad.activa ? `✓ Operativa — ${ciudad.zonas.length} zonas cubiertas` : '⏳ Próximamente disponible'}
            </p>
          </div>
        </div>

        {ciudad.activa ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {ciudad.zonas.map(z => (
              <span key={z} style={{
                background: 'rgba(0,48,102,0.35)', border: '1px solid #1e3a5f',
                color: '#94a3b8', borderRadius: 8, padding: '8px 16px',
                fontSize: 13, fontWeight: 600,
              }}>
                📍 {z}
              </span>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#475569' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🚧</p>
            <p style={{ fontWeight: 700, color: '#64748b' }}>Estamos expandiendo nuestra cobertura a {ciudad.ciudad}.</p>
            <p style={{ fontSize: 13 }}>Las zonas previstas incluyen: {ciudad.zonas.join(', ')}.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SecClientes() {
  return (
    <div style={{ padding: '100px 48px', maxWidth: 1100, margin: '0 auto' }}>
      <p style={{ color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>CLIENTES</p>
      <h2 style={{ color: '#f1f5f9', fontSize: '2.4rem', fontWeight: 900, margin: '0 0 16px' }}>Empresas que confían en SASL</h2>
      <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 56px' }}>Más de 120 organizaciones nos eligen por nuestra calidad y profesionalismo.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
        {CLIENTES.map(c => (
          <div key={c.nombre} style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid #1e3a5f', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ background: 'rgba(0,112,243,0.1)', border: '1px solid rgba(0,112,243,0.3)', color: '#60a5fa', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>{c.tipo}</span>
              <span style={{ color: '#475569', fontSize: 11 }}>Desde {c.desde}</span>
            </div>
            <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 700, fontSize: 14, lineHeight: 1.4 }}>{c.nombre}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecContacto() {
  const [form, setForm] = useState({ nombre: '', empresa: '', correo: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };
  return (
    <div style={{ padding: '100px 48px', maxWidth: 900, margin: '0 auto' }}>
      <p style={{ color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>CONTACTO</p>
      <h2 style={{ color: '#f1f5f9', fontSize: '2.4rem', fontWeight: 900, margin: '0 0 16px' }}>¿Necesita nuestros servicios?</h2>
      <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 48px' }}>Contáctenos y un asesor se comunicará con usted en menos de 24 horas.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 40 }}>
        <div>
          {[
            { e: '📞', l: 'Teléfono', v: '+591 2 2345678' },
            { e: '📱', l: 'WhatsApp', v: '+591 70011122' },
            { e: '✉️', l: 'Correo', v: 'contacto@sasl.bo' },
            { e: '📍', l: 'Oficina central', v: 'Av. 16 de Julio 1234, La Paz' },
            { e: '🕐', l: 'Horario', v: 'Lun–Vie 08:00–18:00' },
          ].map(({ e, l, v }) => (
            <div key={l} style={{ display: 'flex', gap: 14, marginBottom: 20, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20, marginTop: 2 }}>{e}</span>
              <div>
                <p style={{ margin: 0, color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{l}</p>
                <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: 14 }}>{v}</p>
              </div>
            </div>
          ))}
        </div>

        {enviado ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
            <span style={{ fontSize: 56, marginBottom: 16 }}>✅</span>
            <p style={{ color: '#4ade80', fontWeight: 800, fontSize: 18, margin: '0 0 8px' }}>¡Mensaje enviado!</p>
            <p style={{ color: '#64748b', fontSize: 14 }}>Nos comunicaremos con usted a la brevedad.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid #1e3a5f', borderRadius: 16, padding: 32 }}>
            {[
              { k: 'nombre' as const, l: 'Nombre completo', t: 'text' },
              { k: 'empresa' as const, l: 'Empresa / Institución', t: 'text' },
              { k: 'correo' as const, l: 'Correo electrónico', t: 'email' },
            ].map(({ k, l, t }) => (
              <div key={k} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#64748b', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{l}</label>
                <input required type={t} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                  style={{ width: '100%', background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 8, padding: '11px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Mensaje</label>
              <textarea required value={form.mensaje} onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))} rows={3}
                style={{ width: '100%', background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 8, padding: '11px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#003066,#0070f3)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 14, cursor: 'pointer', letterSpacing: 1 }}>
              ENVIAR MENSAJE
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function LandingPage() {
  const [active, setActive] = useState('inicio');

  const renderSection = () => {
    switch (active) {
      case 'inicio':    return <SecInicio setActive={setActive} />;
      case 'empresa':   return <SecEmpresa />;
      case 'servicios': return <SecServicios />;
      case 'cobertura': return <SecCobertura />;
      case 'clientes':  return <SecClientes />;
      case 'contacto':  return <SecContacto />;
      default:          return <SecInicio setActive={setActive} />;
    }
  };

  return (
    <div style={{ backgroundColor: '#060d1a', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
        button { font-family: inherit; }
        input, textarea { font-family: inherit; }
      `}</style>

      <Nav active={active} setActive={setActive} />

      <main style={{ paddingTop: 64 }}>
        {renderSection()}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e3a5f', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ margin: 0, color: '#334155', fontSize: 12 }}>© 2024 SASL Bolivia — Todos los derechos reservados</p>
        <p style={{ margin: 0, color: '#334155', fontSize: 12 }}>{EMPRESA.ciudades}</p>
      </footer>
    </div>
  );
}
