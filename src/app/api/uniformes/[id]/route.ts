import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre_uniforme, talla, descripcion } = body;

    if (!nombre_uniforme || talla === undefined) {
      return NextResponse.json(
        { success: false, message: 'nombre_uniforme y talla son obligatorios.' },
        { status: 400 }
      );
    }

    const pool   = await getConnection();
    const result = await pool.request()
      .input('id',             sql.Int,           parseInt(id, 10))
      .input('nombre_uniforme', sql.NVarChar(255), nombre_uniforme)
      .input('talla',           sql.Int,           talla)
      .input('descripcion',     sql.NVarChar(500), descripcion ?? null)
      .query(`
        UPDATE Uniformes
        SET nombre_uniforme = @nombre_uniforme,
            talla           = @talla,
            descripcion     = @descripcion,
            update_at       = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_uniforme = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Uniforme no encontrado.' }, { status: 404 });
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
      .query('DELETE FROM Uniformes OUTPUT DELETED.id_uniforme WHERE id_uniforme = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Uniforme no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
