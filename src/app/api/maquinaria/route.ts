import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT m.id_maquinaria, m.id_proveedor, m.id_tipo_maquinaria,
             m.id_estado_calidad, m.id_marca_maquinaria,
             m.nombre_maquinaria, m.codigo_inv, m.descripcion,
             m.create_at, m.update_at,
             ec.estado_calidad, mm.nombre_marca
      FROM   Maquinaria m
      LEFT JOIN Estado_calidad ec ON ec.id_estado_calidad = m.id_estado_calidad
      LEFT JOIN Marca_maquinaria mm ON mm.id_marca_maquinaria = m.id_marca_maquinaria
      ORDER  BY m.id_maquinaria
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
    const { id_proveedor, id_tipo_maquinaria, id_estado_calidad, id_marca_maquinaria, nombre_maquinaria, codigo_inv, descripcion } = body;

    if (!nombre_maquinaria || !codigo_inv || !id_proveedor || !id_tipo_maquinaria || !id_estado_calidad || !id_marca_maquinaria) {
      return NextResponse.json(
        { success: false, message: 'nombre_maquinaria, codigo_inv, id_proveedor, id_tipo_maquinaria, id_estado_calidad e id_marca_maquinaria son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id_proveedor',        sql.Int,           parseInt(id_proveedor, 10))
      .input('id_tipo_maquinaria',  sql.Int,           parseInt(id_tipo_maquinaria, 10))
      .input('id_estado_calidad',   sql.Int,           parseInt(id_estado_calidad, 10))
      .input('id_marca_maquinaria', sql.Int,           parseInt(id_marca_maquinaria, 10))
      .input('nombre_maquinaria',   sql.NVarChar(100), nombre_maquinaria)
      .input('codigo_inv',          sql.NVarChar(50),  codigo_inv)
      .input('descripcion',         sql.NVarChar(300), descripcion ?? null)
      .query(`
        INSERT INTO Maquinaria (id_proveedor, id_tipo_maquinaria, id_estado_calidad, id_marca_maquinaria, nombre_maquinaria, codigo_inv, descripcion)
        OUTPUT INSERTED.*
        VALUES (@id_proveedor, @id_tipo_maquinaria, @id_estado_calidad, @id_marca_maquinaria, @nombre_maquinaria, @codigo_inv, @descripcion)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
