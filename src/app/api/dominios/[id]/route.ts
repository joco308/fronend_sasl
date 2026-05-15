import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { dominio } = body;

    if (!dominio) {
      return NextResponse.json(
        { success: false, message: 'dominio es obligatorio.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',      sql.Int,           parseInt(id, 10))
      .input('dominio', sql.NVarChar(100), dominio)
      .query(`
        UPDATE Dominios
        SET dominio   = @dominio,
            update_at = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_dominio = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Dominio no encontrado.' }, { status: 404 });
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
      .query('DELETE FROM Dominios OUTPUT DELETED.id_dominio WHERE id_dominio = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Dominio no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
