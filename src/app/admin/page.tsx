"use client";
import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', color: '#334155' }}>
      
      {/* SIDEBAR TÉCNICO CON CIERRE DE SESIÓN */}
      <aside style={{ width: '260px', backgroundColor: '#0f172a', color: 'white', padding: '40px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 30px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '2px', borderBottom: '2px solid #0070f3', paddingBottom: '10px' }}>SISTEMA SASL</h2>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {['Panel de Control', 'Recursos Humanos', 'Activos Fijos', 'Cronograma', 'Finanzas'].map(item => (
            <button key={item} style={{ 
              padding: '16px 30px', textAlign: 'left', background: 'transparent', 
              border: 'none', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer' 
            }}>{item}</button>
          ))}
        </nav>

        {/* BOTÓN RESTAURADO */}
        <div style={{ padding: '20px 30px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Link href="/" style={{ 
            textDecoration: 'none', color: '#ef4444', fontSize: '0.85rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
             FINALIZAR SESIÓN
          </Link>
        </div>
      </aside>

      <main style={{ flexGrow: 1, padding: '50px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#0f172a', fontWeight: 800 }}>Resumen Operativo</h2>
        <p style={{ color: '#64748b' }}>Bienvenida al panel de gestión, Luz.</p>
        {/* ... Resto del contenido del dashboard ... */}
      </main>
    </div>
  );
}