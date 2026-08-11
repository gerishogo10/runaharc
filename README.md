# Rúnaharc – Őrkövek Párbaja

Magyar nyelvű, böngészőben játszható taktikai kártyajáték-prototípus AI- és kétjátékos online móddal.

## v11 – közös Őrkő-élet, biztos győztes és pakliépítés

### Harcrendszer

- A pályán továbbra is **5 támadási folyosó** van. A folyosók a blokkolást, célzást és pozicionálást határozzák meg.
- Nincs külön élet folyosónként: mindkét játékos **20 közös Őrkő-élettel** indul.
- Egy nyitott folyosóból érkező támadás ezt az egy közös Őrkő-életet sebzi a lény aktuális támadásával.
- Ha az adott folyosóban védő lap áll, azt kell előbb megtámadni, kivéve ha egy kártya képessége kifejezetten megkerüli.
- 0 Őrkő-életnél megnyílik a **10 ÉP-s Mag**. A Magot nyitott folyosóból lehet támadni.
- Az Őrkőre mért túlütő sebzés nem folyik át automatikusan a Magra.

### Nincs döntetlen paklikifogyás miatt

- Ha a pakli üres és a játékosnak húznia kellene, **Kimerülés** következik.
- A Kimerülés közvetlenül a Magot sebzi, és minden sikertelen húzásnál nő: **1, 2, 3, 4…**
- Emiatt egy teljesen kifogyott, lezárt tábla sem tud végtelen döntetlenbe ragadni.

### Kézgazdaság és kezdési kiegyenlítés

- A pakli **30 lapos**.
- **Rúnavisszhang:** a 3. vagy későbbi rúna lerakásakor, ha utána legfeljebb 4 lap van a kézben, húzol 1 lapot.
- Legfeljebb **7 rúna** lehet játékban.
- Az első játékos **5**, a második **6** lappal kezd.
- A második játékos az első saját körére **+1 ideiglenes Kezdőszikrát** kap. Ez erőforrásként elkölthető, de nem számít állandó rúnának és a kör végén eltűnik.

## Pakliépítő

A `deckbuilder.html` oldalon saját aktív pakli építhető és menthető a böngésző helyi tárhelyére.

Pakliszabályok:

- pontosan **30 lap**;
- egy lapból legfeljebb **3 példány**;
- legfeljebb **2 nem-semleges elem** egy pakliban;
- a Semleges lapok nem foglalnak elemhelyet.

A v11 öt induló archetípust tartalmaz:

- **Révülő Visszhang** – Szellem + Víz: kézelőny, rúnavisszafejtés és értéktermelés;
- **Parázsostrom** – Tűz + Föld: közvetlen Őrkő-rombolás és ostrom;
- **Kőszív Erőd** – Föld + Víz: Bástyák, gyógyítás és sebzéscsökkentés;
- **Viharlovasság** – Vihar + Szellem: folyosónyomás, megkerülés és tempó;
- **Tűzvihar Roham** – Tűz + Vihar: agresszív lények és gyors befejezés.

A pakliépítő első iterációja egy aktív saját paklit ment. Több elnevezett paklihely későbbi bővítés lehet.

## Új v11 lapok

A v11 új építkezési tengelyeket ad a Vihar, Tűz, Föld, Víz és Szellem elemekhez: Villámvadász, Mennydörgés, Hamufőnix, Lángostrom, Élő Kőfal, Földrengető, Forrástündér, Áradás, Ősök Hangja és Lidércsereg.

Az új lapok jelenleg alfa állapotú, tematikusan újrahasznált SVG-jeleneteket használnak. A mechanikák stabilizálása után érdemes mindegyikhez egyedi végleges illusztrációt készíteni.

## Olvashatóság

- Az akciósáv a játéktér és a kéz között marad.
- Asztali nézetben a kiválasztottlap-panel nagyobb, a teljes képességszöveg **14–15 px** méretű, nagyobb sortávval.
- A kártyákon csak a gyors információk és kulcsszavak maradnak; a teljes szabályszöveg a kiválasztottlap-panelen olvasható.
- Mobilon és alacsonyabb kijelzőn a felület inkább görget, mint hogy olvashatatlanul összenyomja a lapokat.

## Online játék

A szerver Node.js 20+ környezetben fut, külső npm-függőség nélkül.

```bash
npm start
```

Alapértelmezett helyi cím: `http://localhost:8080`.

A szerver a `PORT` környezeti változót használja és `0.0.0.0` címen figyel, ezért Render Web Service-ként közvetlenül telepíthető. A `/health` útvonal health checkként használható.

Az online szerver a saját paklit is **szerveroldalon validálja**; hibás méretű, túl sok példányt vagy túl sok elemet tartalmazó paklit nem fogad el.

## Offline játék AI ellen

A `index.html` és a `runaharc-standalone.html` önálló fájlok; közvetlenül megnyithatók böngészőben. Az AI mód a böngészőben elmentett aktív saját paklit használja, ha az érvényes.

## Ellenőrzések

```bash
npm test
npm run lint
node tests/online-e2e.mjs
node tests/http-smoke.mjs
GAMES=50000 DIVERSE_GAMES=50000 npm run balance > balance-report.json
PER_PAIR=1000 npm run balance:archetypes > archetype-report.json
N=300 npm run balance:elements > element-report.json
```
