import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT id_rol, nombre_rol, salario, create_at, update_at
      FROM   Roles
      ORDER  BY id_rol
    `);
    return NextResponse.json({ success: true, data: result.recordset });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
      .input('nombre_rol', sql.NVarChar(50), nombre_rol)
      .input('salario',    sql.Int,          parseInt(salario, 10))
      .query(`
        INSERT INTO Roles (nombre_rol, salario)
        OUTPUT INSERTED.*
        VALUES (@nombre_rol, @salario)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
