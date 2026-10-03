const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Listar
app.get('/api/tasks', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Error al listar tareas' });
  }
});

// Crear
app.post('/api/tasks', async (req, res) => {
  const t = req.body || {};
  if (!t.nombre_proyecto?.trim() || !t.resumen?.trim()) {
    return res.status(400).json({ error: 'Nombre del proyecto y resumen son obligatorios' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO tasks
        (nombre_proyecto, tipo_actividad, estado, resumen, descripcion, prioridad,
         informador, persona_asignada, precondicion, fecha_creacion, fecha_cierre, sprint)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        t.nombre_proyecto,
        t.tipo_actividad || 'Feature',
        t.estado || 'Pendiente',
        t.resumen,
        t.descripcion || '',
        t.prioridad || 'Media',
        t.informador || '',
        t.persona_asignada || '',
        t.precondicion || '',
        t.fecha_creacion || new Date().toISOString().slice(0, 10),
        t.fecha_cierre || null,
        t.sprint || '',
      ]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

// Editar
app.put('/api/tasks/:id', async (req, res) => {
  const t = req.body || {};
  try {
    const { rows } = await pool.query(
      `UPDATE tasks SET
        nombre_proyecto=$1, tipo_actividad=$2, estado=$3, resumen=$4, descripcion=$5,
        prioridad=$6, informador=$7, persona_asignada=$8, precondicion=$9,
        fecha_creacion=$10, fecha_cierre=$11, sprint=$12
       WHERE id=$13 RETURNING *`,
      [
        t.nombre_proyecto,
        t.tipo_actividad,
        t.estado,
        t.resumen,
        t.descripcion || '',
        t.prioridad,
        t.informador || '',
        t.persona_asignada || '',
        t.precondicion || '',
        t.fecha_creacion || null,
        t.fecha_cierre || null,
        t.sprint || '',
        req.params.id,
      ]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

// Eliminar
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM tasks WHERE id=$1', [req.params.id]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

// Finalizar: pasa a Finalizada y setea fecha_cierre = hoy
app.patch('/api/tasks/:id/finalizar', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE tasks SET estado='Finalizada', fecha_cierre=CURRENT_DATE
       WHERE id=$1 RETURNING *`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Error al finalizar la tarea' });
  }
});

async function start(retries = 10) {
  for (let i = 1; i <= retries; i++) {
    try {
      await initDb();
      app.listen(PORT, () => console.log(`Backend escuchando en puerto ${PORT}`));
      return;
    } catch (e) {
      console.error(`DB no lista (intento ${i}/${retries}):`, e.message);
      if (i === retries) process.exit(1);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}
start();
