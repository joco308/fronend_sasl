"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ── Tipos ─────────────────────────────────────────────────────────────────────
type Toast = { id: number; type: 'success' | 'error' | 'info' | 'warning'; msg: string };
type Empleado = { id_usuario: number; nombre_usuario: string; correo: string; ci: number; rol: string; id_rol: number; fecha_nacimiento: string; genero: string; estado_civil: string; grado_academico: string; pais: string; activo: boolean; portal_rol?: string; contrasena?: string };
type Role = { id_rol: number; nombre_rol: string; salario: number };
type Cliente = { id_cliente: number; nombre_cliente: string; contacto_emergencia: string; direccion: string };
type Servicio = { id_servicio: number; id_cliente: number; cliente: string; tipo_servicio: string; fecha_inicio: string; fecha_final: string | null; costo: number; descripcion: string };
type Maquina = { id_maquinaria: number; nombre_maquinaria: string; codigo_inv: string; tipo: string; estado: string; proveedor: string; descripcion: string };
type Recurso = { id_recurso: number; nombre: string; tipo: string; proveedor: string; descripcion: string };
type Uniforme = { id_uniforme: number; nombre_uniforme: string; talla: number; descripcion: string };
type AsignacionUniforme = { id: number; usuario: string; uniforme: string; fecha_entrega: string; fecha_devolucion: string | null; estado: string };
type Capacitacion = { id_capacitacion: number; nombre: string; descripcion: string; fecha: string; asignados: number[] };
type Mantenimiento = { id_mantenimiento: number; maquinaria: string; fecha_mantenimiento: string; descripcion: string; costo: number };
type Proveedor = { id_proveedor: number; nombre: string; nit: number; empresa: string; producto: string };
type Incidente = { id_incidente: number; servicio: string; descripcion: string; fecha: string };
type Horario = { id_horario: number; hora_entrada: string; hora_salida: string };
type ServicioTerminado = { id: number; servicio: string; satisfaccion: string; comentarios: string };
type PermRow = { modulo: string; emoji: string; admin: boolean; gerente: boolean; usuario: boolean; cliente: boolean };

// ── Colores ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#060d1a', bgAlt: '#0a1628', sidebar: '#070f1d',
  border: '#1e3a5f', borderLight: '#0f1e30',
  text: '#f1f5f9', textMuted: '#64748b', textSub: '#94a3b8',
  blue: '#1d4ed8', blueLight: '#60a5fa',
  green: '#4ade80', yellow: '#facc15', red: '#f87171', orange: '#fb923c',
};

// ── Datos mock ────────────────────────────────────────────────────────────────
const ROLES: Role[] = [
  { id_rol: 1, nombre_rol: 'Supervisor', salario: 3500 },
  { id_rol: 2, nombre_rol: 'Limpieza', salario: 2200 },
  { id_rol: 3, nombre_rol: 'Admin', salario: 5000 },
];
const EMPLEADOS_INIT: Empleado[] = [
  { id_usuario: 1, nombre_usuario: 'Carlos Mamani', correo: 'c.mamani@sasl.bo', ci: 7891234, id_rol: 1, rol: 'Supervisor', fecha_nacimiento: '1990-03-12', genero: 'Masculino', estado_civil: 'Casado', grado_academico: 'Licenciatura', pais: 'Bolivia', activo: true },
  { id_usuario: 2, nombre_usuario: 'Ana Torres', correo: 'a.torres@sasl.bo', ci: 6543210, id_rol: 2, rol: 'Limpieza', fecha_nacimiento: '1995-07-22', genero: 'Femenino', estado_civil: 'Soltera', grado_academico: 'Secundaria', pais: 'Bolivia', activo: true },
  { id_usuario: 3, nombre_usuario: 'Pedro Quispe', correo: 'p.quispe@sasl.bo', ci: 8765432, id_rol: 2, rol: 'Limpieza', fecha_nacimiento: '1988-11-05', genero: 'Masculino', estado_civil: 'Casado', grado_academico: 'Técnico', pais: 'Bolivia', activo: false },
  { id_usuario: 4, nombre_usuario: 'María López', correo: 'm.lopez@sasl.bo', ci: 5432109, id_rol: 3, rol: 'Admin', fecha_nacimiento: '1985-01-30', genero: 'Femenino', estado_civil: 'Divorciada', grado_academico: 'Maestría', pais: 'Bolivia', activo: true },
];
const CLIENTES_INIT: Cliente[] = [
  { id_cliente: 1, nombre_cliente: 'Banco Nacional', contacto_emergencia: '77012345', direccion: 'Av. Camacho 1234, La Paz' },
  { id_cliente: 2, nombre_cliente: 'Hotel Europa', contacto_emergencia: '77098765', direccion: 'Calle Sagárnaga 456, La Paz' },
  { id_cliente: 3, nombre_cliente: 'Centro Médico Sur', contacto_emergencia: '77056789', direccion: 'Av. Hernando Siles 789, El Alto' },
];
const SERVICIOS_INIT: Servicio[] = [
  { id_servicio: 1, id_cliente: 1, cliente: 'Banco Nacional', tipo_servicio: 'Limpieza Profunda', fecha_inicio: '2026-04-01', fecha_final: '2026-04-30', costo: 4500, descripcion: 'Limpieza completa mensual' },
  { id_servicio: 2, id_cliente: 2, cliente: 'Hotel Europa', tipo_servicio: 'Limpieza Diaria', fecha_inicio: '2026-03-01', fecha_final: null, costo: 8000, descripcion: 'Servicio continuo' },
  { id_servicio: 3, id_cliente: 3, cliente: 'Centro Médico Sur', tipo_servicio: 'Desinfección', fecha_inicio: '2026-04-15', fecha_final: '2026-04-15', costo: 1200, descripcion: 'Desinfección urgente' },
];
const MAQUINARIA_INIT: Maquina[] = [
  { id_maquinaria: 1, nombre_maquinaria: 'Aspiradora Industrial X200', codigo_inv: 'MAQ-001', tipo: 'Aspirado', estado: 'Operativo', proveedor: 'CleanTech Bolivia', descripcion: 'Alta potencia' },
  { id_maquinaria: 2, nombre_maquinaria: 'Fregadora Automática F50', codigo_inv: 'MAQ-002', tipo: 'Fregado', estado: 'Mantenimiento', proveedor: 'Industrial SRL', descripcion: 'En revisión' },
  { id_maquinaria: 3, nombre_maquinaria: 'Hidrolavadora H300', codigo_inv: 'MAQ-003', tipo: 'Presión', estado: 'Operativo', proveedor: 'CleanTech Bolivia', descripcion: 'Uso exterior' },
];
const RECURSOS_INIT: Recurso[] = [
  { id_recurso: 1, nombre: 'Detergente Multiusos 5L', tipo: 'Químico', proveedor: 'SupliLimp SA', descripcion: 'Concentrado' },
  { id_recurso: 2, nombre: 'Trapeador Premium', tipo: 'Utensilio', proveedor: 'CleanStore', descripcion: 'Microfibra' },
  { id_recurso: 3, nombre: 'Desinfectante Hospitalario', tipo: 'Químico', proveedor: 'SupliLimp SA', descripcion: 'Nivel hospitalario' },
];
const UNIFORMES_INIT: Uniforme[] = [
  { id_uniforme: 1, nombre_uniforme: 'Camisa Operativa', talla: 42, descripcion: 'Azul marino con logo' },
  { id_uniforme: 2, nombre_uniforme: 'Pantalón de Trabajo', talla: 40, descripcion: 'Resistente' },
];
const ASIG_UNI_INIT: AsignacionUniforme[] = [
  { id: 1, usuario: 'Ana Torres', uniforme: 'Camisa Operativa', fecha_entrega: '2026-01-15', fecha_devolucion: null, estado: 'Entregado' },
];
const CAPACITACIONES_INIT: Capacitacion[] = [
  { id_capacitacion: 1, nombre: 'Manejo de Químicos', descripcion: 'Uso seguro de productos de limpieza', fecha: '2026-03-10', asignados: [1, 2] },
  { id_capacitacion: 2, nombre: 'Primeros Auxilios', descripcion: 'Atención básica en emergencias', fecha: '2026-04-05', asignados: [1] },
  { id_capacitacion: 3, nombre: 'Protocolo Sanitario', descripcion: 'Medidas sanitarias vigentes', fecha: '2026-05-01', asignados: [] },
];
const MANTENIMIENTOS_INIT: Mantenimiento[] = [
  { id_mantenimiento: 1, maquinaria: 'Fregadora Automática F50', fecha_mantenimiento: '2026-04-10', descripcion: 'Revisión de motor', costo: 350 },
];
const PROVEEDORES_INIT: Proveedor[] = [
  { id_proveedor: 1, nombre: 'SupliLimp SA', nit: 1234567, empresa: 'SupliLimp SA', producto: 'Químicos' },
  { id_proveedor: 2, nombre: 'CleanStore', nit: 7654321, empresa: 'CleanStore Bolivia', producto: 'Utensilios' },
  { id_proveedor: 3, nombre: 'CleanTech Bolivia', nit: 9876543, empresa: 'CleanTech SRL', producto: 'Maquinaria' },
];
const INCIDENTES_INIT: Incidente[] = [
  { id_incidente: 1, servicio: 'Hotel Europa', descripcion: 'Derrame de químico', fecha: '2026-04-02' },
];
const HORARIOS_INIT: Horario[] = [
  { id_horario: 1, hora_entrada: '06:00', hora_salida: '14:00' },
  { id_horario: 2, hora_entrada: '14:00', hora_salida: '22:00' },
];
const TERMINADOS_INIT: ServicioTerminado[] = [
  { id: 1, servicio: 'Desinfección - Centro Médico Sur', satisfaccion: 'Excelente', comentarios: 'Trabajo impecable' },
];
const PERMISOS_INIT: PermRow[] = [
  { modulo: 'Dashboard',      emoji: '📊', admin: true,  gerente: true,  usuario: true,  cliente: false },
  { modulo: 'Empleados',      emoji: '👥', admin: true,  gerente: false, usuario: false, cliente: false },
  { modulo: 'Clientes',       emoji: '🏢', admin: true,  gerente: true,  usuario: false, cliente: false },
  { modulo: 'Servicios',      emoji: '🧹', admin: true,  gerente: true,  usuario: true,  cliente: true  },
  { modulo: 'Maquinaria',     emoji: '⚙️', admin: true,  gerente: false, usuario: false, cliente: false },
  { modulo: 'Proveedores',    emoji: '🚚', admin: true,  gerente: false, usuario: false, cliente: false },
  { modulo: 'Cobros',         emoji: '💰', admin: true,  gerente: true,  usuario: false, cliente: true  },
  { modulo: 'Capacitaciones', emoji: '📚', admin: true,  gerente: false, usuario: true,  cliente: false },
  { modulo: 'Incidentes',     emoji: '⚠️', admin: true,  gerente: true,  usuario: true,  cliente: false },
  { modulo: 'Horarios',       emoji: '🕐', admin: true,  gerente: false, usuario: true,  cliente: false },
  { modulo: 'Roles/Permisos', emoji: '🛡️', admin: true,  gerente: false, usuario: false, cliente: false },
];

// ── Toast ─────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);
  const show = (type: Toast['type'], msg: string) => {
    const id = ++counter.current;
    setToasts(p => [...p, { id, type, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };
  return { toasts, show };
}
const TOAST_CFG: Record<Toast['type'], { bg: string; icon: string }> = {
  success: { bg: 'linear-gradient(135deg,#065f46,#059669)', icon: '✅' },
  error:   { bg: 'linear-gradient(135deg,#7f1d1d,#dc2626)', icon: '❌' },
  warning: { bg: 'linear-gradient(135deg,#78350f,#d97706)', icon: '⚠️' },
  info:    { bg: 'linear-gradient(135deg,#1e3a8a,#2563eb)', icon: 'ℹ️' },
};
const ToastContainer = ({ toasts }: { toasts: Toast[] }) => (
  <div style={{ position: 'fixed', top: 72, right: 20, zIndex: 9000, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
    {toasts.map(t => {
      const cfg = TOAST_CFG[t.type];
      return (
        <div key={t.id} style={{ background: cfg.bg, color: '#fff', padding: '12px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', gap: 10, animation: 'slideInRight .3s ease', maxWidth: 340 }}>
          <span style={{ fontSize: 16 }}>{cfg.icon}</span>{t.msg}
        </div>
      );
    })}
  </div>
);

// ── UI helpers ────────────────────────────────────────────────────────────────
const Badge = ({ text, color = 'blue' }: { text: string; color?: string }) => {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    green:  { bg: 'rgba(34,197,94,.15)',  color: '#4ade80', border: 'rgba(34,197,94,.3)' },
    yellow: { bg: 'rgba(234,179,8,.15)',  color: '#facc15', border: 'rgba(234,179,8,.3)' },
    red:    { bg: 'rgba(239,68,68,.15)',  color: '#f87171', border: 'rgba(239,68,68,.3)' },
    blue:   { bg: 'rgba(59,130,246,.15)', color: '#60a5fa', border: 'rgba(59,130,246,.3)' },
    gray:   { bg: 'rgba(148,163,184,.1)', color: '#94a3b8', border: 'rgba(148,163,184,.3)' },
  };
  const s = map[color] || map.blue;
  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{text}</span>;
};
const Btn = ({ children, onClick, variant = 'primary', sm, disabled }: { children: React.ReactNode; onClick?: () => void; variant?: string; sm?: boolean; disabled?: boolean }) => {
  const v: Record<string, React.CSSProperties> = {
    primary: { background: 'linear-gradient(135deg,#003066,#1d4ed8)', color: '#fff', border: 'none' },
    danger:  { background: 'rgba(239,68,68,.12)', color: '#f87171', border: '1px solid rgba(239,68,68,.3)' },
    ghost:   { background: 'rgba(148,163,184,.08)', color: '#94a3b8', border: '1px solid #1e3a5f' },
    success: { background: 'rgba(34,197,94,.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,.3)' },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...v[variant], padding: sm ? '6px 12px' : '10px 20px', borderRadius: 8, fontSize: sm ? 12 : 14, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, opacity: disabled ? .5 : 1, transition: 'all .15s' }}>
      {children}
    </button>
  );
};
const Inp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} style={{ width: '100%', background: '#0f1e30', border: '1px solid #1e3a5f', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s', ...props.style }}
    onFocus={e => (e.target.style.borderColor = '#0070f3')}
    onBlur={e => (e.target.style.borderColor = '#1e3a5f')}
  />
);
const Sel = ({ children, ...p }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
  <select {...p} style={{ width: '100%', background: '#0f1e30', border: '1px solid #1e3a5f', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>{children}</select>
);
const Fld = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</label>
    {children}
  </div>
);
const G2 = ({ children }: { children: React.ReactNode }) => <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>{children}</div>;
const Modal = ({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)', animation: 'fadeIn .2s ease' }}>
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 18, padding: 32, width: wide ? 'min(780px,95vw)' : 'min(620px,95vw)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 40px 100px rgba(0,0,0,.6)', animation: 'slideUp .25s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ margin: 0, color: C.text, fontSize: 18, fontWeight: 800 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#f87171', cursor: 'pointer', fontSize: 18, width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
      </div>
      {children}
    </div>
  </div>
);
const Tabla = ({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead><tr>{headers.map((h, i) => <th key={i} style={{ padding: '12px 16px', textAlign: 'left', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}`, transition: 'background .15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.02)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            {row.map((cell, j) => <td key={j} style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
    {rows.length === 0 && <div style={{ padding: '48px', textAlign: 'center', color: C.textMuted, fontSize: 14 }}>📭 Sin registros</div>}
  </div>
);
const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', transition: 'border-color .2s', ...style }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,112,243,.3)')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
    {children}
  </div>
);
const SecHeader = ({ title, onAdd, addLabel }: { title: string; onAdd?: () => void; addLabel?: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
    <h2 style={{ margin: 0, color: C.text, fontSize: 20, fontWeight: 800 }}>{title}</h2>
    {onAdd && <Btn onClick={onAdd}>＋ {addLabel || 'Nuevo'}</Btn>}
  </div>
);
const RowActions = ({ onEdit, onDel }: { onEdit: () => void; onDel: () => void }) => (
  <div style={{ display: 'flex', gap: 6 }}>
    <Btn sm variant="ghost" onClick={onEdit}>✏️</Btn>
    <Btn sm variant="danger" onClick={onDel}>🗑️</Btn>
  </div>
);
const footerActions = (onCancel: () => void, onSave: () => void) => (
  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
    <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
    <Btn onClick={onSave}>💾 Guardar</Btn>
  </div>
);

// ── Mini bar chart ────────────────────────────────────────────────────────────
const MiniBar = ({ values, labels, color = '#0070f3' }: { values: number[]; labels: string[]; color?: string }) => {
  const max = Math.max(...values) || 1;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 56, paddingTop: 8 }}>
      {values.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ width: '100%', height: `${(v / max) * 44}px`, background: color, borderRadius: '3px 3px 0 0', transition: 'height .6s ease', opacity: .85 }} />
          <span style={{ color: '#475569', fontSize: 9, fontWeight: 600 }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ empleados, servicios, maquinaria, clientes }: { empleados: Empleado[]; servicios: Servicio[]; maquinaria: Maquina[]; clientes: Cliente[] }) {
  const ingresos = servicios.reduce((s, sv) => s + sv.costo, 0);
  const activos = servicios.filter(s => !s.fecha_final).length;
  const stats = [
    { l: 'Empleados activos', v: empleados.filter(e => e.activo).length, c: '#3b82f6', e: '👥', trend: '+2 este mes' },
    { l: 'Servicios en curso', v: activos, c: '#10b981', e: '🧹', trend: `${servicios.length} totales` },
    { l: 'Maquinaria OK',      v: maquinaria.filter(m => m.estado === 'Operativo').length, c: '#f59e0b', e: '⚙️', trend: `${maquinaria.length} equipos` },
    { l: 'Ingresos totales',   v: `Bs ${ingresos.toLocaleString()}`, c: '#8b5cf6', e: '💰', trend: 'Bs/mes' },
    { l: 'Clientes',           v: clientes.length, c: '#06b6d4', e: '🏢', trend: '+1 nuevo' },
  ];
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: '0 0 4px', color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3 }}>PANEL GENERAL</p>
        <h2 style={{ margin: 0, color: C.text, fontSize: 22, fontWeight: 900 }}>Resumen Operativo</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map(({ l, v, c, e, trend }) => (
          <div key={l} style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 22px', position: 'relative', overflow: 'hidden', transition: 'all .2s' }}
            onMouseEnter={el => { el.currentTarget.style.transform = 'translateY(-3px)'; el.currentTarget.style.borderColor = c + '60'; }}
            onMouseLeave={el => { el.currentTarget.style.transform = 'none'; el.currentTarget.style.borderColor = C.border; }}>
            <div style={{ position: 'absolute', top: -12, right: -12, width: 60, height: 60, borderRadius: '50%', background: c, opacity: .12 }} />
            <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
            <p style={{ margin: '8px 0 4px', color: C.text, fontSize: 24, fontWeight: 900 }}>{e} {v}</p>
            <p style={{ margin: 0, color: '#475569', fontSize: 11 }}>{trend}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Servicios recientes */}
        <Card style={{ gridColumn: 'span 2' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: C.textSub, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.07em' }}>🧹 Servicios recientes</strong>
          </div>
          {servicios.slice(0, 3).map(s => (
            <div key={s.id_servicio} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', borderBottom: `1px solid ${C.borderLight}` }}>
              <div>
                <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{s.cliente}</p>
                <p style={{ margin: 0, color: C.textMuted, fontSize: 11 }}>{s.tipo_servicio} · {s.fecha_inicio}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: C.green, fontWeight: 700, fontSize: 13 }}>Bs {s.costo.toLocaleString()}</span>
                <Badge text={s.fecha_final ? 'Finalizado' : 'Activo'} color={s.fecha_final ? 'yellow' : 'green'} />
              </div>
            </div>
          ))}
        </Card>
        {/* Mini chart */}
        <Card>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderLight}` }}>
            <strong style={{ color: C.textSub, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.07em' }}>📊 Ingresos (6 meses)</strong>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <MiniBar values={[8200, 12400, 9800, 15200, 18900, ingresos]} labels={['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr']} />
            <p style={{ margin: '10px 0 0', color: C.green, fontWeight: 900, fontSize: 18 }}>Bs {ingresos.toLocaleString()}</p>
            <p style={{ margin: '2px 0 0', color: C.textMuted, fontSize: 11 }}>Acumulado Abril</p>
          </div>
        </Card>
      </div>

      {/* Alertas del sistema */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 14, padding: 20 }}>
          <p style={{ margin: '0 0 8px', color: '#f87171', fontWeight: 800, fontSize: 13 }}>⚠️ Alertas</p>
          {maquinaria.filter(m => m.estado !== 'Operativo').map(m => (
            <p key={m.id_maquinaria} style={{ margin: '4px 0', color: '#94a3b8', fontSize: 12 }}>• {m.nombre_maquinaria} — {m.estado}</p>
          ))}
          {empleados.filter(e => !e.activo).map(e => (
            <p key={e.id_usuario} style={{ margin: '4px 0', color: '#94a3b8', fontSize: 12 }}>• {e.nombre_usuario} — Inactivo</p>
          ))}
          {maquinaria.filter(m => m.estado !== 'Operativo').length === 0 && empleados.filter(e => !e.activo).length === 0 && (
            <p style={{ color: '#4ade80', fontSize: 12 }}>✓ Sin alertas activas</p>
          )}
        </div>
        <div style={{ background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 14, padding: 20 }}>
          <p style={{ margin: '0 0 8px', color: '#4ade80', fontWeight: 800, fontSize: 13 }}>✅ Estado del sistema</p>
          <p style={{ margin: '4px 0', color: '#94a3b8', fontSize: 12 }}>• Empleados activos: {empleados.filter(e => e.activo).length}/{empleados.length}</p>
          <p style={{ margin: '4px 0', color: '#94a3b8', fontSize: 12 }}>• Servicios en curso: {activos}</p>
          <p style={{ margin: '4px 0', color: '#94a3b8', fontSize: 12 }}>• Maquinaria operativa: {maquinaria.filter(m => m.estado === 'Operativo').length}/{maquinaria.length}</p>
          <p style={{ margin: '4px 0', color: '#94a3b8', fontSize: 12 }}>• Clientes registrados: {clientes.length}</p>
        </div>
      </div>
    </div>
  );
}

// ── Empleados ─────────────────────────────────────────────────────────────────
function Empleados({ data, setData, roles, show }: { data: Empleado[]; setData: React.Dispatch<React.SetStateAction<Empleado[]>>; roles: Role[]; show: (type: Toast['type'], msg: string) => void }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Empleado> } | null>(null);
  const [search, setSearch] = useState('');
  const filtered = data.filter(e => e.nombre_usuario.toLowerCase().includes(search.toLowerCase()) || e.correo.toLowerCase().includes(search.toLowerCase()));

  const blank: Partial<Empleado> = { nombre_usuario: '', correo: '', ci: 0, id_rol: 1, fecha_nacimiento: '', genero: 'Masculino', estado_civil: 'Soltero', grado_academico: 'Secundaria', pais: 'Bolivia', activo: true, portal_rol: 'Usuario', contrasena: '' };

  const save = async (f: Partial<Empleado>) => {
    const rolNombre = roles.find(r => r.id_rol === Number(f.id_rol))?.nombre_rol || '';
    if (modal?.mode === 'new') {
      if (f.portal_rol && f.contrasena && f.correo && f.nombre_usuario) {
        const res = await fetch('/api/admin/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: f.correo, contrasena: f.contrasena, nombre: f.nombre_usuario, rol: f.portal_rol }),
        });
        const data = await res.json();
        if (!data.success) { show('error', data.message || 'Error al registrar credenciales'); return; }
      }
      setData(p => [...p, { ...f, id_usuario: p.length + 1, rol: rolNombre } as Empleado]);
      show('success', `✅ Empleado ${f.nombre_usuario} creado — puede iniciar sesión como ${f.portal_rol}`);
    } else {
      if (f.portal_rol && f.correo) {
        await fetch('/api/admin/usuarios', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: f.correo, nombre: f.nombre_usuario, rol: f.portal_rol, ...(f.contrasena ? { contrasena: f.contrasena } : {}) }),
        });
      }
      setData(p => p.map(e => e.id_usuario === f.id_usuario ? { ...e, ...f, rol: rolNombre } : e));
      show('info', `Empleado ${f.nombre_usuario} actualizado`);
    }
    setModal(null);
  };

  const toggleActivo = (id: number) => {
    setData(p => p.map(e => {
      if (e.id_usuario === id) {
        show(e.activo ? 'warning' : 'success', `${e.nombre_usuario} ${e.activo ? 'desactivado' : 'activado'}`);
        return { ...e, activo: !e.activo };
      }
      return e;
    }));
  };

  const del = async (e: Empleado) => {
    await fetch('/api/admin/usuarios', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ correo: e.correo }) });
    setData(p => p.filter(x => x.id_usuario !== e.id_usuario));
    show('error', `Empleado ${e.nombre_usuario} eliminado`);
  };

  return (
    <div>
      <SecHeader title="👥 Empleados" onAdd={() => setModal({ mode: 'new', item: blank })} addLabel="Nuevo Empleado" />
      {/* Stats rápidas */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { l: 'Total', v: data.length, c: '#3b82f6' },
          { l: 'Activos', v: data.filter(e => e.activo).length, c: '#4ade80' },
          { l: 'Inactivos', v: data.filter(e => !e.activo).length, c: '#f87171' },
        ].map(({ l, v, c }) => (
          <div key={l} style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: c, fontSize: 20, fontWeight: 900 }}>{v}</span>
            <span style={{ color: C.textMuted, fontSize: 12 }}>{l}</span>
          </div>
        ))}
      </div>
      <Card>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ color: C.textMuted }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o correo..." style={{ background: 'none', border: 'none', color: C.text, fontSize: 14, outline: 'none', flex: 1 }} />
        </div>
        <Tabla
          headers={['#', 'Empleado', 'Correo', 'Cargo', 'Acceso Portal', 'Estado', 'Acciones']}
          rows={filtered.map(e => [
            <span style={{ color: C.blueLight, fontWeight: 700 }}>#{e.id_usuario}</span>,
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: e.activo ? 'linear-gradient(135deg,#003066,#0070f3)' : '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, color: '#fff', fontWeight: 800 }}>
                {e.nombre_usuario.charAt(0)}
              </div>
              <div><p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{e.nombre_usuario}</p><p style={{ margin: 0, color: C.textMuted, fontSize: 11 }}>{e.genero} · {e.grado_academico}</p></div>
            </div>,
            <span style={{ color: '#64748b', fontSize: 12 }}>{e.correo}</span>,
            <Badge text={e.rol} color="blue" />,
            <Badge text={e.portal_rol || '—'} color={e.portal_rol === 'Admin' ? 'red' : e.portal_rol === 'Gerente' ? 'blue' : e.portal_rol === 'Cliente' ? 'yellow' : 'green'} />,
            <button onClick={() => toggleActivo(e.id_usuario)} style={{ padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: e.activo ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.12)', color: e.activo ? '#4ade80' : '#f87171', transition: 'all .15s' }}>
              {e.activo ? '● Activo' : '○ Inactivo'}
            </button>,
            <RowActions onEdit={() => setModal({ mode: 'edit', item: e })} onDel={() => del(e)} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={modal.mode === 'new' ? '➕ Nuevo Empleado' : '✏️ Editar Empleado'} onClose={() => setModal(null)} wide>
          <EmpleadoForm initial={modal.item} roles={roles} onSave={save} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

const PORTAL_ROLES = [
  { v: 'Admin',   label: '🛡️ Admin — acceso completo',        c: '#3b82f6' },
  { v: 'Gerente', label: '📊 Gerente — reportes y clientes',   c: '#8b5cf6' },
  { v: 'Usuario', label: '👤 Usuario — operaciones de campo',   c: '#10b981' },
  { v: 'Cliente', label: '🏢 Cliente — seguimiento de servicios', c: '#f59e0b' },
];

function EmpleadoForm({ initial, roles, onSave, onCancel }: { initial: Partial<Empleado>; roles: Role[]; onSave: (f: Partial<Empleado>) => void; onCancel: () => void }) {
  const [f, setF]         = useState<Partial<Empleado>>({ portal_rol: 'Usuario', ...initial });
  const [showPass, setSP] = useState(false);
  const s = (k: keyof Empleado, v: unknown) => setF(p => ({ ...p, [k]: v }));
  const isNew = !initial.id_usuario;
  const selectedPortal = PORTAL_ROLES.find(r => r.v === f.portal_rol);

  return (
    <>
      {/* ── Acceso al sistema (prominente) ── */}
      <div style={{ background: 'rgba(59,130,246,.06)', border: '1px solid rgba(59,130,246,.18)', borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
        <p style={{ margin: '0 0 12px', color: '#60a5fa', fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' }}>
          🔐 Acceso al sistema
        </p>
        <G2>
          <Fld label="Rol de portal (sección de acceso)">
            <Sel value={f.portal_rol || 'Usuario'} onChange={e => s('portal_rol', e.target.value)}>
              {PORTAL_ROLES.map(r => <option key={r.v} value={r.v}>{r.label}</option>)}
            </Sel>
          </Fld>
          <Fld label={isNew ? 'Contraseña de acceso' : 'Nueva contraseña (dejar vacío = sin cambio)'}>
            <div style={{ position: 'relative' }}>
              <Inp
                type={showPass ? 'text' : 'password'}
                value={f.contrasena || ''}
                onChange={e => s('contrasena', e.target.value)}
                placeholder={isNew ? 'Mínimo 6 caracteres' : '••••••••'}
                style={{ paddingRight: 40 }}
              />
              <button type="button" onClick={() => setSP(p => !p)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 14, padding: 4 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </Fld>
        </G2>
        {selectedPortal && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, padding: '8px 12px', background: `${selectedPortal.c}10`, border: `1px solid ${selectedPortal.c}30`, borderRadius: 8 }}>
            <span style={{ fontSize: 13 }}>ℹ️</span>
            <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>
              El usuario accederá al portal de <strong style={{ color: selectedPortal.c }}>{selectedPortal.v}</strong> con el correo y contraseña asignados.
            </p>
          </div>
        )}
      </div>

      {/* ── Datos personales ── */}
      <p style={{ margin: '0 0 12px', color: '#475569', fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' }}>Datos del empleado</p>
      <G2>
        <Fld label="Nombre completo"><Inp value={f.nombre_usuario || ''} onChange={e => s('nombre_usuario', e.target.value)} /></Fld>
        <Fld label="Correo electrónico"><Inp value={f.correo || ''} onChange={e => s('correo', e.target.value)} type="email" /></Fld>
        <Fld label="CI"><Inp value={f.ci || ''} onChange={e => s('ci', Number(e.target.value))} type="number" /></Fld>
        <Fld label="Fecha nacimiento"><Inp value={f.fecha_nacimiento || ''} onChange={e => s('fecha_nacimiento', e.target.value)} type="date" /></Fld>
        <Fld label="Cargo / Rol interno"><Sel value={f.id_rol} onChange={e => s('id_rol', Number(e.target.value))}>{roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.nombre_rol} — Bs {r.salario}</option>)}</Sel></Fld>
        <Fld label="Género"><Sel value={f.genero} onChange={e => s('genero', e.target.value)}>{['Masculino', 'Femenino', 'Otro'].map(g => <option key={g}>{g}</option>)}</Sel></Fld>
        <Fld label="Estado civil"><Sel value={f.estado_civil} onChange={e => s('estado_civil', e.target.value)}>{['Soltero', 'Casado', 'Casada', 'Divorciado', 'Divorciada'].map(g => <option key={g}>{g}</option>)}</Sel></Fld>
        <Fld label="Grado académico"><Sel value={f.grado_academico} onChange={e => s('grado_academico', e.target.value)}>{['Primaria', 'Secundaria', 'Técnico', 'Licenciatura', 'Maestría'].map(g => <option key={g}>{g}</option>)}</Sel></Fld>
        <Fld label="Estado">
          <Sel value={f.activo ? 'activo' : 'inactivo'} onChange={e => s('activo', e.target.value === 'activo')}>
            <option value="activo">✅ Activo</option>
            <option value="inactivo">⛔ Inactivo</option>
          </Sel>
        </Fld>
      </G2>
      {footerActions(onCancel, () => onSave(f))}
    </>
  );
}

// ── Roles ─────────────────────────────────────────────────────────────────────
function Roles({ data, setData, empleados, show }: { data: Role[]; setData: React.Dispatch<React.SetStateAction<Role[]>>; empleados: Empleado[]; show: (t: Toast['type'], m: string) => void }) {
  const [modal, setModal] = useState<boolean>(false);
  const [f, setF] = useState<Partial<Role>>({});
  const [mode, setMode] = useState<'new' | 'edit'>('new');
  const openNew = () => { setF({}); setMode('new'); setModal(true); };
  const openEdit = (r: Role) => { setF(r); setMode('edit'); setModal(true); };
  const save = () => {
    if (mode === 'new') { setData(p => [...p, { ...f, id_rol: p.length + 1 } as Role]); show('success', 'Rol creado'); }
    else { setData(p => p.map(r => r.id_rol === f.id_rol ? { ...r, ...f } as Role : r)); show('info', 'Rol actualizado'); }
    setModal(false);
  };
  return (
    <div>
      <SecHeader title="🛡️ Roles y Salarios" onAdd={openNew} addLabel="Nuevo Rol" />
      <Card>
        <Tabla
          headers={['ID', 'Nombre del Rol', 'Salario (Bs)', 'Empleados', 'Acciones']}
          rows={data.map(r => [
            <span style={{ color: C.blueLight }}>#{r.id_rol}</span>,
            <strong>{r.nombre_rol}</strong>,
            <span style={{ color: C.green, fontWeight: 700 }}>Bs {r.salario.toLocaleString()}</span>,
            <Badge text={String(empleados.filter(e => e.id_rol === r.id_rol).length) + ' empleados'} color="blue" />,
            <RowActions onEdit={() => openEdit(r)} onDel={() => { setData(p => p.filter(x => x.id_rol !== r.id_rol)); show('error', 'Rol eliminado'); }} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={mode === 'new' ? 'Nuevo Rol' : 'Editar Rol'} onClose={() => setModal(false)}>
          <G2>
            <Fld label="Nombre del rol"><Inp value={f.nombre_rol || ''} onChange={e => setF(p => ({ ...p, nombre_rol: e.target.value }))} /></Fld>
            <Fld label="Salario (Bs)"><Inp value={f.salario || ''} onChange={e => setF(p => ({ ...p, salario: Number(e.target.value) }))} type="number" /></Fld>
          </G2>
          {footerActions(() => setModal(false), save)}
        </Modal>
      )}
    </div>
  );
}

// ── Capacitaciones (con asignación por usuario) ───────────────────────────────
function Capacitaciones({ data, setData, empleados, show }: { data: Capacitacion[]; setData: React.Dispatch<React.SetStateAction<Capacitacion[]>>; empleados: Empleado[]; show: (t: Toast['type'], m: string) => void }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit' | 'asignar'; item: Partial<Capacitacion> } | null>(null);
  const [f, setF] = useState<Partial<Capacitacion>>({});
  const [asigTemp, setAsigTemp] = useState<number[]>([]);
  const [empSearch, setEmpSearch] = useState('');

  const save = () => {
    if (modal?.mode === 'new') { setData(p => [...p, { ...f, id_capacitacion: p.length + 1, asignados: [] } as Capacitacion]); show('success', 'Capacitación creada'); }
    else if (modal?.mode === 'edit') { setData(p => p.map(c => c.id_capacitacion === f.id_capacitacion ? { ...c, ...f } : c)); show('info', 'Capacitación actualizada'); }
    setModal(null);
  };

  const saveAsig = () => {
    setData(p => p.map(c => c.id_capacitacion === modal?.item.id_capacitacion ? { ...c, asignados: asigTemp } : c));
    show('success', `Asignación guardada — ${asigTemp.length} empleado(s)`);
    setModal(null);
  };

  const toggleEmp = (id: number) => setAsigTemp(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const filteredEmps = empleados.filter(e => e.nombre_usuario.toLowerCase().includes(empSearch.toLowerCase()) || e.rol.toLowerCase().includes(empSearch.toLowerCase()));
  const allActive    = empleados.filter(e => e.activo);

  return (
    <div>
      <SecHeader title="📚 Capacitaciones" onAdd={() => { setF({}); setModal({ mode: 'new', item: {} }); }} addLabel="Nueva Capacitación" />

      {/* Progress overview cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14, marginBottom: 20 }}>
        {data.map(cap => {
          const pct = empleados.length > 0 ? Math.round((cap.asignados.length / empleados.length) * 100) : 0;
          return (
            <div key={cap.id_capacitacion} style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,112,243,.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', color: '#e2e8f0', fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cap.nombre}</p>
                  <p style={{ margin: 0, color: C.textMuted, fontSize: 11 }}>📅 {cap.fecha}</p>
                </div>
                <span style={{ color: pct === 100 ? C.green : C.blueLight, fontWeight: 900, fontSize: 18, flexShrink: 0, marginLeft: 12 }}>{pct}%</span>
              </div>
              <div style={{ background: '#0f1e30', borderRadius: 999, height: 6, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#4ade80' : 'linear-gradient(90deg,#003066,#0070f3)', borderRadius: 999, transition: 'width .6s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: C.textMuted, fontSize: 12 }}>{cap.asignados.length}/{empleados.length} empleados</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => { setAsigTemp([...cap.asignados]); setEmpSearch(''); setModal({ mode: 'asignar', item: cap }); }}
                    style={{ background: 'rgba(59,130,246,.12)', border: '1px solid rgba(59,130,246,.3)', color: '#60a5fa', padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                    👥 Asignar
                  </button>
                  <Btn sm variant="ghost" onClick={() => { setF(cap); setModal({ mode: 'edit', item: cap }); }}>✏️</Btn>
                  <Btn sm variant="danger" onClick={() => { setData(p => p.filter(x => x.id_capacitacion !== cap.id_capacitacion)); show('error', 'Capacitación eliminada'); }}>🗑️</Btn>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full table below cards */}
      <Card>
        <Tabla
          headers={['ID', 'Nombre', 'Descripción', 'Fecha', 'Cobertura', 'Acciones']}
          rows={data.map(cap => {
            const pct = empleados.length > 0 ? Math.round((cap.asignados.length / empleados.length) * 100) : 0;
            return [
              <span style={{ color: C.blueLight }}>#{cap.id_capacitacion}</span>,
              <strong>{cap.nombre}</strong>,
              cap.descripcion || '—', cap.fecha,
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 120 }}>
                <div style={{ flex: 1, background: '#0f1e30', borderRadius: 999, height: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#4ade80' : '#0070f3', borderRadius: 999 }} />
                </div>
                <span style={{ color: pct === 100 ? C.green : C.blueLight, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{cap.asignados.length}/{empleados.length}</span>
              </div>,
              <RowActions onEdit={() => { setF(cap); setModal({ mode: 'edit', item: cap }); }} onDel={() => { setData(p => p.filter(x => x.id_capacitacion !== cap.id_capacitacion)); show('error', 'Capacitación eliminada'); }} />,
            ];
          })}
        />
      </Card>

      {modal && modal.mode !== 'asignar' && (
        <Modal title={modal.mode === 'new' ? 'Nueva Capacitación' : 'Editar Capacitación'} onClose={() => setModal(null)}>
          <Fld label="Nombre"><Inp value={f.nombre || ''} onChange={e => setF(p => ({ ...p, nombre: e.target.value }))} /></Fld>
          <G2>
            <Fld label="Fecha"><Inp value={f.fecha || ''} onChange={e => setF(p => ({ ...p, fecha: e.target.value }))} type="date" /></Fld>
            <Fld label="Descripción"><Inp value={f.descripcion || ''} onChange={e => setF(p => ({ ...p, descripcion: e.target.value }))} /></Fld>
          </G2>
          {footerActions(() => setModal(null), save)}
        </Modal>
      )}

      {modal && modal.mode === 'asignar' && (
        <Modal title={`👥 Gestionar asignación — ${modal.item.nombre}`} onClose={() => setModal(null)}>
          <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 14 }}>Active o desactive la participación de cada empleado en esta capacitación:</p>

          {/* Search + bulk controls */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#0f1e30', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 14px', minWidth: 180 }}>
              <span style={{ color: C.textMuted }}>🔍</span>
              <input value={empSearch} onChange={e => setEmpSearch(e.target.value)} placeholder="Buscar empleado..." style={{ background: 'none', border: 'none', color: C.text, fontSize: 13, outline: 'none', flex: 1 }} />
            </div>
            <Btn sm variant="success" onClick={() => setAsigTemp(allActive.map(e => e.id_usuario))}>✓ Todos activos</Btn>
            <Btn sm variant="ghost" onClick={() => setAsigTemp([])}>✗ Ninguno</Btn>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
            {filteredEmps.map(e => {
              const checked = asigTemp.includes(e.id_usuario);
              return (
                <div key={e.id_usuario} onClick={() => toggleEmp(e.id_usuario)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 16px', borderRadius: 10, border: `1px solid ${checked ? '#0070f3' : C.border}`, background: checked ? 'rgba(0,112,243,.08)' : C.bgAlt, cursor: 'pointer', transition: 'all .15s' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${checked ? '#0070f3' : '#334155'}`, background: checked ? '#0070f3' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', flexShrink: 0 }}>
                    {checked && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>✓</span>}
                  </div>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: e.activo ? 'linear-gradient(135deg,#003066,#0070f3)' : '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{e.nombre_usuario.charAt(0)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, color: checked ? C.blueLight : '#e2e8f0', fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.nombre_usuario}</p>
                    <p style={{ margin: 0, color: C.textMuted, fontSize: 11 }}>{e.rol} · {e.correo}</p>
                  </div>
                  {!e.activo && <Badge text="Inactivo" color="red" />}
                </div>
              );
            })}
            {filteredEmps.length === 0 && <p style={{ color: C.textMuted, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Sin resultados para "{empSearch}"</p>}
          </div>

          <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(0,112,243,.06)', borderRadius: 10, border: '1px solid rgba(0,112,243,.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: C.blueLight, fontSize: 13, fontWeight: 600 }}>📋 {asigTemp.length} de {empleados.length} empleados seleccionados</span>
            <div style={{ background: '#0f1e30', borderRadius: 999, height: 6, width: 100, overflow: 'hidden' }}>
              <div style={{ width: `${empleados.length > 0 ? (asigTemp.length / empleados.length) * 100 : 0}%`, height: '100%', background: '#0070f3', borderRadius: 999, transition: 'width .3s ease' }} />
            </div>
          </div>
          {footerActions(() => setModal(null), saveAsig)}
        </Modal>
      )}
    </div>
  );
}

// ── Permisos ──────────────────────────────────────────────────────────────────
function Permisos({ data, setData, show }: { data: PermRow[]; setData: React.Dispatch<React.SetStateAction<PermRow[]>>; show: (t: Toast['type'], m: string) => void }) {
  const roles: { key: keyof PermRow; label: string; color: string }[] = [
    { key: 'admin',   label: 'Admin',   color: '#8b5cf6' },
    { key: 'gerente', label: 'Gerente', color: '#0070f3' },
    { key: 'usuario', label: 'Usuario', color: '#10b981' },
    { key: 'cliente', label: 'Cliente', color: '#f59e0b' },
  ];

  const toggle = (modulo: string, rol: keyof PermRow) => {
    setData(p => p.map(r => r.modulo === modulo ? { ...r, [rol]: !r[rol as keyof PermRow] } : r));
    show('info', `Permiso actualizado: ${modulo}`);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: '0 0 4px', color: '#3b82f6', fontWeight: 800, fontSize: 11, letterSpacing: 3 }}>CONTROL DE ACCESO</p>
        <h2 style={{ margin: 0, color: C.text, fontSize: 22, fontWeight: 900 }}>🛡️ Matriz de Permisos</h2>
        <p style={{ color: C.textMuted, fontSize: 13, marginTop: 8 }}>Control granular de acceso por módulo y rol. Haga clic para activar o desactivar permisos.</p>
      </div>
      {/* Leyenda */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        {roles.map(r => (
          <div key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: r.color }} />
            <span style={{ color: C.textSub, fontSize: 13, fontWeight: 600 }}>{r.label}</span>
          </div>
        ))}
      </div>
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', borderBottom: `1px solid ${C.border}`, width: 200 }}>Módulo</th>
                {roles.map(r => (
                  <th key={r.key} style={{ padding: '14px 20px', textAlign: 'center', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ background: r.color + '20', color: r.color, border: `1px solid ${r.color}40`, borderRadius: 8, padding: '4px 14px', fontSize: 12, fontWeight: 700 }}>{r.label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}`, transition: 'background .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>{row.emoji} {row.modulo}</span>
                  </td>
                  {roles.map(r => {
                    const val = row[r.key as keyof PermRow] as boolean;
                    const isAdmin = r.key === 'admin';
                    return (
                      <td key={r.key} style={{ padding: '14px 20px', textAlign: 'center' }}>
                        <button onClick={() => !isAdmin && toggle(row.modulo, r.key as keyof PermRow)}
                          style={{ width: 40, height: 24, borderRadius: 12, border: 'none', cursor: isAdmin ? 'not-allowed' : 'pointer', background: val ? r.color : '#1e293b', transition: 'all .2s', position: 'relative', display: 'inline-block', opacity: isAdmin ? .7 : 1 }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: val ? 19 : 3, transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.4)' }} />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: C.textMuted, fontSize: 12 }}>🔒 El rol Admin siempre tiene acceso completo y no puede ser modificado.</span>
        </div>
      </Card>
    </div>
  );
}

// ── Clientes ──────────────────────────────────────────────────────────────────
function Clientes({ data, setData, show }: { data: Cliente[]; setData: React.Dispatch<React.SetStateAction<Cliente[]>>; show: (t: Toast['type'], m: string) => void }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Cliente> } | null>(null);
  const [search, setSearch] = useState('');
  const [f, setF] = useState<Partial<Cliente>>({});
  const filtered = data.filter(c => c.nombre_cliente.toLowerCase().includes(search.toLowerCase()));
  const save = () => {
    if (modal?.mode === 'new') { setData(p => [...p, { ...f, id_cliente: p.length + 1 } as Cliente]); show('success', 'Cliente creado'); }
    else { setData(p => p.map(c => c.id_cliente === f.id_cliente ? { ...c, ...f } : c)); show('info', 'Cliente actualizado'); }
    setModal(null);
  };
  const open = (item: Partial<Cliente>) => { setF(item); setModal({ mode: item.id_cliente ? 'edit' : 'new', item }); };
  return (
    <div>
      <SecHeader title="🏢 Clientes" onAdd={() => open({})} addLabel="Nuevo Cliente" />
      <Card>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 10 }}>
          <span style={{ color: C.textMuted }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..." style={{ background: 'none', border: 'none', color: C.text, fontSize: 14, outline: 'none', flex: 1 }} />
        </div>
        <Tabla headers={['ID', 'Empresa', 'Contacto', 'Dirección', 'Acciones']}
          rows={filtered.map(c => [
            <span style={{ color: C.blueLight }}>#{c.id_cliente}</span>,
            <strong>{c.nombre_cliente}</strong>,
            c.contacto_emergencia || '—', c.direccion || '—',
            <RowActions onEdit={() => open(c)} onDel={() => { setData(p => p.filter(x => x.id_cliente !== c.id_cliente)); show('error', 'Cliente eliminado'); }} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nuevo Cliente' : 'Editar Cliente'} onClose={() => setModal(null)}>
          <Fld label="Nombre del cliente / empresa"><Inp value={f.nombre_cliente || ''} onChange={e => setF(p => ({ ...p, nombre_cliente: e.target.value }))} /></Fld>
          <G2>
            <Fld label="Teléfono emergencia"><Inp value={f.contacto_emergencia || ''} onChange={e => setF(p => ({ ...p, contacto_emergencia: e.target.value }))} /></Fld>
            <Fld label="Dirección"><Inp value={f.direccion || ''} onChange={e => setF(p => ({ ...p, direccion: e.target.value }))} /></Fld>
          </G2>
          {footerActions(() => setModal(null), save)}
        </Modal>
      )}
    </div>
  );
}

// ── Servicios ─────────────────────────────────────────────────────────────────
function Servicios({ data, setData, clientes, show }: { data: Servicio[]; setData: React.Dispatch<React.SetStateAction<Servicio[]>>; clientes: Cliente[]; show: (t: Toast['type'], m: string) => void }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Servicio> } | null>(null);
  const [f, setF] = useState<Partial<Servicio>>({});
  const TIPOS = ['Limpieza Profunda', 'Limpieza Diaria', 'Desinfección', 'Mantenimiento', 'Limpieza de Vidrios', 'Higiene Industrial'];
  const save = () => {
    const cli = clientes.find(c => c.id_cliente === Number(f.id_cliente))?.nombre_cliente || '';
    if (modal?.mode === 'new') { setData(p => [...p, { ...f, id_servicio: p.length + 1, cliente: cli } as Servicio]); show('success', 'Servicio registrado'); }
    else { setData(p => p.map(s => s.id_servicio === f.id_servicio ? { ...s, ...f, cliente: cli } : s)); show('info', 'Servicio actualizado'); }
    setModal(null);
  };
  const open = (item: Partial<Servicio>) => { setF(item); setModal({ mode: item.id_servicio ? 'edit' : 'new', item }); };
  return (
    <div>
      <SecHeader title="🧹 Servicios" onAdd={() => open({ id_cliente: clientes[0]?.id_cliente, tipo_servicio: TIPOS[0] })} addLabel="Nuevo Servicio" />
      <Card>
        <Tabla headers={['ID', 'Cliente', 'Tipo', 'Inicio', 'Fin', 'Costo (Bs)', 'Estado', 'Acciones']}
          rows={data.map(s => [
            <span style={{ color: C.blueLight }}>#{s.id_servicio}</span>,
            <strong>{s.cliente}</strong>,
            s.tipo_servicio, s.fecha_inicio, s.fecha_final || '—',
            <span style={{ color: C.green, fontWeight: 700 }}>Bs {Number(s.costo).toLocaleString()}</span>,
            <Badge text={s.fecha_final ? 'Finalizado' : 'Activo'} color={s.fecha_final ? 'yellow' : 'green'} />,
            <RowActions onEdit={() => open(s)} onDel={() => { setData(p => p.filter(x => x.id_servicio !== s.id_servicio)); show('error', 'Servicio eliminado'); }} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nuevo Servicio' : 'Editar Servicio'} onClose={() => setModal(null)}>
          <G2>
            <Fld label="Cliente"><Sel value={f.id_cliente} onChange={e => setF(p => ({ ...p, id_cliente: Number(e.target.value) }))}>{clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre_cliente}</option>)}</Sel></Fld>
            <Fld label="Tipo"><Sel value={f.tipo_servicio} onChange={e => setF(p => ({ ...p, tipo_servicio: e.target.value }))}>{TIPOS.map(t => <option key={t}>{t}</option>)}</Sel></Fld>
            <Fld label="Fecha inicio"><Inp value={f.fecha_inicio || ''} onChange={e => setF(p => ({ ...p, fecha_inicio: e.target.value }))} type="date" /></Fld>
            <Fld label="Fecha fin"><Inp value={f.fecha_final || ''} onChange={e => setF(p => ({ ...p, fecha_final: e.target.value || null }))} type="date" /></Fld>
            <Fld label="Costo (Bs)"><Inp value={f.costo || ''} onChange={e => setF(p => ({ ...p, costo: Number(e.target.value) }))} type="number" /></Fld>
            <Fld label="Descripción"><Inp value={f.descripcion || ''} onChange={e => setF(p => ({ ...p, descripcion: e.target.value }))} /></Fld>
          </G2>
          {footerActions(() => setModal(null), save)}
        </Modal>
      )}
    </div>
  );
}

// ── Maquinaria ────────────────────────────────────────────────────────────────
function Maquinaria({ data, setData, show }: { data: Maquina[]; setData: React.Dispatch<React.SetStateAction<Maquina[]>>; show: (t: Toast['type'], m: string) => void }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Maquina> } | null>(null);
  const [f, setF] = useState<Partial<Maquina>>({});
  const TIPOS = ['Aspirado', 'Fregado', 'Presión', 'Pulido', 'Nebulizado'];
  const ESTADOS = ['Operativo', 'Mantenimiento', 'Fuera de servicio'];
  const save = () => {
    if (modal?.mode === 'new') { setData(p => [...p, { ...f, id_maquinaria: p.length + 1 } as Maquina]); show('success', 'Máquina registrada'); }
    else { setData(p => p.map(m => m.id_maquinaria === f.id_maquinaria ? { ...m, ...f } : m)); show('info', 'Máquina actualizada'); }
    setModal(null);
  };
  return (
    <div>
      <SecHeader title="⚙️ Maquinaria" onAdd={() => { setF({ tipo: TIPOS[0], estado: 'Operativo' }); setModal({ mode: 'new', item: {} }); }} addLabel="Nueva Máquina" />
      <Card>
        <Tabla headers={['Código', 'Nombre', 'Tipo', 'Proveedor', 'Estado', 'Acciones']}
          rows={data.map(m => [
            <span style={{ color: C.blueLight, fontFamily: 'monospace' }}>{m.codigo_inv}</span>,
            <strong>{m.nombre_maquinaria}</strong>,
            m.tipo, m.proveedor,
            <Badge text={m.estado} color={m.estado === 'Operativo' ? 'green' : m.estado === 'Mantenimiento' ? 'yellow' : 'red'} />,
            <RowActions onEdit={() => { setF(m); setModal({ mode: 'edit', item: m }); }} onDel={() => { setData(p => p.filter(x => x.id_maquinaria !== m.id_maquinaria)); show('error', 'Máquina eliminada'); }} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nueva Máquina' : 'Editar Máquina'} onClose={() => setModal(null)}>
          <G2>
            <Fld label="Nombre"><Inp value={f.nombre_maquinaria || ''} onChange={e => setF(p => ({ ...p, nombre_maquinaria: e.target.value }))} /></Fld>
            <Fld label="Código inv."><Inp value={f.codigo_inv || ''} onChange={e => setF(p => ({ ...p, codigo_inv: e.target.value }))} /></Fld>
            <Fld label="Tipo"><Sel value={f.tipo} onChange={e => setF(p => ({ ...p, tipo: e.target.value }))}>{TIPOS.map(t => <option key={t}>{t}</option>)}</Sel></Fld>
            <Fld label="Estado"><Sel value={f.estado} onChange={e => setF(p => ({ ...p, estado: e.target.value }))}>{ESTADOS.map(s => <option key={s}>{s}</option>)}</Sel></Fld>
            <Fld label="Proveedor"><Inp value={f.proveedor || ''} onChange={e => setF(p => ({ ...p, proveedor: e.target.value }))} /></Fld>
            <Fld label="Descripción"><Inp value={f.descripcion || ''} onChange={e => setF(p => ({ ...p, descripcion: e.target.value }))} /></Fld>
          </G2>
          {footerActions(() => setModal(null), save)}
        </Modal>
      )}
    </div>
  );
}

// ── Proveedores ───────────────────────────────────────────────────────────────
function Proveedores({ data, setData, show }: { data: Proveedor[]; setData: React.Dispatch<React.SetStateAction<Proveedor[]>>; show: (t: Toast['type'], m: string) => void }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Proveedor> } | null>(null);
  const [f, setF] = useState<Partial<Proveedor>>({});
  const TIPOS = ['Químicos', 'Utensilios', 'Maquinaria', 'Uniformes', 'Consumibles'];
  const save = () => {
    if (modal?.mode === 'new') { setData(p => [...p, { ...f, id_proveedor: p.length + 1 } as Proveedor]); show('success', 'Proveedor registrado'); }
    else { setData(p => p.map(pr => pr.id_proveedor === f.id_proveedor ? { ...pr, ...f } as Proveedor : pr)); show('info', 'Proveedor actualizado'); }
    setModal(null);
  };
  return (
    <div>
      <SecHeader title="🚚 Proveedores" onAdd={() => { setF({ producto: TIPOS[0] }); setModal({ mode: 'new', item: {} }); }} addLabel="Nuevo Proveedor" />
      <Card>
        <Tabla headers={['ID', 'Nombre', 'NIT', 'Empresa', 'Producto', 'Acciones']}
          rows={data.map(p => [
            <span style={{ color: C.blueLight }}>#{p.id_proveedor}</span>,
            <strong>{p.nombre}</strong>, p.nit, p.empresa,
            <Badge text={p.producto} color="blue" />,
            <RowActions onEdit={() => { setF(p); setModal({ mode: 'edit', item: p }); }} onDel={() => { setData(prev => prev.filter(x => x.id_proveedor !== p.id_proveedor)); show('error', 'Proveedor eliminado'); }} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nuevo Proveedor' : 'Editar Proveedor'} onClose={() => setModal(null)}>
          <G2>
            <Fld label="Nombre"><Inp value={f.nombre || ''} onChange={e => setF(p => ({ ...p, nombre: e.target.value }))} /></Fld>
            <Fld label="NIT"><Inp value={f.nit || ''} onChange={e => setF(p => ({ ...p, nit: Number(e.target.value) }))} type="number" /></Fld>
            <Fld label="Empresa"><Inp value={f.empresa || ''} onChange={e => setF(p => ({ ...p, empresa: e.target.value }))} /></Fld>
            <Fld label="Tipo producto"><Sel value={f.producto} onChange={e => setF(p => ({ ...p, producto: e.target.value }))}>{TIPOS.map(t => <option key={t}>{t}</option>)}</Sel></Fld>
          </G2>
          {footerActions(() => setModal(null), save)}
        </Modal>
      )}
    </div>
  );
}

// ── Mantenimientos ────────────────────────────────────────────────────────────
function Mantenimientos({ data, setData, maquinaria, show }: { data: Mantenimiento[]; setData: React.Dispatch<React.SetStateAction<Mantenimiento[]>>; maquinaria: Maquina[]; show: (t: Toast['type'], m: string) => void }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Mantenimiento> } | null>(null);
  const [f, setF] = useState<Partial<Mantenimiento>>({});
  const save = () => {
    if (modal?.mode === 'new') { setData(p => [...p, { ...f, id_mantenimiento: p.length + 1 } as Mantenimiento]); show('success', 'Mantenimiento registrado'); }
    else { setData(p => p.map(m => m.id_mantenimiento === f.id_mantenimiento ? { ...m, ...f } : m)); show('info', 'Mantenimiento actualizado'); }
    setModal(null);
  };
  return (
    <div>
      <SecHeader title="🔧 Mantenimientos" onAdd={() => { setF({ maquinaria: maquinaria[0]?.nombre_maquinaria }); setModal({ mode: 'new', item: {} }); }} addLabel="Registrar" />
      <Card>
        <Tabla headers={['ID', 'Maquinaria', 'Fecha', 'Descripción', 'Costo', 'Acciones']}
          rows={data.map(m => [
            <span style={{ color: C.blueLight }}>#{m.id_mantenimiento}</span>,
            <strong>{m.maquinaria}</strong>, m.fecha_mantenimiento, m.descripcion || '—',
            <span style={{ color: C.green, fontWeight: 700 }}>Bs {Number(m.costo).toLocaleString()}</span>,
            <RowActions onEdit={() => { setF(m); setModal({ mode: 'edit', item: m }); }} onDel={() => { setData(p => p.filter(x => x.id_mantenimiento !== m.id_mantenimiento)); show('error', 'Registro eliminado'); }} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title="Mantenimiento" onClose={() => setModal(null)}>
          <G2>
            <Fld label="Maquinaria"><Sel value={f.maquinaria} onChange={e => setF(p => ({ ...p, maquinaria: e.target.value }))}>{maquinaria.map(m => <option key={m.id_maquinaria}>{m.nombre_maquinaria}</option>)}</Sel></Fld>
            <Fld label="Fecha"><Inp value={f.fecha_mantenimiento || ''} onChange={e => setF(p => ({ ...p, fecha_mantenimiento: e.target.value }))} type="date" /></Fld>
            <Fld label="Costo (Bs)"><Inp value={f.costo || ''} onChange={e => setF(p => ({ ...p, costo: Number(e.target.value) }))} type="number" /></Fld>
            <Fld label="Descripción"><Inp value={f.descripcion || ''} onChange={e => setF(p => ({ ...p, descripcion: e.target.value }))} /></Fld>
          </G2>
          {footerActions(() => setModal(null), save)}
        </Modal>
      )}
    </div>
  );
}

// ── Incidentes ────────────────────────────────────────────────────────────────
function Incidentes({ data, setData, servicios, show }: { data: Incidente[]; setData: React.Dispatch<React.SetStateAction<Incidente[]>>; servicios: Servicio[]; show: (t: Toast['type'], m: string) => void }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Incidente> } | null>(null);
  const [f, setF] = useState<Partial<Incidente>>({});
  const save = () => {
    if (modal?.mode === 'new') { setData(p => [...p, { ...f, id_incidente: p.length + 1 } as Incidente]); show('warning', 'Incidente registrado'); }
    else { setData(p => p.map(i => i.id_incidente === f.id_incidente ? { ...i, ...f } : i)); show('info', 'Incidente actualizado'); }
    setModal(null);
  };
  return (
    <div>
      <SecHeader title="⚠️ Incidentes" onAdd={() => { setF({ servicio: servicios[0]?.cliente }); setModal({ mode: 'new', item: {} }); }} addLabel="Registrar Incidente" />
      <Card>
        <Tabla headers={['ID', 'Servicio', 'Descripción', 'Fecha', 'Acciones']}
          rows={data.map(i => [
            <span style={{ color: '#f87171' }}>#{i.id_incidente}</span>,
            <strong>{i.servicio}</strong>, i.descripcion, i.fecha,
            <RowActions onEdit={() => { setF(i); setModal({ mode: 'edit', item: i }); }} onDel={() => { setData(p => p.filter(x => x.id_incidente !== i.id_incidente)); show('error', 'Incidente eliminado'); }} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title="Incidente" onClose={() => setModal(null)}>
          <Fld label="Servicio"><Sel value={f.servicio} onChange={e => setF(p => ({ ...p, servicio: e.target.value }))}>{servicios.map(s => <option key={s.id_servicio}>{s.cliente} — {s.tipo_servicio}</option>)}</Sel></Fld>
          <G2>
            <Fld label="Fecha"><Inp value={f.fecha || ''} onChange={e => setF(p => ({ ...p, fecha: e.target.value }))} type="date" /></Fld>
            <Fld label="Descripción"><Inp value={f.descripcion || ''} onChange={e => setF(p => ({ ...p, descripcion: e.target.value }))} /></Fld>
          </G2>
          {footerActions(() => setModal(null), save)}
        </Modal>
      )}
    </div>
  );
}

// ── Horarios ──────────────────────────────────────────────────────────────────
function Horarios({ data, setData, show }: { data: Horario[]; setData: React.Dispatch<React.SetStateAction<Horario[]>>; show: (t: Toast['type'], m: string) => void }) {
  const [modal, setModal] = useState<boolean>(false);
  const [f, setF] = useState<Partial<Horario>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const NAMES = ['Turno Mañana', 'Turno Tarde', 'Turno Noche', 'Turno Extra 1', 'Turno Extra 2'];
  const save = () => {
    if (!editId) { setData(p => [...p, { ...f, id_horario: p.length + 1 } as Horario]); show('success', 'Horario creado'); }
    else { setData(p => p.map(h => h.id_horario === editId ? { ...h, ...f } : h)); show('info', 'Horario actualizado'); }
    setModal(false); setEditId(null);
  };
  return (
    <div>
      <SecHeader title="🕐 Horarios" onAdd={() => { setF({}); setEditId(null); setModal(true); }} addLabel="Nuevo Horario" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
        {data.map((h, i) => (
          <div key={h.id_horario} style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#0070f3'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; }}>
            <p style={{ margin: '0 0 4px', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{NAMES[i] || `Turno ${i + 1}`}</p>
            <p style={{ margin: '0 0 16px', color: C.text, fontSize: 24, fontWeight: 900 }}>{h.hora_entrada} – {h.hora_salida}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn sm variant="ghost" onClick={() => { setF(h); setEditId(h.id_horario); setModal(true); }}>✏️ Editar</Btn>
              <Btn sm variant="danger" onClick={() => { setData(p => p.filter(x => x.id_horario !== h.id_horario)); show('error', 'Horario eliminado'); }}>🗑️</Btn>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title="Horario" onClose={() => setModal(false)}>
          <G2>
            <Fld label="Hora entrada"><Inp value={f.hora_entrada || ''} onChange={e => setF(p => ({ ...p, hora_entrada: e.target.value }))} type="time" /></Fld>
            <Fld label="Hora salida"><Inp value={f.hora_salida || ''} onChange={e => setF(p => ({ ...p, hora_salida: e.target.value }))} type="time" /></Fld>
          </G2>
          {footerActions(() => setModal(false), save)}
        </Modal>
      )}
    </div>
  );
}

// ── Recursos ──────────────────────────────────────────────────────────────────
function Recursos({ data, setData, proveedores, show }: { data: Recurso[]; setData: React.Dispatch<React.SetStateAction<Recurso[]>>; proveedores: Proveedor[]; show: (t: Toast['type'], m: string) => void }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Recurso> } | null>(null);
  const [f, setF] = useState<Partial<Recurso>>({});
  const TIPOS = ['Químico', 'Utensilio', 'Accesorio', 'Consumible'];
  const save = () => {
    if (modal?.mode === 'new') { setData(p => [...p, { ...f, id_recurso: p.length + 1 } as Recurso]); show('success', 'Recurso creado'); }
    else { setData(p => p.map(r => r.id_recurso === f.id_recurso ? { ...r, ...f } : r)); show('info', 'Recurso actualizado'); }
    setModal(null);
  };
  return (
    <div>
      <SecHeader title="🧴 Recursos" onAdd={() => { setF({ tipo: TIPOS[0] }); setModal({ mode: 'new', item: {} }); }} addLabel="Nuevo Recurso" />
      <Card>
        <Tabla headers={['ID', 'Nombre', 'Tipo', 'Proveedor', 'Descripción', 'Acciones']}
          rows={data.map(r => [
            <span style={{ color: C.blueLight }}>#{r.id_recurso}</span>,
            <strong>{r.nombre}</strong>,
            <Badge text={r.tipo} color="blue" />,
            r.proveedor, r.descripcion || '—',
            <RowActions onEdit={() => { setF(r); setModal({ mode: 'edit', item: r }); }} onDel={() => { setData(p => p.filter(x => x.id_recurso !== r.id_recurso)); show('error', 'Recurso eliminado'); }} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nuevo Recurso' : 'Editar Recurso'} onClose={() => setModal(null)}>
          <G2>
            <Fld label="Nombre"><Inp value={f.nombre || ''} onChange={e => setF(p => ({ ...p, nombre: e.target.value }))} /></Fld>
            <Fld label="Tipo"><Sel value={f.tipo} onChange={e => setF(p => ({ ...p, tipo: e.target.value }))}>{TIPOS.map(t => <option key={t}>{t}</option>)}</Sel></Fld>
            <Fld label="Proveedor"><Sel value={f.proveedor} onChange={e => setF(p => ({ ...p, proveedor: e.target.value }))}>{proveedores.map(pr => <option key={pr.id_proveedor}>{pr.nombre}</option>)}</Sel></Fld>
            <Fld label="Descripción"><Inp value={f.descripcion || ''} onChange={e => setF(p => ({ ...p, descripcion: e.target.value }))} /></Fld>
          </G2>
          {footerActions(() => setModal(null), save)}
        </Modal>
      )}
    </div>
  );
}

// ── Uniformes ─────────────────────────────────────────────────────────────────
function Uniformes({ uniforms, setUniforms, asig, setAsig, empleados, show }: { uniforms: Uniforme[]; setUniforms: React.Dispatch<React.SetStateAction<Uniforme[]>>; asig: AsignacionUniforme[]; setAsig: React.Dispatch<React.SetStateAction<AsignacionUniforme[]>>; empleados: Empleado[]; show: (t: Toast['type'], m: string) => void }) {
  const [tab, setTab] = useState<'catalogo' | 'asignaciones'>('catalogo');
  const [f, setF] = useState<Record<string, unknown>>({});
  const [modal, setModal] = useState<{ type: string; mode: 'new' | 'edit' } | null>(null);
  const saveUni = () => { if (modal?.mode === 'new') { setUniforms(p => [...p, { ...f, id_uniforme: p.length + 1 } as Uniforme]); show('success', 'Uniforme creado'); } else { setUniforms(p => p.map(u => u.id_uniforme === f.id_uniforme ? { ...u, ...f } as Uniforme : u)); show('info', 'Uniforme actualizado'); } setModal(null); };
  const saveAsig = () => { if (modal?.mode === 'new') { setAsig(p => [...p, { ...f, id: p.length + 1 } as AsignacionUniforme]); show('success', 'Asignación registrada'); } else { setAsig(p => p.map(a => a.id === f.id ? { ...a, ...f } as AsignacionUniforme : a)); show('info', 'Asignación actualizada'); } setModal(null); };
  return (
    <div>
      <SecHeader title="👕 Uniformes" onAdd={() => { setF(tab === 'catalogo' ? {} : { usuario: empleados[0]?.nombre_usuario, uniforme: uniforms[0]?.nombre_uniforme, estado: 'Entregado' }); setModal({ type: tab, mode: 'new' }); }} addLabel={tab === 'catalogo' ? 'Nuevo Uniforme' : 'Nueva Asignación'} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['catalogo', 'asignaciones'] as const).map(t => <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: tab === t ? C.blue : 'rgba(255,255,255,.05)', color: tab === t ? '#fff' : C.textMuted, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>{t === 'catalogo' ? '📦 Catálogo' : '👕 Asignaciones'}</button>)}
      </div>
      {tab === 'catalogo' && <Card><Tabla headers={['ID', 'Nombre', 'Talla', 'Descripción', 'Acciones']} rows={uniforms.map(u => [<span style={{ color: C.blueLight }}>#{u.id_uniforme}</span>, <strong>{u.nombre_uniforme}</strong>, u.talla, u.descripcion || '—', <RowActions onEdit={() => { setF(u as unknown as Record<string, unknown>); setModal({ type: 'catalogo', mode: 'edit' }); }} onDel={() => { setUniforms(p => p.filter(x => x.id_uniforme !== u.id_uniforme)); show('error', 'Uniforme eliminado'); }} />])} /></Card>}
      {tab === 'asignaciones' && <Card><Tabla headers={['ID', 'Empleado', 'Uniforme', 'Entrega', 'Estado', 'Acciones']} rows={asig.map(a => [<span style={{ color: C.blueLight }}>#{a.id}</span>, a.usuario, a.uniforme, a.fecha_entrega, <Badge text={a.estado} color={a.estado === 'Entregado' ? 'green' : 'blue'} />, <RowActions onEdit={() => { setF(a as unknown as Record<string, unknown>); setModal({ type: 'asignaciones', mode: 'edit' }); }} onDel={() => { setAsig(p => p.filter(x => x.id !== a.id)); show('error', 'Asignación eliminada'); }} />])} /></Card>}
      {modal && (
        <Modal title={modal.type === 'catalogo' ? 'Uniforme' : 'Asignación de Uniforme'} onClose={() => setModal(null)}>
          {modal.type === 'catalogo' ? (
            <><G2><Fld label="Nombre"><Inp value={String(f.nombre_uniforme || '')} onChange={e => setF(p => ({ ...p, nombre_uniforme: e.target.value }))} /></Fld><Fld label="Talla"><Inp value={String(f.talla || '')} onChange={e => setF(p => ({ ...p, talla: Number(e.target.value) }))} type="number" /></Fld><Fld label="Descripción"><Inp value={String(f.descripcion || '')} onChange={e => setF(p => ({ ...p, descripcion: e.target.value }))} /></Fld></G2>{footerActions(() => setModal(null), saveUni)}</>
          ) : (
            <><G2><Fld label="Empleado"><Sel value={String(f.usuario || '')} onChange={e => setF(p => ({ ...p, usuario: e.target.value }))}>{empleados.map(e => <option key={e.id_usuario}>{e.nombre_usuario}</option>)}</Sel></Fld><Fld label="Uniforme"><Sel value={String(f.uniforme || '')} onChange={e => setF(p => ({ ...p, uniforme: e.target.value }))}>{uniforms.map(u => <option key={u.id_uniforme}>{u.nombre_uniforme}</option>)}</Sel></Fld><Fld label="Fecha entrega"><Inp value={String(f.fecha_entrega || '')} onChange={e => setF(p => ({ ...p, fecha_entrega: e.target.value }))} type="date" /></Fld><Fld label="Estado"><Sel value={String(f.estado || '')} onChange={e => setF(p => ({ ...p, estado: e.target.value }))}>{['Entregado', 'Devuelto', 'Extraviado'].map(s => <option key={s}>{s}</option>)}</Sel></Fld></G2>{footerActions(() => setModal(null), saveAsig)}</>
          )}
        </Modal>
      )}
    </div>
  );
}

// ── Terminados ────────────────────────────────────────────────────────────────
function ServiciosTerminados({ data }: { data: ServicioTerminado[] }) {
  const sat = (s: string) => s === 'Excelente' ? 'green' : s === 'Bueno' ? 'blue' : 'yellow';
  return (
    <div>
      <SecHeader title="✅ Servicios Terminados" />
      <Card><Tabla headers={['ID', 'Servicio', 'Satisfacción', 'Comentarios']} rows={data.map(s => [<span style={{ color: C.blueLight }}>#{s.id}</span>, <strong>{s.servicio}</strong>, <Badge text={s.satisfaccion} color={sat(s.satisfaccion)} />, <span style={{ color: C.textSub, fontStyle: 'italic' }}>{s.comentarios || '—'}</span>])} /></Card>
    </div>
  );
}

// ── Navegación ────────────────────────────────────────────────────────────────
type NavId = 'dashboard' | 'empleados' | 'roles' | 'uniformes' | 'capacitaciones' | 'horarios' | 'clientes' | 'servicios' | 'terminados' | 'incidentes' | 'maquinaria' | 'mantenimientos' | 'recursos' | 'proveedores' | 'permisos';
const NAV: { id: NavId; label: string; emoji: string; group: string }[] = [
  { id: 'dashboard',      label: 'Panel de Control',  emoji: '📊', group: 'General' },
  { id: 'empleados',      label: 'Empleados',          emoji: '👥', group: 'Recursos Humanos' },
  { id: 'roles',          label: 'Roles',              emoji: '🛡️', group: 'Recursos Humanos' },
  { id: 'uniformes',      label: 'Uniformes',          emoji: '👕', group: 'Recursos Humanos' },
  { id: 'capacitaciones', label: 'Capacitaciones',     emoji: '📚', group: 'Recursos Humanos' },
  { id: 'horarios',       label: 'Horarios',           emoji: '🕐', group: 'Recursos Humanos' },
  { id: 'clientes',       label: 'Clientes',           emoji: '🏢', group: 'Operaciones' },
  { id: 'servicios',      label: 'Servicios',          emoji: '🧹', group: 'Operaciones' },
  { id: 'terminados',     label: 'Terminados',         emoji: '✅', group: 'Operaciones' },
  { id: 'incidentes',     label: 'Incidentes',         emoji: '⚠️', group: 'Operaciones' },
  { id: 'maquinaria',     label: 'Maquinaria',         emoji: '⚙️', group: 'Activos' },
  { id: 'mantenimientos', label: 'Mantenimientos',     emoji: '🔧', group: 'Activos' },
  { id: 'recursos',       label: 'Recursos',           emoji: '🧴', group: 'Activos' },
  { id: 'proveedores',    label: 'Proveedores',        emoji: '🚚', group: 'Activos' },
  { id: 'permisos',       label: 'Permisos',           emoji: '🛡️', group: 'Sistema' },
];

// ── Componente principal ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const { toasts, show } = useToast();
  const [active, setActive] = useState<NavId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [readAlerts, setReadAlerts]   = useState<Set<string>>(new Set());
  const [now, setNow] = useState('');

  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }));
    tick();
    const t = setInterval(tick, 60000);
    return () => clearInterval(t);
  }, []);

  const [empleados, setEmpleados] = useState<Empleado[]>(EMPLEADOS_INIT);
  const [roles] = useState<Role[]>(ROLES);
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES_INIT);
  const [servicios, setServicios] = useState<Servicio[]>(SERVICIOS_INIT);
  const [maquinaria, setMaquinaria] = useState<Maquina[]>(MAQUINARIA_INIT);
  const [recursos, setRecursos] = useState<Recurso[]>(RECURSOS_INIT);
  const [uniforms, setUniforms] = useState<Uniforme[]>(UNIFORMES_INIT);
  const [asigUni, setAsigUni] = useState<AsignacionUniforme[]>(ASIG_UNI_INIT);
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>(CAPACITACIONES_INIT);
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>(MANTENIMIENTOS_INIT);
  const [proveedores, setProveedores] = useState<Proveedor[]>(PROVEEDORES_INIT);
  const [incidentes, setIncidentes] = useState<Incidente[]>(INCIDENTES_INIT);
  const [horarios, setHorarios] = useState<Horario[]>(HORARIOS_INIT);
  const [terminados] = useState<ServicioTerminado[]>(TERMINADOS_INIT);
  const [permisos, setPermisos] = useState<PermRow[]>(PERMISOS_INIT);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  const groups = [...new Set(NAV.map(n => n.group))];
  const current = NAV.find(n => n.id === active)!;

  const alertItems = [
    ...maquinaria.filter(m => m.estado !== 'Operativo').map(m => ({ key: `maq-${m.id_maquinaria}`, icon: '⚙️', title: m.nombre_maquinaria, sub: m.estado,  color: C.yellow })),
    ...empleados.filter(e => !e.activo).map(e => ({ key: `emp-${e.id_usuario}`, icon: '👤', title: e.nombre_usuario, sub: 'Empleado inactivo', color: C.red })),
  ];
  const unreadAlerts = alertItems.filter(a => !readAlerts.has(a.key));
  const alerts = unreadAlerts.length;

  const openNotif = () => {
    setNotifOpen(p => {
      if (!p) setReadAlerts(new Set(alertItems.map(a => a.key)));
      return !p;
    });
  };

  const renderSection = () => {
    switch (active) {
      case 'dashboard':      return <Dashboard empleados={empleados} servicios={servicios} maquinaria={maquinaria} clientes={clientes} />;
      case 'empleados':      return <Empleados data={empleados} setData={setEmpleados} roles={roles} show={show} />;
      case 'roles':          return <Roles data={roles} setData={() => {}} empleados={empleados} show={show} />;
      case 'uniformes':      return <Uniformes uniforms={uniforms} setUniforms={setUniforms} asig={asigUni} setAsig={setAsigUni} empleados={empleados} show={show} />;
      case 'capacitaciones': return <Capacitaciones data={capacitaciones} setData={setCapacitaciones} empleados={empleados} show={show} />;
      case 'horarios':       return <Horarios data={horarios} setData={setHorarios} show={show} />;
      case 'clientes':       return <Clientes data={clientes} setData={setClientes} show={show} />;
      case 'servicios':      return <Servicios data={servicios} setData={setServicios} clientes={clientes} show={show} />;
      case 'terminados':     return <ServiciosTerminados data={terminados} />;
      case 'incidentes':     return <Incidentes data={incidentes} setData={setIncidentes} servicios={servicios} show={show} />;
      case 'maquinaria':     return <Maquinaria data={maquinaria} setData={setMaquinaria} show={show} />;
      case 'mantenimientos': return <Mantenimientos data={mantenimientos} setData={setMantenimientos} maquinaria={maquinaria} show={show} />;
      case 'recursos':       return <Recursos data={recursos} setData={setRecursos} proveedores={proveedores} show={show} />;
      case 'proveedores':    return <Proveedores data={proveedores} setData={setProveedores} show={show} />;
      case 'permisos':       return <Permisos data={permisos} setData={setPermisos} show={show} />;
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: C.bg, color: C.text, fontFamily: "'Inter','Segoe UI',sans-serif", overflow: 'hidden' }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: ${C.bg}; }
        #__next, [data-nextjs-scroll-focus-boundary] { width: 100%; height: 100%; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060d1a; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.4); }
        select option { background: #0f1e30; }
        button, input, textarea, select { font-family: inherit; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
      `}</style>

      <ToastContainer toasts={toasts} />

      {/* Sidebar */}
      <aside style={{ width: sidebarOpen ? 252 : 62, flexShrink: 0, background: C.sidebar, borderRight: `1px solid ${C.borderLight}`, display: 'flex', flexDirection: 'column', transition: 'width .25s ease', overflow: 'hidden' }}>
        {/* Logo */}
        <div style={{ padding: sidebarOpen ? '10px 14px' : '10px 8px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', minHeight: 70, gap: 10 }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#e8edf5', boxShadow: '0 2px 8px rgba(0,0,0,.3)' }}>
                <img src="/logo-icon.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 900, fontSize: 13, lineHeight: 1.2 }}>Markach'uxña</p>
                <p style={{ margin: 0, color: '#3b82f6', fontSize: 8.5, letterSpacing: 1.5, fontWeight: 700, textTransform: 'uppercase' }}>Multiservicios · Admin</p>
              </div>
            </div>
          ) : (
            <div style={{ width: 38, height: 38, borderRadius: 9, overflow: 'hidden', background: '#e8edf5', boxShadow: '0 2px 8px rgba(0,0,0,.3)', flexShrink: 0 }}>
              <img src="/logo-icon.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
          {groups.map(group => (
            <div key={group}>
              {sidebarOpen && <p style={{ margin: '14px 8px 4px', color: '#1e3a5f', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em' }}>{group}</p>}
              {NAV.filter(n => n.group === group).map(item => (
                <button key={item.id} onClick={() => setActive(item.id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: sidebarOpen ? '9px 12px' : '9px', borderRadius: 9, border: 'none',
                  background: active === item.id ? 'linear-gradient(135deg,rgba(0,112,243,.18),rgba(0,48,102,.18))' : 'none',
                  color: active === item.id ? '#60a5fa' : '#475569',
                  cursor: 'pointer', fontSize: 13, fontWeight: active === item.id ? 700 : 500,
                  marginBottom: 2, justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  borderLeft: active === item.id ? '2px solid #0070f3' : '2px solid transparent',
                  transition: 'all .15s',
                }}
                  onMouseEnter={e => { if (active !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,.04)'; }}
                  onMouseLeave={e => { if (active !== item.id) e.currentTarget.style.background = 'none'; }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{item.emoji}</span>
                  {sidebarOpen && item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Usuario */}
        <div style={{ padding: '10px 8px', borderTop: `1px solid ${C.borderLight}` }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'rgba(0,112,243,.06)', border: '1px solid rgba(0,112,243,.1)' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, fontWeight: 900 }}>M</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, color: C.text, fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>María López</p>
                <p style={{ margin: 0, color: '#3b82f6', fontSize: 10, fontWeight: 600 }}>Admin</p>
              </div>
              <button onClick={handleLogout} title="Cerrar sesión" style={{ background: 'rgba(239,68,68,.1)', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 15, borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⏻</button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18, padding: 8 }}>⏻</button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Header */}
        <header style={{ height: 64, background: C.sidebar, borderBottom: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(p => !p)} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4, borderRadius: 8 }}>☰</button>
          <div>
            <h1 style={{ margin: 0, color: C.text, fontSize: 17, fontWeight: 800 }}>{current.emoji} {current.label}</h1>
            <p style={{ margin: 0, color: '#334155', fontSize: 11 }}>{current.group}</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#334155', fontSize: 12, fontFamily: 'monospace' }}>🕐 {now}</span>
            <div style={{ width: 1, height: 22, background: C.border }} />
            {/* Campana notificaciones */}
            <div style={{ position: 'relative' }}>
              <button onClick={openNotif} style={{ position: 'relative', background: notifOpen ? 'rgba(0,112,243,.15)' : 'none', border: notifOpen ? '1px solid rgba(0,112,243,.3)' : '1px solid transparent', color: C.textMuted, cursor: 'pointer', fontSize: 18, borderRadius: 9, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                🔔
                {alerts > 0 && <span style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, background: '#ef4444', borderRadius: '50%', fontSize: 10, fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2s infinite' }}>{alerts}</span>}
              </button>
              {notifOpen && (
                <>
                  {/* Overlay para cerrar al hacer clic afuera */}
                  <div onClick={() => setNotifOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
                  <div style={{ position: 'absolute', right: 0, top: 44, background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 14, width: 320, boxShadow: '0 20px 60px rgba(0,0,0,.5)', zIndex: 100, animation: 'slideUp .2s ease', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: C.text, fontSize: 13 }}>🔔 Notificaciones</strong>
                      <button onClick={() => setNotifOpen(false)} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 2 }}>✕</button>
                    </div>
                    {alertItems.length === 0
                      ? <div style={{ padding: '24px 18px', textAlign: 'center', color: C.textMuted, fontSize: 13 }}>✅ Sin alertas activas</div>
                      : alertItems.map(a => (
                        <div key={a.key} style={{ padding: '12px 18px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 18, flexShrink: 0 }}>{a.icon}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, color: '#e2e8f0', fontSize: 12, fontWeight: 600 }}>{a.title}</p>
                            <p style={{ margin: 0, fontSize: 11, color: a.color }}>{a.sub}</p>
                          </div>
                          <span style={{ fontSize: 10, color: '#334155', fontWeight: 600 }}>VISTO</span>
                        </div>
                      ))
                    }
                    {alertItems.length > 0 && (
                      <div style={{ padding: '10px 18px', background: 'rgba(0,112,243,.05)', borderTop: `1px solid ${C.borderLight}` }}>
                        <p style={{ margin: 0, color: '#334155', fontSize: 11, textAlign: 'center' }}>Las alertas se marcan como leídas al abrir el panel</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <Badge text="ADMIN" color="blue" />
          </div>
        </header>

        {/* Contenido */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <div style={{ animation: 'slideUp .3s ease' }}>
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
