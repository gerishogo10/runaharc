# Rúnaharc frissítése Renderen

A projekt Render Web Service-ként futtatható.

## Beállítások

- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/health`
- Root Directory: üres
- Instance Type: Free (ha a fiókodban elérhető)

A szerver automatikusan a Render által biztosított `PORT` változót használja és `0.0.0.0` címen figyel.

## Már létező GitHub + Render telepítés frissítése

1. Csomagold ki a friss ZIP-et.
2. A GitHub `runaharc` repository gyökerébe töltsd fel a ZIP tartalmát, a meglévő fájlok felülírásával.
3. Commitold a változtatásokat.
4. Ha az Auto-Deploy aktív, a Render automatikusan új buildet indít a `main` branchről.
5. A deploy után ellenőrizd a `/health` útvonalat, majd próbálj ki egy kétjátékos szobát.
