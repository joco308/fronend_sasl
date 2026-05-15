import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT sd.id_sub_dominio, sd.id_dominio, sd.detalle, sd.create_at, sd.update_at,
             d.dominio
      FROM   Sub_dominios sd
      LEFT JOIN Dominios d ON d.id_dominio = sd.id_dominio
      ORDER  BY sd.id_sub_dominio
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
    const { id_dominio, detalle } = body;

    if (!id_dominio || !detalle) {
      return NextResponse.json(
        { success: false, message: 'id_dominio y detalle son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_dominio', sql.Int,           parseInt(id_dominio, 10))
      .input('detalle',    sql.NVarChar(100), detalle)
      .query(`
        INSERT INTO Sub_dominios (id_dominio, detalle)
        OUTPUT INSERTED.*
        VALUES (@id_dominio, @detalle)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
