import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_usuario = searchParams.get('id_usuario');

    const pool = await getConnection();
    const req  = pool.request();

    let query = `
      SELECT d.id_documento, d.id_usuario, d.tipo_de_documento,
             d.archivo, d.fecha_subida, d.create_at, d.update_at,
             u.nombre_usuario
      FROM   Documentos_usuarios d
      LEFT JOIN Usuario_trabajador u ON u.id_usuario = d.id_usuario
    `;

    if (id_usuario) {
      req.input('id_usuario', sql.Int, parseInt(id_usuario, 10));
      query += ' WHERE d.id_usuario = @id_usuario';
    }

    query += ' ORDER BY d.fecha_subida DESC';

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
    const { id_usuario, tipo_de_documento, archivo, fecha_subida } = body;

    if (!id_usuario || !tipo_de_documento || !archivo || !fecha_subida) {
      return NextResponse.json(
        { success: false, message: 'id_usuario, tipo_de_documento, archivo y fecha_subida son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_usuario',       sql.Int,              parseInt(id_usuario, 10))
      .input('tipo_de_documento',sql.NVarChar(100),    tipo_de_documento)
      .input('archivo',          sql.NVarChar(sql.MAX), archivo)
      .input('fecha_subida',     sql.Date,             new Date(fecha_subida))
      .query(`
        INSERT INTO Documentos_usuarios (id_usuario, tipo_de_documento, archivo, fecha_subida)
        OUTPUT INSERTED.*
        VALUES (@id_usuario, @tipo_de_documento, @archivo, @fecha_subida)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
