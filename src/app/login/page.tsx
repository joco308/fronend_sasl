"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [correo, setCorreo]         = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!correo.trim() || !contrasena.trim()) { setError('Ingrese correo y contraseña.'); return; }
    setLoading(true);
    try {
      const res  = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ correo, contrasena }) });
      const data = await res.json();
      if (data.success) { router.push('/login/auth'); }
      else { setError(data.message || 'Credenciales incorrectas.'); }
    } catch { setError('Error de conexión. Intente nuevamente.'); }
    finally   { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter','Segoe UI',sans-serif", background: '#060d1a' }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes errorShake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        .login-panel { animation: fadeInUp .5s ease both; }
        .login-hero-item { animation: float 4s ease-in-out infinite; }
        .login-hero-item:nth-child(2) { animation-delay:.8s; }
        .login-hero-item:nth-child(3) { animation-delay:1.6s; }
        .login-input:focus { border-color:#3b82f6 !important; box-shadow:0 0 0 3px rgba(59,130,246,.15) !important; }
        .login-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 28px rgba(0,112,243,.45) !important; }
        .login-btn { transition:all .2s ease; }
        .login-error { animation: errorShake .35s ease; }
        .login-field-wrap { position:relative; }
        .login-toggle { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#475569; font-size:14px; padding:4px; }
        .login-toggle:hover { color:#94a3b8; }
        .cred-pill { display:inline-flex; align-items:center; gap:6px; background:rgba(59,130,246,.08); border:1px solid rgba(59,130,246,.18); border-radius:8px; padding:6px 12px; font-size:11px; color:#64748b; cursor:pointer; transition:all .15s; }
        .cred-pill:hover { background:rgba(59,130,246,.14); border-color:rgba(59,130,246,.35); color:#94a3b8; }
        .sasl-left { display:flex; }
        @media(max-width:900px) { .sasl-left { display:none !important; } .login-right { width:100% !important; } .mobile-logo { display:block !important; } }
      `}</style>

      {/* ── LEFT decorative panel ── */}
      <div className="sasl-left" style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'linear-gradient(145deg,#020812 0%,#041020 40%,#061428 100%)' }}>
        {/* Ambient glows */}
        <div style={{ position:'absolute', top:'15%', left:'10%', width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,80,200,.22) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'20%', right:'5%', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,160,120,.12) 0%,transparent 70%)', pointerEvents:'none' }} />

        {/* Grid overlay */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(30,58,95,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(30,58,95,.12) 1px,transparent 1px)', backgroundSize:'48px 48px', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', height:'100%', padding:'clamp(40px,6vw,72px)' }}>
          {/* Brand */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:48, height:48, borderRadius:12, overflow:'hidden', background:'#e8edf5', boxShadow:'0 4px 16px rgba(0,0,0,.35)', flexShrink:0 }}>
              <img src="/logo-icon.jpeg" alt="Logo" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
            <div>
              <p style={{ margin:0, color:'#f1f5f9', fontWeight:900, fontSize:15, letterSpacing:.5 }}>Markach'uxña</p>
              <p style={{ margin:0, color:'#3b82f6', fontSize:9, letterSpacing:2, fontWeight:700 }}>MULTISERVICIOS S.R.L.</p>
            </div>
          </div>

          {/* Headline */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', maxWidth:440 }}>
            <span style={{ display:'inline-block', background:'rgba(59,130,246,.12)', border:'1px solid rgba(59,130,246,.25)', color:'#60a5fa', padding:'5px 14px', borderRadius:20, fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:24 }}>
              SISTEMA DE GESTIÓN
            </span>
            <h1 style={{ margin:'0 0 18px', color:'#f1f5f9', fontSize:'clamp(1.9rem,4vw,3rem)', fontWeight:900, lineHeight:1.1 }}>
              Gestión de<br />
              <span style={{ background:'linear-gradient(90deg,#3b82f6,#60a5fa,#3b82f6)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 3s linear infinite' }}>
                Higiene Industrial
              </span>
            </h1>
            <p style={{ color:'#475569', fontSize:15, lineHeight:1.7, margin:'0 0 40px' }}>
              Plataforma integral para la administración de personal, servicios y operaciones de SASL Bolivia.
            </p>

            {/* Feature cards */}
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { e:'👥', t:'Gestión de personal', d:'Control completo de empleados y roles' },
                { e:'🧹', t:'Servicios en tiempo real', d:'Seguimiento de operaciones activas' },
                { e:'📊', t:'Reportes y análisis', d:'Datos e indicadores de rendimiento' },
              ].map((item, i) => (
                <div key={i} className="login-hero-item" style={{ display:'flex', alignItems:'center', gap:14, background:'rgba(255,255,255,.03)', border:'1px solid rgba(30,58,95,.6)', borderRadius:12, padding:'12px 16px', animationDelay:`${i * 0.8}s` }}>
                  <span style={{ fontSize:22, flexShrink:0 }}>{item.e}</span>
                  <div>
                    <p style={{ margin:0, color:'#e2e8f0', fontWeight:700, fontSize:13 }}>{item.t}</p>
                    <p style={{ margin:0, color:'#475569', fontSize:11 }}>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats bottom */}
          <div style={{ display:'flex', gap:24, paddingTop:24, borderTop:'1px solid rgba(30,58,95,.5)', flexWrap:'wrap' }}>
            {[['80+','Empleados'],['120+','Clientes'],['10 años','Experiencia']].map(([v,l]) => (
              <div key={l}>
                <p style={{ margin:0, color:'#f1f5f9', fontWeight:900, fontSize:20 }}>{v}</p>
                <p style={{ margin:0, color:'#334155', fontSize:11 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT login panel ── */}
      <div className="login-right login-panel" style={{ width:460, flexShrink:0, display:'flex', flexDirection:'column', justifyContent:'center', background:'#080f1e', borderLeft:'1px solid rgba(30,58,95,.5)', padding:'clamp(32px,5vw,60px)' }}>
        <Link href="/" style={{ color:'#334155', textDecoration:'none', fontSize:11, fontWeight:800, letterSpacing:1, display:'inline-flex', alignItems:'center', gap:6, marginBottom:40 }}>
          ← VOLVER AL INICIO
        </Link>

        {/* Logo (visible solo cuando el panel izq está oculto) */}
        <div style={{ display:'none' }} className="mobile-logo">
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:32 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#003066,#0070f3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🧹</div>
            <div><p style={{ margin:0, color:'#f1f5f9', fontWeight:900 }}>SASL</p><p style={{ margin:0, color:'#3b82f6', fontSize:9, letterSpacing:2 }}>BOLIVIA</p></div>
          </div>
        </div>

        {/* Logo en panel derecho */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
          <div style={{ width:160, borderRadius:16, overflow:'hidden', background:'#f0f2f7', boxShadow:'0 4px 20px rgba(0,0,0,.35)' }}>
            <img src="/logo-sasl.jpeg" alt="Markach'uxña Multiservicios" style={{ width:'100%', display:'block' }} />
          </div>
        </div>

        <div style={{ marginBottom:28, textAlign:'center' }}>
          <h2 style={{ margin:'0 0 8px', color:'#f1f5f9', fontSize:'1.4rem', fontWeight:900 }}>Bienvenido de vuelta</h2>
          <p style={{ margin:0, color:'#475569', fontSize:13, lineHeight:1.6 }}>Ingrese sus credenciales para acceder al portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom:18 }}>
            <label style={{ display:'block', color:'#64748b', fontSize:11, fontWeight:700, marginBottom:8, letterSpacing:'.08em', textTransform:'uppercase' }}>
              Correo electrónico
            </label>
            <div className="login-field-wrap">
              <input
                className="login-input"
                type="email" value={correo} required autoComplete="email"
                onChange={e => setCorreo(e.target.value)}
                placeholder="usuario@sasl.bo"
                style={{ width:'100%', background:'#0f1828', border:'1.5px solid #1e3a5f', borderRadius:10, padding:'13px 16px', color:'#f1f5f9', fontSize:14, outline:'none', transition:'all .2s' }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom:24 }}>
            <label style={{ display:'block', color:'#64748b', fontSize:11, fontWeight:700, marginBottom:8, letterSpacing:'.08em', textTransform:'uppercase' }}>
              Contraseña
            </label>
            <div className="login-field-wrap">
              <input
                className="login-input"
                type={showPass ? 'text' : 'password'} value={contrasena} required autoComplete="current-password"
                onChange={e => setContrasena(e.target.value)}
                placeholder="••••••••"
                style={{ width:'100%', background:'#0f1828', border:'1.5px solid #1e3a5f', borderRadius:10, padding:'13px 44px 13px 16px', color:'#f1f5f9', fontSize:14, outline:'none', transition:'all .2s' }}
              />
              <button type="button" className="login-toggle" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error" style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.25)', borderRadius:10, padding:'12px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:16 }}>⚠️</span>
              <p style={{ margin:0, color:'#f87171', fontSize:13, fontWeight:600 }}>{error}</p>
            </div>
          )}

          <button
            type="submit" disabled={loading} className="login-btn"
            style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg,#003066,#1d4ed8)', color:'white', border:'none', borderRadius:10, fontWeight:800, fontSize:14, cursor:loading ? 'not-allowed' : 'pointer', letterSpacing:'.5px', display:'flex', alignItems:'center', justifyContent:'center', gap:10, opacity:loading ? .7 : 1, boxShadow:'0 4px 16px rgba(0,112,243,.3)' }}
          >
            {loading
              ? <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin .6s linear infinite', display:'inline-block' }} />Verificando...</>
              : <>Continuar →</>}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'24px 0' }}>
          <div style={{ flex:1, height:1, background:'#0f1e30' }} />
          <span style={{ color:'#1e3a5f', fontSize:11, fontWeight:600 }}>ACCESO RÁPIDO</span>
          <div style={{ flex:1, height:1, background:'#0f1e30' }} />
        </div>

        {/* Quick credentials */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:24 }}>
          {[
            { r:'Admin',   e:'admin@sasl.bo',   p:'admin123',   emoji:'🛡️', c:'#3b82f6' },
            { r:'Gerente', e:'gerente@sasl.bo', p:'gerente123', emoji:'📊', c:'#8b5cf6' },
            { r:'Usuario', e:'usuario@sasl.bo', p:'usuario123', emoji:'👤', c:'#10b981' },
            { r:'Cliente', e:'cliente@sasl.bo', p:'cliente123', emoji:'🏢', c:'#f59e0b' },
          ].map(u => (
            <button key={u.r} className="cred-pill" style={{ borderColor:`${u.c}25`, background:`${u.c}08` }}
              onClick={() => { setCorreo(u.e); setContrasena(u.p); setError(''); }}>
              <span>{u.emoji}</span>
              <span style={{ color:u.c, fontWeight:700 }}>{u.r}</span>
            </button>
          ))}
        </div>

        <div style={{ padding:'12px 16px', background:'rgba(59,130,246,.06)', border:'1px solid rgba(59,130,246,.12)', borderRadius:10 }}>
          <p style={{ margin:'0 0 4px', color:'#334155', fontSize:11, fontWeight:700 }}>🔐 Código 2FA de prueba:</p>
          <p style={{ margin:0, color:'#475569', fontSize:13, fontWeight:800, letterSpacing:4 }}>123456</p>
        </div>
      </div>
    </div>
  );
}
