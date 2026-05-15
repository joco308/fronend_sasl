import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_cliente = searchParams.get('id_cliente');

    const pool = await getConnection();
    const req  = pool.request();
    let query = `
      SELECT id_telefono, telefono, id_detalle, id_cliente, create_at, update_at
      FROM   Telefono_cliente
    `;
    if (id_cliente) {
      req.input('id_cliente', sql.Int, parseInt(id_cliente, 10));
      query += ' WHERE id_cliente = @id_cliente';
    }
    query += ' ORDER BY id_telefono';

    const result = await req.query(query);
    return NextResponse.json({ success: true, data: result.recordset });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
      .input('telefono',   sql.Int, parseInt(telefono, 10))
      .input('id_detalle', sql.Int, parseInt(id_detalle, 10))
      .input('id_cliente', sql.Int, parseInt(id_cliente, 10))
      .query(`
        INSERT INTO Telefono_cliente (telefono, id_detalle, id_cliente)
        OUTPUT INSERTED.*
        VALUES (@telefono, @id_detalle, @id_cliente)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
