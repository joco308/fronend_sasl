import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT id_marca_maquinaria, id_pais, nombre_marca, create_at, update_at
      FROM   Marca_maquinaria
      ORDER  BY id_marca_maquinaria
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
    const { id_pais, nombre_marca } = body;

    if (!nombre_marca || !id_pais) {
      return NextResponse.json(
        { success: false, message: 'nombre_marca e id_pais son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_pais',      sql.Int,           parseInt(id_pais, 10))
      .input('nombre_marca', sql.NVarChar(100), nombre_marca)
      .query(`
        INSERT INTO Marca_maquinaria (id_pais, nombre_marca)
        OUTPUT INSERTED.*
        VALUES (@id_pais, @nombre_marca)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
