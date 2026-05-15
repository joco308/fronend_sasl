import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { telefono, id_detalle, id_cliente } = body;

    if (!telefono || !id_detalle || !id_cliente) {
      return NextResponse.json(
        { success: false, message: 'telefono, id_detalle e id_cliente son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',         sql.Int, parseInt(id, 10))
      .input('telefono',   sql.Int, parseInt(telefono, 10))
      .input('id_detalle', sql.Int, parseInt(id_detalle, 10))
      .input('id_cliente', sql.Int, parseInt(id_cliente, 10))
      .query(`
        UPDATE Telefono_cliente
        SET telefono   = @telefono,
            id_detalle = @id_detalle,
            id_cliente = @id_cliente,
            update_at  = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_telefono = @id
      `);

    if (result.recordset.length === 0)
      return NextResponse.json({ success: false, message: 'Teléfono no encontrado.' }, { status: 404 });
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
      .query('DELETE FROM Telefono_cliente OUTPUT DELETED.id_telefono WHERE id_telefono = @id');

    if (result.recordset.length === 0)
      return NextResponse.json({ success: false, message: 'Teléfono no encontrado.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
