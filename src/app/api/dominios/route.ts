import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT id_dominio, dominio, create_at, update_at
      FROM   Dominios
      ORDER  BY id_dominio
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
    const { dominio } = body;

    if (!dominio) {
      return NextResponse.json(
        { success: false, message: 'dominio es obligatorio.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('dominio', sql.NVarChar(100), dominio)
      .query(`
        INSERT INTO Dominios (dominio)
        OUTPUT INSERTED.*
        VALUES (@dominio)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
