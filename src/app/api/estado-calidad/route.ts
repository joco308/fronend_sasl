import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT id_estado_calidad, estado_calidad, create_at, update_at
      FROM   Estado_calidad
      ORDER  BY id_estado_calidad
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
    const { estado_calidad } = body;

    if (!estado_calidad) {
      return NextResponse.json(
        { success: false, message: 'estado_calidad es obligatorio.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('estado_calidad', sql.NVarChar(100), estado_calidad)
      .query(`
        INSERT INTO Estado_calidad (estado_calidad)
        OUTPUT INSERTED.*
        VALUES (@estado_calidad)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
