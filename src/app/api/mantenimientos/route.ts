import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT id_mantenimiento, fecha_mantenimiento, descripcion, costo, create_at, update_at
      FROM   Mantenimiento
      ORDER  BY fecha_mantenimiento DESC
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
    const { fecha_mantenimiento, descripcion, costo } = body;

    if (!fecha_mantenimiento || costo == null) {
      return NextResponse.json(
        { success: false, message: 'fecha_mantenimiento y costo son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('fecha_mantenimiento', sql.Date,          new Date(fecha_mantenimiento))
      .input('descripcion',         sql.NVarChar(300), descripcion ?? null)
      .input('costo',               sql.Decimal(10,2), parseFloat(costo))
      .query(`
        INSERT INTO Mantenimiento (fecha_mantenimiento, descripcion, costo)
        OUTPUT INSERTED.*
        VALUES (@fecha_mantenimiento, @descripcion, @costo)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
