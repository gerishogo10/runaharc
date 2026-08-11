export const CARD_LIBRARY = {
  turul: { id: 'turul', name: 'Turul Őrszem', type: 'creature', cost: 2, atk: 2, hp: 2, glyph: '✦', element: 'vihar', text: 'Kijátszáskor: ha kevesebb Őrköved van, mint az ellenfelednek, +1 támadást és +1 életerőt kap.', rarity: 'nemes' },
  liderc: { id: 'liderc', name: 'Mocsári Lidérc', type: 'creature', cost: 1, atk: 1, hp: 2, glyph: '◈', element: 'szellem', text: 'Olcsó, szívós lény, amely gyorsan lezárhat egy támadási folyosót.', rarity: 'közönséges' },
  betyar: { id: 'betyar', name: 'Rúnabetyár', type: 'creature', cost: 3, atk: 3, hp: 2, glyph: '⚔', element: 'semleges', text: 'Ha ebben a körben már rúnává alakítottál egy lapot, +1 támadást kap.', rarity: 'nemes' },
  sarkany: { id: 'sarkany', name: 'Bakonyi Sárkány', type: 'creature', cost: 5, atk: 4, hp: 3, glyph: '◆', element: 'tuz', text: 'Áttörés: ha harcban legyőzi a vele szemben álló lényt, megrepeszt 1 Őrkövet is.', rarity: 'epikus' },
  taltos: { id: 'taltos', name: 'Révülő Táltos', type: 'creature', cost: 4, atk: 2, hp: 2, glyph: '☾', element: 'szellem', text: 'Kijátszáskor húzz 1 lapot.', rarity: 'epikus' },
  vasorr: { id: 'vasorr', name: 'Vasorrú Bába', type: 'creature', cost: 4, atk: 2, hp: 3, glyph: '△', element: 'tuz', text: 'Kijátszáskor okozz 1 sebzést egy véletlenszerű ellenséges lénynek.', rarity: 'nemes' },
  bastya: { id: 'bastya', name: 'Rovásbástya', type: 'structure', cost: 2, atk: 0, hp: 5, glyph: '▣', element: 'fold', passive: true, text: 'Bástya: nem támadhat. Védőmező: a mellette álló saját lapok 1-gyel kevesebb harci sebzést kapnak. Ha elpusztul, húzz 1 lapot.', rarity: 'nemes' },
  szellovas: { id: 'szellovas', name: 'Széljáró Portyázó', type: 'creature', cost: 3, atk: 2, hp: 2, glyph: '➶', element: 'vihar', bypassShield: true, text: 'Átrepülés: akkor is támadhat Őrkövet, ha ugyanabban a folyosóban ellenséges lap áll. A Magot nem kerülheti meg.', rarity: 'epikus' },
  zivatar: { id: 'zivatar', name: 'Zivatarige', type: 'spell', cost: 3, glyph: 'ϟ', element: 'vihar', text: 'Vihar: okozz 2 sebzést egy véletlenszerű ellenséges lénynek, majd 1-1 sebzést a közvetlenül mellette állóknak. Ha nincs célpont, repessz meg 1 Őrkövet.', rarity: 'nemes' },
  parazs: { id: 'parazs', name: 'Parázsige', type: 'spell', cost: 2, glyph: '✹', element: 'tuz', text: 'Tűz: okozz 2 sebzést egy véletlenszerű ellenséges lénynek. Ha túléli, a következő saját köre elején 1 további sebzést szenved. Ha nincs célpont, repessz meg 1 Őrkövet.', rarity: 'nemes' },
  forras: { id: 'forras', name: 'Ősforrás', type: 'spell', cost: 1, glyph: '◎', element: 'viz', text: 'Húzz 1 lapot, majd egy sérült saját lényed vagy Bástyád visszanyer 1 életerőt.', rarity: 'közönséges' },
  vereshold: { id: 'vereshold', name: 'Vérhold', type: 'spell', cost: 1, glyph: '●', element: 'szellem', text: 'Minden saját lényed +1 támadást kap erre a körre.', rarity: 'epikus' },
  rovaskor: { id: 'rovaskor', name: 'Rováskör', type: 'spell', cost: 1, glyph: '◇', element: 'fold', text: 'A következő kijátszott lényed 3 rúnával kevesebbe kerül ebben a körben.', rarity: 'közönséges' }
};

export const DEFAULT_DECK_LIST = [
  'liderc','liderc','liderc','turul','turul','betyar','betyar','taltos','taltos','vasorr',
  'sarkany','bastya','bastya','szellovas','szellovas','zivatar','parazs','forras','vereshold','rovaskor'
];

let uid = 1;
const isBoardCard = card => card.type === 'creature' || card.type === 'structure';
const enemyIndex = i => i === 0 ? 1 : 0;
const laneCard = (player, lane) => player.board.find(card => card.lane === lane) || null;
const validLane = lane => Number.isInteger(lane) && lane >= 0 && lane < 5;

export function makeCard(id) {
  const base = CARD_LIBRARY[id];
  if (!base) throw new Error(`Ismeretlen lap: ${id}`);
  return { ...base, uid: `c${uid++}`, damage: 0, exhausted: true, bonusAtk: 0, lane: null, burn: 0 };
}

export function makeDeck(deckList = DEFAULT_DECK_LIST) { return deckList.map(makeCard); }

export function shuffle(deck, rng = Math.random) {
  const out = [...deck];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function createPlayer(name, rng = Math.random, deckList = DEFAULT_DECK_LIST) {
  const deck = shuffle(makeDeck(deckList), rng);
  return { name, deck, hand: deck.splice(0, 5), board: [], runes: [], shields: 5, coreOpen: false, runePlayed: false, discount: 0 };
}

export function createGame(rng = Math.random, names = ['Te', 'Árnyékidéző'], deckLists = null) {
  const players = [createPlayer(names[0], rng, deckLists?.[0] || DEFAULT_DECK_LIST), createPlayer(names[1], rng, deckLists?.[1] || DEFAULT_DECK_LIST)];
  return {
    players,
    active: 0, turn: 1, phase: 'main', winner: null, log: ['A párbaj elkezdődött.'], eventSeq: 0, lastEvent: null,
    telemetry: { plays: [[], []], runes: [[], []], lanes: [[], []] }, rng
  };
}

function recordEvent(game, event) { game.lastEvent = { seq: ++game.eventSeq, ...event }; }
export function availableRunes(player) { return player.runes.filter(rune => !rune.used).length; }
export function cardCost(player, card) { return Math.max(0, card.cost - (card.type === 'creature' ? player.discount : 0)); }
export function canAfford(player, card) { return availableRunes(player) >= cardCost(player, card); }
export function draw(player, n = 1) {
  const drawn = [];
  while (n-- > 0 && player.deck.length) { const card = player.deck.shift(); player.hand.push(card); drawn.push(card); }
  return drawn;
}
export function spendRunes(player, amount) {
  for (const rune of player.runes) if (!rune.used && amount > 0) { rune.used = true; amount--; }
  return amount === 0;
}
export function openLanes(player) { return [0,1,2,3,4].filter(lane => !laneCard(player, lane)); }

export function placeRune(game, playerIndex, uidToUse) {
  if (game.winner !== null || game.active !== playerIndex) return false;
  const player = game.players[playerIndex];
  if (player.runePlayed) return false;
  const index = player.hand.findIndex(card => card.uid === uidToUse);
  if (index < 0) return false;
  const [card] = player.hand.splice(index, 1);
  player.runes.push({ uid: card.uid, id: card.id, name: card.name, used: false });
  game.telemetry?.runes[playerIndex].push(card.id);
  player.runePlayed = true;
  game.log.unshift(`${player.name} rúnává alakította ezt a lapot: ${card.name}.`);
  recordEvent(game, { type: 'rune', playerIndex, cardId: card.id });
  return true;
}

function cleanupDead(game) {
  for (let playerIndex = 0; playerIndex < 2; playerIndex++) {
    const player = game.players[playerIndex];
    const dead = player.board.filter(card => card.hp - card.damage <= 0);
    if (!dead.length) continue;
    player.board = player.board.filter(card => card.hp - card.damage > 0);
    for (const card of dead) {
      if (card.id === 'bastya') {
        const drawn = draw(player, 1);
        game.log.unshift(`${player.name} Rovásbástyája leomlott${drawn.length ? ', ezért húzott 1 lapot' : ''}.`);
      }
    }
  }
}

function breakShield(game, targetIndex, amount) {
  const target = game.players[targetIndex];
  target.shields = Math.max(0, target.shields - amount);
  if (target.shields === 0) target.coreOpen = true;
}

function resolveSpell(game, playerIndex, card) {
  const player = game.players[playerIndex], enemy = game.players[enemyIndex(playerIndex)];
  const meta = { targets: [] };
  if (card.id === 'zivatar') {
    if (enemy.board.length) {
      const target = enemy.board[Math.floor(game.rng() * enemy.board.length)];
      target.damage += 2; meta.targets.push(target.uid);
      for (const neighbor of enemy.board.filter(other => Math.abs(other.lane - target.lane) === 1)) {
        neighbor.damage += 1; meta.targets.push(neighbor.uid);
      }
      cleanupDead(game);
    } else breakShield(game, enemyIndex(playerIndex), 1);
  }
  if (card.id === 'parazs') {
    if (enemy.board.length) {
      const target = enemy.board[Math.floor(game.rng() * enemy.board.length)];
      target.damage += 2; meta.targets.push(target.uid);
      if (target.hp - target.damage > 0) target.burn = Math.max(target.burn || 0, 1);
      cleanupDead(game);
    } else breakShield(game, enemyIndex(playerIndex), 1);
  }
  if (card.id === 'forras') {
    draw(player, 1);
    const hurt = player.board.filter(unit => unit.damage > 0).sort((a,b) => b.damage - a.damage)[0];
    if (hurt) hurt.damage = Math.max(0, hurt.damage - 1);
  }
  if (card.id === 'vereshold') player.board.filter(unit => unit.type === 'creature').forEach(unit => { unit.bonusAtk += 1; });
  if (card.id === 'rovaskor') player.discount = 3;
  return meta;
}

export function playCard(game, playerIndex, uidToPlay, lane = null) {
  if (game.winner !== null || game.active !== playerIndex) return false;
  const player = game.players[playerIndex], enemy = game.players[enemyIndex(playerIndex)];
  const index = player.hand.findIndex(card => card.uid === uidToPlay);
  if (index < 0) return false;
  const card = player.hand[index];
  if (!canAfford(player, card)) return false;
  if (isBoardCard(card) && (!validLane(lane) || laneCard(player, lane))) return false;
  spendRunes(player, cardCost(player, card));
  player.hand.splice(index, 1);
  game.telemetry?.plays[playerIndex].push(card.id);
  if (isBoardCard(card)) {
    card.lane = lane;
    card.exhausted = true;
    if (card.type === 'creature' && player.discount) player.discount = 0;
    if (card.id === 'turul' && player.shields < enemy.shields) { card.atk++; card.hp++; }
    if (card.id === 'betyar' && player.runePlayed) card.bonusAtk = 1;
    if (card.id === 'taltos') draw(player, 1);
    if (card.id === 'vasorr' && enemy.board.length) {
      enemy.board[Math.floor(game.rng() * enemy.board.length)].damage += 1;
      cleanupDead(game);
    }
    player.board.push(card);
    game.telemetry?.lanes[playerIndex].push(lane);
    game.log.unshift(`${player.name} kijátszotta a ${lane + 1}. helyre: ${card.name}.`);
    recordEvent(game, { type: 'summon', playerIndex, cardUid: card.uid, cardId: card.id, lane });
  } else {
    const spellMeta = resolveSpell(game, playerIndex, card);
    game.log.unshift(`${player.name} kijátszotta ezt az igét: ${card.name}.`);
    recordEvent(game, { type: 'spell', playerIndex, cardId: card.id, cardName: card.name, cardText: card.text, element: card.element, ...spellMeta });
  }
  checkWinner(game);
  return true;
}

function combatReduction(player, card) {
  return player.board.some(unit => unit.id === 'bastya' && unit.uid !== card.uid && Math.abs(unit.lane - card.lane) === 1) ? 1 : 0;
}

export function attack(game, playerIndex, attackerUid, targetUid = null) {
  if (game.winner !== null || game.active !== playerIndex) return false;
  const player = game.players[playerIndex], enemy = game.players[enemyIndex(playerIndex)];
  const attacker = player.board.find(card => card.uid === attackerUid);
  if (!attacker || attacker.exhausted || attacker.type !== 'creature' || attacker.passive || attacker.atk + attacker.bonusAtk <= 0) return false;
  const opposite = laneCard(enemy, attacker.lane);
  const target = targetUid ? enemy.board.find(card => card.uid === targetUid) : null;
  if (targetUid && (!target || target.lane !== attacker.lane || target.uid !== opposite?.uid)) return false;
  if (!targetUid && opposite && !(attacker.bypassShield && enemy.shields > 0)) return false;
  attacker.exhausted = true;
  if (target) {
    const attackPower = attacker.atk + attacker.bonusAtk;
    const counterPower = target.atk + target.bonusAtk;
    target.damage += Math.max(0, attackPower - combatReduction(enemy, target));
    attacker.damage += Math.max(0, counterPower - combatReduction(player, attacker));
    const targetDied = target.hp - target.damage <= 0;
    const attackerDied = attacker.hp - attacker.damage <= 0;
    cleanupDead(game);
    let trampleShield = false;
    if (attacker.id === 'sarkany' && targetDied && enemy.shields > 0) { breakShield(game, enemyIndex(playerIndex), 1); trampleShield = true; }
    game.log.unshift(`${attacker.name} és ${target.name} összecsaptak a ${attacker.lane + 1}. folyosóban.`);
    recordEvent(game, { type: 'attack', playerIndex, attackerUid, targetUid, targetKind: 'creature', lane: attacker.lane, targetDied, attackerDied, trampleShield });
  } else if (enemy.shields > 0) {
    breakShield(game, enemyIndex(playerIndex), 1);
    game.log.unshift(`${attacker.name} a ${attacker.lane + 1}. folyosón keresztül megrepesztett egy Őrkövet.`);
    recordEvent(game, { type: 'attack', playerIndex, attackerUid, targetUid: null, targetKind: 'shield', lane: attacker.lane, bypassed: Boolean(opposite) });
  } else {
    if (opposite) { attacker.exhausted = false; return false; }
    game.winner = playerIndex;
    game.log.unshift(`${attacker.name} elérte a Magot. ${player.name} megnyerte a párbajt!`);
    recordEvent(game, { type: 'attack', playerIndex, attackerUid, targetUid: null, targetKind: 'core', lane: attacker.lane });
  }
  checkWinner(game);
  return true;
}

function checkWinner(game) {
  if (game.winner !== null) return;
  for (let i = 0; i < 2; i++) {
    const player = game.players[i];
    if (!player.deck.length && !player.hand.length && !player.board.length) {
      game.winner = enemyIndex(i);
      recordEvent(game, { type: 'victory', playerIndex: game.winner });
      return;
    }
  }
}

function resolveStartOfTurnEffects(game, playerIndex) {
  const player = game.players[playerIndex];
  let burned = false;
  for (const card of player.board) {
    if ((card.burn || 0) > 0) {
      card.damage += card.burn;
      card.burn = 0;
      burned = true;
    }
  }
  if (burned) {
    game.log.unshift(`${player.name} parázssebzést szenvedett a köre elején.`);
    cleanupDead(game);
  }
}

export function endTurn(game) {
  if (game.winner !== null) return false;
  const current = game.players[game.active];
  current.board.forEach(card => { card.bonusAtk = 0; });
  game.active = enemyIndex(game.active);
  game.turn++;
  const next = game.players[game.active];
  next.runePlayed = false;
  next.discount = 0;
  next.runes.forEach(rune => { rune.used = false; });
  next.board.forEach(card => { card.exhausted = card.passive === true; });
  resolveStartOfTurnEffects(game, game.active);
  if (!next.deck.length) {
    game.winner = enemyIndex(game.active);
    game.log.unshift(`${next.name} nem tudott lapot húzni. ${game.players[game.winner].name} megnyerte a párbajt!`);
    recordEvent(game, { type: 'victory', playerIndex: game.winner });
    return true;
  }
  draw(next, 1);
  game.log.unshift(`${next.name} köre következik.`);
  return true;
}

function cardValue(card, game, playerIndex, style) {
  const player = game.players[playerIndex], enemy = game.players[enemyIndex(playerIndex)];
  let value = 1 + card.cost * .4;
  if (card.type === 'creature') value += card.atk * .8 + card.hp * .42;
  if (card.type === 'structure') value += card.hp * .46 + (style === 'control' ? 1.4 : .35);
  if (card.id === 'taltos') value += 1.1;
  if (card.id === 'vasorr') value += enemy.board.length ? 1.1 : .1;
  if (card.id === 'szellovas') value += enemy.shields > 0 ? (style === 'aggro' ? 1.8 : 1.15) : .2;
  if (card.id === 'zivatar') value += enemy.board.length ? 2 + Math.min(2, enemy.board.length) * .3 : .8;
  if (card.id === 'parazs') value += enemy.board.length ? 1.8 : .65;
  if (card.id === 'forras') value += 1.2;
  if (card.id === 'vereshold') value += player.board.filter(unit => unit.type === 'creature').length * .7;
  if (card.id === 'rovaskor') value += player.hand.some(other => other.type === 'creature' && other.uid !== card.uid) ? 1.5 : -.6;
  return value;
}

function chooseLane(game, playerIndex, card, style) {
  const player = game.players[playerIndex], enemy = game.players[enemyIndex(playerIndex)];
  const choices = openLanes(player).map(lane => {
    const opposing = laneCard(enemy, lane);
    let score = game.rng() * .08;
    if (!opposing) score += style === 'aggro' ? 3.4 : 1.6;
    if (opposing) {
      const remaining = opposing.hp - opposing.damage;
      if (card.type === 'structure') score += 2.2 + opposing.atk * .25;
      else {
        if (card.atk >= remaining) score += 2.8;
        if (card.hp > opposing.atk) score += .7;
      }
      if (card.bypassShield && game.players[enemyIndex(playerIndex)].shields > 0) score += 1.8;
      if (style === 'control') score += opposing.atk * .18;
    }
    return { lane, score };
  });
  choices.sort((a,b) => b.score - a.score);
  return choices[0]?.lane ?? null;
}

export function botTakeTurn(game, playerIndex, style = 'value') {
  if (game.active !== playerIndex || game.winner !== null) return;
  const ai = game.players[playerIndex];
  const enemy = game.players[enemyIndex(playerIndex)];
  if (!ai.runePlayed && ai.hand.length > 2) {
    const counts = ai.hand.reduce((map, card) => (map[card.id] = (map[card.id] || 0) + 1, map), {});
    const runeChoice = [...ai.hand].sort((a,b) => {
      const av = cardValue(a, game, playerIndex, style) + (counts[a.id] > 1 ? -.7 : .25);
      const bv = cardValue(b, game, playerIndex, style) + (counts[b.id] > 1 ? -.7 : .25);
      return av - bv;
    })[0];
    if (runeChoice) placeRune(game, playerIndex, runeChoice.uid);
  }
  let guard = 0;
  while (guard++ < 12) {
    const playable = ai.hand.filter(card => canAfford(ai, card) && (!isBoardCard(card) || openLanes(ai).length));
    if (!playable.length) break;
    playable.sort((a,b) => cardValue(b, game, playerIndex, style) - cardValue(a, game, playerIndex, style));
    const card = playable[0];
    const lane = isBoardCard(card) ? chooseLane(game, playerIndex, card, style) : null;
    if (!playCard(game, playerIndex, card.uid, lane)) break;
  }
  const attackers = [...ai.board].filter(card => card.type === 'creature' && !card.passive);
  for (const card of attackers) {
    if (card.exhausted || game.winner !== null) continue;
    const opposite = laneCard(enemy, card.lane);
    if (opposite) {
      const shouldBypass = card.bypassShield && enemy.shields > 0 && (style === 'aggro' || (style === 'value' && opposite.hp - opposite.damage > card.atk + card.bonusAtk));
      attack(game, playerIndex, card.uid, shouldBypass ? null : opposite.uid);
    } else attack(game, playerIndex, card.uid, null);
  }
  if (game.winner === null) endTurn(game);
}

export function aiTakeTurn(game) { return botTakeTurn(game, 1, 'value'); }
