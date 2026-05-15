import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { id_empresa, id_direccion, nombre_cliente, contacto_emergencia } = body;

    if (!id_empresa || !id_direccion || !nombre_cliente) {
      return NextResponse.json(
        { success: false, message: 'id_empresa, id_direccion y nombre_cliente son obligatorios.' },
        { status: 400 }
      );
    }

    const pool   = await getConnection();
    const result = await pool.request()
      .input('id',                   sql.Int,           parseInt(id, 10))
      .input('id_empresa',           sql.Int,           id_empresa)
      .input('id_direccion',         sql.Int,           id_direccion)
      .input('nombre_cliente',       sql.NVarChar(255), nombre_cliente)
      .input('contacto_emergencia',  sql.NVarChar(255), contacto_emergencia ?? null)
      .query(`
        UPDATE Cliente
        SET id_empresa          = @id_empresa,
            id_direccion        = @id_direccion,
            nombre_cliente      = @nombre_cliente,
            contacto_emergencia = @contacto_emergencia,
            update_at           = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_cliente = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Cliente no encontrado.' }, { status: 404 });
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
      .query('DELETE FROM Cliente OUTPUT DELETED.id_cliente WHERE id_cliente = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Cliente no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
