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
      SELECT ae.id_usuario, ae.id_servicio, ae.id_horario, ae.dias_laborales,
             ae.create_at, ae.update_at,
             u.nombre_usuario, h.hora_entrada, h.hora_salida
      FROM   Asignacion_empleados ae
      LEFT JOIN Usuario_trabajador u ON u.id_usuario = ae.id_usuario
      LEFT JOIN Horario h ON h.id_horario = ae.id_horario
    `;
    if (id_servicio) {
      req.input('id_servicio', sql.Int, parseInt(id_servicio, 10));
      query += ' WHERE ae.id_servicio = @id_servicio';
    }
    query += ' ORDER BY ae.id_servicio, ae.id_usuario';

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
    const { id_usuario, id_servicio, id_horario, dias_laborales } = body;

    if (!id_usuario || !id_servicio || !id_horario || dias_laborales == null) {
      return NextResponse.json(
        { success: false, message: 'id_usuario, id_servicio, id_horario y dias_laborales son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_usuario',    sql.Int, parseInt(id_usuario, 10))
      .input('id_servicio',   sql.Int, parseInt(id_servicio, 10))
      .input('id_horario',    sql.Int, parseInt(id_horario, 10))
      .input('dias_laborales',sql.Int, parseInt(dias_laborales, 10))
      .query(`
        INSERT INTO Asignacion_empleados (id_usuario, id_servicio, id_horario, dias_laborales)
        OUTPUT INSERTED.*
        VALUES (@id_usuario, @id_servicio, @id_horario, @dias_laborales)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id_usuario, id_servicio } = body;

    if (!id_usuario || !id_servicio) {
      return NextResponse.json(
        { success: false, message: 'id_usuario e id_servicio son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    await pool.request()
      .input('id_usuario',  sql.Int, parseInt(id_usuario, 10))
      .input('id_servicio', sql.Int, parseInt(id_servicio, 10))
      .query('DELETE FROM Asignacion_empleados WHERE id_usuario = @id_usuario AND id_servicio = @id_servicio');

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
