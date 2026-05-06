import { NextResponse } from 'next/server';
import { USUARIOS, ROL_ID } from '@/lib/userStore';

export async function GET() {
  return NextResponse.json({
    success: true,
    usuarios: USUARIOS.map(u => ({ correo: u.correo, nombre: u.nombre, rol: u.rol })),
  });
}

export async function POST(request: Request) {
  try {
    const { correo, contrasena, nombre, rol } = await request.json();

    if (!correo || !contrasena || !nombre || !rol) {
      return NextResponse.json({ success: false, message: 'Todos los campos son requeridos.' }, { status: 400 });
    }

    if (USUARIOS.find(u => u.correo === correo)) {
      return NextResponse.json({ success: false, message: 'El correo ya está registrado.' }, { status: 409 });
    }

    const id_rol = ROL_ID[rol] ?? 3;
    USUARIOS.push({ correo, contrasena, nombre, rol, id_rol });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: 'Error interno.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { correo } = await request.json();
    const idx = USUARIOS.findIndex(u => u.correo === correo);
    if (idx >= 0) USUARIOS.splice(idx, 1);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: 'Error interno.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { correo, contrasena, nombre, rol } = await request.json();
    const u = USUARIOS.find(u => u.correo === correo);
    if (!u) return NextResponse.json({ success: false, message: 'Usuario no encontrado.' }, { status: 404 });
    if (nombre) u.nombre = nombre;
    if (contrasena) u.contrasena = contrasena;
    if (rol) { u.rol = rol; u.id_rol = ROL_ID[rol] ?? u.id_rol; }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: 'Error interno.' }, { status: 500 });
  }
}
