import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool   = await getConnection();
    const result = await pool.request().query(`
      SELECT id_capacitacion, nombre, descripcion,
             fecha, create_at, update_at
      FROM   Capacitaciones
      ORDER  BY fecha DESC
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
    const { nombre, descripcion, fecha } = body;

    if (!nombre || !fecha) {
      return NextResponse.json(
        { success: false, message: 'nombre y fecha son obligatorios.' },
        { status: 400 }
      );
    }

    const pool   = await getConnection();
    const result = await pool.request()
      .input('nombre',      sql.NVarChar(255), nombre)
      .input('descripcion', sql.NVarChar(500), descripcion ?? null)
      .input('fecha',       sql.Date,          new Date(fecha))
      .query(`
        INSERT INTO Capacitaciones (nombre, descripcion, fecha)
        OUTPUT INSERTED.*
        VALUES (@nombre, @descripcion, @fecha)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
