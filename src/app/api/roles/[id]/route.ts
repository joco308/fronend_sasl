import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre_rol, salario } = body;

    if (!nombre_rol || salario == null) {
      return NextResponse.json(
        { success: false, message: 'nombre_rol y salario son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',         sql.Int,          parseInt(id, 10))
      .input('nombre_rol', sql.NVarChar(50), nombre_rol)
      .input('salario',    sql.Int,          parseInt(salario, 10))
      .query(`
        UPDATE Roles
        SET nombre_rol = @nombre_rol,
            salario    = @salario,
            update_at  = SYSUTCDATETIME()
        OUTPUT INSERTED.*
        WHERE id_rol = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Rol no encontrado.' }, { status: 404 });
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
      .query('DELETE FROM Roles OUTPUT DELETED.id_rol WHERE id_rol = @id');

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Rol no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
