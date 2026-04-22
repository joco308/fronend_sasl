"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ─── TIPOS ────────────────────────────────────────────────────────────────
type Empleado = { id_usuario: number; nombre_usuario: string; correo: string; ci: number; rol: string; id_rol: number; fecha_nacimiento: string; genero: string; estado_civil: string; grado_academico: string; pais: string; };
type Role = { id_rol: number; nombre_rol: string; salario: number; };
type Cliente = { id_cliente: number; nombre_cliente: string; contacto_emergencia: string; direccion: string; };
type Servicio = { id_servicio: number; id_cliente: number; cliente: string; tipo_servicio: string; fecha_inicio: string; fecha_final: string | null; costo: number; descripcion: string; };
type Maquina = { id_maquinaria: number; nombre_maquinaria: string; codigo_inv: string; tipo: string; estado: string; proveedor: string; descripcion: string; };
type Recurso = { id_recurso: number; nombre: string; tipo: string; proveedor: string; descripcion: string; };
type Uniforme = { id_uniforme: number; nombre_uniforme: string; talla: number; descripcion: string; };
type AsignacionUniforme = { id: number; usuario: string; uniforme: string; fecha_entrega: string; fecha_devolucion: string | null; estado: string; };
type Capacitacion = { id_capacitacion: number; nombre: string; descripcion: string; fecha: string; };
type Mantenimiento = { id_mantenimiento: number; maquinaria: string; fecha_mantenimiento: string; descripcion: string; costo: number; };
type Proveedor = { id_proveedor: number; nombre: string; nit: number; empresa: string; producto: string; };
type Incidente = { id_incidente: number; servicio: string; descripcion: string; fecha: string; };
type Horario = { id_horario: number; hora_entrada: string; hora_salida: string; };
type ServicioTerminado = { id: number; servicio: string; satisfaccion: string; comentarios: string; };

// ─── DATOS MOCK (reemplazar con fetch a /api/... en producción) ───────────
const ROLES: Role[] = [
  { id_rol: 1, nombre_rol: 'Supervisor', salario: 3500 },
  { id_rol: 2, nombre_rol: 'Limpieza', salario: 2200 },
  { id_rol: 3, nombre_rol: 'Admin', salario: 5000 },
  
];
const EMPLEADOS_INIT: Empleado[] = [
  { id_usuario: 1, nombre_usuario: 'Carlos Mamani', correo: 'c.mamani@sasl.bo', ci: 7891234, id_rol: 1, rol: 'Supervisor', fecha_nacimiento: '1990-03-12', genero: 'Masculino', estado_civil: 'Casado', grado_academico: 'Licenciatura', pais: 'Bolivia' },
  { id_usuario: 2, nombre_usuario: 'Ana Torres', correo: 'a.torres@sasl.bo', ci: 6543210, id_rol: 2, rol: 'Limpieza', fecha_nacimiento: '1995-07-22', genero: 'Femenino', estado_civil: 'Soltera', grado_academico: 'Secundaria', pais: 'Bolivia' },
  { id_usuario: 3, nombre_usuario: 'Pedro Quispe', correo: 'p.quispe@sasl.bo', ci: 8765432, id_rol: 2, rol: 'Limpieza', fecha_nacimiento: '1988-11-05', genero: 'Masculino', estado_civil: 'Casado', grado_academico: 'Técnico', pais: 'Bolivia' },
  { id_usuario: 4, nombre_usuario: 'María López', correo: 'm.lopez@sasl.bo', ci: 5432109, id_rol: 3, rol: 'Admin', fecha_nacimiento: '1985-01-30', genero: 'Femenino', estado_civil: 'Divorciada', grado_academico: 'Maestría', pais: 'Bolivia' },
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
  { id_uniforme: 3, nombre_uniforme: 'Guantes de Nitrilo', talla: 8, descripcion: 'Caja x100' },
];
const ASIG_UNI_INIT: AsignacionUniforme[] = [
  { id: 1, usuario: 'Ana Torres', uniforme: 'Camisa Operativa', fecha_entrega: '2026-01-15', fecha_devolucion: null, estado: 'Entregado' },
  { id: 2, usuario: 'Pedro Quispe', uniforme: 'Pantalón de Trabajo', fecha_entrega: '2026-01-15', fecha_devolucion: null, estado: 'Entregado' },
];
const CAPACITACIONES_INIT: Capacitacion[] = [
  { id_capacitacion: 1, nombre: 'Manejo de Químicos', descripcion: 'Uso seguro de productos de limpieza', fecha: '2026-03-10' },
  { id_capacitacion: 2, nombre: 'Primeros Auxilios', descripcion: 'Atención básica en emergencias', fecha: '2026-04-05' },
  { id_capacitacion: 3, nombre: 'Protocolo Sanitario', descripcion: 'Medidas sanitarias vigentes', fecha: '2026-05-01' },
];
const MANTENIMIENTOS_INIT: Mantenimiento[] = [
  { id_mantenimiento: 1, maquinaria: 'Fregadora Automática F50', fecha_mantenimiento: '2026-04-10', descripcion: 'Revisión de motor y correas', costo: 350 },
  { id_mantenimiento: 2, maquinaria: 'Aspiradora Industrial X200', fecha_mantenimiento: '2026-03-20', descripcion: 'Cambio de filtros', costo: 120 },
];
const PROVEEDORES_INIT: Proveedor[] = [
  { id_proveedor: 1, nombre: 'SupliLimp SA', nit: 1234567, empresa: 'SupliLimp SA', producto: 'Químicos' },
  { id_proveedor: 2, nombre: 'CleanStore', nit: 7654321, empresa: 'CleanStore Bolivia', producto: 'Utensilios' },
  { id_proveedor: 3, nombre: 'CleanTech Bolivia', nit: 9876543, empresa: 'CleanTech SRL', producto: 'Maquinaria' },
];
const INCIDENTES_INIT: Incidente[] = [
  { id_incidente: 1, servicio: 'Hotel Europa', descripcion: 'Derrame de químico en pasillo', fecha: '2026-04-02' },
  { id_incidente: 2, servicio: 'Banco Nacional', descripcion: 'Equipo averiado durante servicio', fecha: '2026-04-08' },
];
const HORARIOS_INIT: Horario[] = [
  { id_horario: 1, hora_entrada: '06:00', hora_salida: '14:00' },
  { id_horario: 2, hora_entrada: '14:00', hora_salida: '22:00' },
  { id_horario: 3, hora_entrada: '22:00', hora_salida: '06:00' },
];
const TERMINADOS_INIT: ServicioTerminado[] = [
  { id: 1, servicio: 'Desinfección - Centro Médico Sur', satisfaccion: 'Excelente', comentarios: 'Trabajo impecable, muy puntuales' },
  { id: 2, servicio: 'Limpieza - Banco Nacional (Marzo)', satisfaccion: 'Bueno', comentarios: 'Buen servicio general' },
];

// ─── UTILIDADES UI ────────────────────────────────────────────────────────
const C = {
  bg: '#0f172a', bgAlt: '#0a1628', sidebar: '#070f1d',
  border: '#1e3a5f', borderLight: '#0f1e30',
  text: '#f1f5f9', textMuted: '#64748b', textSub: '#94a3b8',
  blue: '#1d4ed8', blueLight: '#60a5fa',
  green: '#4ade80', yellow: '#facc15', red: '#f87171',
  accent: '#003066',
};

const Badge = ({ text, color = 'blue' }: { text: string; color?: string }) => {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    green: { bg: 'rgba(34,197,94,.15)', color: '#4ade80', border: 'rgba(34,197,94,.3)' },
    yellow: { bg: 'rgba(234,179,8,.15)', color: '#facc15', border: 'rgba(234,179,8,.3)' },
    red: { bg: 'rgba(239,68,68,.15)', color: '#f87171', border: 'rgba(239,68,68,.3)' },
    blue: { bg: 'rgba(59,130,246,.15)', color: '#60a5fa', border: 'rgba(59,130,246,.3)' },
  };
  const s = map[color] || map.blue;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
      {text}
    </span>
  );
};

const Btn = ({ children, onClick, variant = 'primary', sm, disabled }: {
  children: React.ReactNode; onClick?: () => void; variant?: string; sm?: boolean; disabled?: boolean;
}) => {
  const v: Record<string, React.CSSProperties> = {
    primary: { background: 'linear-gradient(135deg,#003066,#1d4ed8)', color: '#fff', border: 'none' },
    danger: { background: 'rgba(239,68,68,.12)', color: '#f87171', border: '1px solid rgba(239,68,68,.3)' },
    ghost: { background: 'rgba(148,163,184,.08)', color: '#94a3b8', border: '1px solid #1e3a5f' },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...v[variant], padding: sm ? '6px 12px' : '10px 20px', borderRadius: 8, fontSize: sm ? 12 : 14, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, opacity: disabled ? .5 : 1 }}>
      {children}
    </button>
  );
};

const Inp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', ...props.style }} />
);

const Sel = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
  <select {...props} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
    {children}
  </select>
);

const Fld = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</label>
    {children}
  </div>
);

const G2 = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>{children}</div>
);

// Modal
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 'min(600px,95vw)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ margin: 0, color: C.text, fontSize: 18, fontWeight: 800 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

// Acciones de tabla
const RowActions = ({ onEdit, onDel }: { onEdit: () => void; onDel: () => void }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    <Btn sm variant="ghost" onClick={onEdit}>✏️</Btn>
    <Btn sm variant="danger" onClick={onDel}>🗑️</Btn>
  </div>
);

// Tabla genérica
const Tabla = ({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>{headers.map((h, i) => <th key={i} style={{ padding: '12px 16px', textAlign: 'left', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: 13 }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
    {rows.length === 0 && (
      <div style={{ padding: '40px', textAlign: 'center', color: C.textMuted, fontSize: 14 }}>Sin registros</div>
    )}
  </div>
);

// Card de sección
const Card = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
    {children}
  </div>
);

// Header de sección
const SecHeader = ({ title, onAdd, addLabel }: { title: string; onAdd?: () => void; addLabel?: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
    <h2 style={{ margin: 0, color: C.text, fontSize: 20, fontWeight: 800 }}>{title}</h2>
    {onAdd && <Btn onClick={onAdd}>＋ {addLabel || 'Nuevo'}</Btn>}
  </div>
);

const footerActions = (onCancel: () => void, onSave: () => void) => (
  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
    <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
    <Btn onClick={onSave}>Guardar</Btn>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// SECCIONES
// ═══════════════════════════════════════════════════════════════════════════

// ── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard({ empleados, servicios, maquinaria, clientes }: {
  empleados: Empleado[]; servicios: Servicio[]; maquinaria: Maquina[]; clientes: Cliente[];
}) {
  const ingresos = servicios.reduce((s, sv) => s + sv.costo, 0);
  const activos = servicios.filter(s => !s.fecha_final).length;
  return (
    <div>
      <SecHeader title="Resumen Operativo" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { l: 'Empleados', v: empleados.length, c: '#3b82f6', e: '👥' },
          { l: 'Servicios activos', v: activos, c: '#10b981', e: '🧹' },
          { l: 'Maquinaria', v: maquinaria.filter(m => m.estado === 'Operativo').length + '/' + maquinaria.length, c: '#f59e0b', e: '⚙️' },
          { l: 'Ingresos totales', v: 'Bs ' + ingresos.toLocaleString(), c: '#8b5cf6', e: '💰' },
          { l: 'Clientes', v: clientes.length, c: '#06b6d4', e: '🏢' },
        ].map(({ l, v, c, e }) => (
          <div key={l} style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -16, right: -16, width: 64, height: 64, borderRadius: '50%', background: c, opacity: .1 }} />
            <p style={{ margin: 0, color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</p>
            <p style={{ margin: '8px 0 0', color: C.text, fontSize: 26, fontWeight: 800 }}>{e} {v}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <div style={{ padding: '18px 20px', borderBottom: `1px solid ${C.borderLight}` }}>
            <strong style={{ color: C.textSub, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.07em' }}>Servicios recientes</strong>
          </div>
          {servicios.slice(0, 4).map(s => (
            <div key={s.id_servicio} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', borderBottom: `1px solid ${C.borderLight}` }}>
              <div>
                <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{s.cliente}</p>
                <p style={{ margin: 0, color: C.textMuted, fontSize: 11 }}>{s.tipo_servicio} · {s.fecha_inicio}</p>
              </div>
              <span style={{ color: C.green, fontWeight: 700, fontSize: 13 }}>Bs {s.costo.toLocaleString()}</span>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ padding: '18px 20px', borderBottom: `1px solid ${C.borderLight}` }}>
            <strong style={{ color: C.textSub, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.07em' }}>Estado de maquinaria</strong>
          </div>
          {maquinaria.map(m => (
            <div key={m.id_maquinaria} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: `1px solid ${C.borderLight}` }}>
              <div>
                <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{m.nombre_maquinaria}</p>
                <p style={{ margin: 0, color: C.textMuted, fontSize: 11 }}>{m.codigo_inv}</p>
              </div>
              <Badge text={m.estado} color={m.estado === 'Operativo' ? 'green' : 'yellow'} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── Empleados ──────────────────────────────────────────────────────────────
function Empleados({ data, setData, roles }: { data: Empleado[]; setData: React.Dispatch<React.SetStateAction<Empleado[]>>; roles: Role[] }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Empleado> } | null>(null);
  const [search, setSearch] = useState('');
  const filtered = data.filter(e => e.nombre_usuario.toLowerCase().includes(search.toLowerCase()) || e.correo.toLowerCase().includes(search.toLowerCase()));

  const blank: Partial<Empleado> = { nombre_usuario: '', correo: '', ci: 0, id_rol: 1, fecha_nacimiento: '', genero: 'Masculino', estado_civil: 'Soltero', grado_academico: 'Secundaria', pais: 'Bolivia' };

  const save = (f: Partial<Empleado>) => {
    const rolNombre = roles.find(r => r.id_rol === Number(f.id_rol))?.nombre_rol || '';
    if (modal?.mode === 'new') {
      setData(p => [...p, { ...f, id_usuario: p.length + 1, rol: rolNombre } as Empleado]);
    } else {
      setData(p => p.map(e => e.id_usuario === f.id_usuario ? { ...e, ...f, rol: rolNombre } : e));
    }
    setModal(null);
  };

  return (
    <div>
      <SecHeader title="Empleados" onAdd={() => setModal({ mode: 'new', item: blank })} addLabel="Nuevo Empleado" />
      <Card>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o correo..." style={{ background: 'none', border: 'none', color: C.text, fontSize: 14, outline: 'none', flex: 1 }} />
        </div>
        <Tabla
          headers={['ID', 'Nombre', 'Correo', 'CI', 'Rol', 'Nacimiento', 'Género', 'Acciones']}
          rows={filtered.map(e => [
            <span style={{ color: C.blueLight, fontWeight: 700 }}>#{e.id_usuario}</span>,
            <strong>{e.nombre_usuario}</strong>,
            e.correo, e.ci,
            <Badge text={e.rol} color="blue" />,
            e.fecha_nacimiento, e.genero,
            <RowActions onEdit={() => setModal({ mode: 'edit', item: e })} onDel={() => setData(p => p.filter(x => x.id_usuario !== e.id_usuario))} />,
          ])}
        />
      </Card>

      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nuevo Empleado' : 'Editar Empleado'} onClose={() => setModal(null)}>
          <EmpleadoForm initial={modal.item} roles={roles} onSave={save} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

function EmpleadoForm({ initial, roles, onSave, onCancel }: { initial: Partial<Empleado>; roles: Role[]; onSave: (f: Partial<Empleado>) => void; onCancel: () => void }) {
  const [f, setF] = useState<Partial<Empleado>>(initial);
  const s = (k: keyof Empleado, v: unknown) => setF(p => ({ ...p, [k]: v }));
  return (
    <>
      <G2>
        <Fld label="Nombre completo"><Inp value={f.nombre_usuario || ''} onChange={e => s('nombre_usuario', e.target.value)} /></Fld>
        <Fld label="Correo electrónico"><Inp value={f.correo || ''} onChange={e => s('correo', e.target.value)} type="email" /></Fld>
        <Fld label="CI (Cédula de Identidad)"><Inp value={f.ci || ''} onChange={e => s('ci', Number(e.target.value))} type="number" /></Fld>
        <Fld label="Fecha de nacimiento"><Inp value={f.fecha_nacimiento || ''} onChange={e => s('fecha_nacimiento', e.target.value)} type="date" /></Fld>
        <Fld label="Rol">
          <Sel value={f.id_rol} onChange={e => s('id_rol', Number(e.target.value))}>
            {roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.nombre_rol} — Bs {r.salario}</option>)}
          </Sel>
        </Fld>
        <Fld label="Género">
          <Sel value={f.genero} onChange={e => s('genero', e.target.value)}>
            {['Masculino', 'Femenino', 'Otro'].map(g => <option key={g}>{g}</option>)}
          </Sel>
        </Fld>
        <Fld label="Estado civil">
          <Sel value={f.estado_civil} onChange={e => s('estado_civil', e.target.value)}>
            {['Soltero', 'Casada', 'Casado', 'Divorciado', 'Divorciada', 'Viudo', 'Conviviente'].map(g => <option key={g}>{g}</option>)}
          </Sel>
        </Fld>
        <Fld label="Grado académico">
          <Sel value={f.grado_academico} onChange={e => s('grado_academico', e.target.value)}>
            {['Primaria', 'Secundaria', 'Técnico', 'Licenciatura', 'Maestría', 'Doctorado'].map(g => <option key={g}>{g}</option>)}
          </Sel>
        </Fld>
        <Fld label="País"><Inp value={f.pais || ''} onChange={e => s('pais', e.target.value)} /></Fld>
        {!initial.id_usuario && <Fld label="Contraseña temporal"><Inp type="password" placeholder="••••••••" /></Fld>}
      </G2>
      {footerActions(onCancel, () => onSave(f))}
    </>
  );
}

// ── Roles ──────────────────────────────────────────────────────────────────
function Roles({ data, setData, empleados }: { data: Role[]; setData: React.Dispatch<React.SetStateAction<Role[]>>; empleados: Empleado[] }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Role> } | null>(null);
  const [f, setF] = useState<Partial<Role>>({});
  const openNew = () => { setF({}); setModal({ mode: 'new', item: {} }); };
  const openEdit = (r: Role) => { setF(r); setModal({ mode: 'edit', item: r }); };
  const save = () => {
    if (modal?.mode === 'new') setData(p => [...p, { ...f, id_rol: p.length + 1 } as Role]);
    else setData(p => p.map(r => r.id_rol === f.id_rol ? { ...r, ...f } as Role : r));
    setModal(null);
  };
  return (
    <div>
      <SecHeader title="Roles y Salarios" onAdd={openNew} addLabel="Nuevo Rol" />
      <Card>
        <Tabla
          headers={['ID', 'Nombre del Rol', 'Salario (Bs)', 'Empleados asignados', 'Acciones']}
          rows={data.map(r => [
            <span style={{ color: C.blueLight }}>#{r.id_rol}</span>,
            <strong>{r.nombre_rol}</strong>,
            <span style={{ color: C.green, fontWeight: 700 }}>Bs {r.salario.toLocaleString()}</span>,
            empleados.filter(e => e.id_rol === r.id_rol).length,
            <RowActions onEdit={() => openEdit(r)} onDel={() => setData(p => p.filter(x => x.id_rol !== r.id_rol))} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nuevo Rol' : 'Editar Rol'} onClose={() => setModal(null)}>
          <G2>
            <Fld label="Nombre del rol"><Inp value={f.nombre_rol || ''} onChange={e => setF(p => ({ ...p, nombre_rol: e.target.value }))} /></Fld>
            <Fld label="Salario (Bs)"><Inp value={f.salario || ''} onChange={e => setF(p => ({ ...p, salario: Number(e.target.value) }))} type="number" /></Fld>
          </G2>
          {footerActions(() => setModal(null), save)}
        </Modal>
      )}
    </div>
  );
}

// ── Clientes ───────────────────────────────────────────────────────────────
function Clientes({ data, setData }: { data: Cliente[]; setData: React.Dispatch<React.SetStateAction<Cliente[]>> }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Cliente> } | null>(null);
  const [search, setSearch] = useState('');
  const [f, setF] = useState<Partial<Cliente>>({});
  const filtered = data.filter(c => c.nombre_cliente.toLowerCase().includes(search.toLowerCase()));
  const save = () => {
    if (modal?.mode === 'new') setData(p => [...p, { ...f, id_cliente: p.length + 1 } as Cliente]);
    else setData(p => p.map(c => c.id_cliente === f.id_cliente ? { ...c, ...f } : c));
    setModal(null);
  };
  const open = (item: Partial<Cliente>) => { setF(item); setModal({ mode: item.id_cliente ? 'edit' : 'new', item }); };
  return (
    <div>
      <SecHeader title="Clientes" onAdd={() => open({})} addLabel="Nuevo Cliente" />
      <Card>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..." style={{ background: 'none', border: 'none', color: C.text, fontSize: 14, outline: 'none', flex: 1 }} />
        </div>
        <Tabla
          headers={['ID', 'Nombre / Empresa', 'Contacto emergencia', 'Dirección', 'Acciones']}
          rows={filtered.map(c => [
            <span style={{ color: C.blueLight }}>#{c.id_cliente}</span>,
            <strong>{c.nombre_cliente}</strong>,
            c.contacto_emergencia || '—',
            c.direccion || '—',
            <RowActions onEdit={() => open(c)} onDel={() => setData(p => p.filter(x => x.id_cliente !== c.id_cliente))} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nuevo Cliente' : 'Editar Cliente'} onClose={() => setModal(null)}>
          <Fld label="Nombre del cliente / empresa"><Inp value={f.nombre_cliente || ''} onChange={e => setF(p => ({ ...p, nombre_cliente: e.target.value }))} /></Fld>
          <G2>
            <Fld label="Teléfono de emergencia"><Inp value={f.contacto_emergencia || ''} onChange={e => setF(p => ({ ...p, contacto_emergencia: e.target.value }))} /></Fld>
            <Fld label="Dirección"><Inp value={f.direccion || ''} onChange={e => setF(p => ({ ...p, direccion: e.target.value }))} /></Fld>
          </G2>
          {footerActions(() => setModal(null), save)}
        </Modal>
      )}
    </div>
  );
}

// ── Servicios ──────────────────────────────────────────────────────────────
function Servicios({ data, setData, clientes }: { data: Servicio[]; setData: React.Dispatch<React.SetStateAction<Servicio[]>>; clientes: Cliente[] }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Servicio> } | null>(null);
  const [f, setF] = useState<Partial<Servicio>>({});
  const save = () => {
    const cli = clientes.find(c => c.id_cliente === Number(f.id_cliente))?.nombre_cliente || '';
    if (modal?.mode === 'new') setData(p => [...p, { ...f, id_servicio: p.length + 1, cliente: cli } as Servicio]);
    else setData(p => p.map(s => s.id_servicio === f.id_servicio ? { ...s, ...f, cliente: cli } : s));
    setModal(null);
  };
  const open = (item: Partial<Servicio>) => { setF(item); setModal({ mode: item.id_servicio ? 'edit' : 'new', item }); };
  const TIPOS = ['Limpieza Profunda', 'Limpieza Diaria', 'Desinfección', 'Mantenimiento', 'Limpieza de Vidrios', 'Tratamiento de Pisos'];
  return (
    <div>
      <SecHeader title="Servicios" onAdd={() => open({ id_cliente: clientes[0]?.id_cliente, tipo_servicio: TIPOS[0] })} addLabel="Nuevo Servicio" />
      <Card>
        <Tabla
          headers={['ID', 'Cliente', 'Tipo', 'Inicio', 'Fin', 'Costo', 'Estado', 'Acciones']}
          rows={data.map(s => [
            <span style={{ color: C.blueLight }}>#{s.id_servicio}</span>,
            <strong>{s.cliente}</strong>,
            s.tipo_servicio, s.fecha_inicio,
            s.fecha_final || '—',
            <span style={{ color: C.green, fontWeight: 700 }}>Bs {Number(s.costo).toLocaleString()}</span>,
            <Badge text={s.fecha_final ? 'Finalizado' : 'Activo'} color={s.fecha_final ? 'yellow' : 'green'} />,
            <RowActions onEdit={() => open(s)} onDel={() => setData(p => p.filter(x => x.id_servicio !== s.id_servicio))} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nuevo Servicio' : 'Editar Servicio'} onClose={() => setModal(null)}>
          <G2>
            <Fld label="Cliente">
              <Sel value={f.id_cliente} onChange={e => setF(p => ({ ...p, id_cliente: Number(e.target.value) }))}>
                {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre_cliente}</option>)}
              </Sel>
            </Fld>
            <Fld label="Tipo de servicio">
              <Sel value={f.tipo_servicio} onChange={e => setF(p => ({ ...p, tipo_servicio: e.target.value }))}>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </Sel>
            </Fld>
            <Fld label="Fecha inicio"><Inp value={f.fecha_inicio || ''} onChange={e => setF(p => ({ ...p, fecha_inicio: e.target.value }))} type="date" /></Fld>
            <Fld label="Fecha fin (opcional)"><Inp value={f.fecha_final || ''} onChange={e => setF(p => ({ ...p, fecha_final: e.target.value || null }))} type="date" /></Fld>
            <Fld label="Costo (Bs)"><Inp value={f.costo || ''} onChange={e => setF(p => ({ ...p, costo: Number(e.target.value) }))} type="number" /></Fld>
            <Fld label="Descripción"><Inp value={f.descripcion || ''} onChange={e => setF(p => ({ ...p, descripcion: e.target.value }))} /></Fld>
          </G2>
          {footerActions(() => setModal(null), save)}
        </Modal>
      )}
    </div>
  );
}

// ── Maquinaria ─────────────────────────────────────────────────────────────
function Maquinaria({ data, setData }: { data: Maquina[]; setData: React.Dispatch<React.SetStateAction<Maquina[]>> }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Maquina> } | null>(null);
  const [f, setF] = useState<Partial<Maquina>>({});
  const save = () => {
    if (modal?.mode === 'new') setData(p => [...p, { ...f, id_maquinaria: p.length + 1 } as Maquina]);
    else setData(p => p.map(m => m.id_maquinaria === f.id_maquinaria ? { ...m, ...f } : m));
    setModal(null);
  };
  const TIPOS = ['Aspirado', 'Fregado', 'Presión', 'Pulido', 'Lavado', 'Secado'];
  const ESTADOS = ['Operativo', 'Mantenimiento', 'Fuera de servicio', 'En reparación'];
  return (
    <div>
      <SecHeader title="Maquinaria" onAdd={() => { setF({ tipo: TIPOS[0], estado: 'Operativo' }); setModal({ mode: 'new', item: {} }); }} addLabel="Nueva Máquina" />
      <Card>
        <Tabla
          headers={['Código', 'Nombre', 'Tipo', 'Proveedor', 'Estado', 'Acciones']}
          rows={data.map(m => [
            <span style={{ color: C.blueLight, fontFamily: 'monospace' }}>{m.codigo_inv}</span>,
            <strong>{m.nombre_maquinaria}</strong>,
            m.tipo, m.proveedor,
            <Badge text={m.estado} color={m.estado === 'Operativo' ? 'green' : m.estado === 'Mantenimiento' ? 'yellow' : 'red'} />,
            <RowActions onEdit={() => { setF(m); setModal({ mode: 'edit', item: m }); }} onDel={() => setData(p => p.filter(x => x.id_maquinaria !== m.id_maquinaria))} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nueva Maquinaria' : 'Editar Maquinaria'} onClose={() => setModal(null)}>
          <G2>
            <Fld label="Nombre"><Inp value={f.nombre_maquinaria || ''} onChange={e => setF(p => ({ ...p, nombre_maquinaria: e.target.value }))} /></Fld>
            <Fld label="Código inventario"><Inp value={f.codigo_inv || ''} onChange={e => setF(p => ({ ...p, codigo_inv: e.target.value }))} /></Fld>
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

// ── Recursos ───────────────────────────────────────────────────────────────
function Recursos({ data, setData, proveedores }: { data: Recurso[]; setData: React.Dispatch<React.SetStateAction<Recurso[]>>; proveedores: Proveedor[] }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Recurso> } | null>(null);
  const [f, setF] = useState<Partial<Recurso>>({});
  const TIPOS = ['Químico', 'Utensilio', 'Accesorio', 'Consumible'];
  const save = () => {
    if (modal?.mode === 'new') setData(p => [...p, { ...f, id_recurso: p.length + 1 } as Recurso]);
    else setData(p => p.map(r => r.id_recurso === f.id_recurso ? { ...r, ...f } : r));
    setModal(null);
  };
  return (
    <div>
      <SecHeader title="Recursos e Insumos" onAdd={() => { setF({ tipo: TIPOS[0] }); setModal({ mode: 'new', item: {} }); }} addLabel="Nuevo Recurso" />
      <Card>
        <Tabla
          headers={['ID', 'Nombre', 'Tipo', 'Proveedor', 'Descripción', 'Acciones']}
          rows={data.map(r => [
            <span style={{ color: C.blueLight }}>#{r.id_recurso}</span>,
            <strong>{r.nombre}</strong>,
            <Badge text={r.tipo} color="blue" />,
            r.proveedor, r.descripcion || '—',
            <RowActions onEdit={() => { setF(r); setModal({ mode: 'edit', item: r }); }} onDel={() => setData(p => p.filter(x => x.id_recurso !== r.id_recurso))} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nuevo Recurso' : 'Editar Recurso'} onClose={() => setModal(null)}>
          <G2>
            <Fld label="Nombre del recurso"><Inp value={f.nombre || ''} onChange={e => setF(p => ({ ...p, nombre: e.target.value }))} /></Fld>
            <Fld label="Tipo"><Sel value={f.tipo} onChange={e => setF(p => ({ ...p, tipo: e.target.value }))}>{TIPOS.map(t => <option key={t}>{t}</option>)}</Sel></Fld>
            <Fld label="Proveedor">
              <Sel value={f.proveedor} onChange={e => setF(p => ({ ...p, proveedor: e.target.value }))}>
                {proveedores.map(p => <option key={p.id_proveedor}>{p.nombre}</option>)}
              </Sel>
            </Fld>
            <Fld label="Descripción"><Inp value={f.descripcion || ''} onChange={e => setF(p => ({ ...p, descripcion: e.target.value }))} /></Fld>
          </G2>
          {footerActions(() => setModal(null), save)}
        </Modal>
      )}
    </div>
  );
}

// ── Uniformes ──────────────────────────────────────────────────────────────
function Uniformes({ uniforms, setUniforms, asig, setAsig, empleados }: {
  uniforms: Uniforme[]; setUniforms: React.Dispatch<React.SetStateAction<Uniforme[]>>;
  asig: AsignacionUniforme[]; setAsig: React.Dispatch<React.SetStateAction<AsignacionUniforme[]>>;
  empleados: Empleado[];
}) {
  const [tab, setTab] = useState<'catalogo' | 'asignaciones'>('catalogo');
  const [modal, setModal] = useState<{ type: string; mode: 'new' | 'edit'; item: Record<string, unknown> } | null>(null);
  const [f, setF] = useState<Record<string, unknown>>({});

  const saveUni = () => {
    if (modal?.mode === 'new') setUniforms(p => [...p, { ...f, id_uniforme: p.length + 1 } as Uniforme]);
    else setUniforms(p => p.map(u => u.id_uniforme === f.id_uniforme ? { ...u, ...f } as Uniforme : u));
    setModal(null);
  };
  const saveAsig = () => {
    if (modal?.mode === 'new') setAsig(p => [...p, { ...f, id: p.length + 1 } as AsignacionUniforme]);
    else setAsig(p => p.map(a => a.id === f.id ? { ...a, ...f } as AsignacionUniforme : a));
    setModal(null);
  };

  return (
    <div>
      <SecHeader
        title="Uniformes"
        onAdd={() => {
          setF(tab === 'catalogo' ? {} : { usuario: empleados[0]?.nombre_usuario, uniforme: uniforms[0]?.nombre_uniforme, estado: 'Entregado' });
          setModal({ type: tab, mode: 'new', item: {} });
        }}
        addLabel={tab === 'catalogo' ? 'Nuevo Uniforme' : 'Nueva Asignación'}
      />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['catalogo', 'asignaciones'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: tab === t ? C.blue : 'rgba(255,255,255,.05)', color: tab === t ? '#fff' : C.textMuted, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
            {t === 'catalogo' ? '📦 Catálogo' : '👕 Asignaciones'}
          </button>
        ))}
      </div>

      {tab === 'catalogo' && (
        <Card>
          <Tabla
            headers={['ID', 'Nombre', 'Talla', 'Descripción', 'Acciones']}
            rows={uniforms.map(u => [
              <span style={{ color: C.blueLight }}>#{u.id_uniforme}</span>,
              <strong>{u.nombre_uniforme}</strong>,
              u.talla, u.descripcion || '—',
              <RowActions onEdit={() => { setF(u as unknown as Record<string, unknown>); setModal({ type: 'catalogo', mode: 'edit', item: u as unknown as Record<string, unknown> }); }} onDel={() => setUniforms(p => p.filter(x => x.id_uniforme !== u.id_uniforme))} />,
            ])}
          />
        </Card>
      )}

      {tab === 'asignaciones' && (
        <Card>
          <Tabla
            headers={['ID', 'Empleado', 'Uniforme', 'Entrega', 'Devolución', 'Estado', 'Acciones']}
            rows={asig.map(a => [
              <span style={{ color: C.blueLight }}>#{a.id}</span>,
              a.usuario, a.uniforme, a.fecha_entrega,
              a.fecha_devolucion || 'Pendiente',
              <Badge text={a.estado} color={a.estado === 'Entregado' ? 'green' : a.estado === 'Devuelto' ? 'blue' : 'red'} />,
              <RowActions onEdit={() => { setF(a as unknown as Record<string, unknown>); setModal({ type: 'asignaciones', mode: 'edit', item: a as unknown as Record<string, unknown> }); }} onDel={() => setAsig(p => p.filter(x => x.id !== a.id))} />,
            ])}
          />
        </Card>
      )}

      {modal && (
        <Modal title={modal.type === 'catalogo' ? (modal.mode === 'new' ? 'Nuevo Uniforme' : 'Editar Uniforme') : (modal.mode === 'new' ? 'Nueva Asignación' : 'Editar Asignación')} onClose={() => setModal(null)}>
          {modal.type === 'catalogo' ? (
            <>
              <G2>
                <Fld label="Nombre del uniforme"><Inp value={String(f.nombre_uniforme || '')} onChange={e => setF(p => ({ ...p, nombre_uniforme: e.target.value }))} /></Fld>
                <Fld label="Talla"><Inp value={String(f.talla || '')} onChange={e => setF(p => ({ ...p, talla: Number(e.target.value) }))} type="number" /></Fld>
                <Fld label="Descripción"><Inp value={String(f.descripcion || '')} onChange={e => setF(p => ({ ...p, descripcion: e.target.value }))} /></Fld>
              </G2>
              {footerActions(() => setModal(null), saveUni)}
            </>
          ) : (
            <>
              <G2>
                <Fld label="Empleado">
                  <Sel value={String(f.usuario || '')} onChange={e => setF(p => ({ ...p, usuario: e.target.value }))}>
                    {empleados.map(e => <option key={e.id_usuario}>{e.nombre_usuario}</option>)}
                  </Sel>
                </Fld>
                <Fld label="Uniforme">
                  <Sel value={String(f.uniforme || '')} onChange={e => setF(p => ({ ...p, uniforme: e.target.value }))}>
                    {uniforms.map(u => <option key={u.id_uniforme}>{u.nombre_uniforme}</option>)}
                  </Sel>
                </Fld>
                <Fld label="Fecha entrega"><Inp value={String(f.fecha_entrega || '')} onChange={e => setF(p => ({ ...p, fecha_entrega: e.target.value }))} type="date" /></Fld>
                <Fld label="Estado">
                  <Sel value={String(f.estado || 'Entregado')} onChange={e => setF(p => ({ ...p, estado: e.target.value }))}>
                    {['Entregado', 'Devuelto', 'Extraviado'].map(s => <option key={s}>{s}</option>)}
                  </Sel>
                </Fld>
              </G2>
              {footerActions(() => setModal(null), saveAsig)}
            </>
          )}
        </Modal>
      )}
    </div>
  );
}

// ── Capacitaciones ─────────────────────────────────────────────────────────
function Capacitaciones({ data, setData, empleados }: { data: Capacitacion[]; setData: React.Dispatch<React.SetStateAction<Capacitacion[]>>; empleados: Empleado[] }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Capacitacion> } | null>(null);
  const [f, setF] = useState<Partial<Capacitacion>>({});
  const save = () => {
    if (modal?.mode === 'new') setData(p => [...p, { ...f, id_capacitacion: p.length + 1 } as Capacitacion]);
    else setData(p => p.map(c => c.id_capacitacion === f.id_capacitacion ? { ...c, ...f } : c));
    setModal(null);
  };
  return (
    <div>
      <SecHeader title="Capacitaciones" onAdd={() => { setF({}); setModal({ mode: 'new', item: {} }); }} addLabel="Nueva Capacitación" />
      <Card>
        <Tabla
          headers={['ID', 'Nombre', 'Descripción', 'Fecha', 'Acciones']}
          rows={data.map(c => [
            <span style={{ color: C.blueLight }}>#{c.id_capacitacion}</span>,
            <strong>{c.nombre}</strong>,
            c.descripcion || '—', c.fecha,
            <RowActions onEdit={() => { setF(c); setModal({ mode: 'edit', item: c }); }} onDel={() => setData(p => p.filter(x => x.id_capacitacion !== c.id_capacitacion))} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nueva Capacitación' : 'Editar Capacitación'} onClose={() => setModal(null)}>
          <Fld label="Nombre de la capacitación"><Inp value={f.nombre || ''} onChange={e => setF(p => ({ ...p, nombre: e.target.value }))} /></Fld>
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

// ── Mantenimientos ─────────────────────────────────────────────────────────
function Mantenimientos({ data, setData, maquinaria }: { data: Mantenimiento[]; setData: React.Dispatch<React.SetStateAction<Mantenimiento[]>>; maquinaria: Maquina[] }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Mantenimiento> } | null>(null);
  const [f, setF] = useState<Partial<Mantenimiento>>({});
  const save = () => {
    if (modal?.mode === 'new') setData(p => [...p, { ...f, id_mantenimiento: p.length + 1 } as Mantenimiento]);
    else setData(p => p.map(m => m.id_mantenimiento === f.id_mantenimiento ? { ...m, ...f } : m));
    setModal(null);
  };
  return (
    <div>
      <SecHeader title="Mantenimientos" onAdd={() => { setF({ maquinaria: maquinaria[0]?.nombre_maquinaria }); setModal({ mode: 'new', item: {} }); }} addLabel="Registrar Mantenimiento" />
      <Card>
        <Tabla
          headers={['ID', 'Maquinaria', 'Fecha', 'Descripción', 'Costo (Bs)', 'Acciones']}
          rows={data.map(m => [
            <span style={{ color: C.blueLight }}>#{m.id_mantenimiento}</span>,
            <strong>{m.maquinaria}</strong>,
            m.fecha_mantenimiento, m.descripcion || '—',
            <span style={{ color: C.green, fontWeight: 700 }}>Bs {Number(m.costo).toLocaleString()}</span>,
            <RowActions onEdit={() => { setF(m); setModal({ mode: 'edit', item: m }); }} onDel={() => setData(p => p.filter(x => x.id_mantenimiento !== m.id_mantenimiento))} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nuevo Mantenimiento' : 'Editar Mantenimiento'} onClose={() => setModal(null)}>
          <G2>
            <Fld label="Maquinaria">
              <Sel value={f.maquinaria} onChange={e => setF(p => ({ ...p, maquinaria: e.target.value }))}>
                {maquinaria.map(m => <option key={m.id_maquinaria}>{m.nombre_maquinaria}</option>)}
              </Sel>
            </Fld>
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

// ── Proveedores ────────────────────────────────────────────────────────────
function Proveedores({ data, setData }: { data: Proveedor[]; setData: React.Dispatch<React.SetStateAction<Proveedor[]>> }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Proveedor> } | null>(null);
  const [f, setF] = useState<Partial<Proveedor>>({});
  const TIPOS = ['Químicos', 'Utensilios', 'Maquinaria', 'Uniformes', 'Consumibles'];
  const save = () => {
    if (modal?.mode === 'new') setData(p => [...p, { ...f, id_proveedor: p.length + 1 } as Proveedor]);
    else setData(p => p.map(pr => pr.id_proveedor === f.id_proveedor ? { ...pr, ...f } : pr));
    setModal(null);
  };
  return (
    <div>
      <SecHeader title="Proveedores" onAdd={() => { setF({ producto: TIPOS[0] }); setModal({ mode: 'new', item: {} }); }} addLabel="Nuevo Proveedor" />
      <Card>
        <Tabla
          headers={['ID', 'Nombre', 'NIT', 'Empresa', 'Producto', 'Acciones']}
          rows={data.map(p => [
            <span style={{ color: C.blueLight }}>#{p.id_proveedor}</span>,
            <strong>{p.nombre}</strong>,
            p.nit, p.empresa,
            <Badge text={p.producto} color="blue" />,
            <RowActions onEdit={() => { setF(p); setModal({ mode: 'edit', item: p }); }} onDel={() => setData(prev => prev.filter(x => x.id_proveedor !== p.id_proveedor))} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nuevo Proveedor' : 'Editar Proveedor'} onClose={() => setModal(null)}>
          <G2>
            <Fld label="Nombre"><Inp value={f.nombre || ''} onChange={e => setF(p => ({ ...p, nombre: e.target.value }))} /></Fld>
            <Fld label="NIT"><Inp value={f.nit || ''} onChange={e => setF(p => ({ ...p, nit: Number(e.target.value) }))} type="number" /></Fld>
            <Fld label="Empresa"><Inp value={f.empresa || ''} onChange={e => setF(p => ({ ...p, empresa: e.target.value }))} /></Fld>
            <Fld label="Tipo de producto">
              <Sel value={f.producto} onChange={e => setF(p => ({ ...p, producto: e.target.value }))}>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </Sel>
            </Fld>
          </G2>
          {footerActions(() => setModal(null), save)}
        </Modal>
      )}
    </div>
  );
}

// ── Incidentes ─────────────────────────────────────────────────────────────
function Incidentes({ data, setData, servicios }: { data: Incidente[]; setData: React.Dispatch<React.SetStateAction<Incidente[]>>; servicios: Servicio[] }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Incidente> } | null>(null);
  const [f, setF] = useState<Partial<Incidente>>({});
  const save = () => {
    if (modal?.mode === 'new') setData(p => [...p, { ...f, id_incidente: p.length + 1 } as Incidente]);
    else setData(p => p.map(i => i.id_incidente === f.id_incidente ? { ...i, ...f } : i));
    setModal(null);
  };
  return (
    <div>
      <SecHeader title="Incidentes" onAdd={() => { setF({ servicio: servicios[0]?.cliente }); setModal({ mode: 'new', item: {} }); }} addLabel="Registrar Incidente" />
      <Card>
        <Tabla
          headers={['ID', 'Servicio', 'Descripción', 'Fecha', 'Acciones']}
          rows={data.map(i => [
            <span style={{ color: '#f87171' }}>#{i.id_incidente}</span>,
            <strong>{i.servicio}</strong>,
            i.descripcion, i.fecha,
            <RowActions onEdit={() => { setF(i); setModal({ mode: 'edit', item: i }); }} onDel={() => setData(p => p.filter(x => x.id_incidente !== i.id_incidente))} />,
          ])}
        />
      </Card>
      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nuevo Incidente' : 'Editar Incidente'} onClose={() => setModal(null)}>
          <Fld label="Servicio relacionado">
            <Sel value={f.servicio} onChange={e => setF(p => ({ ...p, servicio: e.target.value }))}>
              {servicios.map(s => <option key={s.id_servicio}>{s.cliente} — {s.tipo_servicio}</option>)}
            </Sel>
          </Fld>
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

// ── Horarios ───────────────────────────────────────────────────────────────
function Horarios({ data, setData }: { data: Horario[]; setData: React.Dispatch<React.SetStateAction<Horario[]>> }) {
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; item: Partial<Horario> } | null>(null);
  const [f, setF] = useState<Partial<Horario>>({});
  const NAMES = ['Turno Mañana', 'Turno Tarde', 'Turno Noche', 'Turno Extra 1', 'Turno Extra 2'];
  const save = () => {
    if (modal?.mode === 'new') setData(p => [...p, { ...f, id_horario: p.length + 1 } as Horario]);
    else setData(p => p.map(h => h.id_horario === f.id_horario ? { ...h, ...f } : h));
    setModal(null);
  };
  return (
    <div>
      <SecHeader title="Horarios" onAdd={() => { setF({}); setModal({ mode: 'new', item: {} }); }} addLabel="Nuevo Horario" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
        {data.map((h, i) => (
          <div key={h.id_horario} style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
            <p style={{ margin: '0 0 4px', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{NAMES[i] || `Turno ${i + 1}`}</p>
            <p style={{ margin: '0 0 16px', color: C.text, fontSize: 22, fontWeight: 800 }}>{h.hora_entrada} – {h.hora_salida}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn sm variant="ghost" onClick={() => { setF(h); setModal({ mode: 'edit', item: h }); }}>✏️ Editar</Btn>
              <Btn sm variant="danger" onClick={() => setData(p => p.filter(x => x.id_horario !== h.id_horario))}>🗑️</Btn>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal.mode === 'new' ? 'Nuevo Horario' : 'Editar Horario'} onClose={() => setModal(null)}>
          <G2>
            <Fld label="Hora de entrada"><Inp value={f.hora_entrada || ''} onChange={e => setF(p => ({ ...p, hora_entrada: e.target.value }))} type="time" /></Fld>
            <Fld label="Hora de salida"><Inp value={f.hora_salida || ''} onChange={e => setF(p => ({ ...p, hora_salida: e.target.value }))} type="time" /></Fld>
          </G2>
          {footerActions(() => setModal(null), save)}
        </Modal>
      )}
    </div>
  );
}

// ── Servicios Terminados ───────────────────────────────────────────────────
function ServiciosTerminados({ data }: { data: ServicioTerminado[] }) {
  const sat = (s: string) => s === 'Excelente' ? 'green' : s === 'Bueno' ? 'blue' : 'yellow';
  return (
    <div>
      <SecHeader title="Servicios Terminados" />
      <Card>
        <Tabla
          headers={['ID', 'Servicio', 'Satisfacción', 'Comentarios del cliente']}
          rows={data.map(s => [
            <span style={{ color: C.blueLight }}>#{s.id}</span>,
            <strong>{s.servicio}</strong>,
            <Badge text={s.satisfaccion} color={sat(s.satisfaccion)} />,
            <span style={{ color: C.textSub, fontStyle: 'italic' }}>{s.comentarios || '—'}</span>,
          ])}
        />
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVEGACIÓN
// ═══════════════════════════════════════════════════════════════════════════
type NavId = 'dashboard' | 'empleados' | 'roles' | 'uniformes' | 'capacitaciones' | 'horarios' | 'clientes' | 'servicios' | 'terminados' | 'incidentes' | 'maquinaria' | 'mantenimientos' | 'recursos' | 'proveedores';

const NAV: { id: NavId; label: string; emoji: string; group: string }[] = [
  { id: 'dashboard',      label: 'Panel de Control',    emoji: '📊', group: 'General' },
  { id: 'empleados',      label: 'Empleados',           emoji: '👥', group: 'Recursos Humanos' },
  { id: 'roles',          label: 'Roles',               emoji: '🛡️', group: 'Recursos Humanos' },
  { id: 'uniformes',      label: 'Uniformes',           emoji: '👕', group: 'Recursos Humanos' },
  { id: 'capacitaciones', label: 'Capacitaciones',      emoji: '📚', group: 'Recursos Humanos' },
  { id: 'horarios',       label: 'Horarios',            emoji: '🕐', group: 'Recursos Humanos' },
  { id: 'clientes',       label: 'Clientes',            emoji: '🏢', group: 'Operaciones' },
  { id: 'servicios',      label: 'Servicios',           emoji: '🧹', group: 'Operaciones' },
  { id: 'terminados',     label: 'Serv. Terminados',    emoji: '✅', group: 'Operaciones' },
  { id: 'incidentes',     label: 'Incidentes',          emoji: '⚠️', group: 'Operaciones' },
  { id: 'maquinaria',     label: 'Maquinaria',          emoji: '⚙️', group: 'Activos Fijos' },
  { id: 'mantenimientos', label: 'Mantenimientos',      emoji: '🔧', group: 'Activos Fijos' },
  { id: 'recursos',       label: 'Recursos',            emoji: '🧴', group: 'Activos Fijos' },
  { id: 'proveedores',    label: 'Proveedores',         emoji: '🚚', group: 'Activos Fijos' },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const router = useRouter();
  const [active, setActive] = useState<NavId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Estado global compartido entre secciones
  const [empleados, setEmpleados] = useState<Empleado[]>(EMPLEADOS_INIT);
  const [roles, setRoles] = useState<Role[]>(ROLES);
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

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  const groups = [...new Set(NAV.map(n => n.group))];

  const renderSection = () => {
    switch (active) {
      case 'dashboard':      return <Dashboard empleados={empleados} servicios={servicios} maquinaria={maquinaria} clientes={clientes} />;
      case 'empleados':      return <Empleados data={empleados} setData={setEmpleados} roles={roles} />;
      case 'roles':          return <Roles data={roles} setData={setRoles} empleados={empleados} />;
      case 'uniformes':      return <Uniformes uniforms={uniforms} setUniforms={setUniforms} asig={asigUni} setAsig={setAsigUni} empleados={empleados} />;
      case 'capacitaciones': return <Capacitaciones data={capacitaciones} setData={setCapacitaciones} empleados={empleados} />;
      case 'horarios':       return <Horarios data={horarios} setData={setHorarios} />;
      case 'clientes':       return <Clientes data={clientes} setData={setClientes} />;
      case 'servicios':      return <Servicios data={servicios} setData={setServicios} clientes={clientes} />;
      case 'terminados':     return <ServiciosTerminados data={terminados} />;
      case 'incidentes':     return <Incidentes data={incidentes} setData={setIncidentes} servicios={servicios} />;
      case 'maquinaria':     return <Maquinaria data={maquinaria} setData={setMaquinaria} />;
      case 'mantenimientos': return <Mantenimientos data={mantenimientos} setData={setMantenimientos} maquinaria={maquinaria} />;
      case 'recursos':       return <Recursos data={recursos} setData={setRecursos} proveedores={proveedores} />;
      case 'proveedores':    return <Proveedores data={proveedores} setData={setProveedores} />;
    }
  };

  const current = NAV.find(n => n.id === active)!;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#060d1a', color: C.text, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060d1a; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.4); }
        select option { background: #1e293b; }
      `}</style>

      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside style={{
        width: sidebarOpen ? 250 : 62, flexShrink: 0,
        background: '#070f1d', borderRight: `1px solid ${C.borderLight}`,
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease', overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '18px 14px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', gap: 12, minHeight: 62 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
            🧹
          </div>
          {sidebarOpen && (
            <div>
              <p style={{ margin: 0, color: C.text, fontWeight: 900, fontSize: 15 }}>SASL</p>
              <p style={{ margin: 0, color: '#475569', fontSize: 10 }}>Panel Administrativo</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
          {groups.map(group => (
            <div key={group}>
              {sidebarOpen && (
                <p style={{ margin: '14px 8px 4px', color: '#334155', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em' }}>{group}</p>
              )}
              {NAV.filter(n => n.group === group).map(item => (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: 10, padding: sidebarOpen ? '9px 12px' : '9px',
                    borderRadius: 8, border: 'none',
                    background: active === item.id ? 'rgba(0,112,243,.18)' : 'none',
                    color: active === item.id ? '#60a5fa' : '#64748b',
                    cursor: 'pointer', fontSize: 13,
                    fontWeight: active === item.id ? 700 : 500,
                    marginBottom: 2,
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    borderLeft: active === item.id ? '2px solid #0070f3' : '2px solid transparent',
                    transition: 'all .15s',
                  }}
                >
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{item.emoji}</span>
                  {sidebarOpen && item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Usuario + logout */}
        <div style={{ padding: '10px 8px', borderTop: `1px solid ${C.borderLight}` }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#003066,#0070f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, color: C.text, fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Administrador</p>
                <p style={{ margin: 0, color: '#475569', fontSize: 10 }}>admin@sasl.bo</p>
              </div>
              <button onClick={handleLogout} title="Cerrar sesión" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }}>⏻</button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18, padding: 8 }}>⏻</button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{ height: 62, background: '#070f1d', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(p => !p)} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>☰</button>
          <div>
            <h1 style={{ margin: 0, color: C.text, fontSize: 16, fontWeight: 800 }}>{current.emoji} {current.label}</h1>
            <p style={{ margin: 0, color: '#475569', fontSize: 11 }}>{current.group}</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#475569', fontSize: 12 }}>22 Abr 2026</span>
            <div style={{ width: 1, height: 20, background: C.border }} />
            <Badge text="ADMIN" color="blue" />
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
