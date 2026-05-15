import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_maquinaria = searchParams.get('id_maquinaria');

    const pool = await getConnection();
    const req  = pool.request();
    let query = `
      SELECT mm.id_maquinaria, mm.id_mantenimiento, mm.create_at, mm.update_at,
             m.nombre_maquinaria, mn.fecha_mantenimiento, mn.descripcion, mn.costo
      FROM   Mantenimientos_maquinaria mm
      LEFT JOIN Maquinaria m ON m.id_maquinaria = mm.id_maquinaria
      LEFT JOIN Mantenimiento mn ON mn.id_mantenimiento = mm.id_mantenimiento
    `;
    if (id_maquinaria) {
      req.input('id_maquinaria', sql.Int, parseInt(id_maquinaria, 10));
      query += ' WHERE mm.id_maquinaria = @id_maquinaria';
    }
    query += ' ORDER BY mn.fecha_mantenimiento DESC';

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
    const { id_maquinaria, id_mantenimiento } = body;

    if (!id_maquinaria || !id_mantenimiento) {
      return NextResponse.json(
        { success: false, message: 'id_maquinaria e id_mantenimiento son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_maquinaria',   sql.Int, parseInt(id_maquinaria, 10))
      .input('id_mantenimiento',sql.Int, parseInt(id_mantenimiento, 10))
      .query(`
        INSERT INTO Mantenimientos_maquinaria (id_maquinaria, id_mantenimiento)
        OUTPUT INSERTED.*
        VALUES (@id_maquinaria, @id_mantenimiento)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
