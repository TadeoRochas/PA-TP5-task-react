const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'taskdb',
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      nombre_proyecto VARCHAR(150) NOT NULL,
      tipo_actividad VARCHAR(50) NOT NULL DEFAULT 'Feature',
      estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
      resumen VARCHAR(200) NOT NULL,
      descripcion TEXT NOT NULL DEFAULT '',
      prioridad VARCHAR(20) NOT NULL DEFAULT 'Media',
      informador VARCHAR(100) NOT NULL DEFAULT '',
      persona_asignada VARCHAR(100) NOT NULL DEFAULT '',
      precondicion TEXT NOT NULL DEFAULT '',
      fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
      fecha_cierre DATE NULL,
      sprint VARCHAR(50) NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

module.exports = { pool, initDb };
