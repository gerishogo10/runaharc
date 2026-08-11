import { cardArtwork } from './art.js';
import { CARD_LIBRARY } from './engine.js';
import { isSoundEnabled, playGameEvent, primeAudio, setSoundEnabled } from './effects.js';

let socket; let state = null; let seat = null; let selected = null; let room = null; let lastEventSeq = 0;
const $ = id => document.getElementById(id);
const ids = ['hand','playerBoard','enemyBoard','playerShields','enemyShields','playerRunes','enemyRunes','playerMeta','enemyMeta','playerName','enemyName','turnPill','selectedName','selectedText','actions','log','endTurnBtn','toast','connection','roomInfo','roomCode','nameInput','roomInput','createRoom','joinRoom','soundBtn','spellReveal'];
const els = Object.fromEntries(ids.map(id => [id, $(id)]));
const elementMeta = { tuz:['TŰZ','🔥'], vihar:['VIHAR','⚡'], fold:['FÖLD','◆'], viz:['VÍZ','◉'], szellem:['SZELLEM','☾'], semleges:['SEMLEGES','•'] };
const isBoardCard = card => card.type === 'creature' || card.type === 'structure';

function updateSoundButton() { els.soundBtn.textContent = isSoundEnabled() ? 'HANG: BE' : 'HANG: KI'; els.soundBtn.setAttribute('aria-pressed', String(isSoundEnabled())); }
function connect() {
  if (location.protocol === 'file:') { els.connection.textContent = 'Az online módhoz előbb indítsd el a szervert az „npm start” paranccsal.'; els.createRoom.disabled = true; els.joinRoom.disabled = true; return; }
  const proto = location.protocol === 'https:' ? 'wss' : 'ws'; socket = new WebSocket(`${proto}://${location.host}/ws`);
  socket.onopen = () => { els.connection.textContent = 'A szerver elérhető.'; };
  socket.onclose = () => { els.connection.textContent = 'A szerverkapcsolat megszakadt.'; toast('A szerverkapcsolat megszakadt.'); };
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.type === 'room') { room = message.code; seat = message.seat; els.roomInfo.hidden = false; els.roomCode.textContent = room; els.connection.textContent = message.waiting ? 'Várakozás a második játékosra…' : 'A párbaj indul.'; }
    if (message.type === 'state') { state = message.state; seat = message.seat; document.body.classList.add('game-active'); els.connection.textContent = 'Az online párbaj aktív.'; render(); }
    if (message.type === 'error') toast(message.message);
  };
}
function send(type, payload = {}) { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type, ...payload })); }
function sendAction(action) { primeAudio(); selected = null; send('action', action); }

function cardEl(card, zone, owner) {
  const el = document.createElement('button'); el.type = 'button';
  el.className = `card ${card.type} element-${card.element || 'semleges'} ${card.exhausted && zone === 'board' ? 'exhausted' : ''} ${selected?.uid === card.uid ? 'selected' : ''}`;
  el.dataset.rarity = card.rarity; el.dataset.uid = card.uid;
  const remaining = Math.max(0, (card.hp || 0) - (card.damage || 0));
  const typeLabel = card.type === 'creature' ? 'LÉNY' : card.type === 'structure' ? 'BÁSTYA' : 'IGE';
  const [elementName, elementIcon] = elementMeta[card.element || 'semleges'];
  const stats = card.type === 'creature' ? `<div class="stats"><span class="atk">⚔ ${card.atk + card.bonusAtk}</span><span class="hp">♥ ${remaining}</span></div>` : card.type === 'structure' ? `<div class="stats structure-stats"><span class="guard">🛡 ${remaining}</span><span class="passive-word">PASSZÍV</span></div>` : '';
  el.innerHTML = `<div class="card-top"><span class="cost">${card.cost}</span><span class="card-name">${card.name}</span><span class="card-kind">${typeLabel}</span></div><div class="art">${cardArtwork(card.id, card.uid)}<span class="element-badge" title="${elementName}">${elementIcon}</span>${card.burn ? '<span class="burn-badge" title="Parázs">🔥</span>' : ''}</div><div class="card-text">${card.text}</div>${stats}<i class="rarity-gem"></i>`;
  el.onclick = () => { primeAudio(); selected = { ...card, zone, owner }; render(); };
  return el;
}

function available(player) { return player.runes.filter(rune => !rune.used).length; }
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
function shields(el, count) { el.innerHTML = ''; for (let i = 0; i < 5; i++) { const shield = document.createElement('i'); shield.className = `shield ${i >= count ? 'broken' : ''}`; el.appendChild(shield); } }
function runes(el, player) { el.textContent = `RÚNÁK: ${player.runes.filter(rune => !rune.used).length} / ${player.runes.length}`; }
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
  shields(els.playerShields, me.shields); shields(els.enemyShields, enemy.shields); runes(els.playerRunes, me); runes(els.enemyRunes, enemy);
  els.playerMeta.textContent = `Kéz: ${me.hand.length} lap · Pakli: ${me.deckCount} lap`; els.enemyMeta.textContent = `Kéz: ${enemy.handCount} lap · Pakli: ${enemy.deckCount} lap`;
  els.turnPill.textContent = state.winner !== null ? `${state.players[state.winner].name} győzött` : `${state.turn}. kör · ${state.active === seat ? 'TE KÖVETKEZEL' : 'AZ ELLENFÉL KÖVETKEZIK'}`;
  els.endTurnBtn.disabled = state.active !== seat || state.winner !== null; els.log.innerHTML = state.log.slice(0, 5).map(entry => `<span>${entry}</span>`).join('');
  renderActions();
  if (state.lastEvent?.seq > lastEventSeq) { lastEventSeq = state.lastEvent.seq; if (state.lastEvent.type === 'spell') showSpellReveal(state.lastEvent); requestAnimationFrame(() => playGameEvent(state.lastEvent, seat)); }
  if (state.winner !== null) toast(`${state.players[state.winner].name} megnyerte a párbajt.`);
}
function renderActions() {
  els.actions.innerHTML = '';
  if (!selected) { els.selectedName.textContent = 'Nincs kiválasztott lap'; els.selectedText.textContent = 'Válassz egy kézlapot vagy egy támadásra kész lényt. A pálya öt támadási folyosóból áll.'; return; }
  els.selectedName.textContent = selected.name; els.selectedText.textContent = selected.text;
  if (!state || state.active !== seat || state.winner !== null) return;
  const me = state.players[seat], enemy = state.players[1 - seat];
  if (selected.zone === 'hand' && selected.owner === seat) {
    const live = me.hand.find(card => card.uid === selected.uid); if (!live) return;
    if (!me.runePlayed) els.actions.append(button('RÚNÁVÁ ALAKÍTOM', '', { kind: 'rune', uid: live.uid }));
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
    const opposite = enemy.board.find(card => card.lane === live.lane);
    if (opposite) {
      els.actions.append(button(`TÁMADÁS: ${opposite.name}`, '', { kind: 'attack', uid: live.uid, target: opposite.uid }));
      if (live.bypassShield && enemy.shields > 0) els.actions.append(button('ŐRKŐ MEGKERÜLÉSE', 'warn', { kind: 'attack', uid: live.uid, target: null }));
    } else els.actions.append(button(enemy.shields > 0 ? 'ŐRKŐ MEGTÁMADÁSA' : 'MAG MEGTÁMADÁSA', 'warn', { kind: 'attack', uid: live.uid, target: null }));
  }
}
function toast(message) { els.toast.textContent = message; els.toast.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => els.toast.classList.remove('show'), 2000); }
els.createRoom.onclick = () => { primeAudio(); send('create', { name: els.nameInput.value.trim() || 'Rúnaidéző' }); };
els.joinRoom.onclick = () => { primeAudio(); send('join', { code: els.roomInput.value.trim().toUpperCase(), name: els.nameInput.value.trim() || 'Vendég' }); };
els.endTurnBtn.onclick = () => sendAction({ kind: 'end' }); els.soundBtn.onclick = () => { setSoundEnabled(!isSoundEnabled()); updateSoundButton(); };
els.spellReveal?.addEventListener('click', () => { els.spellReveal.hidden = true; clearTimeout(showSpellReveal.t); });
window.addEventListener('keydown', event => { if (event.key === 'Escape') { selected = null; if (els.spellReveal) els.spellReveal.hidden = true; render(); } });
updateSoundButton(); connect();
