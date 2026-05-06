import { NextResponse } from 'next/server';

const ROLE_REDIRECT: Record<string, string> = {
  Admin:      '/admin',
  Supervisor: '/gerente',
  Limpieza:   '/usuario',
  Gerente:    '/gerente',
  Usuario:    '/usuario',
  Cliente:    '/cliente',
};

const USUARIOS_BD = [
  { correo: 'admin@sasl.bo',      contrasena: 'admin123',  nombre: 'María López',   rol: 'Admin',      id_rol: 1 },
  { correo: 'supervisor@sasl.bo', contrasena: 'super123',  nombre: 'Carlos Mamani', rol: 'Supervisor', id_rol: 2 },
  { correo: 'limpieza@sasl.bo',   contrasena: 'limp123',   nombre: 'Ana Torres',    rol: 'Limpieza',   id_rol: 3 },
  { correo: 'gerente@sasl.bo',    contrasena: 'gerente123',nombre: 'Luis Rojas',    rol: 'Gerente',    id_rol: 2 },
  { correo: 'usuario@sasl.bo',    contrasena: 'usuario123',nombre: 'Pedro Quispe',  rol: 'Usuario',    id_rol: 3 },
  { correo: 'cliente@sasl.bo',    contrasena: 'cliente123',nombre: 'Banco Nacional',rol: 'Cliente',    id_rol: 4 },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usuario, contraseña } = body;

    if (!usuario || !contraseña) {
      return NextResponse.json(
        { success: false, mensaje: 'Usuario y contraseña son requeridos.' },
        { status: 400 }
      );
    }

    const found = USUARIOS_BD.find(
      u => u.correo === usuario && u.contrasena === contraseña
    );

    if (!found) {
      return NextResponse.json(
        { success: false, mensaje: 'Credenciales incorrectas.' },
        { status: 401 }
      );
    }

    const preAuthData = encodeURIComponent(JSON.stringify({
      correo: found.correo,
      nombre: found.nombre,
      rol:    found.rol,
      id_rol: found.id_rol,
      redirect: ROLE_REDIRECT[found.rol] || '/admin',
    }));

    const response = NextResponse.json({ success: true });
    response.cookies.set('pre_auth_user', preAuthData, {
      httpOnly: true, path: '/', maxAge: 300, sameSite: 'lax',
    });
    return response;
  } catch {
    return NextResponse.json({ success: false, mensaje: 'Error interno.' }, { status: 500 });
  }
}
