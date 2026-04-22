"use client";
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', backgroundColor: '#ffffff', scrollBehavior: 'smooth' }}>
      
      {/* NAVEGACIÓN DE ALTA PRECISIÓN */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px 10%', background: 'rgba(255,255,255,0.95)', position: 'sticky', top: 0, 
        zIndex: 2000, borderBottom: '1px solid #e2e8f0', backdropFilter: 'blur(10px)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '30px', height: '30px', backgroundColor: '#003066' }}></div>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#003066', textTransform: 'uppercase', letterSpacing: '1px' }}>Marka Chuxña</div>
        </div>
        <div style={{ display: 'flex', gap: '35px', alignItems: 'center' }}>
          {['Servicios', 'Compañía', 'Metodología', 'Cobertura', 'FAQ'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ textDecoration: 'none', color: '#64748b', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>{item}</a>
          ))}
          <Link href="/login" style={{ 
            padding: '12px 28px', backgroundColor: '#0070f3', color: 'white', 
            textDecoration: 'none', fontWeight: 700, fontSize: '12px', borderRadius: '2px', letterSpacing: '1px'
          }}>
            ACCESO STAFF
          </Link>
        </div>
      </nav>

      {/* HERO SECTION: IMPACTO VISUAL */}
      <header style={{ 
        height: '90vh', display: 'flex', alignItems: 'center', 
        background: 'linear-gradient(rgba(0, 48, 102, 0.8), rgba(0, 20, 45, 0.95)), url("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070")',
        backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', padding: '0 10%'
      }}>
        <div style={{ maxWidth: '900px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '4px', color: '#0070f3', textTransform: 'uppercase' }}>Líderes en Mantenimiento Industrial</span>
          <h1 style={{ fontSize: '5rem', margin: '20px 0', lineHeight: 1, fontWeight: 900 }}>Ingeniería en Saneamiento y Logística.</h1>
          <p style={{ fontSize: '1.3rem', marginBottom: '45px', opacity: 0.8, lineHeight: 1.8, maxWidth: '750px' }}>
            Operamos infraestructuras críticas en toda Bolivia bajo estándares internacionales de seguridad. Marka Chuxña es sinónimo de eficiencia técnica y sostenibilidad ambiental.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button style={{ padding: '20px 45px', background: '#0070f3', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>PORTAFOLIO TÉCNICO</button>
            <button style={{ padding: '20px 45px', background: 'transparent', border: '1px solid white', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>CONTACTAR UN ASESOR</button>
          </div>
        </div>
      </header>

      {/* SECCIÓN 1: CIFRAS OPERATIVAS (MÉTRICAS) */}
      <section style={{ padding: '80px 10%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        {[
          { label: "M² Gestionados", val: "2.4M" },
          { label: "Colaboradores Activos", val: "450+" },
          { label: "Proyectos Realizados", val: "1,200+" },
          { label: "Retención de Clientes", val: "98%" }
        ].map((d, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#003066' }}>{d.val}</div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '2px', marginTop: '10px' }}>{d.label}</div>
          </div>
        ))}
      </section>

      {/* SECCIÓN 2: SECTORES DE ATENCIÓN (MAS INFO) */}
      <section id="servicios" style={{ padding: '120px 10%' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#003066', fontWeight: 900, marginBottom: '60px', textAlign: 'center' }}>Especialización por Sector</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
          {[
            { t: "Minería e Hidrocarburos", d: "Limpieza de campamentos y mantenimiento de plantas industriales con protocolos de alta seguridad." },
            { t: "Sector Hospitalario", d: "Desinfección de quirófanos y áreas críticas bajo normas de bioseguridad internacional." },
            { t: "Entidades Financieras", d: "Gestión integral de sedes administrativas y redes de agencias a nivel nacional." },
            { t: "Plantas de Alimentos", d: "Sanitización industrial para evitar contaminación cruzada, cumpliendo normas de inocuidad." },
            { t: "Infraestructura de Altura", d: "Mantenimiento preventivo y limpieza de fachadas acristaladas con equipos certificados." },
            { t: "Logística y Almacenes", d: "Control de plagas y limpieza de suelos de alto tráfico en centros de distribución." }
          ].map((s, idx) => (
            <div key={idx} style={{ padding: '45px', background: 'white', border: '1px solid #f1f5f9', transition: '0.3s' }}>
              <h4 style={{ color: '#0070f3', marginBottom: '20px', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.9rem' }}>{s.t}</h4>
              <p style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: 1.7 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 3: METODOLOGÍA (PASO A PASO) */}
      <section id="metodología" style={{ padding: '100px 10%', backgroundColor: '#0f172a', color: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Proceso de Ejecución</h2>
          <p style={{ opacity: 0.6 }}>Garantía de calidad en cada fase operativa.</p>
        </div>
        <div style={{ display: 'flex', gap: '30px' }}>
          {[
            { n: "01", t: "Levantamiento", d: "Inspección técnica detallada de las áreas de intervención." },
            { n: "02", t: "Despliegue", d: "Movilización de cuadrillas y equipos especializados al sitio." },
            { n: "03", t: "Certificación", d: "Validación de estándares de limpieza y entrega de reportes." }
          ].map((step, i) => (
            <div key={i} style={{ flex: 1, padding: '40px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#0070f3', marginBottom: '20px' }}>{step.n}</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>{step.t}</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.6, lineHeight: 1.6 }}>{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 4: FAQ (MÁS INFO TEXTUAL) */}
      <section id="faq" style={{ padding: '120px 10%' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#003066', textAlign: 'center', marginBottom: '80px', fontWeight: 900 }}>Consultas Corporativas</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {[
            { q: "¿Tienen cobertura en zonas mineras remotas?", a: "Sí, contamos con unidades móviles equipadas para operar en campamentos y plantas fuera del radio urbano." },
            { q: "¿Sus productos son eco-amigables?", a: "Absolutamente. Solo utilizamos insumos biodegradables con certificación de impacto ambiental controlado." },
            { q: "¿Cómo monitorean el avance del trabajo?", a: "Nuestros clientes tienen acceso al panel SASL para ver reportes fotográficos y de cumplimiento en tiempo real." }
          ].map((faq, i) => (
            <div key={i} style={{ marginBottom: '40px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
              <h4 style={{ color: '#0f172a', marginBottom: '10px', fontSize: '1.1rem' }}>{faq.q}</h4>
              <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER: IDENTIDAD FINAL */}
      <footer style={{ padding: '100px 10%', backgroundColor: '#050c18', color: '#94a3b8', borderTop: '4px solid #0070f3' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '60px' }}>
          <div>
            <h3 style={{ color: 'white', marginBottom: '25px', fontWeight: 900 }}>Marka Chuxña S.R.L.</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 2 }}>
              Liderando la industria multiservicios desde 2011.<br/>
              La Paz, Bolivia - Casa Matriz.<br/>
              NIT: 1020304050
            </p>
          </div>
          {['Compañía', 'Servicios', 'Legal'].map((col) => (
            <div key={col}>
              <h4 style={{ color: 'white', marginBottom: '20px', fontSize: '0.8rem', letterSpacing: '2px' }}>{col.toUpperCase()}</h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', lineHeight: 2.5 }}>
                <li>Enlace 01</li>
                <li>Enlace 02</li>
                <li>Enlace 03</li>
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '80px', textAlign: 'center', fontSize: '11px', opacity: 0.5, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
          © 2026 Marka Chuxña S.R.L. - Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}