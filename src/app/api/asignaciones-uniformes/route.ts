import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool   = await getConnection();
    const result = await pool.request().query(`
      SELECT
        a.id_asignacion,
        a.id_usuario,
        a.id_uniforme,
        u.nombre_uniforme,
        a.fecha_entrega,
        a.fecha_devolucion,
        a.estado,
        a.create_at,
        a.update_at
      FROM Asignacion_uniformes a
      LEFT JOIN Uniformes u ON u.id_uniforme = a.id_uniforme
      ORDER BY a.id_asignacion
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
    const { id_usuario, id_uniforme, fecha_entrega, fecha_devolucion, estado } = body;

    if (!id_usuario || !id_uniforme || !fecha_entrega || !estado) {
      return NextResponse.json(
        { success: false, message: 'id_usuario, id_uniforme, fecha_entrega y estado son obligatorios.' },
        { status: 400 }
      );
    }

    const pool   = await getConnection();
    const result = await pool.request()
      .input('id_usuario',       sql.Int,           id_usuario)
      .input('id_uniforme',      sql.Int,           id_uniforme)
      .input('fecha_entrega',    sql.Date,          new Date(fecha_entrega))
      .input('fecha_devolucion', sql.Date,          fecha_devolucion ? new Date(fecha_devolucion) : null)
      .input('estado',           sql.NVarChar(100), estado)
      .query(`
        INSERT INTO Asignacion_uniformes (id_usuario, id_uniforme, fecha_entrega, fecha_devolucion, estado)
        OUTPUT INSERTED.*
        VALUES (@id_usuario, @id_uniforme, @fecha_entrega, @fecha_devolucion, @estado)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
