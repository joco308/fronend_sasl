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
      SELECT am.id_servicio, am.id_maquinaria, am.cantidad, am.descripcion,
             m.nombre_maquinaria, m.codigo_inv
      FROM   Asignacion_maquinaria am
      LEFT JOIN Maquinaria m ON m.id_maquinaria = am.id_maquinaria
    `;
    if (id_servicio) {
      req.input('id_servicio', sql.Int, parseInt(id_servicio, 10));
      query += ' WHERE am.id_servicio = @id_servicio';
    }
    query += ' ORDER BY am.id_servicio, am.id_maquinaria';

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
    const { id_servicio, id_maquinaria, cantidad, descripcion } = body;

    if (!id_servicio || !id_maquinaria || cantidad == null) {
      return NextResponse.json(
        { success: false, message: 'id_servicio, id_maquinaria y cantidad son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_servicio',   sql.Int,           parseInt(id_servicio, 10))
      .input('id_maquinaria', sql.Int,           parseInt(id_maquinaria, 10))
      .input('cantidad',      sql.Int,           parseInt(cantidad, 10))
      .input('descripcion',   sql.NVarChar(300), descripcion ?? null)
      .query(`
        INSERT INTO Asignacion_maquinaria (id_servicio, id_maquinaria, cantidad, descripcion)
        OUTPUT INSERTED.*
        VALUES (@id_servicio, @id_maquinaria, @cantidad, @descripcion)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
