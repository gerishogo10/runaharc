import { cardArtwork } from './art.js';
import { CARD_LIBRARY, MAX_RUNES, DEFAULT_DECK_LIST, GUARDIAN_MAX_HP, CORE_MAX_HP } from './engine.js';
import { isSoundEnabled, playGameEvent, primeAudio, setSoundEnabled } from './effects.js';

let socket; let state = null; let seat = null; let selected = null; let room = null; let lastEventSeq = 0; let actionPending = false;
const $ = id => document.getElementById(id);
function ensureCoreMeter(coreId, shieldsId) {
  let core = $(coreId); if (core) return core;
  const shields = $(shieldsId); if (!shields?.parentElement) return null;
  core = document.createElement('div'); core.id = coreId; core.className = 'core-meter';
  shields.insertAdjacentElement('afterend', core);
  return core;
}
ensureCoreMeter('playerCore', 'playerShields'); ensureCoreMeter('enemyCore', 'enemyShields');
const ids = ['hand','playerBoard','enemyBoard','playerShields','enemyShields','playerCore','enemyCore','playerRunes','enemyRunes','playerMeta','enemyMeta','playerName','enemyName','turnPill','selectedName','selectedMeta','selectedText','actions','log','endTurnBtn','toast','connection','roomInfo','roomCode','nameInput','roomInput','createRoom','joinRoom','soundBtn','spellReveal'];
const els = Object.fromEntries(ids.map(id => [id, $(id)]));
const expectedUiVersion = '11';
const expectedProtocolVersion = 11;
const actualUiVersion = document.querySelector('meta[name="runaharc-ui"]')?.content || null;
const missingUiIds = ids.filter(id => !els[id]);
const versionMismatch = Boolean(actualUiVersion && actualUiVersion !== expectedUiVersion);
const uiReady = !versionMismatch && missingUiIds.length === 0;
function failClosedUi() {
  const end = document.getElementById('endTurnBtn'); if (end) end.disabled = true;
  const create = document.getElementById('createRoom'); if (create) create.disabled = true;
  const join = document.getElementById('joinRoom'); if (join) join.disabled = true;
  const message = versionMismatch
    ? `Kevert játékverzió (${actualUiVersion}/${expectedUiVersion}). Töltsd fel újra a teljes frissítőcsomagot, majd frissíts Ctrl+F5-tel.`
    : 'Hiányos játékfelület: ' + missingUiIds.join(', ') + '. Töltsd fel újra a teljes frissítőcsomagot, majd frissíts Ctrl+F5-tel.';
  const target = document.getElementById('connection') || document.getElementById('selectedText'); if (target) target.textContent = message;
}
if (els.endTurnBtn) els.endTurnBtn.disabled = true;
if (!uiReady) failClosedUi();
const elementMeta = { tuz:['TŰZ','🔥'], vihar:['VIHAR','⚡'], fold:['FÖLD','◆'], viz:['VÍZ','◉'], szellem:['SZELLEM','☾'], semleges:['SEMLEGES','•'] };
const isBoardCard = card => card.type === 'creature' || card.type === 'structure';
const cardKeyword = card => ({
  turul:'KIJÁTSZÁS', liderc:'ALAPLÉNY', betyar:'+1 TÁMADÁS', sarkany:'ÁTTÖRÉS', taltos:'HÚZÁS', vasorr:'KIJÁTSZÁS',
  bastya:'VÉDŐMEZŐ', szellovas:'ÁTREPÜLÉS', zivatar:'LÁNCSEBZÉS', parazs:'PARÁZS', forras:'GYÓGYÍTÁS',
  vereshold:'+1 TÁMADÁS', rovaskor:'-3 KÖLTSÉG', deak:'RÚNAVISSZHANG', javas:'FORRÁSGYÓGYÍTÁS', kobzos:'UTOLSÓ DAL',
  rovasvalto:'RÚNAVISSZAFEJTÉS', csodaszarvas:'VÁNDORLÁS', ostromlo:'OSTROM 1', orkokovac:'ŐRKŐJAVÍTÁS', betoro:'SEBZETT FAL', korepesztes:'ŐRKŐSEBZÉS',
  villamvadasz:'LENDÜLET', mennydorges:'TERÜLETI SEBZÉS', hamufonix:'ÚJJÁSZÜLETÉS', langostrom:'OSTROMIGE', kofal:'ERŐDFAL', foldrengeto:'VISSZAVERÉS', forrastunder:'ÁRAMLÁS', aradas:'GYÓGYÍTÁS', osokhangja:'RÚNAVISSZAFEJTÉS', lidercsapat:'KÍSÉRTETJÁRÁS'
}[card.id] || 'KÉPESSÉG');
function cardMetaText(card) {
  const typeLabel = card.type === 'creature' ? 'Lény' : card.type === 'structure' ? 'Bástya' : 'Ige';
  const [elementName] = elementMeta[card.element || 'semleges'];
  const remaining = Math.max(0, (card.hp || 0) - (card.damage || 0));
  const stats = card.type === 'creature' ? ` · ⚔ ${card.atk + card.bonusAtk} · ♥ ${remaining}` : card.type === 'structure' ? ` · 🛡 ${remaining}` : '';
  const lane = Number.isInteger(card.lane) ? ` · ${card.lane + 1}. folyosó` : '';
  return `${typeLabel} · ${elementName} · ${card.cost} rúna${stats}${lane}`;
}

const DECK_STORAGE_KEY = 'runaharc.deck.v11';
function selectedDeck() {
  try { const deck = JSON.parse(localStorage.getItem(DECK_STORAGE_KEY) || 'null'); if (Array.isArray(deck) && deck.length === 30) return deck; } catch {}
  return [...DEFAULT_DECK_LIST];
}

function updateSoundButton() { if (!els.soundBtn) return; els.soundBtn.textContent = isSoundEnabled() ? 'HANG: BE' : 'HANG: KI'; els.soundBtn.setAttribute('aria-pressed', String(isSoundEnabled())); }
function connect() {
  if (!uiReady) return;
  if (location.protocol === 'file:') { els.connection.textContent = 'Az online módhoz előbb indítsd el a szervert az „npm start” paranccsal.'; els.createRoom.disabled = true; els.joinRoom.disabled = true; return; }
  const proto = location.protocol === 'https:' ? 'wss' : 'ws'; socket = new WebSocket(`${proto}://${location.host}/ws`);
  socket.onopen = () => { els.connection.textContent = 'A szerver elérhető.'; };
  socket.onclose = () => { actionPending = false; clearTimeout(sendAction.t); els.connection.textContent = 'A szerverkapcsolat megszakadt.'; toast('A szerverkapcsolat megszakadt.'); render(); };
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.type === 'room') { room = message.code; seat = message.seat; els.roomInfo.hidden = false; els.roomCode.textContent = room; els.connection.textContent = message.waiting ? 'Várakozás a második játékosra…' : 'A párbaj indul.'; }
    if (message.type === 'state') {
      actionPending = false; clearTimeout(sendAction.t);
      if (message.state?.protocolVersion !== expectedProtocolVersion) {
        state = null; if (els.endTurnBtn) els.endTurnBtn.disabled = true;
        els.connection.textContent = 'Kevert szerver/kliens verzió. Töltsd fel újra a teljes frissítőcsomagot, majd frissíts Ctrl+F5-tel.';
        toast('Verzióütközés: a játék biztonsági okból leállította az akciókat.');
        return;
      }
      state = message.state; seat = message.seat; document.body.classList.add('game-active'); els.connection.textContent = 'Az online párbaj aktív.'; render();
    }
    if (message.type === 'error') { actionPending = false; clearTimeout(sendAction.t); toast(message.message); render(); }
  };
}
function send(type, payload = {}) { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type, ...payload })); }
function sendAction(action) {
  if (!uiReady || actionPending || socket?.readyState !== WebSocket.OPEN) return;
  primeAudio(); actionPending = true; selected = null; send('action', action); render();
  clearTimeout(sendAction.t); sendAction.t = setTimeout(() => { if (!actionPending) return; actionPending = false; toast('A szerver nem válaszolt időben. Próbáld újra a lépést.'); render(); }, 5000);
}

function cardEl(card, zone, owner) {
  const el = document.createElement('button'); el.type = 'button';
  el.className = `card ${card.type} element-${card.element || 'semleges'} ${card.exhausted && zone === 'board' ? 'exhausted' : ''} ${selected?.uid === card.uid ? 'selected' : ''}`;
  el.dataset.rarity = card.rarity; el.dataset.uid = card.uid;
  const remaining = Math.max(0, (card.hp || 0) - (card.damage || 0));
  const typeLabel = card.type === 'creature' ? 'LÉNY' : card.type === 'structure' ? 'BÁSTYA' : 'IGE';
  const [elementName, elementIcon] = elementMeta[card.element || 'semleges'];
  const stats = card.type === 'creature' ? `<div class="stats"><span class="atk">⚔ ${card.atk + card.bonusAtk}</span><span class="hp">♥ ${remaining}</span></div>` : card.type === 'structure' ? `<div class="stats structure-stats"><span class="guard">🛡 ${remaining}</span><span class="passive-word">PASSZÍV</span></div>` : '';
  const keyword = cardKeyword(card);
  el.setAttribute('aria-label', `${card.name}. ${cardMetaText(card)}. ${card.text}`);
  el.title = card.text;
  el.innerHTML = `<div class="card-top"><span class="cost">${card.cost}</span><span class="card-name">${card.name}</span><span class="card-kind">${typeLabel}</span></div><div class="art">${cardArtwork(card.id, card.uid)}<span class="element-badge" title="${elementName}">${elementIcon}</span>${card.burn ? '<span class="burn-badge" title="Parázs">🔥</span>' : ''}</div><div class="card-keywords"><span class="element-word">${elementName}</span><span>${keyword}</span></div>${stats}<i class="rarity-gem"></i>`;
  el.onclick = () => { primeAudio(); selected = { ...card, zone, owner }; render(); };
  return el;
}

function available(player) { return player.runes.filter(rune => !rune.used).length + (player.spark ? 1 : 0); }
function cost(player, card) { return Math.max(0, card.cost - (card.type === 'creature' ? player.discount : 0)); }
function openLanes(player) { return [0,1,2,3,4].filter(lane => !player.board.some(card => card.lane === lane)); }
function canPlaceSelectedInLane(lane) {
  if (!state || !selected || selected.zone !== 'hand' || selected.owner !== seat || state.active !== seat || state.winner !== null) return false;
  const me = state.players[seat], live = me.hand.find(card => card.uid === selected.uid);
  return Boolean(live && isBoardCard(live) && available(me) >= cost(me, live) && openLanes(me).includes(lane));
}
function renderBoard(el, player, owner) {
  const slots = [];
  for (let lane = 0; lane < 5; lane++) {
    const slot = document.createElement('div'); slot.className = 'lane-slot'; slot.dataset.lane = lane;
    const card = player.board.find(unit => unit.lane === lane);
    if (card) slot.appendChild(cardEl(card, 'board', owner));
    else {
      slot.innerHTML = `<span class="lane-number">${lane + 1}</span><span class="lane-empty">ÜRES HELY</span>`;
      if (owner === seat && canPlaceSelectedInLane(lane)) {
        slot.classList.add('summon-target'); slot.tabIndex = 0; slot.setAttribute('role','button');
        const place = () => sendAction({ kind: 'play', uid: selected.uid, lane });
        slot.onclick = place; slot.onkeydown = event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); place(); } };
      }
    }
    slots.push(slot);
  }
  el.replaceChildren(...slots);
}
function shields(el, player) {
  const hp = Math.max(0, player.guardianHp || 0); const pct = Math.max(0, Math.min(100, hp / GUARDIAN_MAX_HP * 100));
  el.className = `shields guardian-total ${hp <= 0 ? 'broken' : hp <= 8 ? 'critical' : ''}`;
  el.setAttribute('aria-label', `Őrkő-élet: ${hp}/${GUARDIAN_MAX_HP}`);
  el.innerHTML = `<span class="guardian-label">ŐRKŐ-ÉLET <b>${hp}/${GUARDIAN_MAX_HP}</b></span><span class="guardian-track"><i style="width:${pct}%"></i></span>`;
}
function core(el, player) { el.textContent = `MAG ${player.coreHp}/${CORE_MAX_HP}`; el.classList.toggle('open', player.coreOpen); }
function runes(el, player) { const ready = player.runes.filter(rune => !rune.used).length + (player.spark ? 1 : 0); el.textContent = `RÚNÁK: ${ready} / ${player.runes.length}${player.spark ? ' · +1 SZIKRA' : ''}${player.runes.length >= 3 ? ' · VISSZHANG' : ''}`; }
function button(label, cls, action) { const b = document.createElement('button'); b.type = 'button'; b.className = `action-btn ${cls || ''}`; b.textContent = label; b.onclick = () => sendAction(action); return b; }

function showSpellReveal(event) {
  const card = CARD_LIBRARY[event.cardId]; if (!card || !els.spellReveal) return;
  const [elementName, elementIcon] = elementMeta[card.element || 'semleges'];
  els.spellReveal.innerHTML = `<div class="spell-reveal-card"><span class="eyebrow">IGE FELMUTATÁSA · ${elementName}</span><div class="spell-reveal-art">${cardArtwork(card.id, `reveal-${event.seq}`)}</div><h2>${elementIcon} ${card.name}</h2><p>${card.text}</p><small>Kattints bárhová a bezáráshoz</small></div>`;
  els.spellReveal.hidden = false; clearTimeout(showSpellReveal.t); showSpellReveal.t = setTimeout(() => { els.spellReveal.hidden = true; }, 4200);
}

function render() {
  if (!state) return;
  const me = state.players[seat], enemy = state.players[1 - seat];
  els.playerName.textContent = me.name; els.enemyName.textContent = enemy.name;
  els.hand.replaceChildren(...me.hand.map(card => cardEl(card, 'hand', seat)));
  renderBoard(els.playerBoard, me, seat); renderBoard(els.enemyBoard, enemy, 1 - seat);
  shields(els.playerShields, me); shields(els.enemyShields, enemy); core(els.playerCore, me); core(els.enemyCore, enemy); runes(els.playerRunes, me); runes(els.enemyRunes, enemy);
  els.playerMeta.textContent = `Kéz: ${me.hand.length} lap · Pakli: ${me.deckCount} lap${me.fatigue ? ` · Kimerülés: ${me.fatigue}` : ''}`; els.enemyMeta.textContent = `Kéz: ${enemy.handCount} lap · Pakli: ${enemy.deckCount} lap${enemy.fatigue ? ` · Kimerülés: ${enemy.fatigue}` : ''}`;
  els.turnPill.textContent = state.winner !== null ? `${state.players[state.winner].name} győzött` : `${state.turn}. kör · ${state.active === seat ? 'TE KÖVETKEZEL' : 'AZ ELLENFÉL KÖVETKEZIK'}`;
  els.endTurnBtn.disabled = actionPending || socket?.readyState !== WebSocket.OPEN || state.active !== seat || state.winner !== null; els.log.innerHTML = state.log.slice(0, 5).map(entry => `<span>${entry}</span>`).join('');
  renderActions();
  if (state.lastEvent?.seq > lastEventSeq) { lastEventSeq = state.lastEvent.seq; if (state.lastEvent.type === 'spell') showSpellReveal(state.lastEvent); requestAnimationFrame(() => playGameEvent(state.lastEvent, seat)); }
  if (state.winner !== null) toast(`${state.players[state.winner].name} megnyerte a párbajt.`);
}
function renderActions() {
  els.actions.innerHTML = '';
  if (state && selected) {
    const source = state.players[selected.owner];
    const liveSelected = selected.zone === 'hand' ? source?.hand?.find(card => card.uid === selected.uid) : source?.board?.find(card => card.uid === selected.uid);
    if (liveSelected) selected = { ...liveSelected, zone: selected.zone, owner: selected.owner }; else selected = null;
  }
  if (actionPending) { els.selectedName.textContent = 'Lépés feldolgozása…'; els.selectedMeta.textContent = 'Várakozás a szerverre'; els.selectedText.textContent = 'A szerver ellenőrzi a lépést. Újabb akció csak a frissített játékállapot megérkezése után indítható.'; return; }
  if (!selected) { els.selectedName.textContent = 'Nincs kiválasztott lap'; els.selectedMeta.textContent = 'Kattints egy lapra a részletekhez'; els.selectedText.textContent = 'Válassz egy kézlapot vagy egy támadásra kész lényt. A pálya öt támadási folyosóból áll.'; return; }
  els.selectedName.textContent = selected.name; els.selectedMeta.textContent = cardMetaText(selected); els.selectedText.textContent = selected.text;
  if (!state || state.active !== seat || state.winner !== null) return;
  const me = state.players[seat], enemy = state.players[1 - seat];
  if (selected.zone === 'hand' && selected.owner === seat) {
    const live = me.hand.find(card => card.uid === selected.uid); if (!live) return;
    if (!me.runePlayed && me.runes.length < MAX_RUNES) els.actions.append(button('RÚNÁVÁ ALAKÍTOM', '', { kind: 'rune', uid: live.uid }));
    const price = cost(me, live);
    if (available(me) >= price) {
      if (isBoardCard(live)) {
        for (const lane of openLanes(me)) els.actions.append(button(`${lane + 1}. HELY · ${price} RÚNA`, 'primary lane-action', { kind: 'play', uid: live.uid, lane }));
        els.selectedText.textContent = `${live.text} Válaszd ki a pályán vagy itt azt az üres helyet, ahová kijátszod.`;
      } else els.actions.append(button(`IGE KIJÁTSZÁSA · ${price} RÚNA`, 'primary', { kind: 'play', uid: live.uid }));
    }
  }
  if (selected.zone === 'board' && selected.owner === seat) {
    const live = me.board.find(card => card.uid === selected.uid); if (!live) return;
    if (live.type === 'structure' || live.passive) { els.selectedText.textContent = `${live.text} Ez a lap passzív, ezért nem indíthat támadást.`; return; }
    if (live.exhausted) return;
    if (live.id === 'csodaszarvas' && !live.moved) {
      for (const lane of [live.lane - 1, live.lane + 1].filter(lane => lane >= 0 && lane < 5 && !me.board.some(card => card.lane === lane))) {
        els.actions.append(button(`VÁNDORLÁS → ${lane + 1}. HELY`, 'move-action', { kind: 'move', uid: live.uid, lane }));
      }
    }
    const opposite = enemy.board.find(card => card.lane === live.lane);
    if (opposite) {
      els.actions.append(button(`TÁMADÁS: ${opposite.name}`, '', { kind: 'attack', uid: live.uid, target: opposite.uid }));
      if (live.bypassShield && enemy.guardianHp > 0) els.actions.append(button(`ŐRKŐ-ÉLET MEGKERÜLÉSE · ${enemy.guardianHp}/${GUARDIAN_MAX_HP}`, 'warn', { kind: 'attack', uid: live.uid, target: null }));
    } else if (enemy.guardianHp > 0) els.actions.append(button(`ŐRKŐ-ÉLET TÁMADÁSA · ${enemy.guardianHp}/${GUARDIAN_MAX_HP}`, 'warn', { kind: 'attack', uid: live.uid, target: null }));
    else if (enemy.coreOpen) els.actions.append(button(`MAG MEGTÁMADÁSA · ${enemy.coreHp}/${CORE_MAX_HP} ÉP`, 'warn', { kind: 'attack', uid: live.uid, target: null }));
  }
}
function toast(message) { els.toast.textContent = message; els.toast.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => els.toast.classList.remove('show'), 2000); }
if (uiReady) {
  els.createRoom.onclick = () => { primeAudio(); send('create', { name: els.nameInput.value.trim() || 'Rúnaidéző', deck: selectedDeck() }); };
  els.joinRoom.onclick = () => { primeAudio(); send('join', { code: els.roomInput.value.trim().toUpperCase(), name: els.nameInput.value.trim() || 'Vendég', deck: selectedDeck() }); };
  els.endTurnBtn.onclick = () => sendAction({ kind: 'end' });
  els.soundBtn.onclick = () => { setSoundEnabled(!isSoundEnabled()); updateSoundButton(); };
  els.spellReveal.addEventListener('click', () => { els.spellReveal.hidden = true; clearTimeout(showSpellReveal.t); });
  window.addEventListener('keydown', event => { if (event.key === 'Escape') { selected = null; els.spellReveal.hidden = true; render(); } });
  updateSoundButton(); connect();
}
