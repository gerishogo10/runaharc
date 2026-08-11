import { cardArtwork } from './art.js';
import { CARD_LIBRARY, createGame, availableRunes, cardCost, placeRune, playCard, attack, moveCard, endTurn, aiTakeTurn, openLanes, MAX_RUNES } from './engine.js';
import { isSoundEnabled, playGameEvent, primeAudio, setSoundEnabled } from './effects.js';

let game = createGame();
let selected = null;
let lastEventSeq = 0;
const $ = id => document.getElementById(id);
const ids = ['hand','playerBoard','enemyBoard','playerShields','enemyShields','playerCore','enemyCore','playerRunes','enemyRunes','playerMeta','enemyMeta','turnPill','selectedName','selectedMeta','selectedText','actions','log','endTurnBtn','toast','rulesDialog','rulesBtn','closeRules','soundBtn','spellReveal'];
const els = Object.fromEntries(ids.map(id => [id, $(id)]));
const elementMeta = { tuz:['TŰZ','🔥'], vihar:['VIHAR','⚡'], fold:['FÖLD','◆'], viz:['VÍZ','◉'], szellem:['SZELLEM','☾'], semleges:['SEMLEGES','•'] };
const isBoardCard = card => card.type === 'creature' || card.type === 'structure';
const cardKeyword = card => ({
  turul:'KIJÁTSZÁS', liderc:'ALAPLÉNY', betyar:'+1 TÁMADÁS', sarkany:'ÁTTÖRÉS', taltos:'HÚZÁS', vasorr:'KIJÁTSZÁS',
  bastya:'VÉDŐMEZŐ', szellovas:'ÁTREPÜLÉS', zivatar:'LÁNCSEBZÉS', parazs:'PARÁZS', forras:'GYÓGYÍTÁS',
  vereshold:'+1 TÁMADÁS', rovaskor:'-3 KÖLTSÉG', deak:'RÚNAVISSZHANG', javas:'FORRÁSGYÓGYÍTÁS', kobzos:'UTOLSÓ DAL',
  rovasvalto:'RÚNAVISSZAFEJTÉS', csodaszarvas:'VÁNDORLÁS', ostromlo:'OSTROM 1', orkokovac:'ŐRKŐJAVÍTÁS', betoro:'SEBZETT FAL', korepesztes:'ŐRKŐSEBZÉS'
}[card.id] || 'KÉPESSÉG');
function cardMetaText(card) {
  const typeLabel = card.type === 'creature' ? 'Lény' : card.type === 'structure' ? 'Bástya' : 'Ige';
  const [elementName] = elementMeta[card.element || 'semleges'];
  const remaining = Math.max(0, (card.hp || 0) - (card.damage || 0));
  const stats = card.type === 'creature' ? ` · ⚔ ${card.atk + card.bonusAtk} · ♥ ${remaining}` : card.type === 'structure' ? ` · 🛡 ${remaining}` : '';
  const lane = Number.isInteger(card.lane) ? ` · ${card.lane + 1}. folyosó` : '';
  return `${typeLabel} · ${elementName} · ${card.cost} rúna${stats}${lane}`;
}

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
  el.setAttribute('aria-label', `${card.name}. ${cardMetaText(card)}. ${card.text}`);
  const stats = card.type === 'creature'
    ? `<div class="stats"><span class="atk">⚔ ${card.atk + card.bonusAtk}</span><span class="hp">♥ ${remaining}</span></div>`
    : card.type === 'structure' ? `<div class="stats structure-stats"><span class="guard">🛡 ${remaining}</span><span class="passive-word">PASSZÍV</span></div>` : '';
  const keyword = cardKeyword(card);
  el.title = card.text;
  el.innerHTML = `<div class="card-top"><span class="cost">${card.cost}</span><span class="card-name">${card.name}</span><span class="card-kind">${typeLabel}</span></div><div class="art">${cardArtwork(card.id, card.uid)}<span class="element-badge" title="${elementName}">${elementIcon}</span>${card.burn ? '<span class="burn-badge" title="Parázs">🔥</span>' : ''}</div><div class="card-keywords"><span class="element-word">${elementName}</span><span>${keyword}</span></div>${stats}<i class="rarity-gem" aria-hidden="true"></i>`;
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

function renderShields(el, guardians) {
  el.innerHTML = '';
  guardians.forEach((hp, lane) => {
    const shield = document.createElement('i');
    shield.className = `shield ${hp <= 0 ? 'broken' : hp <= 2 ? 'critical' : ''}`;
    shield.dataset.lane = lane;
    shield.setAttribute('aria-label', `${lane + 1}. Őrkő: ${hp}/5 életerő`);
    shield.innerHTML = `<span>${hp}</span>`;
    el.appendChild(shield);
  });
}
function renderCore(el, player) { el.textContent = `MAG ${player.coreHp}/10`; el.classList.toggle('open', player.coreOpen); }
function renderRunes(el, player) { el.textContent = `RÚNÁK: ${availableRunes(player)} / ${player.runes.length}${player.runes.length >= 3 ? ' · VISSZHANG' : ''}`; }
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
  renderShields(els.playerShields, player.guardians); renderShields(els.enemyShields, enemy.guardians); renderCore(els.playerCore, player); renderCore(els.enemyCore, enemy);
  renderRunes(els.playerRunes, player); renderRunes(els.enemyRunes, enemy);
  els.playerMeta.textContent = `Kéz: ${player.hand.length} lap · Pakli: ${player.deck.length} lap${player.fatigue ? ` · Kimerülés: ${player.fatigue}` : ''}`;
  els.enemyMeta.textContent = `Kéz: ${enemy.hand.length} lap · Pakli: ${enemy.deck.length} lap${enemy.fatigue ? ` · Kimerülés: ${enemy.fatigue}` : ''}`;
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
  if (!selected) { els.selectedName.textContent = 'Nincs kiválasztott lap'; els.selectedMeta.textContent = 'Kattints egy lapra a részletekhez'; els.selectedText.textContent = 'Válassz egy kézlapot vagy egy támadásra kész lényt. A pálya öt támadási folyosóból áll.'; return; }
  els.selectedName.textContent = selected.name; els.selectedMeta.textContent = cardMetaText(selected); els.selectedText.textContent = selected.text;
  const player = game.players[0], enemy = game.players[1];
  if (game.active !== 0 || game.winner !== null) return;
  if (selected.zone === 'hand' && selected.owner === 0) {
    const live = player.hand.find(card => card.uid === selected.uid); if (!live) return;
    if (!player.runePlayed && player.runes.length < MAX_RUNES) els.actions.append(button('RÚNÁVÁ ALAKÍTOM', '', () => { placeRune(game, 0, live.uid); selected = null; render(); }));
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
    if (live.id === 'csodaszarvas' && !live.moved) {
      for (const lane of [live.lane - 1, live.lane + 1].filter(lane => lane >= 0 && lane < 5 && !player.board.some(card => card.lane === lane))) {
        els.actions.append(button(`VÁNDORLÁS → ${lane + 1}. HELY`, 'move-action', () => { if (moveCard(game, 0, live.uid, lane)) { selected = null; render(); } }));
      }
    }
    const opposite = enemy.board.find(card => card.lane === live.lane);
    if (opposite) {
      els.actions.append(button(`TÁMADÁS: ${opposite.name}`, '', () => { attack(game, 0, live.uid, opposite.uid); selected = null; render(); }));
      if (live.bypassShield && enemy.guardians[live.lane] > 0) els.actions.append(button(`ŐRKŐ MEGKERÜLÉSE · ${enemy.guardians[live.lane]}/5 ÉP`, 'warn', () => { attack(game, 0, live.uid); selected = null; render(); }));
    } else if (enemy.guardians[live.lane] > 0) els.actions.append(button(`ŐRKŐ MEGTÁMADÁSA · ${enemy.guardians[live.lane]}/5 ÉP`, 'warn', () => { attack(game, 0, live.uid); selected = null; render(); }));
    else if (enemy.coreOpen) els.actions.append(button(`MAG MEGTÁMADÁSA · ${enemy.coreHp}/10 ÉP`, 'warn', () => { attack(game, 0, live.uid); selected = null; render(); }));
    else els.selectedText.textContent = `${live.text} Ezen a folyosón az Őrkő már elpusztult. A Mag csak akkor támadható, ha mind az öt Őrkő megsemmisült.`;
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
