import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT id_proveedor, id_empresa, id_producto, nit, nombre, create_at, update_at
      FROM   Provedores
      ORDER  BY id_proveedor
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
    const { id_empresa, id_producto, nit, nombre } = body;

    if (!nombre || !nit || !id_empresa || !id_producto) {
      return NextResponse.json(
        { success: false, message: 'nombre, nit, id_empresa e id_producto son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_empresa',  sql.Int,          parseInt(id_empresa, 10))
      .input('id_producto', sql.Int,          parseInt(id_producto, 10))
      .input('nit',         sql.Int,          parseInt(nit, 10))
      .input('nombre',      sql.NVarChar(50), nombre)
      .query(`
        INSERT INTO Provedores (id_empresa, id_producto, nit, nombre)
        OUTPUT INSERTED.*
        VALUES (@id_empresa, @id_producto, @nit, @nombre)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
