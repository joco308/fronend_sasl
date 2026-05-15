import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT id_horario, hora_entrada, hora_salida, create_at, update_at
      FROM   Horario
      ORDER  BY id_horario
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
    const { hora_entrada, hora_salida } = body;

    if (!hora_entrada || !hora_salida) {
      return NextResponse.json(
        { success: false, message: 'hora_entrada y hora_salida son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('hora_entrada', sql.VarChar(8), hora_entrada)
      .input('hora_salida',  sql.VarChar(8), hora_salida)
      .query(`
        INSERT INTO Horario (hora_entrada, hora_salida)
        OUTPUT INSERTED.*
        VALUES (@hora_entrada, @hora_salida)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
