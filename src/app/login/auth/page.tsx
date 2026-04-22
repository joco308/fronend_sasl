"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      router.push('/admin');
    } else {
      alert("El código debe tener 6 dígitos.");
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: '400px', padding: '50px', background: 'white', border: '1px solid #e2e8f0', textAlign: 'center' }}>
        <h2 style={{ fontWeight: 900, color: '#0f172a' }}>Seguridad Doble Factor</h2>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '20px 0 40px' }}>Ingrese el token dinámico de su credencial.</p>
        <form onSubmit={handleVerify}>
          <input 
            required maxLength={6} type="text" value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ width: '100%', padding: '15px', border: '1px solid #0070f3', fontSize: '2rem', textAlign: 'center', letterSpacing: '8px', marginBottom: '25px' }}
            placeholder="000000"
          />
          <button type="submit" style={{ width: '100%', padding: '15px', background: '#0070f3', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>VERIFICAR ACCESO</button>
        </form>
        <Link href="/" style={{ display: 'block', marginTop: '30px', color: '#94a3b8', fontSize: '11px', textDecoration: 'none' }}>CANCELAR OPERACIÓN</Link>
      </div>
    </div>
  );
}