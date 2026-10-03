# TP5 — Manejador de tareas de proyectos de software

App con formulario y listado de tareas. Frontend en React + Vite, backend en Express y persistencia en Postgres. Los tres corren en Docker.

## Estructura

```
.
├── frontend/          # React + Vite (formulario + listado)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── components/
│   │       ├── TaskForm.jsx
│   │       └── TaskList.jsx
│   ├── Dockerfile
│   └── nginx.conf
├── backend/           # Express + pg
│   ├── index.js       # API REST
│   ├── db.js          # Pool + CREATE TABLE IF NOT EXISTS
│   └── Dockerfile
└── docker-compose.yml # frontend + backend + db
```

## Campos de la tarea

Nombre del proyecto, tipo de actividad, estado, resumen, descripción, prioridad, informador, persona asignada, precondición, fecha de creación, fecha de cierre, sprint.

## API

- `GET /api/tasks` — listar
- `POST /api/tasks` — crear
- `PUT /api/tasks/:id` — editar
- `DELETE /api/tasks/:id` — eliminar
- `PATCH /api/tasks/:id/finalizar` — pasa a `Finalizada` y setea fecha de cierre con `CURRENT_DATE`
- `GET /api/health` — chequeo

## Requisitos

- Docker + Docker Compose
- Puertos libres: 5173, 3001, 5432

## Cómo levantar

```powershell
cd "PA-TP5-task-react"
docker compose up --build -d
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001/api/health
- Postgres: localhost:5432 (usuario `postgres`, pass `postgres`, db `taskdb`)

Ver estado y logs:

```powershell
docker compose ps
docker compose logs backend
docker compose logs db
```

Bajar todo (los datos quedan en el volumen `pgdata`):

```powershell
docker compose down
```

Borrar también los datos:

```powershell
docker compose down -v
```

## Desarrollo local (sin Docker)

Necesitás Postgres corriendo local y Node 20+.

```powershell
# Backend
cd backend
npm.cmd install
# copiar .env.example a .env y ajustar si hace falta
npm.cmd run dev

# Frontend (otra terminal)
cd frontend
npm.cmd install
npm.cmd run dev
# -> http://localhost:5173
```
