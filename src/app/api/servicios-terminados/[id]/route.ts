import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { id_servicio, satisfaccion, comentarios } = body;

    if (!id_servicio || satisfaccion == null) {
      return NextResponse.json(
        { success: false, message: 'id_servicio y satisfaccion son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',           sql.Int,           parseInt(id, 10))
      .input('id_servicio',  sql.Int,           parseInt(id_servicio, 10))
      .input('satisfaccion', sql.Int,           parseInt(satisfaccion, 10))
      .input('comentarios',  sql.NVarChar(300), comentarios ?? null)
      .query(`
        UPDATE Servicio_terminado
        SET id_servicio  = @id_servicio,
            satisfaccion = @satisfaccion,
            comentarios  = @comentarios,
            update_at    = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_servicio_terminado = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Servicio terminado no encontrado.' }, { status: 404 });
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
      .query('DELETE FROM Servicio_terminado OUTPUT DELETED.id_servicio_terminado WHERE id_servicio_terminado = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Servicio terminado no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
