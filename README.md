# Rúnaharc

Magyar nyelvű, kétjátékos online kártyajáték-prototípus.

## Helyi indítás
Node.js 20+ szükséges.

```bash
npm start
```

Ezután nyisd meg: `http://localhost:8080`

## Render telepítés
A projekt gyökerében lévő `render.yaml` egy ingyenes Node web service-t definiál.
Részletes lépések: `RENDER-START-HERE.md`.

## Tesztek
```bash
npm test
npm run lint
node tests/online-e2e.mjs
```
