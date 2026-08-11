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

- részletes, egyedi SVG-illusztráció a jelenlegi lapkészlethez;
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

## v4 asztali egykepernyos elrendezes
900 px-nel szelesebb es legalabb 760 px magas bongeszoben az aktiv parbaj a teljes viewportot hasznalja: a lobby eltunik, a jatekter, az akciosav es a kez egyszerre lathato. Alacsonyabb vagy mobil kijelzon a korabbi gorgetheto elrendezes marad meg, hogy a lapok ne legyenek tul kicsik.


## v6 – olvashatósági frissítés
A pálya öt folyosója középre rendezett és keskenyebb. A kártyákon a teljes szabályszöveg helyett rövid kulcsszavak láthatók; a teljes leírás a pálya és a kéz közötti kiválasztottlap-panelen olvasható.

## v7 – sérülő Őrkövek és Mag
- Mind az öt folyosó saját, 5 életerős Őrkővel rendelkezik.
- Közvetlen támadáskor a lény az aktuális támadóerejével megegyező sebzést okoz az adott folyosó Őrkövének.
- A sebzés megmarad az Őrkövön; a 0 életerős Őrkő összetörik, és a túlütő sebzés nem folyik át a Magra.
- A Mag csak mind az öt Őrkő elpusztítása után támadható, és 10 életerővel rendelkezik.
- A Magot is a lény aktuális támadóereje sebzi; 0 életerőnél a tulajdonosa elveszíti a párbajt.
- A v7 első körben mechanikai prototípus: a korábbi lapértékeket nem balanszoltuk át. A mellékelt `balance-report.json` egy 5000 tükörmeccses + 1000 változatos paklis előzetes mérés.


## v8 – Rúnavisszhang és 30 lapos pakli
- A pakli 30 lapos. A hosszabb, Őrkő-életerős meccsekhez ez csökkenti a túl korai kifáradást.
- **Rúnavisszhang:** a 3. vagy későbbi rúna lerakásakor, ha utána legfeljebb 4 lap marad a kézben, a játékos húz 1 lapot.
- Legfeljebb 7 rúna lehet egy játékos előtt; ezután nem kell további lapokat erőforrássá áldozni.
- Üres paklinál minden sikertelen kötelező húzás fix 1 sebzést okoz a Magnak.
- Új lapok: Rovásíró Deák, Forrásjáró Javas, Kobzos Hírnök, Rovásváltó, Csodaszarvas, Kárpáti Ostromló, Őrkőkovács, Parázsló Betörő és Kőrepesztés.
- Kézgazdasági lapok és döntések: feltételes húzás, rúnák visszafejtése, Őrkő-javítás, folyosóváltás és célzott ostrom.
- Az alap pakli 30 lapos, vegyes tempó-/értékpakli, hogy a Rúnavisszhang mellett is legyen elég tartalék a hosszabb meccsekhez.

## v8 balance-mérés
A végleges jelöltet 25 000 tükörmeccsel és 25 000 változatos, véletlenszerűen összeállított paklis meccsel ellenőriztük. Mind az 50 000 parti befejeződött időtúllépés nélkül. A tükörmeccsekben a kezdőjátékos győzelmi aránya 50,676%, a 6. saját körben az átlagos kéz 4,68 lap, a 8. saját körben 4,11 lap volt; a 8. körben csak az esetek 5,42%-ában maradt legfeljebb 2 lap. A Kárpáti Ostromló a mérés közben 3/3-ról 2/3-ra gyengült, az Ősforrás pedig feltételes második húzást kapott, hogy elsősorban kis kézből segítsen visszakapaszkodni.
