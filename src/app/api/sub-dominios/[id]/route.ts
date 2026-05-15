import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { id_dominio, detalle } = body;

    if (!id_dominio || !detalle) {
      return NextResponse.json(
        { success: false, message: 'id_dominio y detalle son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',         sql.Int,           parseInt(id, 10))
      .input('id_dominio', sql.Int,           parseInt(id_dominio, 10))
      .input('detalle',    sql.NVarChar(100), detalle)
      .query(`
        UPDATE Sub_dominios
        SET id_dominio = @id_dominio,
            detalle    = @detalle,
            update_at  = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_sub_dominio = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Sub-dominio no encontrado.' }, { status: 404 });
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
      .query('DELETE FROM Sub_dominios OUTPUT DELETED.id_sub_dominio WHERE id_sub_dominio = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Sub-dominio no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
