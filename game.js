import { cardArtwork } from './art.js';
import { createGame, availableRunes, cardCost, placeRune, playCard, attack, endTurn, aiTakeTurn } from './engine.js';
import { isSoundEnabled, playGameEvent, primeAudio, setSoundEnabled } from './effects.js';

let game = createGame();
let selected = null;
let lastEventSeq = 0;
const $ = id => document.getElementById(id);
const ids = ['hand','playerBoard','enemyBoard','playerShields','enemyShields','playerRunes','enemyRunes','playerMeta','enemyMeta','turnPill','selectedName','selectedText','actions','log','endTurnBtn','toast','rulesDialog','rulesBtn','closeRules','soundBtn'];
const els = Object.fromEntries(ids.map(id => [id, $(id)]));

function updateSoundButton() {
  els.soundBtn.textContent = isSoundEnabled() ? 'HANG: BE' : 'HANG: KI';
  els.soundBtn.setAttribute('aria-pressed', String(isSoundEnabled()));
}

function cardEl(card, zone, owner) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = `card ${card.type} ${card.exhausted && zone === 'board' ? 'exhausted' : ''} ${selected?.uid === card.uid ? 'selected' : ''}`;
  el.dataset.rarity = card.rarity;
  el.dataset.uid = card.uid;
  el.setAttribute('aria-label', `${card.name}, költsége: ${card.cost} rúna${card.type === 'creature' ? `, ${card.atk + card.bonusAtk} támadás, ${Math.max(0, card.hp - card.damage)} életerő` : ''}`);
  const typeLabel = card.type === 'creature' ? 'LÉNY' : 'IGE';
  el.innerHTML = `<div class="card-top"><span class="cost">${card.cost}</span><span class="card-name">${card.name}</span><span class="card-kind">${typeLabel}</span></div><div class="art">${cardArtwork(card.id, card.uid)}</div><div class="card-text">${card.text}</div>${card.type === 'creature' ? `<div class="stats"><span class="atk">⚔ ${card.atk + card.bonusAtk}</span><span class="hp">♥ ${Math.max(0, card.hp - card.damage)}</span></div>` : ''}<i class="rarity-gem" aria-hidden="true"></i>`;
  el.onclick = () => { primeAudio(); select(card, zone, owner); };
  return el;
}

function renderShields(el, count) {
  el.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const shield = document.createElement('i');
    shield.className = `shield ${i >= count ? 'broken' : ''}`;
    el.appendChild(shield);
  }
}

function renderRunes(el, player) {
  el.textContent = `RÚNÁK: ${availableRunes(player)} / ${player.runes.length}`;
}

function render() {
  const player = game.players[0];
  const enemy = game.players[1];
  els.hand.replaceChildren(...player.hand.map(card => cardEl(card, 'hand', 0)));
  els.playerBoard.replaceChildren(...player.board.map(card => cardEl(card, 'board', 0)));
  els.enemyBoard.replaceChildren(...enemy.board.map(card => cardEl(card, 'board', 1)));
  renderShields(els.playerShields, player.shields);
  renderShields(els.enemyShields, enemy.shields);
  renderRunes(els.playerRunes, player);
  renderRunes(els.enemyRunes, enemy);
  els.playerMeta.textContent = `Kéz: ${player.hand.length} lap · Pakli: ${player.deck.length} lap`;
  els.enemyMeta.textContent = `Kéz: ${enemy.hand.length} lap · Pakli: ${enemy.deck.length} lap`;
  els.turnPill.textContent = game.winner !== null
    ? `${game.players[game.winner].name} győzött`
    : `${game.turn}. kör · ${game.active === 0 ? 'TE KÖVETKEZEL' : 'AZ ELLENFÉL KÖVETKEZIK'}`;
  els.endTurnBtn.disabled = game.active !== 0 || game.winner !== null;
  els.log.innerHTML = game.log.slice(0, 5).map(entry => `<span>${entry}</span>`).join('');
  renderActions();
  if (game.lastEvent?.seq > lastEventSeq) {
    lastEventSeq = game.lastEvent.seq;
    requestAnimationFrame(() => playGameEvent(game.lastEvent, 0));
  }
  if (game.winner !== null) toast(`${game.players[game.winner].name} megnyerte a párbajt.`);
}

function select(card, zone, owner) { selected = { ...card, zone, owner }; render(); }
function clearSelection() { selected = null; render(); }
function button(label, cls, fn) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = `action-btn ${cls || ''}`; b.textContent = label;
  b.onclick = () => { primeAudio(); fn(); };
  return b;
}

function renderActions() {
  els.actions.innerHTML = '';
  if (!selected) {
    els.selectedName.textContent = 'Nincs kiválasztott lap';
    els.selectedText.textContent = 'Válassz egy lapot a kezedből, vagy egy támadásra kész lényt a játéktérről.';
    return;
  }
  els.selectedName.textContent = selected.name;
  els.selectedText.textContent = selected.text;
  const player = game.players[0];
  if (game.active !== 0 || game.winner !== null) return;
  if (selected.zone === 'hand' && selected.owner === 0) {
    const live = player.hand.find(card => card.uid === selected.uid);
    if (!live) return;
    if (!player.runePlayed) els.actions.append(button('RÚNÁVÁ ALAKÍTOM', '', () => { placeRune(game, 0, live.uid); clearSelection(); }));
    const cost = cardCost(player, live);
    if (availableRunes(player) >= cost) els.actions.append(button(`KIJÁTSZOM · ${cost} RÚNÁÉRT`, 'primary', () => { if (playCard(game, 0, live.uid)) clearSelection(); }));
  }
  if (selected.zone === 'board' && selected.owner === 0) {
    const live = player.board.find(card => card.uid === selected.uid);
    if (!live || live.exhausted) return;
    els.actions.append(button(game.players[1].shields > 0 ? 'ŐRKŐ MEGTÁMADÁSA' : 'MAG MEGTÁMADÁSA', 'warn', () => { attack(game, 0, live.uid); clearSelection(); }));
    game.players[1].board.forEach(target => els.actions.append(button(`TÁMADÁS: ${target.name}`, '', () => { attack(game, 0, live.uid, target.uid); clearSelection(); })));
  }
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => els.toast.classList.remove('show'), 1800);
}

els.endTurnBtn.onclick = () => {
  primeAudio();
  if (endTurn(game)) {
    selected = null;
    render();
    setTimeout(() => { aiTakeTurn(game); render(); }, 550);
  }
};
els.soundBtn.onclick = () => { setSoundEnabled(!isSoundEnabled()); updateSoundButton(); };
els.rulesBtn.onclick = () => els.rulesDialog.showModal();
els.closeRules.onclick = () => els.rulesDialog.close();
els.rulesDialog.addEventListener('click', event => { if (event.target === els.rulesDialog) els.rulesDialog.close(); });
window.addEventListener('keydown', event => {
  if (event.key === 'Escape') { selected = null; render(); }
  if (event.key === 'Enter' && game.active === 0 && game.winner === null) els.endTurnBtn.click();
});

updateSoundButton();
render();
