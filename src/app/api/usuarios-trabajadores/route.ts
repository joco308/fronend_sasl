import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT u.id_usuario, u.correo, u.ci, u.nombre_usuario, u.fecha_nacimiento,
             u.id_rol, u.id_estado_civil, u.id_grado_academico, u.id_genero,
             u.id_direccion, u.id_pais, u.create_at, u.update_at,
             r.nombre_rol
      FROM   Usuario_trabajador u
      LEFT JOIN Roles r ON r.id_rol = u.id_rol
      ORDER  BY u.id_usuario
    `);
    return NextResponse.json({ success: true, data: result.recordset });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
