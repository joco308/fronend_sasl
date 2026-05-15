import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, descripcion, fecha } = body;

    if (!nombre || !fecha) {
      return NextResponse.json(
        { success: false, message: 'nombre y fecha son obligatorios.' },
        { status: 400 }
      );
    }

    const pool   = await getConnection();
    const result = await pool.request()
      .input('id',          sql.Int,           parseInt(id, 10))
      .input('nombre',      sql.NVarChar(255), nombre)
      .input('descripcion', sql.NVarChar(500), descripcion ?? null)
      .input('fecha',       sql.Date,          new Date(fecha))
      .query(`
        UPDATE Capacitaciones
        SET nombre      = @nombre,
            descripcion = @descripcion,
            fecha       = @fecha,
            update_at   = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_capacitacion = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Capacitación no encontrada.' }, { status: 404 });
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
    const pool   = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id, 10))
      .query('DELETE FROM Capacitaciones OUTPUT DELETED.id_capacitacion WHERE id_capacitacion = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Capacitación no encontrada.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
