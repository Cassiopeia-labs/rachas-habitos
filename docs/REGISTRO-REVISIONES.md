# Registro de revisiones Develop ↔ Testing

Cada entrada la escribe el orquestador tras una ronda de Testing.

| Tarea | Ronda | Resultado | Fallos principales |
|---|---|---|---|
| T1+T2 | 1 | PASA | Ninguno. Observaciones: aviso de Next "instant navigation" en /login por GuestOnly; comentario de plantilla en next.config.ts. Se pasan a Develop en T3. |
| T3+T4 | 1 | FALLA | [D9/D11] cliente cuenta puntos de código y las reglas unidades UTF-16 → nombres con emojis válidos en cliente rechazados por Firestore. [D16] falta 404 propia en español. |
| T3+T4 | 2 | PASA | Ninguno. Fallos de ronda 1 verificados como corregidos (emulador: 5/5 casos de longitud). |
