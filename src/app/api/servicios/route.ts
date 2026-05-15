import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT s.id_servicio, s.id_cliente, s.id_direccion, s.tipo_servicio,
             s.fecha_inicio, s.fecha_final, s.costo, s.descripcion,
             s.create_at, s.update_at,
             c.nombre_cliente
      FROM   Servicio s
      LEFT JOIN Cliente c ON c.id_cliente = s.id_cliente
      ORDER  BY s.id_servicio DESC
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
    const { id_cliente, id_direccion, tipo_servicio, fecha_inicio, fecha_final, costo, descripcion } = body;

    if (!id_cliente || !id_direccion || !tipo_servicio || !fecha_inicio || costo == null) {
      return NextResponse.json(
        { success: false, message: 'id_cliente, id_direccion, tipo_servicio, fecha_inicio y costo son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_cliente',    sql.Int,          parseInt(id_cliente, 10))
      .input('id_direccion',  sql.Int,          parseInt(id_direccion, 10))
      .input('tipo_servicio', sql.Int,          parseInt(tipo_servicio, 10))
      .input('fecha_inicio',  sql.Date,         new Date(fecha_inicio))
      .input('fecha_final',   sql.Date,         fecha_final ? new Date(fecha_final) : null)
      .input('costo',         sql.Decimal(10,2), parseFloat(costo))
      .input('descripcion',   sql.NVarChar(300), descripcion ?? null)
      .query(`
        INSERT INTO Servicio (id_cliente, id_direccion, tipo_servicio, fecha_inicio, fecha_final, costo, descripcion)
        OUTPUT INSERTED.*
        VALUES (@id_cliente, @id_direccion, @tipo_servicio, @fecha_inicio, @fecha_final, @costo, @descripcion)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
