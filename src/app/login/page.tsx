"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [correo, setCorreo]       = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!correo.trim() || !contrasena.trim()) {
      setError('Ingrese correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await res.json();

      if (data.success) {
        // Paso 1 OK → ir a verificación 2FA
        router.push('/login/auth');
      } else {
        setError(data.message || 'Credenciales incorrectas.');
      }
    } catch {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh', display: 'flex',
      backgroundColor: '#0f172a', fontFamily: "'Inter', sans-serif",
    }}>
      {/* Panel izquierdo decorativo */}
      <div style={{
        flex: 1,
        backgroundImage: 'url("https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069")',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{
          height: '100%', width: '100%',
          backgroundColor: 'rgba(0,48,102,0.78)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '10%',
        }}>
          <p style={{ color: '#93c5fd', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '3px', marginBottom: 20 }}>
            SISTEMA DE GESTIÓN
          </p>
          <h2 style={{ color: 'white', fontSize: '3rem', fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
            Sistemas de Gestión de Higiene Industrial.
          </h2>
          <p style={{ color: '#94a3b8', marginTop: 24, fontSize: '0.95rem', lineHeight: 1.6 }}>
            Acceso exclusivo para personal autorizado de SASL.
          </p>
        </div>
      </div>

      {/* Panel derecho: formulario */}
      <div style={{
        width: '480px', backgroundColor: 'white',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px',
      }}>
        <Link href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '11px', fontWeight: 800, marginBottom: '40px', display: 'block' }}>
          ← VOLVER AL INICIO
        </Link>

        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#003066', margin: 0 }}>
            Portal SASL
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 8 }}>
            Ingrese sus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '10px', fontWeight: 900, color: '#1e293b', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>
              CORREO ELECTRÓNICO
            </label>
            <input
              type="email" value={correo} required
              onChange={e => setCorreo(e.target.value)}
              placeholder="usuario@sasl.bo"
              style={{
                width: '100%', padding: '14px', border: '1px solid #e2e8f0',
                borderRadius: 8, fontSize: '0.9rem', outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = '#003066')}
              onBlur={e  => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '10px', fontWeight: 900, color: '#1e293b', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>
              CONTRASEÑA
            </label>
            <input
              type="password" value={contrasena} required
              onChange={e => setContrasena(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '14px', border: '1px solid #e2e8f0',
                borderRadius: 8, fontSize: '0.9rem', outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = '#003066')}
              onBlur={e  => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 8, padding: '12px 16px', marginBottom: 20,
              color: '#dc2626', fontSize: '0.85rem', fontWeight: 600,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '16px',
              background: loading ? '#94a3b8' : '#003066',
              color: 'white', border: 'none', borderRadius: 8,
              fontWeight: 900, fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '1px',
            }}
          >
            {loading ? 'VERIFICANDO...' : 'CONTINUAR →'}
          </button>
        </form>

        <div style={{ marginTop: 40, padding: 16, background: '#f8fafc', borderRadius: 8, fontSize: '0.75rem', color: '#94a3b8' }}>
          <strong style={{ color: '#64748b' }}>Credenciales de prueba:</strong><br />
          admin@sasl.bo / admin123<br />
          supervisor@sasl.bo / super123<br />
          trabajador@sasl.bo / trab123
        </div>
      </div>
    </div>
  );
}
