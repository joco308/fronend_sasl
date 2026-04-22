"use client";
import React, { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('resumen');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* SIDEBAR LATERAL */}
      <aside style={{ width: '280px', backgroundColor: '#003066', color: 'white', padding: '30px 20px', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '50px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-1px' }}>MARKA ADMIN</h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Panel de Gestión v2.0</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
          {[
            { id: 'resumen', label: 'Resumen General', icon: '📊' },
            { id: 'personal', label: 'Gestión de Personal', icon: '👥' },
            { id: 'inventario', label: 'Inventario y Maquinaria', icon: '🚜' },
            { id: 'servicios', label: 'Servicios Activos', icon: '🧼' },
            { id: 'reportes', label: 'Reportes Mensuales', icon: '📑' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '15px',
                backgroundColor: activeTab === item.id ? '#0070f3' : 'transparent',
                border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer',
                textAlign: 'left', fontWeight: activeTab === item.id ? 'bold' : 'normal',
                transition: '0.3s'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => window.location.href = "/"}
          style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          🚪 Cerrar Sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flexGrow: 1, padding: '40px' }}>
        
        {/* HEADER DEL PANEL */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#003066', margin: 0 }}>Bienvenida de nuevo, Luz</h1>
            <p style={{ color: '#718096', marginTop: '5px' }}>Esto es lo que está pasando hoy en Marka Chuxña.</p>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', color: '#003066' }}>Administrador Global</div>
              <div style={{ fontSize: '0.8rem', color: '#0070f3' }}>En línea</div>
            </div>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#0070f3', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>L</div>
          </div>
        </header>

        {/* TARJETAS DE MÉTRICAS */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '40px' }}>
          {[
            { label: 'Servicios Hoy', value: '24', color: '#0070f3', icon: '🚀' },
            { label: 'Personal Activo', value: '142', color: '#10b981', icon: '👷' },
            { label: 'Alertas Stock', value: '3', color: '#ef4444', icon: '⚠️' },
            { label: 'Ingresos Mes', value: 'Bs. 45.200', color: '#8b5cf6', icon: '💰' }
          ].map((card, i) => (
            <div key={i} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
                <span style={{ color: card.color, fontWeight: 'bold', fontSize: '0.8rem', backgroundColor: `${card.color}15`, padding: '4px 8px', borderRadius: '5px' }}>+12%</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#003066' }}>{card.value}</div>
              <div style={{ color: '#718096', fontSize: '0.9rem', marginTop: '5px' }}>{card.label}</div>
            </div>
          ))}
        </section>

        {/* TABLA DE ACTIVIDAD RECIENTE */}
        <section style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: '25px', color: '#003066' }}>Actividad de Servicios Recientes</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>CLIENTE / OBRA</th>
                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>SERVICIO</th>
                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>ESTADO</th>
                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>ENCARGADO</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cliente: "Banco Central", serv: "Limpieza Técnica", status: "En Curso", color: "#0070f3", user: "Marco A." },
                { cliente: "Hospital Obrero", serv: "Desinfección", status: "Completado", color: "#10b981", user: "Sara T." },
                { cliente: "Edificio Girasoles", serv: "Vidrios Altura", status: "Pendiente", color: "#f59e0b", user: "Juan P." },
                { cliente: "Planta Minera San Jose", serv: "Post-Obra", status: "En Curso", color: "#0070f3", user: "Roberto L." }
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#1e293b' }}>{row.cliente}</td>
                  <td style={{ padding: '15px', color: '#64748b' }}>{row.serv}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ backgroundColor: `${row.color}15`, color: row.color, padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>{row.status}</span>
                  </td>
                  <td style={{ padding: '15px', color: '#64748b' }}>{row.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </main>
    </div>
  );
}