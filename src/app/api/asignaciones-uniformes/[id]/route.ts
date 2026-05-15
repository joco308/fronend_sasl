import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { id_usuario, id_uniforme, fecha_entrega, fecha_devolucion, estado } = body;

    if (!id_usuario || !id_uniforme || !fecha_entrega || !estado) {
      return NextResponse.json(
        { success: false, message: 'id_usuario, id_uniforme, fecha_entrega y estado son obligatorios.' },
        { status: 400 }
      );
    }

    const pool   = await getConnection();
    const result = await pool.request()
      .input('id',               sql.Int,           parseInt(id, 10))
      .input('id_usuario',       sql.Int,           id_usuario)
      .input('id_uniforme',      sql.Int,           id_uniforme)
      .input('fecha_entrega',    sql.Date,          new Date(fecha_entrega))
      .input('fecha_devolucion', sql.Date,          fecha_devolucion ? new Date(fecha_devolucion) : null)
      .input('estado',           sql.NVarChar(100), estado)
      .query(`
        UPDATE Asignacion_uniformes
        SET id_usuario       = @id_usuario,
            id_uniforme      = @id_uniforme,
            fecha_entrega    = @fecha_entrega,
            fecha_devolucion = @fecha_devolucion,
            estado           = @estado,
            update_at        = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_asignacion = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Asignación no encontrada.' }, { status: 404 });
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
      .query('DELETE FROM Asignacion_uniformes OUTPUT DELETED.id_asignacion WHERE id_asignacion = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Asignación no encontrada.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
