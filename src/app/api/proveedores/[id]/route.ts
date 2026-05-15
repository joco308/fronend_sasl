import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { id_empresa, id_producto, nit, nombre } = body;

    if (!nombre || !nit || !id_empresa || !id_producto) {
      return NextResponse.json(
        { success: false, message: 'nombre, nit, id_empresa e id_producto son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',          sql.Int,          parseInt(id, 10))
      .input('id_empresa',  sql.Int,          parseInt(id_empresa, 10))
      .input('id_producto', sql.Int,          parseInt(id_producto, 10))
      .input('nit',         sql.Int,          parseInt(nit, 10))
      .input('nombre',      sql.NVarChar(50), nombre)
      .query(`
        UPDATE Provedores
        SET id_empresa  = @id_empresa,
            id_producto = @id_producto,
            nit         = @nit,
            nombre      = @nombre,
            update_at   = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_proveedor = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Proveedor no encontrado.' }, { status: 404 });
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
      .query('DELETE FROM Provedores OUTPUT DELETED.id_proveedor WHERE id_proveedor = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Proveedor no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
