import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { fecha_mantenimiento, descripcion, costo } = body;

    if (!fecha_mantenimiento || costo == null) {
      return NextResponse.json(
        { success: false, message: 'fecha_mantenimiento y costo son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',                  sql.Int,           parseInt(id, 10))
      .input('fecha_mantenimiento', sql.Date,          new Date(fecha_mantenimiento))
      .input('descripcion',         sql.NVarChar(300), descripcion ?? null)
      .input('costo',               sql.Decimal(10,2), parseFloat(costo))
      .query(`
        UPDATE Mantenimiento
        SET fecha_mantenimiento = @fecha_mantenimiento,
            descripcion         = @descripcion,
            costo               = @costo,
            update_at           = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_mantenimiento = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Mantenimiento no encontrado.' }, { status: 404 });
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
      .query('DELETE FROM Mantenimiento OUTPUT DELETED.id_mantenimiento WHERE id_mantenimiento = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Mantenimiento no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
