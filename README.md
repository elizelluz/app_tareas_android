# App de Gestión de Tareas

App móvil desarrollada con **React Native (Expo)** para el frontend y **FastAPI + MongoDB** para el backend.

---

## Arquitectura

```
app-tareas/
├── backend/               # API REST con FastAPI
│   ├── main.py            # Endpoints CRUD + estadísticas
│   ├── models.py          # Modelos Pydantic (Task, Prioridad, Categoría)
│   ├── database.py        # Conexión asíncrona a MongoDB con Motor
│   └── requirements.txt   # Dependencias Python
│
└── frontend/              # App Expo (React Native)
    ├── App.js             # Entry point (NavigationContainer + GestureHandler)
    └── src/
        ├── api/
        │   └── tasks.js            # Cliente HTTP (fetch) para el backend
        ├── theme/
        │   └── colors.js           # Paleta de colores por prioridad/categoría
        ├── navigation/
        │   └── AppNavigator.js     # Navegación por tabs (Bottom Tab Navigator)
        ├── screens/
        │   ├── TasksScreen.js      # Pantalla principal: CRUD + búsqueda + filtros
        │   ├── CompletedScreen.js  # Tareas completadas
        │   └── StatsScreen.js      # Estadísticas de productividad
        └── components/
            ├── TaskCard.js         # Tarjeta de tarea con indicador visual
            ├── TaskForm.js         # Modal para crear/editar tareas
            ├── FilterBar.js        # Barra de búsqueda y filtros
            └── StatsCard.js        # Tarjeta de métrica
```

---

## Backend (FastAPI + MongoDB)

### Modelo de Tarea

| Campo           | Tipo                  | Descripción                        |
|-----------------|-----------------------|------------------------------------|
| `_id`           | ObjectId              | Identificador único                |
| `title`         | String                | Título de la tarea (obligatorio)   |
| `description`   | String                | Descripción detallada              |
| `priority`      | Enum (Alta/Media/Baja)| Nivel de prioridad                 |
| `category`      | Enum (Trabajo/Personal/Compras/Otros) | Categoría de organización |
| `due_date`      | String (opcional)     | Fecha de vencimiento (YYYY-MM-DD)  |
| `completed`     | Boolean               | Estado de completado               |
| `created_at`    | String (ISO)          | Fecha de creación                  |

### Endpoints

| Método | Ruta                | Descripción                          |
|--------|---------------------|--------------------------------------|
| GET    | `/api/tasks`        | Listar tareas (con filtros opcionales: `search`, `priority`, `category`) |
| GET    | `/api/tasks/stats`  | Estadísticas: total, completadas, pendientes, por prioridad, por categoría |
| POST   | `/api/tasks`        | Crear nueva tarea                    |
| PUT    | `/api/tasks/{id}`   | Actualizar tarea (parcial)           |
| DELETE | `/api/tasks/{id}`   | Eliminar tarea                       |

### Ejecución

```bash
cd backend
uvicorn main:app --reload --port 8000
```

Requiere MongoDB corriendo en `localhost:27017`.

---

## Frontend (Expo + React Native)

### Navegación

Tres tabs en la parte inferior:

| Tab           | Pantalla           | Descripción                              |
|---------------|--------------------|------------------------------------------|
| 📋 Tareas     | TasksScreen        | Tareas pendientes con CRUD completo      |
| ✅ Completadas| CompletedScreen    | Tareas marcadas como completadas         |
| 📊 Estadísticas| StatsScreen       | Métricas de productividad                |

### Funcionalidades Implementadas

#### CRUD de Tareas
- **Crear**: Botón flotante (+) → Modal bottom-sheet con formulario
- **Editar**: Long-press sobre una tarea → Modal prellenado
- **Eliminar**: Botón ✕ en cada tarjeta → Confirmación con Alert
- **Campos del formulario**: Título, Descripción, Prioridad (selector visual), Categoría (selector visual), Fecha de vencimiento

#### Interacción con Gestos
- **Tap** en una tarea → Alterna estado completado/no completado
- **Long-press** → Abre modal de edición
- **Pull-to-refresh** → Recarga la lista desde la API

#### Búsqueda y Filtros (FilterBar)
- **Búsqueda** por texto en tiempo real (filtra por título)
- **Filtro por prioridad**: Todas, Alta, Media, Baja
- **Filtro por categoría**: Todas, Trabajo, Personal, Compras, Otros
- Los filtros se aplican combinados

#### Diseño Visual
- **Prioridad Alta** → Indicador rojo (#FF6B6B)
- **Prioridad Media** → Indicador naranja (#FFB347)
- **Prioridad Baja** → Indicador verde (#51CF66)
- **Categorías** con colores distintivos:
  - Trabajo: #6C63FF (púrpura)
  - Personal: #4ECDC4 (turquesa)
  - Compras: #FF6B6B (rojo)
  - Otros: #95A5A6 (gris)
- Touch targets mínimos de 48px
- SafeArea handling con `react-native-safe-area-context`
- Keyboard avoiding en formularios
- Tarjetas con sombra sutil, bordes redondeados (12px)

#### Estadísticas (StatsScreen)
- **Resumen**: Total de tareas, Completadas, Pendientes
- **Por Prioridad**: Conteo agrupado por nivel de prioridad
- **Por Categoría**: Conteo agrupado por categoría
- Cada métrica muestra valor numérico grande + etiqueta + indicador de color

### Componentes

| Componente    | Archivo               | Props                                      |
|---------------|-----------------------|--------------------------------------------|
| TaskCard      | `TaskCard.js`         | `task`, `onToggle`, `onEdit`, `onDelete`   |
| TaskForm      | `TaskForm.js`         | `visible`, `onClose`, `onSubmit`, `initial`|
| FilterBar     | `FilterBar.js`        | `search`, `onSearchChange`, `priority`, `onPriorityChange`, `category`, `onCategoryChange` |
| StatsCard     | `StatsCard.js`        | `label`, `value`, `color`                  |

### Ejecución

```bash
cd frontend
npx expo start
```

Escanea el QR con Expo Go en tu dispositivo móvil.

---

## Dependencias

### Backend (Python)
- `fastapi` - Framework web
- `uvicorn` - Servidor ASGI
- `motor` - Driver asíncrono de MongoDB
- `pydantic` - Validación de datos

### Frontend (Node.js)
- `expo` ~56.0.12
- `react-native` 0.85.3
- `@react-navigation/native` + `@react-navigation/bottom-tabs` - Navegación
- `react-native-screens` + `react-native-safe-area-context` - Navegación nativa
- `react-native-gesture-handler` - Gestos
- `react-native-reanimated` - Animaciones
- `react-native-swipe-list-view` - Listas con swipe
