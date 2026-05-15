import sql from 'mssql';

const config: sql.config = {
  server:   process.env.DB_SERVER   ?? 'localhost',
  port:     parseInt(process.env.DB_PORT ?? '1433', 10),
  database: process.env.DB_DATABASE ?? 'limpieza',
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt:                false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30_000,
  },
};

declare global {
  // eslint-disable-next-line no-var
  var _mssqlPool: sql.ConnectionPool | undefined;
}

export async function getConnection(): Promise<sql.ConnectionPool> {
  console.log('[db] config:', {
    server:   process.env.DB_SERVER,
    port:     process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD ? '***ok***' : 'UNDEFINED',
  });

  if (global._mssqlPool?.connected) {
    return global._mssqlPool;
  }

  const pool = new sql.ConnectionPool(config);

  pool.on('error', (err: Error) => {
    console.error('[db] pool error:', err);
  });

  await pool.connect();
  global._mssqlPool = pool;
  return pool;
}