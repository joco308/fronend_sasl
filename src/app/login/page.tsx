"use client";
import Link from 'next/link';
import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#003066', margin: 0 }}>Acceso Administrativo</h2>
          <span style={{ fontSize: '12px', color: '#0070f3', fontWeight: 'bold', textTransform: 'uppercase' }}>Paso 1: Credenciales</span>
        </div>
        
        <div className={styles.inputGroup}>
          <label>Usuario</label>
          <input type="text" placeholder="admin" className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label>Contraseña</label>
          <input type="password" placeholder="••••••••" className={styles.input} />
        </div>

        <button onClick={() => window.location.href="/login/auth"} className={styles.boton}>
          Continuar
        </button>

        <Link href="/" style={{ display: 'block', marginTop: '20px', color: '#64748b', fontSize: '14px', textDecoration: 'none' }}>
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}