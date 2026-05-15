import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT st.id_servicio_terminado, st.id_servicio, st.satisfaccion,
             st.comentarios, st.create_at, st.update_at
      FROM   Servicio_terminado st
      ORDER  BY st.create_at DESC
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
    const { id_servicio, satisfaccion, comentarios } = body;

    if (!id_servicio || satisfaccion == null) {
      return NextResponse.json(
        { success: false, message: 'id_servicio y satisfaccion son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_servicio',  sql.Int,           parseInt(id_servicio, 10))
      .input('satisfaccion', sql.Int,           parseInt(satisfaccion, 10))
      .input('comentarios',  sql.NVarChar(300), comentarios ?? null)
      .query(`
        INSERT INTO Servicio_terminado (id_servicio, satisfaccion, comentarios)
        OUTPUT INSERTED.*
        VALUES (@id_servicio, @satisfaccion, @comentarios)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
