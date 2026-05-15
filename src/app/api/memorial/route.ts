import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT m.id_memorial, m.id_empleado, m.descripcion, m.create_at, m.update_at,
             u.nombre_usuario
      FROM   Memorial m
      LEFT JOIN Usuario_trabajador u ON u.id_usuario = m.id_empleado
      ORDER  BY m.create_at DESC
    `);
    return NextResponse.json({ success: true, data: result.recordset });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_empleado, descripcion } = body;

    if (!id_empleado || !descripcion) {
      return NextResponse.json(
        { success: false, message: 'id_empleado y descripcion son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_empleado', sql.Int,     parseInt(id_empleado, 10))
      .input('descripcion', sql.NVarChar(sql.MAX), descripcion)
      .query(`
        INSERT INTO Memorial (id_empleado, descripcion)
        OUTPUT INSERTED.*
        VALUES (@id_empleado, @descripcion)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
