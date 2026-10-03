import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.list();
      setTasks(data);
    } catch {
      setError('No se pudo conectar con el backend. Verificá que esté corriendo en el puerto 3001.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(formData) {
    setSaving(true);
    setError('');
    try {
      if (editingTask) {
        const updated = await api.update(editingTask.id, formData);
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)));
        setEditingTask(null);
      } else {
        const created = await api.create(formData);
        setTasks((prev) => [created, ...prev]);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar esta tarea?')) return;
    try {
      await api.remove(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (editingTask?.id === id) setEditingTask(null);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleFinalize(id) {
    try {
      const updated = await api.finalize(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Gestor de tareas</h1>
          <p>Proyectos de software — carga, seguimiento y cierre.</p>
        </div>
        <button className="secondary" onClick={load} disabled={loading}>
          {loading ? 'Cargando...' : 'Recargar'}
        </button>
      </header>

      {error && <div className="error">{error}</div>}

      <main className="layout">
        <TaskForm
          editingTask={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => setEditingTask(null)}
          saving={saving}
        />
        {loading ? (
          <section className="panel">
            <p className="muted">Cargando tareas...</p>
          </section>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={setEditingTask}
            onDelete={handleDelete}
            onFinalize={handleFinalize}
          />
        )}
      </main>

      <footer className="footer">
        <span>TP5 — React + Express + Postgres</span>
      </footer>
    </div>
  );
}
