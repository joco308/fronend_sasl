import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT h.id_historial, h.id_maquinaria, h.id_estado_calidad,
             h.fecha_cambio, h.descripcion, h.create_at, h.update_at,
             m.nombre_maquinaria, ec.estado_calidad
      FROM   Historial_estado_maquina h
      LEFT JOIN Maquinaria m ON m.id_maquinaria = h.id_maquinaria
      LEFT JOIN Estado_calidad ec ON ec.id_estado_calidad = h.id_estado_calidad
      ORDER  BY h.fecha_cambio DESC
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
    const { id_maquinaria, id_estado_calidad, fecha_cambio, descripcion } = body;

    if (!id_maquinaria || !id_estado_calidad || !fecha_cambio) {
      return NextResponse.json(
        { success: false, message: 'id_maquinaria, id_estado_calidad y fecha_cambio son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_maquinaria',    sql.Int,           parseInt(id_maquinaria, 10))
      .input('id_estado_calidad',sql.Int,           parseInt(id_estado_calidad, 10))
      .input('fecha_cambio',     sql.DateTime2,     new Date(fecha_cambio))
      .input('descripcion',      sql.NVarChar(300), descripcion ?? null)
      .query(`
        INSERT INTO Historial_estado_maquina (id_maquinaria, id_estado_calidad, fecha_cambio, descripcion)
        OUTPUT INSERTED.*
        VALUES (@id_maquinaria, @id_estado_calidad, @fecha_cambio, @descripcion)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
