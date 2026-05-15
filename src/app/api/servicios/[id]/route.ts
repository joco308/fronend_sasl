import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id, 10))
      .query(`
        SELECT s.*, c.nombre_cliente
        FROM   Servicio s
        LEFT JOIN Cliente c ON c.id_cliente = s.id_cliente
        WHERE  s.id_servicio = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Servicio no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
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
      .input('id',            sql.Int,           parseInt(id, 10))
      .input('id_cliente',    sql.Int,           parseInt(id_cliente, 10))
      .input('id_direccion',  sql.Int,           parseInt(id_direccion, 10))
      .input('tipo_servicio', sql.Int,           parseInt(tipo_servicio, 10))
      .input('fecha_inicio',  sql.Date,          new Date(fecha_inicio))
      .input('fecha_final',   sql.Date,          fecha_final ? new Date(fecha_final) : null)
      .input('costo',         sql.Decimal(10,2), parseFloat(costo))
      .input('descripcion',   sql.NVarChar(300), descripcion ?? null)
      .query(`
        UPDATE Servicio
        SET id_cliente    = @id_cliente,
            id_direccion  = @id_direccion,
            tipo_servicio = @tipo_servicio,
            fecha_inicio  = @fecha_inicio,
            fecha_final   = @fecha_final,
            costo         = @costo,
            descripcion   = @descripcion,
            update_at     = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_servicio = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Servicio no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id, 10))
      .query('DELETE FROM Servicio OUTPUT DELETED.id_servicio WHERE id_servicio = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Servicio no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
