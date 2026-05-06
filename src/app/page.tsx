"use client";
import { useState } from 'react';
import Link from 'next/link';

// ── Datos ────────────────────────────────────────────────────────────────────
const EMPRESA = {
  descripcion: 'Empresa boliviana especializada en higiene industrial, limpieza profesional y saneamiento de espacios de trabajo. Más de 10 años brindando soluciones integrales a empresas, hospitales, hoteles y entidades públicas en La Paz y El Alto.',
  mision: 'Proveer servicios de limpieza e higiene industrial con los más altos estándares de calidad, garantizando ambientes saludables y seguros para nuestros clientes, utilizando productos certificados y personal altamente capacitado.',
  vision: 'Ser la empresa líder en servicios de higiene industrial en Bolivia, reconocida por nuestra excelencia operativa, compromiso medioambiental y desarrollo del talento humano.',
  valores: ['Responsabilidad', 'Calidad', 'Puntualidad', 'Confianza', 'Seguridad', 'Innovación'],
  fundacion: '2014', empleados: '80+', clientes: '120+', ciudades: 'La Paz, El Alto, Cochabamba',
};

const SERVICIOS = [
  { emoji: '🧹', titulo: 'Limpieza Profunda',         desc: 'Limpieza exhaustiva de instalaciones comerciales e industriales, incluyendo áreas de difícil acceso, fachadas y espacios técnicos.' },
  { emoji: '🏥', titulo: 'Saneamiento Hospitalario',  desc: 'Protocolos especializados para clínicas, laboratorios y centros médicos con productos de nivel hospitalario certificados.' },
  { emoji: '🏢', titulo: 'Mantenimiento de Edificios',desc: 'Servicio continuo para oficinas, centros comerciales y edificios corporativos, con supervisión diaria y reportes de gestión.' },
  { emoji: '⚗️', titulo: 'Desinfección Especializada',desc: 'Tratamientos con nebulizadores y productos EPA aprobados para eliminar virus, bacterias y hongos en todo tipo de superficies.' },
  { emoji: '🪟', titulo: 'Limpieza de Vidrios',       desc: 'Servicio de limpieza en altura con equipos certificados para edificios de hasta 20 pisos en La Paz y El Alto.' },
  { emoji: '🏭', titulo: 'Higiene Industrial',        desc: 'Gestión integral de residuos, control de plagas y auditorías de salubridad para plantas industriales y almacenes.' },
];

const COBERTURA = [
  { ciudad: 'La Paz',     zonas: ['Miraflores','San Pedro','Sopocachi','Calacoto','Achumani','Obrajes','Centro','Zona Sur','Max Paredes','Villa Fátima'], activa: true },
  { ciudad: 'El Alto',    zonas: ['Ciudad Satélite','Villa Adela','Río Seco','Senkata','16 de Julio','Mercado Ferial','Ballivián','Villa Bolivia'],       activa: true },
  { ciudad: 'Cochabamba', zonas: ['Cercado','Quillacollo','Sacaba','Tiquipaya'],                                                                          activa: false },
];

const CLIENTES = [
  { nombre: 'Banco Nacional de Bolivia', tipo: 'Financiero', desde: '2018' },
  { nombre: 'Hotel Europa La Paz',        tipo: 'Hotelería',  desde: '2019' },
  { nombre: 'Centro Médico Sur',          tipo: 'Salud',      desde: '2020' },
  { nombre: 'Plaza Shopping Center',      tipo: 'Comercial',  desde: '2017' },
  { nombre: 'Colegio San Agustín',        tipo: 'Educación',  desde: '2021' },
  { nombre: 'YPFB Refinería',             tipo: 'Industrial', desde: '2016' },
];

const LINKS = ['inicio', 'empresa', 'servicios', 'cobertura', 'clientes', 'contacto'];

// ── Barra de navegación ───────────────────────────────────────────────────────
function Nav({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(7,15,29,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(30,58,95,0.6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,4vw,48px)', height: 60 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, overflow: 'hidden', background: '#e8edf5', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,.3)' }}>
            <img src="/logo-icon.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 900, fontSize: 13, letterSpacing: .5 }}>Markach'uxña</p>
            <p style={{ margin: 0, color: '#3b82f6', fontSize: 8, letterSpacing: 2, fontWeight: 700 }}>MULTISERVICIOS S.R.L.</p>
          </div>
        </div>

        {/* Links — ocultos en móvil vía CSS */}
        <div className="sasl-nav-links">
          {LINKS.map(l => (
            <button key={l} onClick={() => setActive(l)} style={{
              background: active === l ? 'rgba(0,112,243,0.15)' : 'none',
              border: active === l ? '1px solid rgba(0,112,243,0.4)' : '1px solid transparent',
              color: active === l ? '#60a5fa' : '#64748b',
              padding: '7px 13px', borderRadius: 8, cursor: 'pointer',
              fontSize: 12, fontWeight: 600, textTransform: 'capitalize', transition: 'all .15s',
            }}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>

        {/* Derecha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/login" style={{ background: 'linear-gradient(135deg,#003066,#0070f3)', color: 'white', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 800, letterSpacing: 1, whiteSpace: 'nowrap' }}>
            ACCEDER →
          </Link>
          {/* Hamburger — visible solo en móvil */}
          <button className="sasl-hamburger" onClick={() => setOpen(p => !p)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 22, cursor: 'pointer', padding: 4 }}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <div style={{ borderTop: '1px solid #1e3a5f', padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {LINKS.map(l => (
            <button key={l} onClick={() => { setActive(l); setOpen(false); }} style={{
              background: active === l ? 'rgba(0,112,243,0.12)' : 'none',
              border: 'none', borderRadius: 8,
              color: active === l ? '#60a5fa' : '#94a3b8',
              padding: '11px 16px', textAlign: 'left', cursor: 'pointer',
              fontSize: 14, fontWeight: active === l ? 700 : 500, textTransform: 'capitalize',
            }}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── Sección Inicio ────────────────────────────────────────────────────────────
function SecInicio({ setActive }: { setActive: (s: string) => void }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(90px,12vw,140px) clamp(20px,6vw,80px) 80px', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(0,48,102,0.35) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <span style={{ background: 'rgba(0,112,243,0.12)', border: '1px solid rgba(0,112,243,0.3)', color: '#60a5fa', padding: '6px 18px', borderRadius: 20, fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: 28, display: 'inline-block' }}>
        LA PAZ · EL ALTO · COCHABAMBA
      </span>
      <h1 style={{ margin: '0 0 20px', color: '#f1f5f9', fontSize: 'clamp(2rem,6vw,4.5rem)', fontWeight: 900, lineHeight: 1.08, maxWidth: 780 }}>
        Higiene Industrial<br />
        <span style={{ background: 'linear-gradient(90deg,#0070f3,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>de Alto Estándar</span>
      </h1>
      <p style={{ color: '#94a3b8', fontSize: 'clamp(0.9rem,2.5vw,1.1rem)', maxWidth: 560, lineHeight: 1.7, margin: '0 0 40px' }}>
        Empresa boliviana especializada en limpieza profesional, saneamiento y gestión de higiene para empresas, hospitales e instituciones.
      </p>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => setActive('servicios')} style={{ background: 'linear-gradient(135deg,#003066,#0070f3)', color: 'white', padding: '13px 28px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>
          VER SERVICIOS
        </button>
        <button onClick={() => setActive('contacto')} style={{ background: 'rgba(255,255,255,.06)', color: '#94a3b8', padding: '13px 28px', borderRadius: 10, border: '1px solid #1e3a5f', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Contactar
        </button>
      </div>
      <div style={{ display: 'flex', gap: 'clamp(20px,5vw,56px)', marginTop: 60, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[{ v: EMPRESA.empleados, l: 'Empleados activos' }, { v: EMPRESA.clientes, l: 'Clientes satisfechos' }, { v: '10+ años', l: 'De experiencia' }, { v: '3', l: 'Ciudades' }].map(({ v, l }) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#f1f5f9', fontSize: 'clamp(20px,4vw,28px)', fontWeight: 900 }}>{v}</p>
            <p style={{ margin: '4px 0 0', color: '#475569', fontSize: 12 }}>{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sección Empresa ───────────────────────────────────────────────────────────
function SecEmpresa() {
  return (
    <div style={{ padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,48px)', maxWidth: 1100, margin: '0 auto' }}>
      <p style={{ color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>SOBRE NOSOTROS</p>
      <h2 style={{ color: '#f1f5f9', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, margin: '0 0 48px' }}>Quiénes somos</h2>
      <div className="sasl-grid-empresa" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'clamp(20px,4vw,48px)', marginBottom: 40, alignItems: 'start' }}>
        <div>
          <p style={{ color: '#94a3b8', fontSize: 'clamp(0.88rem,2vw,1rem)', lineHeight: 1.8, marginBottom: 24 }}>{EMPRESA.descripcion}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[{ l: 'Fundación', v: EMPRESA.fundacion }, { l: 'Personal', v: EMPRESA.empleados }, { l: 'Clientes', v: EMPRESA.clientes }].map(({ l, v }) => (
              <div key={l} style={{ background: 'rgba(0,112,243,0.08)', border: '1px solid rgba(0,112,243,0.2)', borderRadius: 10, padding: '14px 20px', flex: 1, minWidth: 90, textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#60a5fa', fontSize: 22, fontWeight: 900 }}>{v}</p>
                <p style={{ margin: '4px 0 0', color: '#475569', fontSize: 11 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid #1e3a5f', borderRadius: 16, padding: 28 }}>
          <p style={{ color: '#60a5fa', fontWeight: 800, fontSize: 11, letterSpacing: 2, marginBottom: 14 }}>NUESTROS VALORES</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {EMPRESA.valores.map(v => (
              <span key={v} style={{ background: 'rgba(0,48,102,0.4)', border: '1px solid #1e3a5f', color: '#94a3b8', borderRadius: 8, padding: '7px 12px', fontSize: 13, fontWeight: 600 }}>✓ {v}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="sasl-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {[{ t: '🎯 Misión', c: EMPRESA.mision, accent: '#0070f3' }, { t: '🔭 Visión', c: EMPRESA.vision, accent: '#10b981' }].map(({ t, c, accent }) => (
          <div key={t} style={{ background: 'rgba(10,22,40,0.8)', border: `1px solid ${accent}30`, borderRadius: 16, padding: 'clamp(18px,3vw,28px)', borderLeft: `3px solid ${accent}` }}>
            <p style={{ margin: '0 0 10px', color: '#f1f5f9', fontWeight: 800, fontSize: 15 }}>{t}</p>
            <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.7, fontSize: 14 }}>{c}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sección Servicios ─────────────────────────────────────────────────────────
function SecServicios() {
  return (
    <div style={{ padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,48px)', maxWidth: 1100, margin: '0 auto' }}>
      <p style={{ color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>NUESTROS SERVICIOS</p>
      <h2 style={{ color: '#f1f5f9', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, margin: '0 0 14px' }}>Soluciones integrales de higiene</h2>
      <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 48px' }}>Personal certificado, equipos industriales y productos de primera categoría.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,300px),1fr))', gap: 18 }}>
        {SERVICIOS.map(s => (
          <div key={s.titulo} style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid #1e3a5f', borderRadius: 16, padding: 'clamp(20px,3vw,28px)', transition: 'border-color .2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#0070f3')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e3a5f')}
          >
            <div style={{ fontSize: 30, marginBottom: 14 }}>{s.emoji}</div>
            <p style={{ margin: '0 0 10px', color: '#f1f5f9', fontWeight: 800, fontSize: 15 }}>{s.titulo}</p>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sección Cobertura ─────────────────────────────────────────────────────────
function SecCobertura() {
  const [idx, setIdx] = useState(0);
  const ciudad = COBERTURA[idx];
  return (
    <div style={{ padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,48px)', maxWidth: 1100, margin: '0 auto' }}>
      <p style={{ color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>COBERTURA GEOGRÁFICA</p>
      <h2 style={{ color: '#f1f5f9', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, margin: '0 0 14px' }}>¿Dónde operamos?</h2>
      <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 36px' }}>Seleccione una ciudad para ver las zonas de cobertura disponibles.</p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        {COBERTURA.map((c, i) => (
          <button key={c.ciudad} onClick={() => setIdx(i)} style={{ padding: '11px 24px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14, border: idx === i ? '1px solid #0070f3' : '1px solid #1e3a5f', background: idx === i ? 'rgba(0,112,243,0.15)' : 'rgba(10,22,40,0.8)', color: idx === i ? '#60a5fa' : '#64748b', opacity: c.activa ? 1 : 0.6, transition: 'all .15s' }}>
            {c.ciudad}{!c.activa && <span style={{ fontSize: 10, color: '#f59e0b', marginLeft: 6 }}>Próx.</span>}
          </button>
        ))}
      </div>
      <div style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid #1e3a5f', borderRadius: 16, padding: 'clamp(20px,4vw,36px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: ciudad.activa ? 'rgba(0,112,243,0.12)' : 'rgba(245,158,11,0.08)', border: `1px solid ${ciudad.activa ? '#0070f330' : '#f59e0b30'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📍</div>
          <div>
            <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 900, fontSize: 18 }}>{ciudad.ciudad}</p>
            <p style={{ margin: '3px 0 0', color: ciudad.activa ? '#4ade80' : '#f59e0b', fontSize: 12, fontWeight: 700 }}>
              {ciudad.activa ? `✓ Operativa — ${ciudad.zonas.length} zonas cubiertas` : '⏳ Próximamente disponible'}
            </p>
          </div>
        </div>
        {ciudad.activa ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {ciudad.zonas.map(z => (
              <span key={z} style={{ background: 'rgba(0,48,102,0.35)', border: '1px solid #1e3a5f', color: '#94a3b8', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600 }}>📍 {z}</span>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '28px 0', color: '#475569' }}>
            <p style={{ fontSize: 36, marginBottom: 10 }}>🚧</p>
            <p style={{ fontWeight: 700, color: '#64748b' }}>Estamos expandiendo nuestra cobertura a {ciudad.ciudad}.</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>Zonas previstas: {ciudad.zonas.join(', ')}.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sección Clientes ──────────────────────────────────────────────────────────
function SecClientes() {
  return (
    <div style={{ padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,48px)', maxWidth: 1100, margin: '0 auto' }}>
      <p style={{ color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>CLIENTES</p>
      <h2 style={{ color: '#f1f5f9', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, margin: '0 0 14px' }}>Empresas que confían en SASL</h2>
      <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 48px' }}>Más de 120 organizaciones nos eligen por nuestra calidad y profesionalismo.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,260px),1fr))', gap: 18 }}>
        {CLIENTES.map(c => (
          <div key={c.nombre} style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid #1e3a5f', borderRadius: 14, padding: 22 }}>
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

// ── Sección Contacto ──────────────────────────────────────────────────────────
function SecContacto() {
  const [form, setForm] = useState({ nombre: '', empresa: '', correo: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setEnviado(true); };
  return (
    <div style={{ padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,48px)', maxWidth: 900, margin: '0 auto' }}>
      <p style={{ color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>CONTACTO</p>
      <h2 style={{ color: '#f1f5f9', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, margin: '0 0 14px' }}>¿Necesita nuestros servicios?</h2>
      <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 40px' }}>Contáctenos y un asesor se comunicará con usted en menos de 24 horas.</p>
      <div className="sasl-grid-contact" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 'clamp(24px,5vw,40px)' }}>
        <div className="sasl-contact-info">
          {[['📞','Teléfono','+591 2 2345678'],['📱','WhatsApp','+591 70011122'],['✉️','Correo','contacto@sasl.bo'],['📍','Oficina central','Av. 16 de Julio 1234, La Paz'],['🕐','Horario','Lun–Vie 08:00–18:00']].map(([e, l, v]) => (
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 16, padding: 'clamp(28px,5vw,40px)', textAlign: 'center' }}>
            <span style={{ fontSize: 48, marginBottom: 16 }}>✅</span>
            <p style={{ color: '#4ade80', fontWeight: 800, fontSize: 18, margin: '0 0 8px' }}>¡Mensaje enviado!</p>
            <p style={{ color: '#64748b', fontSize: 14 }}>Nos comunicaremos con usted a la brevedad.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid #1e3a5f', borderRadius: 16, padding: 'clamp(20px,4vw,32px)' }}>
            {([['nombre','Nombre completo','text'],['empresa','Empresa / Institución','text'],['correo','Correo electrónico','email']] as const).map(([k,l,t]) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', color: '#64748b', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{l}</label>
                <input required type={t} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                  style={{ width: '100%', background: '#060d1a', border: '1px solid #1e3a5f', borderRadius: 8, padding: '11px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Mensaje</label>
              <textarea required value={form.mensaje} onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))} rows={3}
                style={{ width: '100%', background: '#060d1a', border: '1px solid #1e3a5f', borderRadius: 8, padding: '11px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
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

// ── Componente principal ──────────────────────────────────────────────────────
export default function LandingPage() {
  // Siempre inicia en "inicio" — la sección principal por defecto
  const [active, setActive] = useState<string>('inicio');

  const renderSection = () => {
    switch (active) {
      case 'empresa':   return <SecEmpresa />;
      case 'servicios': return <SecServicios />;
      case 'cobertura': return <SecCobertura />;
      case 'clientes':  return <SecClientes />;
      case 'contacto':  return <SecContacto />;
      default:          return <SecInicio setActive={setActive} />;
    }
  };

  return (
    <div style={{ backgroundColor: '#060d1a', minHeight: '100vh', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
        button, input, textarea, select { font-family: inherit; }

        /* Nav links: visibles en desktop, ocultos en móvil */
        .sasl-nav-links { display: flex; gap: 2px; }
        .sasl-hamburger { display: none; }

        @media (max-width: 768px) {
          .sasl-nav-links  { display: none; }
          .sasl-hamburger  { display: block; }
        }

        /* Empresa: 2 columnas → 1 en móvil */
        .sasl-grid-empresa { grid-template-columns: 1.2fr 1fr; }
        .sasl-grid-2       { grid-template-columns: 1fr 1fr; }
        .sasl-grid-contact { grid-template-columns: 1fr 1.4fr; }

        @media (max-width: 700px) {
          .sasl-grid-empresa { grid-template-columns: 1fr !important; }
          .sasl-grid-2       { grid-template-columns: 1fr !important; }
          .sasl-grid-contact { grid-template-columns: 1fr !important; }
          /* En contacto móvil: formulario primero, info después */
          .sasl-contact-info { order: 2; }
        }
      `}</style>

      <Nav active={active} setActive={setActive} />

      <main style={{ paddingTop: 60 }}>
        {renderSection()}
      </main>

      <footer style={{ borderTop: '1px solid #1e3a5f', padding: 'clamp(20px,4vw,28px) clamp(20px,5vw,48px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <p style={{ margin: 0, color: '#334155', fontSize: 12 }}>© 2025 Markach'uxña Multiservicios S.R.L. — Todos los derechos reservados</p>
        <p style={{ margin: 0, color: '#334155', fontSize: 12 }}>{EMPRESA.ciudades}</p>
      </footer>
    </div>
  );
}
