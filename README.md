# Rúnaharc v5

Magyar nyelvű, kétjátékos online kártyajáték-prototípus Node.js/WebSocket szerverrel.

## Fő szabályok

- A játéktér 5 támadási folyosóból áll.
- Lény vagy Bástya kijátszásakor a játékos választja ki az öt hely egyikét.
- Egy lény alapból csak a vele szemben, ugyanabban a folyosóban álló lapot támadhatja.
- Őrkövet csak akkor lehet közvetlenül támadni, ha az adott folyosóban nincs ellenséges lap.
- A Széljáró Portyázó Átrepülés képessége blokkoló mellett is támadhat Őrkövet, de a Magot nem kerülheti meg.
- A Rovásbástya 0 támadású passzív lap. A mellette álló saját lapok 1-gyel kevesebb harci sebzést kapnak, és a Bástya elpusztulásakor a tulajdonosa húz 1 lapot.
- A Vihar elementális sebzés a szomszédos folyosókra is átcsaphat.
- A Tűz elementális sebzés parázshatást hagyhat, amely a célpont következő saját köre elején további sebzést okoz.
- Az igéket a játék mindkét félnek külön felmutatja, hogy legyen idő elolvasni őket.
- A kezdőjátékos az első körében nem húz lapot; a második játékos igen. Ez az 5 folyosós rendszer kezdési előnyét kompenzálja.

## Indítás

Node.js 20+:

```bash
npm start
```

Ezután: `http://localhost:8080`

AI mód: `http://localhost:8080/ai`

## Ellenőrzés

```bash
npm test
npm run lint
node tests/online-e2e.mjs
node tests/http-smoke.mjs
```

Balance-szimuláció:

```bash
GAMES=200000 DIVERSE_GAMES=100000 npm run balance > balance-report.json
```

A `balance-report.json` külön méri a fix paklis tükörmeccseket és a változatos, véletlenszerű paklikkal futtatott teszteket. A szimuláció erős automatizált jelzés, de nem helyettesíti a valódi játékosokkal végzett playtestet.
