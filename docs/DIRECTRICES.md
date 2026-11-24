# DIRECTRICES de calidad

Documento del agente **Testing**. Develop debe cumplir todas las directrices; Testing revisa cada
entrega contra esta lista y la devuelve con los fallos hasta que todo pasa.

## Calidad básica

- **D1 — Check verde.** `npm run check` (typecheck + lint + tests + build) termina sin errores.
- **D2 — TypeScript estricto.** Prohibido `any`, `@ts-ignore`, `@ts-expect-error` y `eslint-disable`.
- **D3 — Sin código muerto.** Nada de `console.log`, código comentado, imports sin usar ni
  restos de la plantilla de create-next-app (logos de Next/Vercel, textos "To get started").

## Arquitectura

- **D4 — Capa de datos única.** Solo `src/lib/habits.ts` importa `firebase/firestore`, y solo
  `src/lib/firebase.ts` llama a `initializeApp`. Los componentes no hablan con Firestore.
- **D5 — Lógica pura testeada.** Los cálculos (rachas, fechas, porcentajes, validación) viven en
  `src/lib/streaks.ts` y `src/lib/validation.ts`, sin importar React ni Firebase, y cada función
  exportada tiene tests en `tests/`.
- **D6 — Casos límite.** Los tests de rachas cubren: sin registros, solo hoy, racha que termina
  ayer (sigue viva), hueco de un día (se rompe), cambio de mes/año, fechas duplicadas o
  desordenadas.
- **D7 — Fechas locales.** Los días se representan como `YYYY-MM-DD` en hora local. Prohibido
  usar `toISOString()` para obtener el día.

## Seguridad

- **D8 — Sin secretos en el repo.** Ninguna clave ni config real en ficheros versionados;
  se leen de `process.env.NEXT_PUBLIC_FIREBASE_*`. `.env.example` solo contiene nombres.
- **D9 — Reglas de Firestore.** `firestore.rules` solo permite a un usuario autenticado leer y
  escribir bajo `users/{uid}/... (su propio uid)`. Valida en escritura de hábitos: `name` string de 1–40
  caracteres, `completedDates` lista, y solo los campos permitidos. Todo lo demás denegado.
- **D10 — Rutas protegidas.** El panel no muestra datos sin sesión: redirige a `/login`.
  Un usuario con sesión que entra en `/login` o `/register` va al panel.

## Experiencia de usuario

- **D11 — Validación de formularios.** Nombre de hábito vacío, solo espacios o > 40 caracteres
  se rechaza con mensaje en español. Email/contraseña inválidos muestran el error de Firebase
  traducido a un mensaje comprensible (no el código crudo `auth/...`).
- **D12 — Estados.** Toda vista que carga datos tiene estado de carga, vacío y error.
- **D13 — Accesibilidad.** Inputs con `<label>`, botones de solo icono con `aria-label`,
  casillas de día con estado accesible (`aria-pressed` o checkbox), `lang="es"` en `<html>`.
- **D14 — Confirmación destructiva.** Borrar un hábito pide confirmación.
- **D15 — Responsive.** Usable a 375 px de ancho sin scroll horizontal.
- **D16 — Textos en español** para todo lo visible; metadata (`title`, `description`) de la app.
