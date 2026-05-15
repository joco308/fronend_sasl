import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool   = await getConnection();
    const result = await pool.request().query(`
      SELECT id_uniforme, nombre_uniforme, talla,
             descripcion, create_at, update_at
      FROM   Uniformes
      ORDER  BY id_uniforme
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
    const { nombre_uniforme, talla, descripcion } = body;

    if (!nombre_uniforme || talla === undefined) {
      return NextResponse.json(
        { success: false, message: 'nombre_uniforme y talla son obligatorios.' },
        { status: 400 }
      );
    }

    const pool   = await getConnection();
    const result = await pool.request()
      .input('nombre_uniforme', sql.NVarChar(255), nombre_uniforme)
      .input('talla',           sql.Int,           talla)
      .input('descripcion',     sql.NVarChar(500), descripcion ?? null)
      .query(`
        INSERT INTO Uniformes (nombre_uniforme, talla, descripcion)
        OUTPUT INSERTED.*
        VALUES (@nombre_uniforme, @talla, @descripcion)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
