import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { id_servicio, descripcion, fecha } = body;

    if (!id_servicio || !descripcion || !fecha) {
      return NextResponse.json(
        { success: false, message: 'id_servicio, descripcion y fecha son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',          sql.Int,           parseInt(id, 10))
      .input('id_servicio', sql.Int,           parseInt(id_servicio, 10))
      .input('descripcion', sql.NVarChar(300), descripcion)
      .input('fecha',       sql.Date,          new Date(fecha))
      .query(`
        UPDATE Incidentes
        SET id_servicio = @id_servicio,
            descripcion = @descripcion,
            fecha       = @fecha,
            update_at   = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_incidente = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Incidente no encontrado.' }, { status: 404 });
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
      .query('DELETE FROM Incidentes OUTPUT DELETED.id_incidente WHERE id_incidente = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Incidente no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
