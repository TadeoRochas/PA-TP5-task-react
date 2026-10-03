import { useEffect, useState } from 'react';

const TIPOS = ['Bug', 'Feature', 'Mejora', 'Testing', 'Documentación', 'Soporte'];
const ESTADOS = ['Pendiente', 'En Progreso', 'En Revisión', 'Bloqueada', 'Finalizada'];
const PRIORIDADES = ['Baja', 'Media', 'Alta', 'Crítica'];

const emptyForm = {
  nombre_proyecto: '',
  tipo_actividad: 'Feature',
  estado: 'Pendiente',
  resumen: '',
  descripcion: '',
  prioridad: 'Media',
  informador: '',
  persona_asignada: '',
  precondicion: '',
  fecha_creacion: new Date().toISOString().slice(0, 10),
  fecha_cierre: '',
  sprint: '',
};

function toFormValue(task) {
  if (!task) return { ...emptyForm };
  return {
    nombre_proyecto: task.nombre_proyecto || '',
    tipo_actividad: task.tipo_actividad || 'Feature',
    estado: task.estado || 'Pendiente',
    resumen: task.resumen || '',
    descripcion: task.descripcion || '',
    prioridad: task.prioridad || 'Media',
    informador: task.informador || '',
    persona_asignada: task.persona_asignada || '',
    precondicion: task.precondicion || '',
    fecha_creacion: (task.fecha_creacion || '').slice(0, 10),
    fecha_cierre: (task.fecha_cierre || '').slice(0, 10),
    sprint: task.sprint || '',
  };
}

export default function TaskForm({ editingTask, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(emptyForm);
  const isEditing = Boolean(editingTask);

  useEffect(() => {
    setForm(toFormValue(editingTask));
  }, [editingTask]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre_proyecto.trim() || !form.resumen.trim()) return;
    onSubmit({ ...form, fecha_cierre: form.fecha_cierre || null });
  }

  return (
    <section className="panel">
      <h2>{isEditing ? 'Editar tarea' : 'Nueva tarea'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label htmlFor="nombre_proyecto">Nombre del proyecto *</label>
          <input
            id="nombre_proyecto"
            value={form.nombre_proyecto}
            onChange={(e) => set('nombre_proyecto', e.target.value)}
            placeholder="Ej: Sistema de ventas"
            required
            maxLength={150}
          />
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="tipo_actividad">Tipo de actividad</label>
            <select
              id="tipo_actividad"
              value={form.tipo_actividad}
              onChange={(e) => set('tipo_actividad', e.target.value)}
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              value={form.estado}
              onChange={(e) => set('estado', e.target.value)}
            >
              {ESTADOS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="resumen">Resumen *</label>
          <input
            id="resumen"
            value={form.resumen}
            onChange={(e) => set('resumen', e.target.value)}
            placeholder="Título corto de la tarea"
            required
            maxLength={200}
          />
        </div>

        <div className="field">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            value={form.descripcion}
            onChange={(e) => set('descripcion', e.target.value)}
            rows={3}
            placeholder="Detalle de lo que hay que hacer"
          />
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="prioridad">Prioridad</label>
            <select
              id="prioridad"
              value={form.prioridad}
              onChange={(e) => set('prioridad', e.target.value)}
            >
              {PRIORIDADES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="sprint">Sprint</label>
            <input
              id="sprint"
              value={form.sprint}
              onChange={(e) => set('sprint', e.target.value)}
              placeholder="Ej: Sprint 3"
              maxLength={50}
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="informador">Informador</label>
            <input
              id="informador"
              value={form.informador}
              onChange={(e) => set('informador', e.target.value)}
              placeholder="Quien reporta"
              maxLength={100}
            />
          </div>
          <div className="field">
            <label htmlFor="persona_asignada">Persona asignada</label>
            <input
              id="persona_asignada"
              value={form.persona_asignada}
              onChange={(e) => set('persona_asignada', e.target.value)}
              placeholder="Responsable"
              maxLength={100}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="precondicion">Precondición</label>
          <textarea
            id="precondicion"
            value={form.precondicion}
            onChange={(e) => set('precondicion', e.target.value)}
            rows={2}
            placeholder="Condición previa para iniciar"
          />
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="fecha_creacion">Fecha de creación</label>
            <input
              id="fecha_creacion"
              type="date"
              value={form.fecha_creacion}
              onChange={(e) => set('fecha_creacion', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="fecha_cierre">Fecha de cierre</label>
            <input
              id="fecha_cierre"
              type="date"
              value={form.fecha_cierre}
              onChange={(e) => set('fecha_cierre', e.target.value)}
            />
          </div>
        </div>

        <div className="actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear tarea'}
          </button>
          {isEditing && (
            <button type="button" className="secondary" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
