import { cardArtwork } from './art.js';
import { CARD_LIBRARY, createGame, availableRunes, cardCost, placeRune, playCard, attack, endTurn, aiTakeTurn, openLanes } from './engine.js';
import { isSoundEnabled, playGameEvent, primeAudio, setSoundEnabled } from './effects.js';

let game = createGame();
let selected = null;
let lastEventSeq = 0;
const $ = id => document.getElementById(id);
const ids = ['hand','playerBoard','enemyBoard','playerShields','enemyShields','playerRunes','enemyRunes','playerMeta','enemyMeta','turnPill','selectedName','selectedText','actions','log','endTurnBtn','toast','rulesDialog','rulesBtn','closeRules','soundBtn','spellReveal'];
const els = Object.fromEntries(ids.map(id => [id, $(id)]));
const elementMeta = { tuz:['TŰZ','🔥'], vihar:['VIHAR','⚡'], fold:['FÖLD','◆'], viz:['VÍZ','◉'], szellem:['SZELLEM','☾'], semleges:['SEMLEGES','•'] };
const isBoardCard = card => card.type === 'creature' || card.type === 'structure';

function updateSoundButton() {
  els.soundBtn.textContent = isSoundEnabled() ? 'HANG: BE' : 'HANG: KI';
  els.soundBtn.setAttribute('aria-pressed', String(isSoundEnabled()));
}

function cardEl(card, zone, owner) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = `card ${card.type} element-${card.element || 'semleges'} ${card.exhausted && zone === 'board' ? 'exhausted' : ''} ${selected?.uid === card.uid ? 'selected' : ''}`;
  el.dataset.rarity = card.rarity; el.dataset.uid = card.uid;
  const remaining = Math.max(0, (card.hp || 0) - (card.damage || 0));
  const typeLabel = card.type === 'creature' ? 'LÉNY' : card.type === 'structure' ? 'BÁSTYA' : 'IGE';
  const [elementName, elementIcon] = elementMeta[card.element || 'semleges'];
  el.setAttribute('aria-label', `${card.name}, költsége ${card.cost} rúna, ${typeLabel.toLowerCase()}${card.type === 'creature' ? `, ${card.atk + card.bonusAtk} támadás, ${remaining} életerő` : card.type === 'structure' ? `, ${remaining} védelem` : ''}`);
  const stats = card.type === 'creature'
    ? `<div class="stats"><span class="atk">⚔ ${card.atk + card.bonusAtk}</span><span class="hp">♥ ${remaining}</span></div>`
    : card.type === 'structure' ? `<div class="stats structure-stats"><span class="guard">🛡 ${remaining}</span><span class="passive-word">PASSZÍV</span></div>` : '';
  el.innerHTML = `<div class="card-top"><span class="cost">${card.cost}</span><span class="card-name">${card.name}</span><span class="card-kind">${typeLabel}</span></div><div class="art">${cardArtwork(card.id, card.uid)}<span class="element-badge" title="${elementName}">${elementIcon}</span>${card.burn ? '<span class="burn-badge" title="Parázs">🔥</span>' : ''}</div><div class="card-text">${card.text}</div>${stats}<i class="rarity-gem" aria-hidden="true"></i>`;
  el.onclick = () => { primeAudio(); selected = { ...card, zone, owner }; render(); };
  return el;
}

function canPlaceSelectedInLane(lane) {
  if (!selected || selected.zone !== 'hand' || selected.owner !== 0 || game.active !== 0 || game.winner !== null) return false;
  const live = game.players[0].hand.find(card => card.uid === selected.uid);
  return Boolean(live && isBoardCard(live) && availableRunes(game.players[0]) >= cardCost(game.players[0], live) && openLanes(game.players[0]).includes(lane));
}

function renderBoard(el, player, owner) {
  const slots = [];
  for (let lane = 0; lane < 5; lane++) {
    const slot = document.createElement('div');
    slot.className = 'lane-slot'; slot.dataset.lane = lane;
    const card = player.board.find(unit => unit.lane === lane);
    if (card) slot.appendChild(cardEl(card, 'board', owner));
    else {
      slot.innerHTML = `<span class="lane-number">${lane + 1}</span><span class="lane-empty">ÜRES HELY</span>`;
      if (owner === 0 && canPlaceSelectedInLane(lane)) {
        slot.classList.add('summon-target'); slot.tabIndex = 0; slot.setAttribute('role','button');
        const place = () => { const uid = selected?.uid; if (uid && playCard(game, 0, uid, lane)) { selected = null; render(); } };
        slot.onclick = place; slot.onkeydown = event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); place(); } };
      }
    }
    slots.push(slot);
  }
  el.replaceChildren(...slots);
}

function renderShields(el, count) {
  el.innerHTML = '';
  for (let i = 0; i < 5; i++) { const shield = document.createElement('i'); shield.className = `shield ${i >= count ? 'broken' : ''}`; el.appendChild(shield); }
}
function renderRunes(el, player) { el.textContent = `RÚNÁK: ${availableRunes(player)} / ${player.runes.length}`; }
function button(label, cls, fn) { const b = document.createElement('button'); b.type = 'button'; b.className = `action-btn ${cls || ''}`; b.textContent = label; b.onclick = () => { primeAudio(); fn(); }; return b; }

function showSpellReveal(event) {
  const card = CARD_LIBRARY[event.cardId]; if (!card || !els.spellReveal) return;
  const [elementName, elementIcon] = elementMeta[card.element || 'semleges'];
  els.spellReveal.innerHTML = `<div class="spell-reveal-card"><span class="eyebrow">IGE FELMUTATÁSA · ${elementName}</span><div class="spell-reveal-art">${cardArtwork(card.id, `reveal-${event.seq}`)}</div><h2>${elementIcon} ${card.name}</h2><p>${card.text}</p><small>Kattints bárhová a bezáráshoz</small></div>`;
  els.spellReveal.hidden = false; clearTimeout(showSpellReveal.t);
  showSpellReveal.t = setTimeout(() => { els.spellReveal.hidden = true; }, 4200);
}

function render() {
  const player = game.players[0], enemy = game.players[1];
  els.hand.replaceChildren(...player.hand.map(card => cardEl(card, 'hand', 0)));
  renderBoard(els.playerBoard, player, 0); renderBoard(els.enemyBoard, enemy, 1);
  renderShields(els.playerShields, player.shields); renderShields(els.enemyShields, enemy.shields);
  renderRunes(els.playerRunes, player); renderRunes(els.enemyRunes, enemy);
  els.playerMeta.textContent = `Kéz: ${player.hand.length} lap · Pakli: ${player.deck.length} lap`;
  els.enemyMeta.textContent = `Kéz: ${enemy.hand.length} lap · Pakli: ${enemy.deck.length} lap`;
  els.turnPill.textContent = game.winner !== null ? `${game.players[game.winner].name} győzött` : `${game.turn}. kör · ${game.active === 0 ? 'TE KÖVETKEZEL' : 'AZ ELLENFÉL KÖVETKEZIK'}`;
  els.endTurnBtn.disabled = game.active !== 0 || game.winner !== null;
  els.log.innerHTML = game.log.slice(0, 5).map(entry => `<span>${entry}</span>`).join('');
  renderActions();
  if (game.lastEvent?.seq > lastEventSeq) {
    lastEventSeq = game.lastEvent.seq;
    if (game.lastEvent.type === 'spell') showSpellReveal(game.lastEvent);
    requestAnimationFrame(() => playGameEvent(game.lastEvent, 0));
  }
  if (game.winner !== null) toast(`${game.players[game.winner].name} megnyerte a párbajt.`);
}

function renderActions() {
  els.actions.innerHTML = '';
  if (!selected) { els.selectedName.textContent = 'Nincs kiválasztott lap'; els.selectedText.textContent = 'Válassz egy kézlapot vagy egy támadásra kész lényt. A pálya öt támadási folyosóból áll.'; return; }
  els.selectedName.textContent = selected.name; els.selectedText.textContent = selected.text;
  const player = game.players[0], enemy = game.players[1];
  if (game.active !== 0 || game.winner !== null) return;
  if (selected.zone === 'hand' && selected.owner === 0) {
    const live = player.hand.find(card => card.uid === selected.uid); if (!live) return;
    if (!player.runePlayed) els.actions.append(button('RÚNÁVÁ ALAKÍTOM', '', () => { placeRune(game, 0, live.uid); selected = null; render(); }));
    const cost = cardCost(player, live);
    if (availableRunes(player) >= cost) {
      if (isBoardCard(live)) {
        for (const lane of openLanes(player)) els.actions.append(button(`${lane + 1}. HELY · ${cost} RÚNA`, 'primary lane-action', () => { if (playCard(game, 0, live.uid, lane)) { selected = null; render(); } }));
        els.selectedText.textContent = `${live.text} Válaszd ki a pályán vagy itt azt az üres helyet, ahová kijátszod.`;
      } else els.actions.append(button(`IGE KIJÁTSZÁSA · ${cost} RÚNA`, 'primary', () => { if (playCard(game, 0, live.uid)) { selected = null; render(); } }));
    }
  }
  if (selected.zone === 'board' && selected.owner === 0) {
    const live = player.board.find(card => card.uid === selected.uid); if (!live) return;
    if (live.type === 'structure' || live.passive) { els.selectedText.textContent = `${live.text} Ez a lap passzív, ezért nem indíthat támadást.`; return; }
    if (live.exhausted) return;
    const opposite = enemy.board.find(card => card.lane === live.lane);
    if (opposite) {
      els.actions.append(button(`TÁMADÁS: ${opposite.name}`, '', () => { attack(game, 0, live.uid, opposite.uid); selected = null; render(); }));
      if (live.bypassShield && enemy.shields > 0) els.actions.append(button('ŐRKŐ MEGKERÜLÉSE', 'warn', () => { attack(game, 0, live.uid); selected = null; render(); }));
    } else els.actions.append(button(enemy.shields > 0 ? 'ŐRKŐ MEGTÁMADÁSA' : 'MAG MEGTÁMADÁSA', 'warn', () => { attack(game, 0, live.uid); selected = null; render(); }));
  }
}

function toast(message) { els.toast.textContent = message; els.toast.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => els.toast.classList.remove('show'), 1800); }

els.endTurnBtn.onclick = () => { primeAudio(); if (endTurn(game)) { selected = null; render(); setTimeout(() => { aiTakeTurn(game); render(); }, 550); } };
els.soundBtn.onclick = () => { setSoundEnabled(!isSoundEnabled()); updateSoundButton(); };
els.rulesBtn.onclick = () => els.rulesDialog.showModal(); els.closeRules.onclick = () => els.rulesDialog.close();
els.rulesDialog.addEventListener('click', event => { if (event.target === els.rulesDialog) els.rulesDialog.close(); });
els.spellReveal?.addEventListener('click', () => { els.spellReveal.hidden = true; clearTimeout(showSpellReveal.t); });
window.addEventListener('keydown', event => { if (event.key === 'Escape') { selected = null; if (els.spellReveal) els.spellReveal.hidden = true; render(); } if (event.key === 'Enter' && game.active === 0 && game.winner === null && !selected) els.endTurnBtn.click(); });
updateSoundButton(); render();
