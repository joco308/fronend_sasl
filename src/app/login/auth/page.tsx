"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [digits, setDigits]   = useState(['', '', '', '', '', '']);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...digits];
    next[i] = val.slice(-1);
    setDigits(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputs.current[5]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const codigo = digits.join('');
    if (codigo.length < 6) {
      setError('Ingrese los 6 dígitos del código.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin');
      } else {
        setError(data.message || 'Código incorrecto.');
        setDigits(['', '', '', '', '', '']);
        setTimeout(() => inputs.current[0]?.focus(), 50);
      }
    } catch {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const codigoCompleto = digits.join('').length === 6;

  return (
    <div style={{
      height: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#0f172a', fontFamily: "'Inter', sans-serif",
    }}>
      {/* Fondo decorativo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'radial-gradient(circle at 20% 50%, rgba(0,48,102,0.4) 0%, transparent 60%),' +
          'radial-gradient(circle at 80% 20%, rgba(0,112,243,0.15) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        width: '440px', padding: '50px',
        background: 'white', borderRadius: 20,
        boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        textAlign: 'center',
      }}>
        {/* Ícono */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg,#003066,#0070f3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: 28,
        }}>
          🔐
        </div>

        <h2 style={{ fontWeight: 900, color: '#0f172a', fontSize: '1.4rem', margin: 0 }}>
          Verificación de Seguridad
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '12px 0 36px', lineHeight: 1.6 }}>
          Ingrese el código de 6 dígitos de su autenticador.<br />
          <strong style={{ color: '#003066' }}>Código de prueba: 123456</strong>
        </p>

        <form onSubmit={handleVerify}>
          {/* Inputs de dígitos */}
          <div
            style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}
            onPaste={handlePaste}
          >
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => { inputs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                style={{
                  width: 48, height: 58,
                  border: d ? '2px solid #003066' : '2px solid #e2e8f0',
                  borderRadius: 10, fontSize: '1.6rem', fontWeight: 800,
                  textAlign: 'center', outline: 'none',
                  color: '#0f172a', background: d ? '#f0f7ff' : 'white',
                  transition: 'all 0.15s',
                }}
              />
            ))}
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 8, padding: '10px 16px', marginBottom: 20,
              color: '#dc2626', fontSize: '0.82rem', fontWeight: 600,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!codigoCompleto || loading}
            style={{
              width: '100%', padding: '15px',
              background: codigoCompleto && !loading ? '#003066' : '#94a3b8',
              color: 'white', border: 'none', borderRadius: 10,
              fontWeight: 800, fontSize: '0.9rem',
              cursor: codigoCompleto && !loading ? 'pointer' : 'not-allowed',
              letterSpacing: '1px',
            }}
          >
            {loading ? 'VERIFICANDO...' : 'VERIFICAR ACCESO'}
          </button>
        </form>

        <Link href="/login" style={{
          display: 'block', marginTop: 24,
          color: '#94a3b8', fontSize: '11px',
          textDecoration: 'none', letterSpacing: '1px',
        }}>
          ← VOLVER AL LOGIN
        </Link>
      </div>
    </div>
  );
}
