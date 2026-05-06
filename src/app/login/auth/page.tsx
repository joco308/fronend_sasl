"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [digits, setDigits]   = useState(['', '', '', '', '', '']);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => { inputs.current[0]?.focus(); }, []);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...digits];
    next[i] = val.slice(-1);
    setDigits(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setDigits(pasted.split('')); inputs.current[5]?.focus(); }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const codigo = digits.join('');
    if (codigo.length < 6) { setError('Ingrese los 6 dígitos del código.'); return; }
    setLoading(true); setError('');
    try {
      const res  = await fetch('/api/login/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codigo }) });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push(data.redirect || '/admin'), 800);
      } else {
        setError(data.message || 'Código incorrecto.');
        setDigits(['', '', '', '', '', '']);
        setTimeout(() => inputs.current[0]?.focus(), 50);
      }
    } catch { setError('Error de conexión. Intente nuevamente.'); }
    finally   { setLoading(false); }
  };

  const filled  = digits.join('').length;
  const complete = filled === 6;

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#060d1a', fontFamily:"'Inter','Segoe UI',sans-serif", padding:24 }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes errorShake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        @keyframes successPop { 0%{transform:scale(.8);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .auth-panel  { animation: fadeInUp .45s ease both; }
        .auth-error  { animation: errorShake .35s ease; }
        .auth-success { animation: successPop .4s ease both; }
        .otp-digit:focus { border-color:#3b82f6 !important; box-shadow:0 0 0 3px rgba(59,130,246,.18) !important; background:#0f1e32 !important; }
        .otp-digit { transition: all .15s ease; }
        .verify-btn { transition: all .2s ease; }
        .verify-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 28px rgba(0,112,243,.45) !important; }
      `}</style>

      {/* Background glows */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:'20%', left:'20%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,80,200,.12) 0%,transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:'15%', right:'15%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,180,140,.08) 0%,transparent 70%)' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(30,58,95,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(30,58,95,.06) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />
      </div>

      <div className="auth-panel" style={{ position:'relative', width:'100%', maxWidth:440, background:'#080f1e', border:'1px solid rgba(30,58,95,.7)', borderRadius:20, padding:'clamp(32px,6vw,52px)', boxShadow:'0 40px 100px rgba(0,0,0,.6)', textAlign:'center' }}>

        {success ? (
          // Success state
          <div className="auth-success" style={{ padding:'24px 0' }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#065f46,#059669)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:32, boxShadow:'0 8px 24px rgba(5,150,105,.35)' }}>✓</div>
            <h3 style={{ margin:'0 0 8px', color:'#4ade80', fontSize:'1.3rem', fontWeight:900 }}>Acceso concedido</h3>
            <p style={{ margin:0, color:'#475569', fontSize:14 }}>Redirigiendo a tu panel...</p>
            <div style={{ marginTop:20, width:40, height:3, background:'linear-gradient(90deg,#059669,#34d399)', borderRadius:2, margin:'20px auto 0', animation:'pulse 1s ease infinite' }} />
          </div>
        ) : (
          <>
            {/* Brand logo */}
            <div style={{ width:100, margin:'0 auto 20px', borderRadius:14, overflow:'hidden', background:'#f0f2f7', boxShadow:'0 8px 24px rgba(0,0,0,.4)' }}>
              <img src="/logo-sasl.jpeg" alt="Markach'uxña" style={{ width:'100%', display:'block' }} />
            </div>

            <h2 style={{ margin:'0 0 8px', color:'#f1f5f9', fontSize:'1.5rem', fontWeight:900 }}>Verificación en 2 pasos</h2>
            <p style={{ margin:'0 0 32px', color:'#475569', fontSize:13, lineHeight:1.6 }}>
              Ingrese el código de 6 dígitos de su autenticador.
            </p>

            {/* Progress bar */}
            <div style={{ height:3, background:'#0f1e30', borderRadius:2, marginBottom:28, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${(filled / 6) * 100}%`, background:'linear-gradient(90deg,#003066,#3b82f6)', borderRadius:2, transition:'width .15s ease' }} />
            </div>

            <form onSubmit={handleVerify}>
              <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:28 }} onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    className="otp-digit"
                    ref={el => { inputs.current[i] = el; }}
                    type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    style={{
                      width:52, height:62, border:`2px solid ${d ? '#3b82f6' : '#1e3a5f'}`,
                      borderRadius:12, fontSize:'1.7rem', fontWeight:900,
                      textAlign:'center', outline:'none', background:d ? '#0d1e35' : '#0a1525',
                      color: d ? '#60a5fa' : '#334155', cursor:'text',
                    }}
                  />
                ))}
              </div>

              {error && (
                <div className="auth-error" style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.22)', borderRadius:10, padding:'11px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
                  <span>⚠️</span>
                  <p style={{ margin:0, color:'#f87171', fontSize:13, fontWeight:600, textAlign:'left' }}>{error}</p>
                </div>
              )}

              <button
                type="submit" disabled={!complete || loading} className="verify-btn"
                style={{ width:'100%', padding:'14px', background: complete && !loading ? 'linear-gradient(135deg,#003066,#1d4ed8)' : '#0f1e30', color: complete ? 'white' : '#334155', border:`1px solid ${complete ? 'transparent' : '#1e3a5f'}`, borderRadius:12, fontWeight:800, fontSize:14, cursor: complete && !loading ? 'pointer' : 'not-allowed', letterSpacing:'.5px', display:'flex', alignItems:'center', justifyContent:'center', gap:10, boxShadow: complete ? '0 4px 16px rgba(0,112,243,.3)' : 'none' }}
              >
                {loading
                  ? <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin .6s linear infinite', display:'inline-block' }} />Verificando...</>
                  : 'Verificar acceso'}
              </button>
            </form>

            {/* Hint */}
            <div style={{ marginTop:24, padding:'12px 16px', background:'rgba(59,130,246,.06)', border:'1px solid rgba(59,130,246,.12)', borderRadius:10 }}>
              <p style={{ margin:0, color:'#334155', fontSize:11, fontWeight:700 }}>Código de prueba</p>
              <p style={{ margin:'4px 0 0', color:'#3b82f6', fontSize:18, fontWeight:900, letterSpacing:6 }}>123456</p>
            </div>

            <Link href="/login" style={{ display:'inline-block', marginTop:20, color:'#334155', fontSize:11, textDecoration:'none', letterSpacing:1, fontWeight:700 }}>
              ← VOLVER AL LOGIN
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
