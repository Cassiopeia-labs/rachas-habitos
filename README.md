# Rachas — gestor de hábitos

App web para registrar hábitos diarios y seguir tus rachas. Next.js 16 + Firebase (Auth + Firestore), desplegada en Vercel.

Construida con un equipo de **3 agentes de Claude Code**.

## El equipo de agentes

| Agente | Fichero | Papel |
|---|---|---|
| Orquestador | [`CLAUDE.md`](CLAUDE.md) | Agente principal. Planifica (`docs/TAREAS.md`), reparte el trabajo y coordina el bucle Develop ↔ Testing. |
| Develop | [`.claude/agents/develop.md`](.claude/agents/develop.md) | Subagente que programa, con su guía de cómo programar en este proyecto. |
| Testing | [`.claude/agents/testing.md`](.claude/agents/testing.md) | Subagente revisor. Comprueba el trabajo de Develop contra las directrices y le devuelve los fallos hasta que todo pasa. |
| Directrices | [`docs/DIRECTRICES.md`](docs/DIRECTRICES.md) | D1–D16: las reglas que Develop tiene que cumplir y que Testing verifica. |

Rastro del proceso:
- [`docs/TAREAS.md`](docs/TAREAS.md): tablero de tareas del orquestador (T1–T4).
- [`docs/REGISTRO-REVISIONES.md`](docs/REGISTRO-REVISIONES.md): cada ronda de revisión de Testing, con sus fallos y resultado.
- El historial de git muestra cada bloque aprobado.

## Funcionalidades

- Registro, inicio y cierre de sesión con email/contraseña.
- Crear hábitos (nombre + emoji), renombrarlos y borrarlos (con confirmación).
- Marcar o desmarcar cada uno de los últimos 7 días.
- Estadísticas por hábito: racha actual, mejor racha y % de cumplimiento de 30 días.
- Datos privados por usuario, garantizados por las reglas de seguridad de Firestore (`firestore.rules`).

## Desarrollo local

```bash
cp .env.example .env.local   # rellena con la config web de tu proyecto Firebase
npm install
npm run dev
```

`npm run check` ejecuta typecheck, lint, tests (Vitest) y build.

Las claves no están en el repositorio: se leen de `NEXT_PUBLIC_FIREBASE_*` (en `.env.local` en local y en las variables de entorno de Vercel en producción).
