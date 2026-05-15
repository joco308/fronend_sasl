import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT id_direccion, id_zona, calle, n_casa, create_at, update_at
      FROM   Direccion
      ORDER  BY id_direccion
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
    const { id_zona, calle, n_casa } = body;

    if (!id_zona || !calle || n_casa == null) {
      return NextResponse.json(
        { success: false, message: 'id_zona, calle y n_casa son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_zona', sql.Int,           parseInt(id_zona, 10))
      .input('calle',   sql.NVarChar(100), calle)
      .input('n_casa',  sql.Int,           parseInt(n_casa, 10))
      .query(`
        INSERT INTO Direccion (id_zona, calle, n_casa)
        OUTPUT INSERTED.*
        VALUES (@id_zona, @calle, @n_casa)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
