import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_usuario     = searchParams.get('id_usuario');
    const id_capacitacion = searchParams.get('id_capacitacion');

    const pool = await getConnection();
    const req  = pool.request();
    const where: string[] = [];

    if (id_usuario) {
      req.input('id_usuario', sql.Int, parseInt(id_usuario, 10));
      where.push('uc.id_usuario = @id_usuario');
    }
    if (id_capacitacion) {
      req.input('id_capacitacion', sql.Int, parseInt(id_capacitacion, 10));
      where.push('uc.id_capacitacion = @id_capacitacion');
    }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const result = await req.query(`
      SELECT uc.id_usuario, uc.id_capacitacion, uc.estado,
             u.nombre_usuario, c.nombre AS nombre_capacitacion, c.fecha
      FROM   Usuarios_capacitaciones uc
      LEFT JOIN Usuario_trabajador u ON u.id_usuario = uc.id_usuario
      LEFT JOIN Capacitaciones c ON c.id_capacitacion = uc.id_capacitacion
      ${whereClause}
      ORDER  BY c.fecha DESC
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
    const { id_usuario, id_capacitacion, estado } = body;

    if (!id_usuario || !id_capacitacion || !estado) {
      return NextResponse.json(
        { success: false, message: 'id_usuario, id_capacitacion y estado son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_usuario',     sql.Int,          parseInt(id_usuario, 10))
      .input('id_capacitacion',sql.Int,          parseInt(id_capacitacion, 10))
      .input('estado',         sql.NVarChar(50), estado)
      .query(`
        INSERT INTO Usuarios_capacitaciones (id_usuario, id_capacitacion, estado)
        OUTPUT INSERTED.*
        VALUES (@id_usuario, @id_capacitacion, @estado)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id_usuario, id_capacitacion, estado } = body;

    if (!id_usuario || !id_capacitacion || !estado) {
      return NextResponse.json(
        { success: false, message: 'id_usuario, id_capacitacion y estado son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_usuario',     sql.Int,          parseInt(id_usuario, 10))
      .input('id_capacitacion',sql.Int,          parseInt(id_capacitacion, 10))
      .input('estado',         sql.NVarChar(50), estado)
      .query(`
        UPDATE Usuarios_capacitaciones
        SET estado = @estado
        OUTPUT INSERTED.*
        WHERE id_usuario = @id_usuario AND id_capacitacion = @id_capacitacion
      `);

    if (result.recordset.length === 0)
      return NextResponse.json({ success: false, message: 'Asignación no encontrada.' }, { status: 404 });
    return NextResponse.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
