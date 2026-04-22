"use client";
import { useState } from 'react';

export default function AuthPage() {
  const [codigo, setCodigo] = useState("");

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{ 
        background: 'white', padding: '40px', borderRadius: '20px', 
        textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '350px' 
      }}>
        <h2 style={{ color: '#003066', marginBottom: '10px' }}>Verificación</h2>
        <p style={{ fontSize: '14px', color: '#64748b' }}>Ingresa el código de acceso</p>
        
        <div style={{ margin: '30px 0' }}>
          <input 
            type="text" 
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="000000" 
            style={{ 
              width: '100%', padding: '15px', border: '2px solid #e2e8f0', 
              borderRadius: '12px', textAlign: 'center', fontSize: '24px', 
              letterSpacing: '8px', color: '#003066', fontWeight: 'bold' 
            }} 
          />
          <p style={{ fontSize: '11px', color: '#0070f3', marginTop: '10px' }}>Código de prueba: 123456</p>
        </div>

        <button 
          onClick={() => codigo === "123456" ? window.location.href="/admin" : alert("Error")}
          style={{ 
            width: '100%', padding: '15px', backgroundColor: '#003066', 
            color: 'white', border: 'none', borderRadius: '12px', 
            fontWeight: 'bold', cursor: 'pointer' 
          }}
        >
          Verificar y Entrar
        </button>
      </div>
    </div>
  );
}