import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { id_empleado, descripcion } = body;

    if (!id_empleado || !descripcion) {
      return NextResponse.json(
        { success: false, message: 'id_empleado y descripcion son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',          sql.Int,              parseInt(id, 10))
      .input('id_empleado', sql.Int,              parseInt(id_empleado, 10))
      .input('descripcion', sql.NVarChar(sql.MAX), descripcion)
      .query(`
        UPDATE Memorial
        SET id_empleado = @id_empleado,
            descripcion = @descripcion,
            update_at   = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_memorial = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Memorial no encontrado.' }, { status: 404 });
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
      .query('DELETE FROM Memorial OUTPUT DELETED.id_memorial WHERE id_memorial = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Memorial no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
