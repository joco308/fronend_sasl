import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { estado_calidad } = body;

    if (!estado_calidad) {
      return NextResponse.json(
        { success: false, message: 'estado_calidad es obligatorio.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',             sql.Int,           parseInt(id, 10))
      .input('estado_calidad', sql.NVarChar(100), estado_calidad)
      .query(`
        UPDATE Estado_calidad
        SET estado_calidad = @estado_calidad,
            update_at      = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_estado_calidad = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Estado no encontrado.' }, { status: 404 });
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
      .query('DELETE FROM Estado_calidad OUTPUT DELETED.id_estado_calidad WHERE id_estado_calidad = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Estado no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
