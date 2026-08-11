function frame(id, uid, label, inner, accent='#75e3d4', warm='#d3a85c') {
  const s=String(uid||id).replace(/[^a-zA-Z0-9_-]/g,'');
  return `<svg viewBox="0 0 180 112" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${s}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1c2833"/><stop offset=".52" stop-color="#0c1219"/><stop offset="1" stop-color="#05080c"/></linearGradient>
    <radialGradient id="glow-${s}" cx="50%" cy="42%" r="65%"><stop stop-color="${accent}" stop-opacity=".34"/><stop offset=".55" stop-color="${accent}" stop-opacity=".06"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    <linearGradient id="metal-${s}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff2c4"/><stop offset=".26" stop-color="${warm}"/><stop offset=".58" stop-color="#70502b"/><stop offset="1" stop-color="#f1d492"/></linearGradient>
    <filter id="soft-${s}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="shadow-${s}" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="2.4" flood-color="#000" flood-opacity=".75"/></filter>
    <pattern id="grain-${s}" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="1" cy="2" r=".45" fill="#fff" opacity=".05"/><circle cx="6" cy="5" r=".35" fill="#fff" opacity=".035"/><path d="M0 7 8 1" stroke="#fff" stroke-width=".25" opacity=".018"/></pattern>
    <linearGradient id="fade-${s}" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></linearGradient>
  </defs>
  <rect width="180" height="112" fill="url(#bg-${s})"/>
  <rect width="180" height="112" fill="url(#glow-${s})"/>
  ${inner.replaceAll('$S',s).replaceAll('$A',accent).replaceAll('$W',warm)}
  <path d="M7 21V8h13M160 8h13v13M7 91v13h13M160 104h13V91" fill="none" stroke="url(#metal-${s})" stroke-width="1.2" opacity=".72"/>
  <path d="M15 12h27M138 12h27M15 100h27M138 100h27" stroke="${accent}" stroke-width=".8" opacity=".34"/>
  <rect width="180" height="112" fill="url(#fade-${s})"/>
  <rect width="180" height="112" fill="url(#grain-${s})"/>
  <rect x=".7" y=".7" width="178.6" height="110.6" rx="8" fill="none" stroke="rgba(255,255,255,.18)"/>
  </svg>`;
}

const scenes = {
  turul: (s)=>frame('turul',s,'Turul őrszem viharfelhők és hegygerincek fölött',`
    <circle cx="135" cy="25" r="22" fill="#dffff9" opacity=".16" filter="url(#soft-$S)"/><circle cx="135" cy="25" r="10" fill="#dffff9" opacity=".85"/>
    <path d="M0 89 28 60 49 75 75 39 101 72 126 47 180 86v26H0Z" fill="#071119"/><path d="M0 96 40 70 66 87 101 62 135 88 180 69v43H0Z" fill="#0a1820" opacity=".9"/>
    <g><path d="M37 48c16-24 38-27 54-12 16-15 40-12 56 12-21-8-37-4-52 8l-5 20-6-20C69 44 56 41 37 48Z" fill="#eefcf8"/><path d="M61 47c13 1 22 6 29 15 8-9 18-14 31-15-12 7-20 14-25 24l-6 13-7-13c-4-10-12-17-22-24Z" fill="#c7d7d3"/><path d="m86 48 5-16 7 16-7 8Z" fill="url(#metal-$S)"/><circle cx="92" cy="43" r="1.7" fill="#101820"/></g>
    <path d="M17 34c19-10 31-8 42-1M121 39c18-9 31-7 42 2" stroke="$A" opacity=".22" stroke-width="1.4" fill="none"/>`,'#75e3d4','#d3a85c'),
  liderc: (s)=>frame('liderc',s,'Mocsári lidérc a ködös nádasban',`
    <rect width="180" height="112" fill="#0a231d" opacity=".66"/><path d="M0 78c24-9 36 1 56-5 25-8 40 6 62-2 20-7 41-2 62 3v38H0Z" fill="#07140f"/>
    <g opacity=".65" stroke="#608778" stroke-width="1.2"><path d="M19 77 14 42M26 79l3-46M146 78l5-40M155 80l-2-47M39 80l-6-33"/><path d="M13 51l-8-9M28 49l9-10M150 51l-10-11M154 47l8-11"/></g>
    <ellipse cx="91" cy="49" rx="39" ry="31" fill="$A" opacity=".16" filter="url(#soft-$S)"/>
    <g><path d="M70 83c5-14 1-30 7-44 3-8 9-14 14-18 9 8 15 18 17 31 2 11 0 21 5 31l-13-10-9 13-8-13Z" fill="#caffeb" opacity=".76"/><path d="M78 46c6-8 20-9 28 0-1 14-7 21-14 22-8-1-13-9-14-22Z" fill="#e6fff3" opacity=".82"/><circle cx="86" cy="48" r="2.2" fill="#0d3a2c"/><circle cx="98" cy="48" r="2.2" fill="#0d3a2c"/><path d="M87 58c3 2 7 2 10 0" stroke="#24624c" fill="none"/></g>
    <path d="M8 91c39-7 68 8 108-3 22-6 45-1 64 6" stroke="#7ce8bd" opacity=".18" fill="none"/>`,'#57e4ad','#b9dfbf'),
  betyar: (s)=>frame('betyar',s,'Rúnabetyár vörös alkonyatban',`
    <rect width="180" height="112" fill="#2c1712" opacity=".55"/><circle cx="140" cy="26" r="20" fill="#ffba65" opacity=".25" filter="url(#soft-$S)"/><circle cx="140" cy="26" r="11" fill="#efb46d" opacity=".65"/>
    <path d="M0 91 35 67 67 80 96 50 124 78 180 55v57H0Z" fill="#0c1015"/><g><path d="m66 88 4-39 13-18 17 9 4 48Z" fill="#111217"/><path d="m69 48 20-24 28 10-37 9Z" fill="#7c2022"/><path d="M80 42c8-8 20-6 27 2l-4 17-15 4-12-10Z" fill="#c99d72"/><path d="M95 43l8 3-2 4-8-2Z" fill="#221816"/><path d="m103 56 35 33-6 6-36-35Z" fill="#dfe2df"/><path d="m128 83 19 18-8 7-18-20Z" fill="url(#metal-$S)"/><path d="M67 61c-9 8-14 15-18 27" stroke="#9b1f24" stroke-width="7"/></g>
    <path d="M20 37c14 2 25 8 33 17M125 47c15-5 28-4 39 2" stroke="$W" opacity=".24" fill="none"/>`,'#e7744f','#d7a05c'),
  sarkany: (s)=>frame('sarkany',s,'Bakonyi sárkány lángoló hegygerinc fölött',`
    <rect width="180" height="112" fill="#32120e" opacity=".64"/><ellipse cx="47" cy="72" rx="39" ry="26" fill="#ff6a2d" opacity=".18" filter="url(#soft-$S)"/><path d="M0 93 31 64 57 80 88 39 118 77 145 56 180 77v35H0Z" fill="#120b0a"/>
    <g><path d="M39 58c21-31 43-37 65-27l28-12-12 24c17 10 27 25 28 42l-31-20-25 9-18 25-1-31Z" fill="#a33e31"/><path d="M54 57c15-18 32-22 49-15l15 10-24 2-18 17Z" fill="#d17655"/><path d="M101 35c9-5 21-4 30 3l-13 17-21-3Z" fill="#c45d42"/><path d="m128 38 16-5-9 12Z" fill="#f5d07a"/><circle cx="119" cy="42" r="2" fill="#ffe46e"/><path d="M132 49c13 1 22 6 30 15-12-4-22-3-31 2" stroke="#ff9a55" stroke-width="3" fill="none"/></g>
    <path d="M18 76c8-10 17-12 28-6-7 3-12 8-16 15" fill="#ffbf55" opacity=".8"/>`,'#ff784d','#e7b465'),
  taltos: (s)=>frame('taltos',s,'Révülő táltos csillagok és rovásjelek között',`
    <rect width="180" height="112" fill="#11163a" opacity=".65"/><circle cx="139" cy="24" r="18" fill="#e9efff" opacity=".9"/><circle cx="146" cy="18" r="18" fill="#1c2450"/>
    <g fill="#fff" opacity=".74"><circle cx="20" cy="18" r="1.2"/><circle cx="43" cy="29" r="1"/><circle cx="69" cy="14" r="1.4"/><circle cx="110" cy="23" r="1"/><circle cx="158" cy="48" r="1.2"/></g>
    <ellipse cx="87" cy="67" rx="42" ry="28" fill="$A" opacity=".12" filter="url(#soft-$S)"/><g><path d="m68 101 6-50 12-20 14 18 8 52Z" fill="#171320"/><path d="m74 51 12-23 15 21-13 11Z" fill="#d3bfa5"/><path d="M59 86c7-17 17-27 29-31 15 5 26 15 34 31" fill="none" stroke="$A" stroke-width="2.6"/><circle cx="89" cy="66" r="6" fill="#90f3e5"/><path d="m88 54 7 12-7 12-7-12Z" fill="none" stroke="#dffef9"/></g>
    <g stroke="$W" opacity=".35" fill="none"><path d="M33 56h20l-10-13v27M131 63h19l-9-12v25"/></g>`,'#79e7da','#d8b67b'),
  vasorr: (s)=>frame('vasorr',s,'Vasorrú bába izzó üst és erdei kunyhó előtt',`
    <rect width="180" height="112" fill="#291524" opacity=".66"/><path d="M0 89c29-22 52-15 76-7 29 10 64-6 104-17v47H0Z" fill="#0e0b10"/><ellipse cx="45" cy="83" rx="30" ry="22" fill="#f29347" opacity=".2" filter="url(#soft-$S)"/>
    <g><path d="m100 99-8-49 13-24 18 15 7 58Z" fill="#171019"/><path d="m90 49 18-31 31 16-41 10Z" fill="#29202c"/><path d="M102 47c8-7 18-5 27 4l-5 16-17 2-11-10Z" fill="#c79c78"/><path d="m117 52 25 5-24 5Z" fill="#d9dfe1"/><circle cx="111" cy="51" r="2" fill="#28161c"/><path d="M28 73h39l-6 27H34Z" fill="#6b3a24" stroke="#d29255" stroke-width="2"/><path d="M36 69c6-13 18-13 25 0" fill="none" stroke="#e4a55e" stroke-width="4"/><path d="M38 80c6-11 15-12 22 0" fill="$A" opacity=".42"/></g>
    <path d="M44 66c-8-11-3-18 4-24M54 63c6-10 2-18-3-23" stroke="#cae8c7" opacity=".35" fill="none"/>`,'#d87cc1','#d59b56'),
  zivatar: (s)=>frame('zivatar',s,'Zivatarige villámokkal a puszta fölött',`
    <rect width="180" height="112" fill="#111a3a" opacity=".78"/><path d="M0 82c30-12 54 4 82-4 34-10 59 4 98-4v38H0Z" fill="#080d14"/><g opacity=".44" fill="#4f5e80"><ellipse cx="43" cy="30" rx="35" ry="13"/><ellipse cx="85" cy="22" rx="42" ry="16"/><ellipse cx="130" cy="32" rx="38" ry="14"/></g>
    <path d="m100 5-35 49h25L71 106l55-68H99Z" fill="#fff3ae"/><path d="m101 7-28 43h21L80 88l38-51H96Z" fill="#dffff9" opacity=".85"/>
    <g stroke="$A" opacity=".55" fill="none" stroke-width="2"><path d="M47 6 30 29l12 2-18 27M146 9l-17 25 12 1-15 25"/></g><path d="M0 93c39-7 77 4 111-3 25-5 47-4 69 2" stroke="#9bc9ff" opacity=".3"/>`,'#8cecff','#cbd2ff'),
  forras: (s)=>frame('forras',s,'Ősforrás fénylő vízzel és mohos sziklákkal',`
    <rect width="180" height="112" fill="#0b2930" opacity=".72"/><path d="M0 99 28 63 52 77 77 34 102 76 127 57 180 92v20H0Z" fill="#0a1718"/><ellipse cx="91" cy="88" rx="64" ry="19" fill="$A" opacity=".25" filter="url(#soft-$S)"/><ellipse cx="91" cy="87" rx="53" ry="13" fill="#83e9dd" opacity=".45"/><ellipse cx="91" cy="87" rx="35" ry="7" fill="#d9fffb" opacity=".5"/>
    <g><path d="M91 28c-15 20-19 34-5 45 19-5 23-19 5-45Z" fill="#c5fff8"/><path d="M89 36c-8 14-9 23-2 29" stroke="#fff" opacity=".65" fill="none" stroke-width="2"/></g>
    <g fill="#314b40"><circle cx="36" cy="79" r="12"/><circle cx="52" cy="88" r="10"/><circle cx="135" cy="83" r="13"/><circle cx="151" cy="91" r="9"/></g><path d="M31 73c6-7 10-8 17-2M130 77c8-7 14-7 21-1" stroke="#76b77f" stroke-width="3"/>`,'#72e6d7','#b8d39a'),
  vereshold: (s)=>frame('vereshold',s,'Vérhold vörös hegyek és harci rúnák fölött',`
    <rect width="180" height="112" fill="#300b13" opacity=".82"/><circle cx="92" cy="37" r="31" fill="#ff6a62" opacity=".17" filter="url(#soft-$S)"/><circle cx="92" cy="37" r="24" fill="#c52d3c"/><circle cx="86" cy="31" r="20" fill="#e6564e" opacity=".45"/>
    <path d="M0 96 31 68 55 82 82 49 104 84 128 64 180 91v21H0Z" fill="#11080b"/><path d="M23 88 42 67l10 12 18-22 14 25 20-23 17 20 16-15 19 24" fill="none" stroke="#ff7277" stroke-width="2" opacity=".48"/>
    <g stroke="#ffd6bf" opacity=".5"><path d="M20 35h18l-9-12v25M144 39h18l-9-12v25"/></g>`,'#ff5d66','#e1a06d'),
  bastya: (s)=>frame('bastya',s,'Rovásbástya ősi kőkapuval és fénylő védőrúnákkal',`
    <rect width="180" height="112" fill="#172019" opacity=".82"/><path d="M0 94 28 72 49 80 72 55 101 77 128 52 180 82v30H0Z" fill="#0b100d"/><ellipse cx="90" cy="63" rx="55" ry="34" fill="$A" opacity=".12" filter="url(#soft-$S)"/>
    <g filter="url(#shadow-$S)"><path d="M44 100V48l17-23h58l17 23v52H44Z" fill="#29352b" stroke="#9bbb83" stroke-width="2"/><path d="M60 100V55l12-14h36l12 14v45" fill="#111814" stroke="#d7c38d" stroke-width="1.5"/><path d="M79 100V65c0-9 5-15 11-15s11 6 11 15v35" fill="#070b09"/><path d="M50 53h18v16H50ZM112 53h18v16h-18Z" fill="#5f7358"/><path d="M57 29v-13M123 29v-13M46 47l-13-9M134 47l13-9" stroke="#b8d6a5" stroke-width="4"/></g>
    <g fill="none" stroke="$W" opacity=".72"><circle cx="90" cy="69" r="17"/><path d="M90 52v34M73 69h34m-29-12 24 24m0-24-24 24"/></g>`,'#9bc78a','#d4b36f'),
  szellovas: (s)=>frame('szellovas',s,'Széljáró portyázó vágtat a viharfelhők között',`
    <rect width="180" height="112" fill="#102132" opacity=".82"/><path d="M0 86c32-16 55-8 82-17 31-10 62-2 98-17v60H0Z" fill="#081018"/><g stroke="#bff6ff" opacity=".28" fill="none"><path d="M8 25c35 8 61 4 86-8M93 35c28 7 52 4 79-7M16 54c30 5 54 1 75-6"/></g>
    <g filter="url(#shadow-$S)"><path d="M47 82c14-17 29-24 47-19l28-18 19 5-25 24c10 8 16 17 18 27l-29-15-21 8-18 10-8-19Z" fill="#d9e9e8"/><path d="M72 62c8-15 18-25 31-29l15 9-12 17-16 10Z" fill="#697a83"/><path d="m100 35 8-15 10 18-9 8Z" fill="url(#metal-$S)"/><path d="M64 82 35 99M91 86l-12 20M112 78l25 18" stroke="$A" stroke-width="3"/></g><path d="m137 34 19-12-8 20 16 2-25 15 7-17Z" fill="#dffcff" opacity=".8"/>`,'#7fe9ff','#d9b66f'),
  parazs: (s)=>frame('parazs',s,'Parázsige izzó tűzrúnával és szikrázó hamuval',`
    <rect width="180" height="112" fill="#34120d" opacity=".86"/><ellipse cx="90" cy="60" rx="52" ry="39" fill="#ff6b32" opacity=".18" filter="url(#soft-$S)"/><g fill="#ffb65c" opacity=".72"><circle cx="35" cy="30" r="2"/><circle cx="52" cy="77" r="1.6"/><circle cx="137" cy="26" r="1.8"/><circle cx="151" cy="73" r="2.2"/><circle cx="119" cy="91" r="1.4"/></g>
    <g transform="translate(90 59)" filter="url(#shadow-$S)"><path d="M0-43c12 18 31 27 28 49-2 19-15 34-30 40 5-13 0-22-9-31-13-13-8-35 11-58Z" fill="#ff6a2f"/><path d="M-2-23c8 15 18 22 14 37-3 10-9 18-18 23 3-10-2-15-6-21-8-11-2-25 10-39Z" fill="#ffd36e"/><path d="m0-12 10 18-10 18L-10 6Z" fill="none" stroke="#fff4ca" stroke-width="2"/></g>`,'#ff7447','#f1b75e'),
  rovaskor: (s)=>frame('rovaskor',s,'Ősi rováskör arany és türkiz fénnyel',`
    <rect width="180" height="112" fill="#201a10" opacity=".78"/><ellipse cx="90" cy="79" rx="64" ry="23" fill="#030506"/><ellipse cx="90" cy="70" rx="48" ry="32" fill="$W" opacity=".12" filter="url(#soft-$S)"/>
    <g transform="translate(90 67)" fill="none"><ellipse rx="49" ry="31" stroke="$W" stroke-width="2.4"/><ellipse rx="34" ry="21" stroke="$A" stroke-width="1.8"/><circle r="10" stroke="#effffb" stroke-width="1.3"/><path d="M0-30V30M-47 0h94M-32-22l64 44M32-22l-64 44" stroke="#e7d7a5" opacity=".7"/><path d="m0-18 9 18-9 18-9-18Z" stroke="$A" stroke-width="2"/></g>
    <g stroke="$W" opacity=".5"><path d="M35 28h15l-8-10v21M130 31h15l-7-10v20"/></g>`,'#76e8d9','#e1b968'),
  deak: (s)=>frame('deak',s,'Rovásíró deák fénylő kézirattal egy kolostori műhelyben',`
    <rect width="180" height="112" fill="#17152a" opacity=".78"/><path d="M0 94h180v18H0Z" fill="#090a10"/><ellipse cx="92" cy="56" rx="48" ry="34" fill="$A" opacity=".12" filter="url(#soft-$S)"/>
    <g filter="url(#shadow-$S)"><path d="M61 94 69 43l18-18 20 12 10 57Z" fill="#252131"/><circle cx="89" cy="39" r="12" fill="#d6b38e"/><path d="m74 61 43 4-7 28-45-5Z" fill="#efe2bd"/><path d="M80 69h25M78 77h29M77 85h20" stroke="#5b4635" stroke-width="2"/><path d="m113 49 22-19 4 4-21 21Z" fill="url(#metal-$S)"/></g><path d="M31 30h17l-8-11v23M136 31h16l-8-11v22" stroke="$A" opacity=".45"/>`,'#9b8cff','#d7b46a'),
  javas: (s)=>frame('javas',s,'Forrásjáró javas gyógyító vízrúnával',`
    <rect width="180" height="112" fill="#092633" opacity=".8"/><ellipse cx="91" cy="83" rx="62" ry="18" fill="#73e7e0" opacity=".2"/><path d="M0 100 33 72 59 82 88 52 118 80 151 63 180 81v31H0Z" fill="#071317"/>
    <g filter="url(#shadow-$S)"><path d="M76 99 72 55l17-25 18 25 4 44Z" fill="#153540"/><circle cx="90" cy="45" r="11" fill="#caa887"/><path d="M90 63c-13 13-18 21-2 33 17-8 18-19 2-33Z" fill="#bffff7"/><path d="M90 69v20M80 79h20" stroke="#fff" stroke-width="2"/></g><circle cx="90" cy="78" r="30" fill="$A" opacity=".09" filter="url(#soft-$S)"/>`,'#73e7e0','#c9d8aa'),
  kobzos: (s)=>frame('kobzos',s,'Kobzos hírnök esti tábortűznél',`
    <rect width="180" height="112" fill="#2a1b14" opacity=".8"/><circle cx="144" cy="25" r="16" fill="#ffe6b2" opacity=".55"/><path d="M0 92 38 68 71 82 103 57 137 78 180 65v47H0Z" fill="#0d0d10"/>
    <g filter="url(#shadow-$S)"><path d="M65 99 72 51l16-17 18 17 7 48Z" fill="#2b2420"/><circle cx="89" cy="42" r="11" fill="#c49b76"/><ellipse cx="105" cy="69" rx="12" ry="18" fill="#9b5a2c" stroke="#e0b56d" stroke-width="2"/><path d="m97 58-19-23M107 52l13-26" stroke="#e0b56d" stroke-width="3"/><path d="M105 58v23" stroke="#f5d69a"/></g><g fill="$A" opacity=".65"><circle cx="131" cy="51" r="2"/><circle cx="143" cy="43" r="1.7"/><circle cx="153" cy="56" r="1.4"/></g>`,'#e6c07a','#d59855'),
  rovasvalto: (s)=>frame('rovasvalto',s,'Rovásváltó forgó rúnakövek között',`
    <rect width="180" height="112" fill="#1d1530" opacity=".82"/><ellipse cx="90" cy="58" rx="55" ry="38" fill="$A" opacity=".12" filter="url(#soft-$S)"/><g transform="translate(90 58)" fill="none" stroke-linecap="round"><path d="M-38-8c8-22 33-31 54-20l10 6" stroke="$A" stroke-width="4"/><path d="m23-30 8 9-12 3" stroke="$A" stroke-width="4"/><path d="M38 8c-8 22-33 31-54 20l-10-6" stroke="$W" stroke-width="4"/><path d="m-23 30-8-9 12-3" stroke="$W" stroke-width="4"/><circle r="18" stroke="#e9ddff" stroke-width="2"/><path d="M0-13v26M-11 0h22" stroke="#e9ddff"/></g>`,'#b496ff','#d6aa68'),
  csodaszarvas: (s)=>frame('csodaszarvas',s,'Csodaszarvas fényösvényen az éjszakai erdőben',`
    <rect width="180" height="112" fill="#111b2c" opacity=".86"/><circle cx="136" cy="24" r="17" fill="#e9f6ff" opacity=".72"/><path d="M0 92c28-18 50-10 76-19 36-13 66 4 104-14v53H0Z" fill="#08100f"/>
    <g filter="url(#shadow-$S)"><path d="M55 84c14-21 32-29 52-20l18-13 14 5-18 16c7 8 10 17 10 27l-23-15-18 4-14 14-6-17Z" fill="#d8e9df"/><path d="M97 62c6-18 12-30 23-39M104 63c16-16 25-24 37-27M106 58c2-16 0-26-6-36" stroke="url(#metal-$S)" stroke-width="3" fill="none"/><path d="M66 87 48 104M92 88l-7 19M112 82l20 17" stroke="$A" stroke-width="3"/></g><path d="M18 71c38 9 67 5 93-7" stroke="$A" opacity=".25" fill="none"/>`,'#8ff1d0','#e0bd72'),
  ostromlo: (s)=>frame('ostromlo',s,'Kárpáti ostromló faltörő kalapáccsal',`
    <rect width="180" height="112" fill="#252318" opacity=".86"/><path d="M0 93 31 68 54 79 81 54 111 78 142 57 180 73v39H0Z" fill="#10110d"/><g filter="url(#shadow-$S)"><path d="M64 100 68 52l17-22 22 18 8 52Z" fill="#30352b"/><circle cx="90" cy="42" r="11" fill="#bf9972"/><path d="m103 58 39-24 7 10-41 28Z" fill="#8a6a3d"/><path d="m137 27 25 18-11 17-25-18Z" fill="#72766c" stroke="#d5c07e" stroke-width="2"/><path d="M54 72h22M51 83h25" stroke="$A" stroke-width="4"/></g>`,'#c9c46f','#d1a65c'),
  orkokovac: (s)=>frame('orkokovac',s,'Őrkőkovács izzó rúnakövön dolgozik',`
    <rect width="180" height="112" fill="#231b14" opacity=".86"/><ellipse cx="101" cy="72" rx="48" ry="27" fill="#ffba62" opacity=".15" filter="url(#soft-$S)"/><g filter="url(#shadow-$S)"><path d="M53 98 60 53l18-18 18 12 7 51Z" fill="#30312a"/><circle cx="80" cy="44" r="10" fill="#c09a77"/><path d="M103 81h44l-8 18h-36Z" fill="#4c5146" stroke="#cbbd7c"/><path d="m101 57 30-25 6 7-29 28Z" fill="#a98b56"/><path d="m126 27 21 19-9 12-21-19Z" fill="#73766b"/></g><g fill="$A"><circle cx="119" cy="70" r="2"/><circle cx="131" cy="62" r="1.6"/><circle cx="140" cy="74" r="1.8"/></g>`,'#d8d27c','#d4a55d'),
  betoro: (s)=>frame('betoro',s,'Parázsló betörő égő kapu előtt',`
    <rect width="180" height="112" fill="#35120e" opacity=".86"/><path d="M0 96 36 69 63 82 90 55 119 78 151 58 180 76v36H0Z" fill="#100b0a"/><ellipse cx="122" cy="61" rx="39" ry="31" fill="#ff6c38" opacity=".16" filter="url(#soft-$S)"/>
    <g filter="url(#shadow-$S)"><path d="M54 100 62 54l17-17 20 13 8 50Z" fill="#2e1d19"/><circle cx="81" cy="45" r="10" fill="#c59770"/><path d="m96 61 32-18 6 9-32 22Z" fill="#6f5534"/><path d="M123 34c10 11 16 20 10 31-5-6-10-8-14-16-4-8 0-12 4-15Z" fill="#ff9c45"/><path d="M133 54c9 9 12 17 6 27-5-5-10-8-12-14-3-6 1-10 6-13Z" fill="#ffd070"/></g>`,'#ff7c4d','#dfa05c'),
  korepesztes: (s)=>frame('korepesztes',s,'Kőrepesztő ostromrúna széthasadó őskövön',`
    <rect width="180" height="112" fill="#232015" opacity=".86"/><ellipse cx="90" cy="58" rx="55" ry="38" fill="$A" opacity=".12" filter="url(#soft-$S)"/><g transform="translate(90 58)" filter="url(#shadow-$S)"><path d="m-24-39 21 15 18-15 9 23 25 2-13 21 10 23-25 1-17 19-15-20-25-3 13-20-10-23 24-1Z" fill="#686b5d" stroke="url(#metal-$S)" stroke-width="2"/><path d="M-4-28 3-8-7 5 8 16 1 37M20-22 9-4l12 9-8 17M-24-9l17 14-15 15" fill="none" stroke="#fff2b6" stroke-width="2.5"/><circle r="7" fill="$A" opacity=".8"/></g>`,'#d6cf79','#d0a25c')
};

const artAliases = {
  villamvadasz: 'szellovas', mennydorges: 'zivatar', hamufonix: 'parazs', langostrom: 'sarkany',
  kofal: 'bastya', foldrengeto: 'ostromlo', forrastunder: 'javas', aradas: 'forras',
  osokhangja: 'taltos', lidercsapat: 'liderc'
};
export function cardArtwork(id, uid) {
  return (scenes[id] || scenes[artAliases[id]] || scenes.rovaskor)(uid || `${id}-preview`);
}
