import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { hora_entrada, hora_salida } = body;

    if (!hora_entrada || !hora_salida) {
      return NextResponse.json(
        { success: false, message: 'hora_entrada y hora_salida son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',           sql.Int,        parseInt(id, 10))
      .input('hora_entrada', sql.VarChar(8), hora_entrada)
      .input('hora_salida',  sql.VarChar(8), hora_salida)
      .query(`
        UPDATE Horario
        SET hora_entrada = @hora_entrada,
            hora_salida  = @hora_salida,
            update_at    = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_horario = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Horario no encontrado.' }, { status: 404 });
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
      .query('DELETE FROM Horario OUTPUT DELETED.id_horario WHERE id_horario = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Horario no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
