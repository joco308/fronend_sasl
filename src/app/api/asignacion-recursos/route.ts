import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_servicio = searchParams.get('id_servicio');

    const pool = await getConnection();
    const req  = pool.request();
    let query = `
      SELECT ar.id_servicio, ar.id_recurso, ar.cantidad,
             r.nombre AS nombre_recurso
      FROM   Asignacion_recursos ar
      LEFT JOIN Recursos r ON r.id_recurso = ar.id_recurso
    `;
    if (id_servicio) {
      req.input('id_servicio', sql.Int, parseInt(id_servicio, 10));
      query += ' WHERE ar.id_servicio = @id_servicio';
    }
    query += ' ORDER BY ar.id_servicio, ar.id_recurso';

    const result = await req.query(query);
    return NextResponse.json({ success: true, data: result.recordset });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_servicio, id_recurso, cantidad } = body;

    if (!id_servicio || !id_recurso || cantidad == null) {
      return NextResponse.json(
        { success: false, message: 'id_servicio, id_recurso y cantidad son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_servicio', sql.Int, parseInt(id_servicio, 10))
      .input('id_recurso',  sql.Int, parseInt(id_recurso, 10))
      .input('cantidad',    sql.Int, parseInt(cantidad, 10))
      .query(`
        INSERT INTO Asignacion_recursos (id_servicio, id_recurso, cantidad)
        OUTPUT INSERTED.*
        VALUES (@id_servicio, @id_recurso, @cantidad)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
