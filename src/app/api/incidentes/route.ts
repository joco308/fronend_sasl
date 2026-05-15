import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT i.id_incidente, i.id_servicio, i.descripcion, i.fecha,
             i.create_at, i.update_at
      FROM   Incidentes i
      ORDER  BY i.fecha DESC
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
    const { id_servicio, descripcion, fecha } = body;

    if (!id_servicio || !descripcion || !fecha) {
      return NextResponse.json(
        { success: false, message: 'id_servicio, descripcion y fecha son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_servicio', sql.Int,           parseInt(id_servicio, 10))
      .input('descripcion', sql.NVarChar(300), descripcion)
      .input('fecha',       sql.Date,          new Date(fecha))
      .query(`
        INSERT INTO Incidentes (id_servicio, descripcion, fecha)
        OUTPUT INSERTED.*
        VALUES (@id_servicio, @descripcion, @fecha)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
