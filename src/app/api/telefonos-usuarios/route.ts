import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_usuario = searchParams.get('id_usuario');

    const pool = await getConnection();
    const req  = pool.request();
    let query = `
      SELECT id_telefono_usuario, telefono_usuario, id_usuario, id_detalle, create_at, update_at
      FROM   Telefono_usuarios
    `;
    if (id_usuario) {
      req.input('id_usuario', sql.Int, parseInt(id_usuario, 10));
      query += ' WHERE id_usuario = @id_usuario';
    }
    query += ' ORDER BY id_telefono_usuario';

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
    const { telefono_usuario, id_usuario, id_detalle } = body;

    if (!telefono_usuario || !id_usuario || !id_detalle) {
      return NextResponse.json(
        { success: false, message: 'telefono_usuario, id_usuario e id_detalle son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('telefono_usuario', sql.Int, parseInt(telefono_usuario, 10))
      .input('id_usuario',       sql.Int, parseInt(id_usuario, 10))
      .input('id_detalle',       sql.Int, parseInt(id_detalle, 10))
      .query(`
        INSERT INTO Telefono_usuarios (telefono_usuario, id_usuario, id_detalle)
        OUTPUT INSERTED.*
        VALUES (@telefono_usuario, @id_usuario, @id_detalle)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
