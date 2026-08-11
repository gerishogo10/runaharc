export const CARD_LIBRARY = {
  turul: { id: 'turul', name: 'Turul Őrszem', type: 'creature', cost: 2, atk: 2, hp: 2, glyph: '✦', text: 'Kijátszáskor: ha kevesebb őrköved van, mint az ellenfelednek, +1 támadást és +1 életerőt kap.', rarity: 'nemes' },
  lidérc: { id: 'lidérc', name: 'Mocsári Lidérc', type: 'creature', cost: 1, atk: 1, hp: 2, glyph: '◈', text: 'Olcsó, szívós nyitólény.', rarity: 'közönséges' },
  betyar: { id: 'betyar', name: 'Rúnabetyár', type: 'creature', cost: 3, atk: 3, hp: 2, glyph: '⚔', text: 'Ha ebben a körben már rúnává alakítottál egy lapot, +1 támadást kap.', rarity: 'nemes' },
  sarkany: { id: 'sarkany', name: 'Bakonyi Sárkány', type: 'creature', cost: 5, atk: 5, hp: 4, glyph: '◆', text: 'Áttörés: ha legyőz egy lényt, egy őrkövet is megrepeszt.', rarity: 'epikus' },
  taltos: { id: 'taltos', name: 'Révülő Táltos', type: 'creature', cost: 4, atk: 2, hp: 4, glyph: '☾', text: 'Kijátszáskor húzz 1 lapot.', rarity: 'epikus' },
  vasorr: { id: 'vasorr', name: 'Vasorrú Bába', type: 'creature', cost: 4, atk: 3, hp: 3, glyph: '△', text: 'Kijátszáskor: okozz 1 sebzést egy véletlenszerű ellenséges lénynek.', rarity: 'nemes' },
  zivatar: { id: 'zivatar', name: 'Zivatarige', type: 'spell', cost: 2, glyph: 'ϟ', text: 'Okozz 2 sebzést egy véletlenszerű ellenséges lénynek. Ha nincs ilyen lény, repessz meg 1 őrkövet.', rarity: 'nemes' },
  forras: { id: 'forras', name: 'Ősforrás', type: 'spell', cost: 1, glyph: '◎', text: 'Húzz 1 lapot, majd egy sérült saját lényed visszanyer 1 életerőt.', rarity: 'közönséges' },
  vereshold: { id: 'vereshold', name: 'Vérhold', type: 'spell', cost: 2, glyph: '●', text: 'Minden saját lény +1 támadást kap erre a körre.', rarity: 'epikus' },
  rovaskor: { id: 'rovaskor', name: 'Rováskör', type: 'spell', cost: 1, glyph: '◇', text: 'A következő kijátszott lényed 2 rúnával kevesebbe kerül ebben a körben.', rarity: 'közönséges' }
};

const DECK_LIST = ['lidérc','lidérc','lidérc','turul','turul','turul','betyar','betyar','betyar','taltos','taltos','vasorr','vasorr','sarkany','sarkany','zivatar','zivatar','forras','vereshold','rovaskor'];
let uid = 1;

export function makeCard(id) {
  const base = CARD_LIBRARY[id];
  return { ...base, uid: `c${uid++}`, damage: 0, exhausted: true, bonusAtk: 0 };
}

export function makeDeck() { return DECK_LIST.map(makeCard); }

export function shuffle(deck, rng = Math.random) {
  const out = [...deck];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function createPlayer(name, rng = Math.random) {
  const deck = shuffle(makeDeck(), rng);
  return { name, deck, hand: deck.splice(0, 5), board: [], runes: [], shields: 5, coreOpen: false, runePlayed: false, discount: 0 };
}

export function createGame(rng = Math.random, names = ['Te', 'Árnyékidéző']) {
  const game = { players: [createPlayer(names[0], rng), createPlayer(names[1], rng)], active: 0, turn: 1, phase: 'main', winner: null, log: ['A párbaj elkezdődött.'], eventSeq: 0, lastEvent: null, telemetry: { plays: [[], []], runes: [[], []] }, rng };
  return game;
}

function recordEvent(game, event) { game.lastEvent = { seq: ++game.eventSeq, ...event }; }

export function availableRunes(player) { return player.runes.filter(r => !r.used).length; }
export function cardCost(player, card) { return Math.max(0, card.cost - (card.type === 'creature' ? player.discount : 0)); }
export function canAfford(player, card) { return availableRunes(player) >= cardCost(player, card); }
export function draw(player, n = 1) {
  const drawn = [];
  while (n-- > 0 && player.deck.length) { const c = player.deck.shift(); player.hand.push(c); drawn.push(c); }
  return drawn;
}
export function spendRunes(player, amount) {
  for (const rune of player.runes) { if (!rune.used && amount > 0) { rune.used = true; amount--; } }
  return amount === 0;
}
export function placeRune(game, playerIndex, uidToUse) {
  if (game.winner !== null || game.active !== playerIndex) return false;
  const p = game.players[playerIndex];
  if (p.runePlayed) return false;
  const idx = p.hand.findIndex(c => c.uid === uidToUse);
  if (idx < 0) return false;
  const [card] = p.hand.splice(idx, 1);
  p.runes.push({ uid: card.uid, id: card.id, name: card.name, used: false });
  game.telemetry?.runes[playerIndex].push(card.id);
  p.runePlayed = true;
  game.log.unshift(`${p.name} rúnává alakította ezt a lapot: ${card.name}.`);
  recordEvent(game, { type: 'rune', playerIndex, cardId: card.id });
  return true;
}

function removeDead(board) { return board.filter(c => c.hp - c.damage > 0); }
function enemyIndex(i) { return i === 0 ? 1 : 0; }

export function playCard(game, playerIndex, uidToPlay) {
  if (game.winner !== null || game.active !== playerIndex) return false;
  const p = game.players[playerIndex], e = game.players[enemyIndex(playerIndex)];
  const idx = p.hand.findIndex(c => c.uid === uidToPlay);
  if (idx < 0) return false;
  const card = p.hand[idx];
  if (!canAfford(p, card) || (card.type === 'creature' && p.board.length >= 5)) return false;
  spendRunes(p, cardCost(p, card)); p.hand.splice(idx, 1);
  game.telemetry?.plays[playerIndex].push(card.id);
  if (card.type === 'creature') {
    if (p.discount) p.discount = 0;
    card.exhausted = true;
    if (card.id === 'turul' && p.shields < e.shields) { card.atk++; card.hp++; }
    if (card.id === 'betyar' && p.runePlayed) card.bonusAtk = 1;
    if (card.id === 'taltos') draw(p, 1);
    if (card.id === 'vasorr' && e.board.length) e.board[Math.floor(game.rng() * e.board.length)].damage += 1;
    p.board.push(card); e.board = removeDead(e.board);
    game.log.unshift(`${p.name} kijátszotta ezt a lényt: ${card.name}.`);
    recordEvent(game, { type: 'summon', playerIndex, cardUid: card.uid, cardId: card.id });
  } else {
    resolveSpell(game, playerIndex, card);
    game.log.unshift(`${p.name} megidézte ezt az igét: ${card.name}.`);
    recordEvent(game, { type: 'spell', playerIndex, cardId: card.id });
  }
  checkWinner(game);
  return true;
}

function resolveSpell(game, i, card) {
  const p = game.players[i], e = game.players[enemyIndex(i)];
  if (card.id === 'zivatar') {
    if (e.board.length) e.board[Math.floor(game.rng() * e.board.length)].damage += 2;
    else breakShield(game, enemyIndex(i), 1);
    e.board = removeDead(e.board);
  }
  if (card.id === 'forras') {
    draw(p, 1);
    const hurt = p.board.find(c => c.damage > 0); if (hurt) hurt.damage = Math.max(0, hurt.damage - 1);
  }
  if (card.id === 'vereshold') p.board.forEach(c => c.bonusAtk += 1);
  if (card.id === 'rovaskor') p.discount = 2;
}

export function attack(game, playerIndex, attackerUid, targetUid = null) {
  if (game.winner !== null || game.active !== playerIndex) return false;
  const p = game.players[playerIndex], e = game.players[enemyIndex(playerIndex)];
  const attacker = p.board.find(c => c.uid === attackerUid);
  if (!attacker || attacker.exhausted) return false;
  const target = targetUid ? e.board.find(c => c.uid === targetUid) : null;
  if (targetUid && !target) return false;
  attacker.exhausted = true;
  if (target) {
    target.damage += attacker.atk + attacker.bonusAtk;
    attacker.damage += target.atk + target.bonusAtk;
    const targetDied = target.hp - target.damage <= 0;
    p.board = removeDead(p.board); e.board = removeDead(e.board);
    if (attacker.id === 'sarkany' && targetDied) breakShield(game, enemyIndex(playerIndex), 1);
    game.log.unshift(`${attacker.name} és ${target.name} összecsaptak.`);
    recordEvent(game, { type: 'attack', playerIndex, attackerUid, targetUid, targetKind: 'creature', targetDied, attackerDied: !p.board.some(c => c.uid === attackerUid) });
  } else {
    if (e.shields > 0) {
      breakShield(game, enemyIndex(playerIndex), 1);
      game.log.unshift(`${attacker.name} megrepesztett egy őrkövet.`);
      recordEvent(game, { type: 'attack', playerIndex, attackerUid, targetUid: null, targetKind: 'shield' });
    } else {
      game.winner = playerIndex;
      game.log.unshift(`${attacker.name} elérte a Magot. ${p.name} megnyerte a párbajt!`);
      recordEvent(game, { type: 'attack', playerIndex, attackerUid, targetUid: null, targetKind: 'core' });
    }
  }
  checkWinner(game); return true;
}

function breakShield(game, targetIndex, amount) {
  const e = game.players[targetIndex];
  e.shields = Math.max(0, e.shields - amount);
  if (e.shields === 0) e.coreOpen = true;
}
function checkWinner(game) {
  if (game.winner !== null) return;
  for (let i = 0; i < 2; i++) {
    const p = game.players[i];
    if (!p.deck.length && !p.hand.length && !p.board.length) {
      game.winner = enemyIndex(i);
      recordEvent(game, { type: 'victory', playerIndex: game.winner });
      return;
    }
  }
}

export function endTurn(game) {
  if (game.winner !== null) return false;
  const p = game.players[game.active];
  p.board.forEach(c => { c.bonusAtk = 0; });
  game.active = enemyIndex(game.active); game.turn++;
  const next = game.players[game.active];
  next.runePlayed = false; next.discount = 0; next.runes.forEach(r => r.used = false); next.board.forEach(c => c.exhausted = false);
  if (!next.deck.length) {
    game.winner = enemyIndex(game.active);
    game.log.unshift(`${next.name} nem tudott lapot húzni. ${game.players[game.winner].name} megnyerte a párbajt!`);
    recordEvent(game, { type: 'victory', playerIndex: game.winner });
    return true;
  }
  // Az első saját körében egyik játékos sem húz; ez megszünteti a mérhető kezdőjátékos-előnyt.
  if (!(game.turn === 2 && game.active === 1)) draw(next, 1);
  game.log.unshift(`${next.name} köre következik.`); return true;
}

export function botTakeTurn(game, playerIndex, style = 'value') {
  if (game.active !== playerIndex || game.winner !== null) return;
  const ai = game.players[playerIndex];
  const enemy = game.players[enemyIndex(playerIndex)];
  const counts = ai.hand.reduce((m,c)=>(m[c.id]=(m[c.id]||0)+1,m),{});
  const runeScore = c => {
    let score = c.cost;
    if (counts[c.id] > 1) score += 2;
    if (c.cost <= ai.runes.length + 1) score -= 2;
    if (c.id === 'sarkany' && ai.runes.length >= 3) score -= 4;
    if (c.id === 'taltos' && ai.runes.length >= 2) score -= 3;
    if (c.id === 'vasorr' && ai.runes.length >= 2 && enemy.board.length) score -= 2;
    return score;
  };
  const runeChoice = ai.hand.slice().sort((a,b)=>runeScore(b)-runeScore(a))[0];
  if (runeChoice) placeRune(game, playerIndex, runeChoice.uid);
  let guard = 0;
  while (guard++ < 20) {
    const playable = ai.hand.filter(c => {
      if (!canAfford(ai, c) || (c.type === 'creature' && ai.board.length >= 5)) return false;
      if (c.id === 'vereshold' && ai.board.length < 2) return false;
      if (c.id === 'rovaskor') {
        const after = availableRunes(ai) - cardCost(ai, c);
        const combo = ai.hand.find(x => x.uid !== c.uid && x.type === 'creature' && Math.max(0, x.cost - 2) <= after);
        if (!combo) return false;
      }
      return true;
    });
    if (!playable.length) break;
    const value = c => {
      if (c.type === 'creature') {
        const base = c.atk + c.hp - c.cost * .45;
        if (style === 'aggro') return base + c.atk * .8 - c.cost * .2;
        if (style === 'control') return base + c.hp * .55;
        return base + (c.id === 'taltos' ? 2 : 0) + (c.id === 'vasorr' && enemy.board.length ? 1.3 : 0);
      }
      let v = 2.4 - c.cost * .25;
      if (c.id === 'zivatar') v += enemy.board.length ? 2.2 : 1.1;
      if (c.id === 'forras') v += 1.2;
      if (c.id === 'vereshold') v += ai.board.length * .75;
      if (c.id === 'rovaskor') v += ai.hand.some(x=>x.type==='creature' && x.uid!==c.uid) ? 1.6 : -1;
      return v;
    };
    playable.sort((a,b)=>value(b)-value(a));
    if (!playCard(game, playerIndex, playable[0].uid)) break;
  }
  for (const c of [...ai.board]) {
    if (c.exhausted) continue;
    const power = c.atk + c.bonusAtk;
    const killable = enemy.board.filter(t => t.hp - t.damage <= power).sort((a,b)=>(b.atk+b.hp)-(a.atk+a.hp))[0];
    const favorable = enemy.board.filter(t => power >= t.hp-t.damage && (c.hp-c.damage) > t.atk+t.bonusAtk).sort((a,b)=>b.atk-a.atk)[0];
    const target = style === 'control' ? (favorable || killable) : killable;
    attack(game, playerIndex, c.uid, target?.uid ?? null);
    if (game.winner !== null) break;
  }
  if (game.winner === null) endTurn(game);
}

export function aiTakeTurn(game) { return botTakeTurn(game, 1, 'value'); }
