import { cardArtwork } from './art.js';
import { isSoundEnabled, playGameEvent, primeAudio, setSoundEnabled } from './effects.js';

let socket;
let state = null;
let seat = null;
let selected = null;
let room = null;
let lastEventSeq = 0;
const $ = id => document.getElementById(id);
const ids = ['hand','playerBoard','enemyBoard','playerShields','enemyShields','playerRunes','enemyRunes','playerMeta','enemyMeta','playerName','enemyName','turnPill','selectedName','selectedText','actions','log','endTurnBtn','toast','connection','roomInfo','roomCode','nameInput','roomInput','createRoom','joinRoom','soundBtn'];
const els = Object.fromEntries(ids.map(id => [id, $(id)]));

function updateSoundButton() {
  els.soundBtn.textContent = isSoundEnabled() ? 'HANG: BE' : 'HANG: KI';
  els.soundBtn.setAttribute('aria-pressed', String(isSoundEnabled()));
}

function connect() {
  if (location.protocol === 'file:') {
    els.connection.textContent = 'Az online módhoz előbb indítsd el a szervert az „npm start” paranccsal.';
    els.createRoom.disabled = true; els.joinRoom.disabled = true; return;
  }
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  socket = new WebSocket(`${proto}://${location.host}/ws`);
  socket.onopen = () => { els.connection.textContent = 'A szerver elérhető.'; };
  socket.onclose = () => { els.connection.textContent = 'A szerverkapcsolat megszakadt.'; toast('A szerverkapcsolat megszakadt.'); };
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.type === 'room') {
      room = message.code; seat = message.seat;
      els.roomInfo.hidden = false; els.roomCode.textContent = room;
      els.connection.textContent = message.waiting ? 'Várakozás a második játékosra…' : 'A párbaj indul.';
    }
    if (message.type === 'state') {
      state = message.state; seat = message.seat;
      els.connection.textContent = 'Az online párbaj aktív.';
      render();
    }
    if (message.type === 'error') toast(message.message);
  };
}

function send(type, payload = {}) {
  if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type, ...payload }));
}

function sendAction(action) {
  primeAudio();
  selected = null;
  send('action', action);
}

function cardEl(card, zone, owner) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = `card ${card.type} ${card.exhausted && zone === 'board' ? 'exhausted' : ''} ${selected?.uid === card.uid ? 'selected' : ''}`;
  el.dataset.rarity = card.rarity;
  el.dataset.uid = card.uid;
  el.setAttribute('aria-label', `${card.name}, költsége: ${card.cost} rúna${card.type === 'creature' ? `, ${card.atk + card.bonusAtk} támadás, ${Math.max(0, card.hp - card.damage)} életerő` : ''}`);
  const typeLabel = card.type === 'creature' ? 'LÉNY' : 'IGE';
  el.innerHTML = `<div class="card-top"><span class="cost">${card.cost}</span><span class="card-name">${card.name}</span><span class="card-kind">${typeLabel}</span></div><div class="art">${cardArtwork(card.id, card.uid)}</div><div class="card-text">${card.text}</div>${card.type === 'creature' ? `<div class="stats"><span class="atk">⚔ ${card.atk + card.bonusAtk}</span><span class="hp">♥ ${Math.max(0, card.hp - card.damage)}</span></div>` : ''}<i class="rarity-gem"></i>`;
  el.onclick = () => { primeAudio(); selected = { ...card, zone, owner }; render(); };
  return el;
}

function shields(el, count) {
  el.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const shield = document.createElement('i'); shield.className = `shield ${i >= count ? 'broken' : ''}`; el.appendChild(shield);
  }
}
function runes(el, player) { el.textContent = `RÚNÁK: ${player.runes.filter(rune => !rune.used).length} / ${player.runes.length}`; }
function button(label, cls, action) {
  const b = document.createElement('button'); b.type = 'button'; b.className = `action-btn ${cls || ''}`; b.textContent = label;
  b.onclick = () => sendAction(action); return b;
}

function render() {
  if (!state) return;
  const me = state.players[seat];
  const enemy = state.players[1 - seat];
  els.playerName.textContent = me.name; els.enemyName.textContent = enemy.name;
  els.hand.replaceChildren(...me.hand.map(card => cardEl(card, 'hand', seat)));
  els.playerBoard.replaceChildren(...me.board.map(card => cardEl(card, 'board', seat)));
  els.enemyBoard.replaceChildren(...enemy.board.map(card => cardEl(card, 'board', 1 - seat)));
  shields(els.playerShields, me.shields); shields(els.enemyShields, enemy.shields);
  runes(els.playerRunes, me); runes(els.enemyRunes, enemy);
  els.playerMeta.textContent = `Kéz: ${me.hand.length} lap · Pakli: ${me.deckCount} lap`;
  els.enemyMeta.textContent = `Kéz: ${enemy.handCount} lap · Pakli: ${enemy.deckCount} lap`;
  els.turnPill.textContent = state.winner !== null
    ? `${state.players[state.winner].name} győzött`
    : `${state.turn}. kör · ${state.active === seat ? 'TE KÖVETKEZEL' : 'AZ ELLENFÉL KÖVETKEZIK'}`;
  els.endTurnBtn.disabled = state.active !== seat || state.winner !== null;
  els.log.innerHTML = state.log.slice(0, 5).map(entry => `<span>${entry}</span>`).join('');
  renderActions();
  if (state.lastEvent?.seq > lastEventSeq) {
    lastEventSeq = state.lastEvent.seq;
    requestAnimationFrame(() => playGameEvent(state.lastEvent, seat));
  }
  if (state.winner !== null) toast(`${state.players[state.winner].name} megnyerte a párbajt.`);
}

function renderActions() {
  els.actions.innerHTML = '';
  if (!selected) {
    els.selectedName.textContent = 'Nincs kiválasztott lap';
    els.selectedText.textContent = 'Válassz egy lapot a kezedből, vagy egy támadásra kész lényt a játéktérről.';
    return;
  }
  els.selectedName.textContent = selected.name; els.selectedText.textContent = selected.text;
  if (!state || state.active !== seat || state.winner !== null) return;
  const me = state.players[seat], enemy = state.players[1 - seat];
  if (selected.zone === 'hand' && selected.owner === seat) {
    const live = me.hand.find(card => card.uid === selected.uid); if (!live) return;
    if (!me.runePlayed) els.actions.append(button('RÚNÁVÁ ALAKÍTOM', '', { kind: 'rune', uid: live.uid }));
    const available = me.runes.filter(rune => !rune.used).length;
    const cost = Math.max(0, live.cost - (live.type === 'creature' ? me.discount : 0));
    if (available >= cost) els.actions.append(button(`KIJÁTSZOM · ${cost} RÚNÁÉRT`, 'primary', { kind: 'play', uid: live.uid }));
  }
  if (selected.zone === 'board' && selected.owner === seat) {
    const live = me.board.find(card => card.uid === selected.uid); if (!live || live.exhausted) return;
    els.actions.append(button(enemy.shields > 0 ? 'ŐRKŐ MEGTÁMADÁSA' : 'MAG MEGTÁMADÁSA', 'warn', { kind: 'attack', uid: live.uid, target: null }));
    enemy.board.forEach(target => els.actions.append(button(`TÁMADÁS: ${target.name}`, '', { kind: 'attack', uid: live.uid, target: target.uid })));
  }
}

function toast(message) {
  els.toast.textContent = message; els.toast.classList.add('show'); clearTimeout(toast.t);
  toast.t = setTimeout(() => els.toast.classList.remove('show'), 2000);
}

els.createRoom.onclick = () => { primeAudio(); send('create', { name: els.nameInput.value.trim() || 'Rúnaidéző' }); };
els.joinRoom.onclick = () => { primeAudio(); send('join', { code: els.roomInput.value.trim().toUpperCase(), name: els.nameInput.value.trim() || 'Vendég' }); };
els.endTurnBtn.onclick = () => sendAction({ kind: 'end' });
els.soundBtn.onclick = () => { setSoundEnabled(!isSoundEnabled()); updateSoundButton(); };
window.addEventListener('keydown', event => { if (event.key === 'Escape') { selected = null; render(); } });

updateSoundButton();
connect();
