# Tareas (tablero del orquestador)

| # | Tarea | Estado |
|---|---|---|
| T1 | Base: Firebase, sesión, login/registro, rutas protegidas, layout | hecha |
| T2 | Lógica pura de rachas y validación + tests | hecha |
| T3 | Panel de hábitos: CRUD, marcar días, estadísticas | hecha |
| T4 | Reglas de Firestore + pulido (a11y, responsive, textos) | hecha |

## T1 — Base y autenticación
- `src/lib/firebase.ts` inicializa Firebase desde `NEXT_PUBLIC_FIREBASE_*` (sin inicializar dos veces).
- `AuthProvider` + `useAuth()` con `user`, `loading`.
- `/register` y `/login` con email + contraseña (mín. 6), errores traducidos al español.
- `/` (panel) redirige a `/login` sin sesión; `/login` y `/register` redirigen a `/` con sesión.
- Cabecera con nombre de la app, email del usuario y botón "Cerrar sesión".
- Se elimina todo el contenido de la plantilla.

## T2 — Lógica pura
- `toDayKey(date)`, `lastNDays(n, today)`, `currentStreak(dates, today)`, `bestStreak(dates)`,
  `completionRate(dates, days, today)` en `src/lib/streaks.ts`.
- `validateHabitName(name)` en `src/lib/validation.ts` → `{ ok: true, value } | { ok: false, error }`.
- Tests con los casos límite de D6.

## T3 — Panel de hábitos
- Modelo: `users/{uid}/habits/{id}` = `{ name, emoji, completedDates: string[], createdAt }`.
- Listado en tiempo real (`onSnapshot`) ordenado por `createdAt`.
- Crear hábito (nombre + emoji a elegir de una lista corta), renombrar, borrar con confirmación.
- Rejilla de los últimos 7 días por hábito; clic marca/desmarca ese día.
- Racha actual, mejor racha y % de los últimos 30 días por hábito.
- Estados de carga, vacío ("Aún no tienes hábitos…") y error.

## T4 — Reglas y pulido
- `firestore.rules` según D9.
- Revisión de accesibilidad (D13), responsive (D15) y textos (D16).
