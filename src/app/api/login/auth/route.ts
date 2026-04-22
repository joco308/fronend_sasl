import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// PASO 2 — Valida código 2FA y emite sesión definitiva
// Redirige según el rol: Admin→/admin, Supervisor→/supervisor, Limpieza→/limpieza
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { codigo } = body;

    const cookieStore = await cookies();
    const preAuthCookie = cookieStore.get('pre_auth_user');

    if (!preAuthCookie?.value) {
      return NextResponse.json(
        { success: false, message: 'Sesión expirada. Vuelva a iniciar sesión.' },
        { status: 401 }
      );
    }

    // Código fijo de prueba: 123456
    // En producción: validar contra campo codigo2fa de tabla Usuario_trabajador
    if (codigo !== '123456') {
      return NextResponse.json(
        { success: false, message: 'Código incorrecto. Intente nuevamente.' },
        { status: 401 }
      );
    }

    let usuario: { correo: string; nombre: string; rol: string; id_rol: number };
    try {
      usuario = JSON.parse(decodeURIComponent(preAuthCookie.value));
    } catch {
      return NextResponse.json(
        { success: false, message: 'Sesión inválida. Vuelva a iniciar sesión.' },
        { status: 401 }
      );
    }

    const sessionData = encodeURIComponent(JSON.stringify({
      correo:      usuario.correo,
      nombre:      usuario.nombre,
      rol:         usuario.rol,
      id_rol:      usuario.id_rol,
      autenticado: true,
      timestamp:   Date.now(),
    }));

    // Determinar ruta de destino según el rol
    const rutaDestino: Record<string, string> = {
      'Admin':      '/admin',
      'Supervisor': '/supervisor',
      'Limpieza':   '/limpieza',
    };
    const redirect = rutaDestino[usuario.rol] || '/admin';

    const response = NextResponse.json({ success: true, rol: usuario.rol, redirect });

    response.cookies.set('session_token', sessionData, {
      httpOnly: true,
      path: '/',
      maxAge: 3600,
      sameSite: 'lax',
    });

    // Eliminar cookie temporal
    response.cookies.set('pre_auth_user', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, message: 'Error interno.' }, { status: 500 });
  }
}
