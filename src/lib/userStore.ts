export type UsuarioDB = {
  correo: string;
  contrasena: string;
  nombre: string;
  rol: string;
  id_rol: number;
};

// Module-level singleton — persists while the Node process is running (dev server)
export const USUARIOS: UsuarioDB[] = [
  { correo: 'admin@sasl.bo',   contrasena: 'admin123',   nombre: 'María López',    rol: 'Admin',   id_rol: 1 },
  { correo: 'gerente@sasl.bo', contrasena: 'gerente123', nombre: 'Carlos Mamani',  rol: 'Gerente', id_rol: 2 },
  { correo: 'usuario@sasl.bo', contrasena: 'usuario123', nombre: 'Ana Torres',     rol: 'Usuario', id_rol: 3 },
  { correo: 'cliente@sasl.bo', contrasena: 'cliente123', nombre: 'Banco Nacional', rol: 'Cliente', id_rol: 4 },
];

export const ROL_ID: Record<string, number> = {
  Admin: 1, Gerente: 2, Usuario: 3, Cliente: 4,
};
