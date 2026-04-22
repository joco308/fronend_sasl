"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const router = useRouter();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.trim() || !pass.trim()) {
      alert("Acceso Denegado: Credenciales obligatorias.");
      return;
    }
    // Redirección a la subcarpeta auth
    router.push('/login/auth'); 
  };

  return (
    <div style={{ height: '100vh', display: 'flex', backgroundColor: '#0f172a', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ flex: 1, backgroundImage: 'url("https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(30%)' }}>
        <div style={{ height: '100%', width: '100%', backgroundColor: 'rgba(0,48,102,0.7)', display: 'flex', alignItems: 'center', padding: '10%' }}>
           <h2 style={{ color: 'white', fontSize: '3.5rem', fontWeight: 900, lineHeight: 1 }}>Sistemas de Gestión de Higiene Industrial.</h2>
        </div>
      </div>
      <div style={{ width: '500px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px' }}>
        <Link href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '11px', fontWeight: 800, marginBottom: '40px' }}>← VOLVER AL INICIO</Link>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#003066', marginBottom: '40px' }}>Portal SASL</h2>
        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '10px', fontWeight: 900, color: '#1e293b', display: 'block', marginBottom: '8px' }}>USUARIO</label>
            <input required type="text" value={user} onChange={(e) => setUser(e.target.value)} style={{ width: '100%', padding: '15px', border: '1px solid #e2e8f0' }} />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ fontSize: '10px', fontWeight: 900, color: '#1e293b', display: 'block', marginBottom: '8px' }}>CONTRASEÑA</label>
            <input required type="password" value={pass} onChange={(e) => setPass(e.target.value)} style={{ width: '100%', padding: '15px', border: '1px solid #e2e8f0' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '18px', background: '#003066', color: 'white', border: 'none', fontWeight: 900, cursor: 'pointer' }}>CONTINUAR A VERIFICACIÓN</button>
        </form>
      </div>
    </div>
  );
}