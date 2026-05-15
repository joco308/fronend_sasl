import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool   = await getConnection();
    const result = await pool.request().query(`
      SELECT id_cliente, id_empresa, id_direccion,
             nombre_cliente, contacto_emergencia,
             create_at, update_at
      FROM   Cliente
      ORDER  BY id_cliente
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
    const { id_empresa, id_direccion, nombre_cliente, contacto_emergencia } = body;

    if (!id_empresa || !id_direccion || !nombre_cliente) {
      return NextResponse.json(
        { success: false, message: 'id_empresa, id_direccion y nombre_cliente son obligatorios.' },
        { status: 400 }
      );
    }

    const pool   = await getConnection();
    const result = await pool.request()
      .input('id_empresa',           sql.Int,           id_empresa)
      .input('id_direccion',         sql.Int,           id_direccion)
      .input('nombre_cliente',       sql.NVarChar(255), nombre_cliente)
      .input('contacto_emergencia',  sql.NVarChar(255), contacto_emergencia ?? null)
      .query(`
        INSERT INTO Cliente (id_empresa, id_direccion, nombre_cliente, contacto_emergencia)
        OUTPUT INSERTED.*
        VALUES (@id_empresa, @id_direccion, @nombre_cliente, @contacto_emergencia)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
