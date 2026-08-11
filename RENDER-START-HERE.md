# Rúnaharc – Render telepítés

Ez a mappa GitHub + Render telepítésre kész.

## 1. GitHub
1. Hozz létre egy új, üres GitHub repository-t (például `runaharc`).
2. A GitHub webes felületén válaszd az **Add file → Upload files** lehetőséget.
3. Töltsd fel **ennek a mappának a tartalmát** a repository gyökerébe.
   - Fontos: a `package.json`, `server.js` és `render.yaml` közvetlenül a repo gyökerében legyen.
4. Commitold a fájlokat.

## 2. Render
1. Jelentkezz be a Renderbe GitHubbal.
2. Válaszd a **New → Blueprint** lehetőséget.
3. Kapcsold össze a `runaharc` GitHub repository-t.
4. A Render automatikusan felismeri a gyökérben lévő `render.yaml` fájlt.
5. Ellenőrizd, hogy az instance type **Free**.
6. Indítsd el a Blueprint deployt.
7. Sikeres deploy után nyisd meg a kapott `https://...onrender.com` címet.

## 3. Játék a barátoddal
1. Mindketten ugyanazt az `onrender.com` címet nyissátok meg.
2. Az egyik játékos válassza a szoba létrehozását.
3. Küldje el az 5 karakteres szobakódot a másik játékosnak.
4. A másik játékos adja meg a kódot és csatlakozzon.

## Ellenőrző parancsok
- `npm test`
- `npm run lint`
- `node tests/online-e2e.mjs`

A szerver a Render által megadott `PORT` környezeti változót használja, és `0.0.0.0` címen figyel.
A `/health` végpont egyszerű egészségellenőrzést ad vissza.
