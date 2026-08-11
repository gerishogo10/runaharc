# Rúnaharc

Magyar nyelvű, böngészőben játszható kártyajáték-prototípus AI- és kétjátékos online móddal.

## Online játék

A szerver Node.js 20+ környezetben fut, külső npm-függőség nélkül.

```bash
npm start
```

Alapértelmezett helyi cím: `http://localhost:8080`.

A szerver a `PORT` környezeti változót használja, ezért Render Web Service-ként közvetlenül telepíthető. A `/health` útvonal health checkként használható.

## Offline játék AI ellen

A `index.html` és a `runaharc-standalone.html` önálló fájlok; közvetlenül megnyithatók böngészőben.

## Vizuális és hangrendszer

- részletes, egyedi SVG-illusztráció mind a 10 laptípushoz;
- fehér kártyanév és támadási érték;
- támadás-, őrkő-, Mag-, idézés-, ige- és rúnaeffektek;
- külön hangkapcsoló;
- `prefers-reduced-motion` támogatás;
- az akciósáv a játéktér és a kéz között helyezkedik el.

## Ellenőrzések

```bash
npm test
npm run lint
node tests/online-e2e.mjs
node tests/http-smoke.mjs
GAMES=100000 node scripts/balance.js > balance-report.json
```
