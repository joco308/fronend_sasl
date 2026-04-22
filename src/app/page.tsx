"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [mensaje, setMensaje] = useState("");

  return (
    <div style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, sans-serif", color: '#2d3748', backgroundColor: '#fff', scrollBehavior: 'smooth' }}>
      
      {/* NAVBAR SUPREMO */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px 10%', background: 'rgba(255, 255, 255, 0.98)', 
        position: 'sticky', top: 0, zIndex: 2000, boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#003066', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold' }}>MC</div>
          <div style={{ fontWeight: 900, fontSize: '1.6rem', color: '#003066', letterSpacing: '-1px' }}>MARKA CHUXÑA</div>
        </div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          {['Servicios', 'Nosotros', 'Proyectos', 'Contacto'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ textDecoration: 'none', color: '#4a5568', fontWeight: 600, fontSize: '14px', transition: '0.3s' }}>{item}</a>
          ))}
          <Link href="/login" style={{ 
            padding: '12px 28px', backgroundColor: '#0070f3', color: 'white', 
            textDecoration: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px',
            boxShadow: '0 4px 15px rgba(0, 112, 243, 0.3)'
          }}>
            Inicio de Sesión
          </Link>
        </div>
      </nav>

      {/* HERO SECTION - IMPACTO TOTAL */}
      <header style={{ 
        height: '95vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(rgba(0, 48, 102, 0.85), rgba(0, 20, 40, 0.8)), url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop")',
        backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', textAlign: 'center', position: 'relative'
      }}>
        <div style={{ maxWidth: '1000px', padding: '0 20px' }}>
          <h1 style={{ fontSize: '5rem', marginBottom: '25px', lineHeight: 1, fontWeight: 900 }}>Pureza y Orden en cada <span style={{ color: '#0070f3' }}>Estructura</span></h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '45px', opacity: 0.9, maxWidth: '800px', margin: '0 auto 45px', lineHeight: 1.6 }}>Más que una empresa de limpieza, somos el motor que mantiene impecable el corazón de la industria boliviana. Seguridad, higiene y eficiencia 24/7.</p>
          <div style={{ display: 'flex', gap: '25px', justifyContent: 'center' }}>
            <a href="#servicios" style={{ padding: '20px 45px', fontSize: '1.1rem', backgroundColor: '#0070f3', color: 'white', borderRadius: '15px', fontWeight: 'bold', textDecoration: 'none', transition: '0.3s' }}>Ver Servicios</a>
            <Link href="/login" style={{ padding: '20px 45px', fontSize: '1.1rem', backgroundColor: 'rgba(255,255,255,0.1)', border: '2px solid white', color: 'white', borderRadius: '15px', fontWeight: 'bold', textDecoration: 'none' }}>Acceso Administrativo</Link>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '30px', animation: 'bounce 2s infinite' }}>▼</div>
      </header>

      {/* SECCIÓN: SOBRE NOSOTROS & VALORES */}
      <section id="nosotros" style={{ padding: '120px 10%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#0070f3', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Nuestra Identidad</span>
            <h2 style={{ fontSize: '3rem', color: '#003066', margin: '15px 0' }}>Compromiso que trasciende la superficie</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.9, color: '#4a5568' }}>
              Fundada en La Paz, **Marka Chuxña** nació con el propósito de profesionalizar el sector de mantenimiento industrial. Hoy, gestionamos infraestructuras críticas con un equipo de más de 200 profesionales capacitados bajo normas internacionales de bioseguridad.
            </p>
            <div style={{ marginTop: '40px' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ color: '#0070f3', fontSize: '1.5rem' }}>✓</div>
                <div><strong>Seguridad Industrial:</strong> Cero incidentes en 5 años de operación.</div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ color: '#0070f3', fontSize: '1.5rem' }}>✓</div>
                <div><strong>Eco-Friendly:</strong> Productos biodegradables certificados.</div>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1556911220-e15204d13f81?q=80&w=2070" style={{ width: '100%', borderRadius: '30px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }} alt="Equipo trabajando" />
            <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', background: '#0070f3', color: 'white', padding: '30px', borderRadius: '20px', fontWeight: 'bold' }}>
              <span style={{ fontSize: '2.5rem' }}>15+</span><br/>Años de Trayectoria
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: SERVICIOS (MEGA GRID) */}
      <section id="servicios" style={{ padding: '120px 10%', backgroundColor: '#f4f7fa' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '3.5rem', color: '#003066', marginBottom: '20px' }}>Soluciones Integrales</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: '#718096' }}>Ofrecemos un catálogo diversificado para cubrir desde oficinas corporativas hasta plantas mineras de alto riesgo.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
          {[
            { t: "Limpieza Industrial", d: "Intervención profunda en silos, motores y áreas de producción con equipos de alta presión.", i: "🏭" },
            { t: "Desinfección Hospitalaria", d: "Control de carga bacteriana en quirófanos y áreas blancas bajo normas ISO.", i: "🏥" },
            { t: "Trabajos en Altura", d: "Limpieza de vidrios y fachadas en rascacielos con equipos de alpinismo industrial.", i: "🧗" },
            { t: "Limpieza Post-Obra", d: "Eliminación de escombros finos, pintura y residuos químicos para entregas llave en mano.", i: "🏗️" },
            { t: "Mantenimiento Técnico", d: "Cuidado de sistemas de aire acondicionado, ductos y luminarias industriales.", i: "🔧" },
            { t: "Sanitización Masiva", d: "Tratamiento de espacios públicos y comerciales contra virus y patógenos.", i: "🛡️" }
          ].map((s, idx) => (
            <div key={idx} style={{ 
              padding: '50px', background: 'white', borderRadius: '30px', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.02)', transition: '0.4s', cursor: 'default'
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '25px' }}>{s.i}</div>
              <h3 style={{ color: '#003066', marginBottom: '20px', fontSize: '1.6rem' }}>{s.t}</h3>
              <p style={{ color: '#4a5568', lineHeight: 1.8 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN: PROYECTOS (PORTAFOLIO) */}
      <section id="proyectos" style={{ padding: '120px 10%' }}>
        <h2 style={{ fontSize: '3rem', color: '#003066', marginBottom: '60px', textAlign: 'center' }}>Proyectos Recientes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', height: '600px' }}>
          <div style={{ background: 'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070") center/cover', borderRadius: '20px' }}></div>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: 'url("https://images.unsplash.com/photo-1541829081725-4462b5570300?q=80&w=2070") center/cover', borderRadius: '20px' }}></div>
            <div style={{ background: 'url("https://images.unsplash.com/photo-1503387762-592dea58ef21?q=80&w=2062") center/cover', borderRadius: '20px' }}></div>
          </div>
          <div style={{ background: 'url("https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=2070") center/cover', borderRadius: '20px' }}></div>
        </div>
      </section>

      {/* SECCIÓN: CONTACTO & FORMULARIO */}
      <section id="contacto" style={{ padding: '120px 10%', backgroundColor: '#003066', color: 'white' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px' }}>
          <div>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '30px' }}>¿Listo para el siguiente nivel de limpieza?</h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '50px' }}>Solicita una auditoría de higiene gratuita para tu empresa. Nuestros expertos te responderán en menos de 24 horas.</p>
            <div style={{ fontSize: '1.1rem' }}>
              <p>📍 Calle 15 de Calacoto, La Paz</p>
              <p>📞 (+591) 2 27744XX</p>
              <p>📧 contacto@markachuxna.com</p>
            </div>
          </div>
          <div style={{ background: 'white', padding: '50px', borderRadius: '30px' }}>
            <h3 style={{ color: '#003066', marginBottom: '30px' }}>Enviar Mensaje</h3>
            <input type="text" placeholder="Nombre Completo" style={{ width: '100%', padding: '15px', marginBottom: '20px', border: '1px solid #e2e8f0', borderRadius: '10px' }} />
            <input type="email" placeholder="Email Corporativo" style={{ width: '100%', padding: '15px', marginBottom: '20px', border: '1px solid #e2e8f0', borderRadius: '10px' }} />
            <textarea placeholder="¿En qué podemos ayudarte?" style={{ width: '100%', padding: '15px', height: '150px', marginBottom: '20px', border: '1px solid #e2e8f0', borderRadius: '10px' }}></textarea>
            <button style={{ width: '100%', padding: '20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar Solicitud</button>
          </div>
        </div>
      </section>

      {/* FOOTER SUPREMO */}
      <footer style={{ padding: '100px 10% 40px', backgroundColor: '#0a192f', color: 'white' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '80px' }}>
          <div>
            <h3 style={{ fontSize: '2rem', marginBottom: '20px', color: '#0070f3' }}>MARKA CHUXÑA</h3>
            <p style={{ opacity: 0.5, lineHeight: 1.8 }}>Liderando la industria multiservicios en Bolivia desde 2011. Calidad superior, tecnología avanzada y un equipo humano excepcional.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '25px' }}>Menú</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', opacity: 0.6 }}>
              <span>Servicios</span>
              <span>Galería</span>
              <span>Nosotros</span>
              <span>Carreras</span>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '25px' }}>Sectores</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', opacity: 0.6 }}>
              <span>Minería</span>
              <span>Salud</span>
              <span>Bancario</span>
              <span>Educativo</span>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '25px' }}>Social</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', opacity: 0.6 }}>
              <span>Facebook</span>
              <span>LinkedIn</span>
              <span>Instagram</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px', textAlign: 'center', opacity: 0.3, fontSize: '13px' }}>
          © 2026 Marka Chuxña Multiservicios SRL. Orgullosamente desarrollado en Bolivia.
        </div>
      </footer>

      {/* EFECTO BOUNCE (OPCIONAL) */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-10px);}
          60% {transform: translateY(-5px);}
        }
      `}</style>

    </div>
  );
}