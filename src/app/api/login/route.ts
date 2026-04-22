import { NextResponse } from 'next/server';

// Usuarios que coinciden con la tabla Usuario_trabajador
// En producción: reemplazar con consulta real a SQL Server
const USUARIOS_BD = [
  { correo: 'admin@sasl.bo',      contrasena: 'admin123',  id_rol: 3, nombre: 'María López',   rol: 'Admin' },
  { correo: 'supervisor@sasl.bo', contrasena: 'super123',  id_rol: 1, nombre: 'Carlos Mamani', rol: 'Supervisor' },
  { correo: 'limpieza@sasl.bo',   contrasena: 'limp123',   id_rol: 2, nombre: 'Ana Torres',    rol: 'Limpieza' },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { correo, contrasena } = body;

    if (!correo || !contrasena) {
      return NextResponse.json(
        { success: false, message: 'Correo y contraseña son requeridos.' },
        { status: 400 }
      );
    }

    const usuario = USUARIOS_BD.find(
      u => u.correo === correo && u.contrasena === contrasena
    );

    if (!usuario) {
      return NextResponse.json(
        { success: false, message: 'Credenciales incorrectas.' },
        { status: 401 }
      );
    }

    const preAuthData = encodeURIComponent(JSON.stringify({
      correo: usuario.correo,
      nombre: usuario.nombre,
      rol:    usuario.rol,
      id_rol: usuario.id_rol,
    }));

    const response = NextResponse.json({ success: true });
    response.cookies.set('pre_auth_user', preAuthData, {
      httpOnly: true,
      path: '/',
      maxAge: 300,
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, message: 'Error interno.' }, { status: 500 });
  }
}
