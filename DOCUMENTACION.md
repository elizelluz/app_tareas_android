# Documentación del Proyecto - App de Gestión de Tareas

## Arquitectura

```
app-tareas/
├── backend/                  # API REST con FastAPI + MongoDB
│   ├── main.py               # Endpoints CRUD + estadísticas
│   ├── models.py             # Modelos Pydantic (Task, Project, Prioridad, etc.)
│   ├── database.py           # Conexión asíncrona a MongoDB con Motor
│   └── requirements.txt      # Dependencias Python
├── frontend/                 # App Expo (React Native)
│   ├── App.js                # Entry point
│   ├── app.json              # Configuración Expo + EAS Build
│   ├── eas.json              # Perfiles de build EAS
│   ├── BUILD.md              # Instrucciones para generar APK
│   └── src/
│       ├── api/
│       │   ├── tasks.js      # Cliente HTTP para tareas
│       │   └── projects.js   # Cliente HTTP para proyectos
│       ├── components/
│       │   ├── TaskCard.js        # Tarjeta de tarea compacta
│       │   ├── TaskForm.js        # Modal crear/editar tarea
│       │   ├── KanbanColumn.js    # Columna del tablero Kanban
│       │   └── StatsCard.js       # Tarjeta de métrica con barra
│       ├── screens/
│       │   ├── KanbanScreen.js    # Tablero Kanban (3 columnas)
│       │   ├── ProjectsScreen.js  # Gestión de proyectos
│       │   └── StatsScreen.js     # Dashboard de estadísticas
│       ├── navigation/
│       │   └── AppNavigator.js    # Tabs superiores
│       └── theme/
│           └── colors.js          # Paleta de colores
└── DOCUMENTACION.md          # Este archivo
```

---

## Funcionalidades Implementadas

### 1. Tablero Kanban (3 columnas)

Navegación con tabs superiores: **Kanban** · **Proyectos** · **Estadísticas**

El tablero principal tiene tres columnas con scroll horizontal:

| Columna | Color | Descripción |
|---------|-------|-------------|
| 📋 **Pendientes** | Rojo `#FF6B6B` | Tareas por hacer |
| ⚡ **En Proceso** | Naranja `#FFB347` | Tareas en curso |
| ✅ **Completadas** | Verde `#51CF66` | Tareas terminadas |

**Interacción con tarjetas:**
- **Tap** → abre formulario de edición
- **Botón `>`** → mueve a la siguiente columna (Pendiente → En Proceso → Completada → Pendiente)
- **Botón `✕`** → elimina con confirmación
- **Badge de estado** en la esquina: "Pendiente" / "En curso" / "Lista"
- **Indicador de prioridad**: punto rojo/naranja/verde
- **Categoría** y **fecha de vencimiento** visibles

### 2. Filtro por Proyectos

Barra horizontal sobre el tablero para filtrar tareas por proyecto:
- **"Todas"** → muestra tareas de todos los proyectos
- **Chip de proyecto** → muestra solo tareas de ese proyecto
- Al crear una tarea, se preselecciona el proyecto activo

### 3. Gestión de Proyectos

Pantalla completa CRUD de proyectos:

- **Lista** de proyectos con indicador de color
- **Tap** → abre formulario de edición
- **Botón `✕`** → elimina con confirmación (desvincula tareas)
- **Modal** con nombre, selector de 8 colores predefinidos, botón ✕ para cerrar
- **Pull-to-refresh** para recargar

### 4. Dashboard de Estadísticas

Pantalla con diseño tipo dashboard:

- **Header** con Total, En Proceso, Completadas y Pendientes (números grandes)
- **Barra de progreso** con porcentaje de completado
- **Por Prioridad** — tarjetas con iconos (🔴🟠🟢) y barra proporcional
- **Por Categoría** — tarjetas con iconos (💼👤🛒📦) y barra proporcional
- **Pull-to-refresh** para recargar

### 5. Formulario de Tarea

Modal bottom-sheet con:

- **Título** y **Descripción**
- **Prioridad**: selector visual Alta/Media/Baja con colores
- **Categoría**: selector visual Trabajo/Personal/Compras/Otros
- **Proyecto**: chips horizontales con colores (solo si hay proyectos)
- **Fecha de vencimiento**: campo de texto YYYY-MM-DD
- **Botón ✕** para cerrar sin guardar
- **Botón Cancelar / Crear o Guardar**

### 6. Generación de APK con EAS Build

Configurado en `eas.json` y `app.json`:

- **Preview**: `eas build -p android --profile preview` → APK para pruebas
- **Production**: `eas build -p android --profile production` → APK release
- SDK 36, ProGuard habilitado, expo-splash-screen configurado

Ver `BUILD.md` para instrucciones detalladas.

---

## API Backend

### Tareas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/tasks` | Listar tareas (filtros: `search`, `priority`, `category`, `status`, `project_id`) |
| GET | `/api/tasks/stats` | Estadísticas agrupadas |
| POST | `/api/tasks` | Crear tarea |
| PUT | `/api/tasks/{id}` | Actualizar tarea |
| DELETE | `/api/tasks/{id}` | Eliminar tarea |

### Proyectos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/projects` | Listar proyectos |
| POST | `/api/projects` | Crear proyecto |
| PUT | `/api/projects/{id}` | Actualizar proyecto |
| DELETE | `/api/projects/{id}` | Eliminar proyecto (desvincula tareas) |

### Modelo de Tarea

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId | Identificador único |
| `title` | String | Título (obligatorio) |
| `description` | String | Descripción |
| `priority` | Enum | `Alta`, `Media`, `Baja` |
| `category` | Enum | `Trabajo`, `Personal`, `Compras`, `Otros` |
| `status` | Enum | `pending`, `in_progress`, `completed` |
| `project_id` | String o null | Proyecto asociado |
| `due_date` | String o null | Fecha de vencimiento |
| `created_at` | String (ISO) | Fecha de creación |

### Modelo de Proyecto

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId | Identificador único |
| `name` | String | Nombre del proyecto |
| `color` | String | Color hexadecimal (ej: `#6C63FF`) |
| `description` | String | Descripción |
| `created_at` | String (ISO) | Fecha de creación |

---

## Tecnologías

- **Frontend**: React Native 0.85 + Expo 56
- **Navegación**: `@react-navigation/material-top-tabs`
- **Backend**: FastAPI + Motor (MongoDB asíncrono)
- **Base de datos**: MongoDB
- **Build**: EAS Build (Expo)

---

## Cómo ejecutar

### Backend
```bash
cd backend
uvicorn main:app --reload --port 8001
```

### Frontend
```bash
cd frontend
npx expo start
```

### Generar APK
```bash
cd frontend
eas build -p android --profile preview
```

Ver `BUILD.md` para instrucciones detalladas.
