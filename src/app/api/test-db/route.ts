import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool   = await getConnection();
    const result = await pool.request().query(`
      SELECT TOP 5 TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE
      FROM   INFORMATION_SCHEMA.TABLES
      WHERE  TABLE_CATALOG = 'limpieza'
    `);

    return NextResponse.json({
      success: true,
      tablas:  result.recordset,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
