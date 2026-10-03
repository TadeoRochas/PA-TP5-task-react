export default function TaskList({ tasks, onEdit, onDelete, onFinalize }) {
  if (tasks.length === 0) {
    return (
      <section className="panel">
        <h2>Listado de tareas</h2>
        <p className="muted">No hay tareas cargadas. Creá la primera con el formulario.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Listado de tareas <span className="count">{tasks.length}</span></h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Resumen</th>
              <th>Proyecto</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Asignada</th>
              <th>Sprint</th>
              <th>Cierre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => {
              const finished = t.estado === 'Finalizada';
              return (
                <tr key={t.id} className={finished ? 'finished' : ''}>
                  <td>
                    <strong>{t.resumen}</strong>
                    {t.descripcion && <span className="desc">{t.descripcion}</span>}
                  </td>
                  <td>{t.nombre_proyecto}</td>
                  <td>{t.tipo_actividad}</td>
                  <td>
                    <span className={`pill estado-${t.estado.replace(/\s/g, '')}`}>
                      {t.estado}
                    </span>
                  </td>
                  <td>
                    <span className={`pill prio-${t.prioridad}`}>{t.prioridad}</span>
                  </td>
                  <td>{t.persona_asignada || '—'}</td>
                  <td>{t.sprint || '—'}</td>
                  <td>{t.fecha_cierre ? t.fecha_cierre.slice(0, 10) : '—'}</td>
                  <td>
                    <div className="row-actions">
                      <button className="link" onClick={() => onEdit(t)}>Editar</button>
                      {!finished && (
                        <button className="link ok" onClick={() => onFinalize(t.id)}>
                          Finalizar
                        </button>
                      )}
                      <button className="link danger" onClick={() => onDelete(t.id)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
