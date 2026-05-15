import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { id_proveedor, id_tipo, nombre, descripcion } = body;

    if (!nombre || !id_proveedor || !id_tipo) {
      return NextResponse.json(
        { success: false, message: 'nombre, id_proveedor e id_tipo son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',          sql.Int,           parseInt(id, 10))
      .input('id_proveedor',sql.Int,           parseInt(id_proveedor, 10))
      .input('id_tipo',     sql.Int,           parseInt(id_tipo, 10))
      .input('nombre',      sql.NVarChar(100), nombre)
      .input('descripcion', sql.NVarChar(300), descripcion ?? null)
      .query(`
        UPDATE Recursos
        SET id_proveedor = @id_proveedor,
            id_tipo      = @id_tipo,
            nombre       = @nombre,
            descripcion  = @descripcion,
            update_at    = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_recurso = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Recurso no encontrado.' }, { status: 404 });
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
      .query('DELETE FROM Recursos OUTPUT DELETED.id_recurso WHERE id_recurso = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Recurso no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
