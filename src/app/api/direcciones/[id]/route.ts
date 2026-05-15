import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { id_zona, calle, n_casa } = body;

    if (!id_zona || !calle || n_casa == null) {
      return NextResponse.json(
        { success: false, message: 'id_zona, calle y n_casa son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',      sql.Int,           parseInt(id, 10))
      .input('id_zona', sql.Int,           parseInt(id_zona, 10))
      .input('calle',   sql.NVarChar(100), calle)
      .input('n_casa',  sql.Int,           parseInt(n_casa, 10))
      .query(`
        UPDATE Direccion
        SET id_zona   = @id_zona,
            calle     = @calle,
            n_casa    = @n_casa,
            update_at = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_direccion = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Dirección no encontrada.' }, { status: 404 });
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
      .query('DELETE FROM Direccion OUTPUT DELETED.id_direccion WHERE id_direccion = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Dirección no encontrada.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
