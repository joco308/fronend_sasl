import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { codigo } = await request.json();

    const cookieStore = await cookies();
    const preAuthCookie = cookieStore.get('pre_auth_user');

    if (!preAuthCookie?.value) {
      return NextResponse.json(
        { success: false, mensaje: 'Sesión expirada. Vuelva a iniciar sesión.' },
        { status: 401 }
      );
    }

    if (codigo !== '123456') {
      return NextResponse.json(
        { success: false, mensaje: 'Código incorrecto. Intente nuevamente.' },
        { status: 401 }
      );
    }

    let usuario: { correo: string; nombre: string; rol: string; id_rol: number; redirect: string };
    try {
      usuario = JSON.parse(decodeURIComponent(preAuthCookie.value));
    } catch {
      return NextResponse.json(
        { success: false, mensaje: 'Sesión inválida. Vuelva a iniciar sesión.' },
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

    const response = NextResponse.json({ success: true, redireccion: usuario.redirect });
    response.cookies.set('session_token', sessionData, {
      httpOnly: true, path: '/', maxAge: 3600, sameSite: 'lax',
    });
    response.cookies.set('pre_auth_user', '', {
      httpOnly: true, path: '/', maxAge: 0,
    });
    return response;
  } catch {
    return NextResponse.json({ success: false, mensaje: 'Error interno.' }, { status: 500 });
  }
}
