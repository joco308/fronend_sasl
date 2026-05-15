import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();

    const tables = await pool.request().query(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG = 'limpieza'
      ORDER BY TABLE_NAME
    `);

    const columns = await pool.request().query(`
      SELECT
        TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT,
        COLUMNPROPERTY(OBJECT_ID(TABLE_NAME), COLUMN_NAME, 'IsIdentity') AS IS_IDENTITY
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_CATALOG = 'limpieza'
      ORDER BY TABLE_NAME, ORDINAL_POSITION
    `);

    return NextResponse.json({
      success: true,
      tables:  tables.recordset.map((r: { TABLE_NAME: string }) => r.TABLE_NAME),
      columns: columns.recordset,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
