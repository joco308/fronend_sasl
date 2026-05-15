import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { id_pais, nombre_marca } = body;

    if (!nombre_marca || !id_pais) {
      return NextResponse.json(
        { success: false, message: 'nombre_marca e id_pais son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',           sql.Int,           parseInt(id, 10))
      .input('id_pais',      sql.Int,           parseInt(id_pais, 10))
      .input('nombre_marca', sql.NVarChar(100), nombre_marca)
      .query(`
        UPDATE Marca_maquinaria
        SET id_pais      = @id_pais,
            nombre_marca = @nombre_marca,
            update_at    = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_marca_maquinaria = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Marca no encontrada.' }, { status: 404 });
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
      .query('DELETE FROM Marca_maquinaria OUTPUT DELETED.id_marca_maquinaria WHERE id_marca_maquinaria = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Marca no encontrada.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
