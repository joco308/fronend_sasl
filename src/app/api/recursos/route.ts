import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT id_recurso, id_proveedor, id_tipo, nombre, descripcion, create_at, update_at
      FROM   Recursos
      ORDER  BY id_recurso
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
    const { id_proveedor, id_tipo, nombre, descripcion } = body;

    if (!nombre || !id_proveedor || !id_tipo) {
      return NextResponse.json(
        { success: false, message: 'nombre, id_proveedor e id_tipo son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_proveedor', sql.Int,           parseInt(id_proveedor, 10))
      .input('id_tipo',      sql.Int,           parseInt(id_tipo, 10))
      .input('nombre',       sql.NVarChar(100), nombre)
      .input('descripcion',  sql.NVarChar(300), descripcion ?? null)
      .query(`
        INSERT INTO Recursos (id_proveedor, id_tipo, nombre, descripcion)
        OUTPUT INSERTED.*
        VALUES (@id_proveedor, @id_tipo, @nombre, @descripcion)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
