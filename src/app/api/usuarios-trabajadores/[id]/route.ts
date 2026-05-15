import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id, 10))
      .query(`
        SELECT u.id_usuario, u.correo, u.ci, u.nombre_usuario, u.fecha_nacimiento,
               u.id_rol, u.id_estado_civil, u.id_grado_academico, u.id_genero,
               u.id_direccion, u.id_pais, u.create_at, u.update_at,
               r.nombre_rol
        FROM   Usuario_trabajador u
        LEFT JOIN Roles r ON r.id_rol = u.id_rol
        WHERE  u.id_usuario = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { correo, ci, nombre_usuario, fecha_nacimiento, id_rol, id_estado_civil, id_grado_academico, id_genero, id_direccion, id_pais } = body;

    if (!nombre_usuario || !correo || !ci || !id_rol) {
      return NextResponse.json(
        { success: false, message: 'nombre_usuario, correo, ci e id_rol son obligatorios.' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id',                  sql.Int,           parseInt(id, 10))
      .input('correo',              sql.NVarChar(100), correo)
      .input('ci',                  sql.Int,           parseInt(ci, 10))
      .input('nombre_usuario',      sql.NVarChar(100), nombre_usuario)
      .input('fecha_nacimiento',    sql.Date,          fecha_nacimiento ? new Date(fecha_nacimiento) : null)
      .input('id_rol',              sql.Int,           parseInt(id_rol, 10))
      .input('id_estado_civil',     sql.Int,           id_estado_civil ? parseInt(id_estado_civil, 10) : null)
      .input('id_grado_academico',  sql.Int,           id_grado_academico ? parseInt(id_grado_academico, 10) : null)
      .input('id_genero',           sql.Int,           id_genero ? parseInt(id_genero, 10) : null)
      .input('id_direccion',        sql.Int,           id_direccion ? parseInt(id_direccion, 10) : null)
      .input('id_pais',             sql.Int,           id_pais ? parseInt(id_pais, 10) : null)
      .query(`
        UPDATE Usuario_trabajador
        SET correo             = @correo,
            ci                 = @ci,
            nombre_usuario     = @nombre_usuario,
            fecha_nacimiento   = @fecha_nacimiento,
            id_rol             = @id_rol,
            id_estado_civil    = @id_estado_civil,
            id_grado_academico = @id_grado_academico,
            id_genero          = @id_genero,
            id_direccion       = @id_direccion,
            id_pais            = @id_pais,
            update_at          = SYSUTCDATETIME()
        OUTPUT INSERTED.id_usuario, INSERTED.correo, INSERTED.ci,
               INSERTED.nombre_usuario, INSERTED.fecha_nacimiento,
               INSERTED.id_rol, INSERTED.update_at
        WHERE id_usuario = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
