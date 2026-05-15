import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { id_proveedor, id_tipo_maquinaria, id_estado_calidad, id_marca_maquinaria, nombre_maquinaria, codigo_inv, descripcion } = body;

    if (!nombre_maquinaria || !codigo_inv || !id_proveedor || !id_tipo_maquinaria || !id_estado_calidad || !id_marca_maquinaria) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos FK y nombre/codigo son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',                   sql.Int,           parseInt(id, 10))
      .input('id_proveedor',         sql.Int,           parseInt(id_proveedor, 10))
      .input('id_tipo_maquinaria',   sql.Int,           parseInt(id_tipo_maquinaria, 10))
      .input('id_estado_calidad',    sql.Int,           parseInt(id_estado_calidad, 10))
      .input('id_marca_maquinaria',  sql.Int,           parseInt(id_marca_maquinaria, 10))
      .input('nombre_maquinaria',    sql.NVarChar(100), nombre_maquinaria)
      .input('codigo_inv',           sql.NVarChar(50),  codigo_inv)
      .input('descripcion',          sql.NVarChar(300), descripcion ?? null)
      .query(`
        UPDATE Maquinaria
        SET id_proveedor        = @id_proveedor,
            id_tipo_maquinaria  = @id_tipo_maquinaria,
            id_estado_calidad   = @id_estado_calidad,
            id_marca_maquinaria = @id_marca_maquinaria,
            nombre_maquinaria   = @nombre_maquinaria,
            codigo_inv          = @codigo_inv,
            descripcion         = @descripcion,
            update_at           = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_maquinaria = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Maquinaria no encontrada.' }, { status: 404 });
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
      .query('DELETE FROM Maquinaria OUTPUT DELETED.id_maquinaria WHERE id_maquinaria = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Maquinaria no encontrada.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
