export const CARD_LIBRARY = {
  turul: { id: 'turul', name: 'Turul Őrszem', type: 'creature', cost: 2, atk: 2, hp: 2, glyph: '✦', element: 'vihar', text: 'Kijátszáskor: ha kevesebb Őrkő-életed van, mint az ellenfelednek, +1 támadást és +1 életerőt kap.', rarity: 'nemes' },
  liderc: { id: 'liderc', name: 'Mocsári Lidérc', type: 'creature', cost: 1, atk: 1, hp: 3, glyph: '◈', element: 'szellem', text: 'Olcsó, szívós lény, amely gyorsan lezárhat egy támadási folyosót.', rarity: 'közönséges' },
  betyar: { id: 'betyar', name: 'Rúnabetyár', type: 'creature', cost: 3, atk: 3, hp: 2, glyph: '⚔', element: 'semleges', text: 'Ha ebben a körben már rúnává alakítottál egy lapot, +1 támadást kap.', rarity: 'nemes' },
  sarkany: { id: 'sarkany', name: 'Bakonyi Sárkány', type: 'creature', cost: 5, atk: 3, hp: 3, glyph: '◆', element: 'tuz', text: 'Áttörés: ha harcban legyőzi a vele szemben álló lényt, 1 sebzést okoz az ellenséges Őrkő-életnek is.', rarity: 'epikus' },
  taltos: { id: 'taltos', name: 'Révülő Táltos', type: 'creature', cost: 4, atk: 2, hp: 3, glyph: '☾', element: 'szellem', text: 'Kijátszáskor húzz 1 lapot.', rarity: 'epikus' },
  vasorr: { id: 'vasorr', name: 'Vasorrú Bába', type: 'creature', cost: 4, atk: 3, hp: 2, glyph: '△', element: 'tuz', text: 'Kijátszáskor okozz 1 sebzést egy véletlenszerű ellenséges lénynek.', rarity: 'nemes' },
  bastya: { id: 'bastya', name: 'Rovásbástya', type: 'structure', cost: 1, atk: 0, hp: 4, glyph: '▣', element: 'fold', passive: true, text: 'Bástya: nem támadhat. Védőmező: a mellette álló saját lapok 1-gyel kevesebb harci sebzést kapnak. Ha elpusztul, húzz 1 lapot.', rarity: 'nemes' },
  szellovas: { id: 'szellovas', name: 'Széljáró Portyázó', type: 'creature', cost: 3, atk: 2, hp: 2, glyph: '➶', element: 'vihar', bypassShield: true, text: 'Átrepülés: akkor is támadhatja az Őrkő-életet, ha a saját folyosójában ellenséges lap áll. A Magot nem kerülheti meg.', rarity: 'epikus' },
  zivatar: { id: 'zivatar', name: 'Zivatarige', type: 'spell', cost: 3, glyph: 'ϟ', element: 'vihar', text: 'Vihar: okozz 2 sebzést egy véletlenszerű ellenséges lénynek, majd 1-1 sebzést a közvetlenül mellette állóknak. Ha nincs célpont, okozz 1 sebzést az ellenséges Őrkő-életnek.', rarity: 'nemes' },
  parazs: { id: 'parazs', name: 'Parázsige', type: 'spell', cost: 2, glyph: '✹', element: 'tuz', text: 'Tűz: okozz 2 sebzést egy véletlenszerű ellenséges lénynek. Ha túléli, a következő saját köre elején 1 további sebzést szenved. Ha nincs célpont, okozz 1 sebzést az ellenséges Őrkő-életnek.', rarity: 'nemes' },
  forras: { id: 'forras', name: 'Ősforrás', type: 'spell', cost: 2, glyph: '◎', element: 'viz', text: 'Húzz 1 lapot. Ha a kijátszása után legfeljebb 3 lap maradt a kezedben, húzz még 1-et. Ezután egy sérült saját lapod vagy az Őrkő-életed visszanyer 1 életerőt.', rarity: 'közönséges' },
  vereshold: { id: 'vereshold', name: 'Vérhold', type: 'spell', cost: 1, glyph: '●', element: 'szellem', text: 'Minden saját lényed +1 támadást kap erre a körre. Ha legalább 2 lényed van, húzz 1 lapot.', rarity: 'epikus' },
  rovaskor: { id: 'rovaskor', name: 'Rováskör', type: 'spell', cost: 1, glyph: '◇', element: 'fold', text: 'A következő kijátszott lényed 3 rúnával kevesebbe kerül ebben a körben.', rarity: 'közönséges' },
  deak: { id: 'deak', name: 'Rovásíró Deák', type: 'creature', cost: 2, atk: 1, hp: 3, glyph: '✎', element: 'szellem', text: 'Kijátszáskor: ha ezután legfeljebb 4 lap van a kezedben, húzz 1 lapot.', rarity: 'közönséges' },
  javas: { id: 'javas', name: 'Forrásjáró Javas', type: 'creature', cost: 3, atk: 2, hp: 3, glyph: '◉', element: 'viz', text: 'Kijátszáskor: ha az Őrkő-életed sérült, visszanyer 2 életerőt. Ha teljes vagy már összeomlott, húzz 1 lapot.', rarity: 'nemes' },
  kobzos: { id: 'kobzos', name: 'Kobzos Hírnök', type: 'creature', cost: 2, atk: 2, hp: 3, glyph: '♫', element: 'semleges', text: 'Utolsó dal: amikor elpusztul, húzz 1 lapot.', rarity: 'közönséges' },
  rovasvalto: { id: 'rovasvalto', name: 'Rovásváltó', type: 'creature', cost: 2, atk: 2, hp: 2, glyph: '↺', element: 'szellem', text: 'Kijátszáskor: ha legalább 3 rúnád van, a legrégebbi rúnád visszakerül a kezedbe.', rarity: 'nemes' },
  csodaszarvas: { id: 'csodaszarvas', name: 'Csodaszarvas', type: 'creature', cost: 5, atk: 2, hp: 3, glyph: '✧', element: 'szellem', text: 'Vándorlás: támadás előtt körönként egyszer átmehet egy szomszédos üres saját folyosóra.', rarity: 'epikus' },
  ostromlo: { id: 'ostromlo', name: 'Kárpáti Ostromló', type: 'creature', cost: 5, atk: 2, hp: 3, glyph: '⬢', element: 'fold', siege: 1, text: 'Ostrom 1: Őrkő megtámadásakor 1 további sebzést okoz. Lény és Mag ellen nem kap bónuszt.', rarity: 'nemes' },
  orkokovac: { id: 'orkokovac', name: 'Őrkőkovács', type: 'creature', cost: 3, atk: 1, hp: 4, glyph: '⚒', element: 'fold', text: 'Kijátszáskor: a még álló Őrkő-védelmed legfeljebb 3 életerőt visszanyer.', rarity: 'nemes' },
  betoro: { id: 'betoro', name: 'Parázsló Betörő', type: 'creature', cost: 3, atk: 3, hp: 2, glyph: '✹', element: 'tuz', text: 'Sebzett fal: ha az ellenséges Őrkő-élet már sérült, Őrkő támadásakor +1 sebzést okoz.', rarity: 'nemes' },
  korepesztes: { id: 'korepesztes', name: 'Kőrepesztés', type: 'spell', cost: 2, glyph: '✦', element: 'fold', text: 'Ostromige: okozz 3 sebzést az ellenséges Őrkő-életnek. A védő lényeket megkerüli.', rarity: 'nemes' },
  villamvadasz: { id: 'villamvadasz', name: 'Villámvadász', type: 'creature', cost: 3, atk: 3, hp: 2, glyph: 'ϟ', element: 'vihar', siege: 1, text: 'Lendület: Őrkő támadásakor +1 sebzést okoz. Lény és Mag ellen nem kap bónuszt.', rarity: 'nemes' },
  mennydorges: { id: 'mennydorges', name: 'Mennydörgés', type: 'spell', cost: 4, glyph: '☈', element: 'vihar', text: 'Okozz 1 sebzést minden ellenséges lénynek. Ha legalább kettőt eltalált, húzz 1 lapot.', rarity: 'epikus' },
  hamufonix: { id: 'hamufonix', name: 'Hamufőnix', type: 'creature', cost: 4, atk: 3, hp: 2, glyph: '✹', element: 'tuz', text: 'Újjászületés: amikor először elpusztul, egy kimerült Hamufőnix kerül a kezedbe. Másodszor már végleg elenyészik.', rarity: 'epikus' },
  langostrom: { id: 'langostrom', name: 'Lángostrom', type: 'spell', cost: 4, glyph: '🔥', element: 'tuz', text: 'Okozz 4 sebzést az ellenséges Őrkő-életnek. Nem sebzi közvetlenül a Magot.', rarity: 'nemes' },
  kofal: { id: 'kofal', name: 'Élő Kőfal', type: 'structure', cost: 2, atk: 0, hp: 5, glyph: '▰', element: 'fold', passive: true, text: 'Erődfal: amíg pályán van, az Őrkő-életed a lénytámadásokból 1-gyel kevesebb sebzést kap. Több Kőfal nem halmozódik.', rarity: 'nemes' },
  foldrengeto: { id: 'foldrengeto', name: 'Földrengető', type: 'creature', cost: 5, atk: 4, hp: 4, glyph: '⬟', element: 'fold', text: 'Visszaverés: amikor Őrkövet sebez, a saját Őrkő-életed 1-et gyógyul.', rarity: 'epikus' },
  forrastunder: { id: 'forrastunder', name: 'Forrástündér', type: 'creature', cost: 3, atk: 2, hp: 3, glyph: '◉', element: 'viz', text: 'Áramlás: kijátszáskor húzz 1 lapot. Ha már legalább 5 lap van a kezedben, húzás helyett gyógyíts 3 Őrkő-életet.', rarity: 'nemes' },
  aradas: { id: 'aradas', name: 'Áradás', type: 'spell', cost: 3, glyph: '≈', element: 'viz', text: 'Gyógyíts 4 Őrkő-életet. Ha legalább 3 életerőt ténylegesen visszaállított, húzz 1 lapot.', rarity: 'nemes' },
  osokhangja: { id: 'osokhangja', name: 'Ősök Hangja', type: 'spell', cost: 3, glyph: '☾', element: 'szellem', text: 'A legrégebbi rúnád visszakerül a kezedbe, majd húzz 1 lapot. Ha nincs rúnád, csak húzz 1 lapot.', rarity: 'epikus' },
  lidercsapat: { id: 'lidercsapat', name: 'Lidércsereg', type: 'creature', cost: 3, atk: 2, hp: 3, glyph: '◈', element: 'szellem', text: 'Kísértetjárás: ha ebben a párbajban már legalább 2 saját lapod elpusztult, +1/+1-et kap kijátszáskor.', rarity: 'nemes' }
};

export const DECK_SIZE = 30;
export const MAX_COPIES = 3;
export const MAX_DECK_ELEMENTS = 2;
export const RUNE_ECHO_MIN_RUNES = 3;
export const RUNE_ECHO_HAND_THRESHOLD = 4;
export const MAX_RUNES = 7;
export const GUARDIAN_MAX_HP = 20;
export const CORE_MAX_HP = 10;

const buildList = entries => entries.flatMap(([id,count]) => Array(count).fill(id));
export const PRESET_DECKS = {
  visszhang: { name: 'Révülő Visszhang', description: 'Szellem + Víz: kézelőny, rúnák visszafejtése és hosszú távú érték.', cards: buildList([['liderc',2],['taltos',2],['vereshold',2],['deak',3],['rovasvalto',2],['csodaszarvas',2],['osokhangja',3],['lidercsapat',2],['forras',1],['javas',2],['forrastunder',2],['aradas',1],['betyar',3],['kobzos',3]]) },
  ostrom: { name: 'Parázsostrom', description: 'Tűz + Föld: célzott Őrkő-rombolás, ostromlapok és nagy befejező támadások.', cards: buildList([['sarkany',2],['vasorr',2],['parazs',2],['betoro',2],['hamufonix',2],['langostrom',2],['bastya',2],['rovaskor',2],['ostromlo',2],['orkokovac',2],['korepesztes',2],['kofal',2],['foldrengeto',2],['betyar',2],['kobzos',2]]) },
  erod: { name: 'Kőszív Erőd', description: 'Föld + Víz: Bástyák, sebzéscsökkentés, gyógyítás és fokozatos ellenállás.', cards: buildList([['bastya',3],['rovaskor',2],['ostromlo',2],['orkokovac',2],['korepesztes',2],['kofal',3],['foldrengeto',2],['forras',2],['javas',3],['forrastunder',2],['aradas',3],['betyar',2],['kobzos',2]]) },
  vihar: { name: 'Viharlovasság', description: 'Vihar + Szellem: folyosónyomás, megkerülés, tempó és rugalmas harc.', cards: buildList([['turul',2],['szellovas',2],['zivatar',2],['villamvadasz',2],['mennydorges',2],['liderc',2],['taltos',2],['vereshold',2],['deak',2],['rovasvalto',2],['csodaszarvas',2],['osokhangja',2],['lidercsapat',2],['betyar',2],['kobzos',2]]) },
  roham: { name: 'Tűzvihar Roham', description: 'Tűz + Vihar: agresszív lények, folyosómegkerülés és gyors nyomás.', cards: buildList([['turul',2],['szellovas',3],['zivatar',2],['villamvadasz',3],['mennydorges',2],['sarkany',2],['vasorr',2],['parazs',3],['betoro',3],['hamufonix',2],['langostrom',2],['betyar',2],['kobzos',2]]) }
};
export const DEFAULT_DECK_LIST = [...PRESET_DECKS.vihar.cards];

export function validateDeckList(deckList) {
  const errors = [];
  if (!Array.isArray(deckList)) return { ok: false, errors: ['A pakli nem érvényes lista.'], elements: [], counts: {} };
  if (deckList.length !== DECK_SIZE) errors.push(`A paklinak pontosan ${DECK_SIZE} laposnak kell lennie.`);
  const counts = {}; const elements = new Set();
  for (const id of deckList) {
    const card = CARD_LIBRARY[id];
    if (!card) { errors.push(`Ismeretlen lap: ${id}`); continue; }
    counts[id] = (counts[id] || 0) + 1;
    if (counts[id] > MAX_COPIES) errors.push(`${card.name}: legfeljebb ${MAX_COPIES} példány lehet.`);
    if (card.element && card.element !== 'semleges') elements.add(card.element);
  }
  if (elements.size > MAX_DECK_ELEMENTS) errors.push(`Legfeljebb ${MAX_DECK_ELEMENTS} elemet választhatsz a Semlegesen kívül.`);
  return { ok: errors.length === 0, errors: [...new Set(errors)], elements: [...elements], counts };
}

let uid = 1;
const isBoardCard = card => card.type === 'creature' || card.type === 'structure';
const enemyIndex = i => i === 0 ? 1 : 0;
const laneCard = (player, lane) => player.board.find(card => card.lane === lane) || null;
const validLane = lane => Number.isInteger(lane) && lane >= 0 && lane < 5;

export function makeCard(id) {
  const base = CARD_LIBRARY[id];
  if (!base) throw new Error(`Ismeretlen lap: ${id}`);
  return { ...base, uid: `c${uid++}`, damage: 0, exhausted: true, bonusAtk: 0, lane: null, burn: 0, moved: false };
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
  return { name, deck, hand: deck.splice(0, 5), board: [], runes: [], spark: false, guardianHp: GUARDIAN_MAX_HP, coreHp: CORE_MAX_HP, coreOpen: false, runePlayed: false, discount: 0, fatigue: 0, deaths: 0 };
}

export function createGame(rng = Math.random, names = ['Te', 'Árnyékidéző'], deckLists = null) {
  const players = [createPlayer(names[0], rng, deckLists?.[0] || DEFAULT_DECK_LIST), createPlayer(names[1], rng, deckLists?.[1] || DEFAULT_DECK_LIST)];
  players[1].spark = true;
  draw(players[1], 1);
  return {
    players,
    active: 0, turn: 1, phase: 'main', winner: null, log: ['A párbaj elkezdődött.'], eventSeq: 0, lastEvent: null,
    telemetry: { plays: [[], []], runes: [[], []], lanes: [[], []], runeEchoes: [0, 0] }, rng
  };
}

function recordEvent(game, event) { game.lastEvent = { seq: ++game.eventSeq, ...event }; }
export function availableRunes(player) { return player.runes.filter(rune => !rune.used).length + (player.spark ? 1 : 0); }
export function cardCost(player, card) { return Math.max(0, card.cost - (card.type === 'creature' ? player.discount : 0)); }
export function canAfford(player, card) { return availableRunes(player) >= cardCost(player, card); }
export function draw(player, n = 1) {
  const drawn = [];
  while (n-- > 0 && player.deck.length) { const card = player.deck.shift(); player.hand.push(card); drawn.push(card); }
  return drawn;
}
export function spendRunes(player, amount) {
  if (player.spark && amount > 0) { player.spark = false; amount--; }
  for (const rune of player.runes) if (!rune.used && amount > 0) { rune.used = true; amount--; }
  return amount === 0;
}
export function openLanes(player) { return [0,1,2,3,4].filter(lane => !laneCard(player, lane)); }

export function placeRune(game, playerIndex, uidToUse) {
  if (game.winner !== null || game.active !== playerIndex) return false;
  const player = game.players[playerIndex];
  if (player.runePlayed || player.runes.length >= MAX_RUNES) return false;
  const index = player.hand.findIndex(card => card.uid === uidToUse);
  if (index < 0) return false;
  const [card] = player.hand.splice(index, 1);
  player.runes.push({ uid: card.uid, id: card.id, name: card.name, used: false });
  game.telemetry?.runes[playerIndex].push(card.id);
  player.runePlayed = true;
  const echoActive = player.runes.length >= RUNE_ECHO_MIN_RUNES && player.hand.length <= RUNE_ECHO_HAND_THRESHOLD;
  const echoDrawn = echoActive ? draw(player, 1) : [];
  if (echoDrawn.length) {
    if (game.telemetry?.runeEchoes) game.telemetry.runeEchoes[playerIndex]++;
    game.log.unshift(`Rúnavisszhang: ${player.name} húzott 1 lapot.`);
  }
  game.log.unshift(`${player.name} rúnává alakította ezt a lapot: ${card.name}.`);
  recordEvent(game, { type: 'rune', playerIndex, cardId: card.id, runeEcho: echoDrawn.length > 0 });
  return true;
}

function cleanupDead(game) {
  for (let playerIndex = 0; playerIndex < 2; playerIndex++) {
    const player = game.players[playerIndex];
    const dead = player.board.filter(card => card.hp - card.damage <= 0);
    if (!dead.length) continue;
    player.board = player.board.filter(card => card.hp - card.damage > 0);
    player.deaths = (player.deaths || 0) + dead.length;
    for (const card of dead) {
      if (card.id === 'bastya') {
        const drawn = draw(player, 1);
        game.log.unshift(`${player.name} Rovásbástyája leomlott${drawn.length ? ', ezért húzott 1 lapot' : ''}.`);
      }
      if (card.id === 'kobzos') {
        const drawn = draw(player, 1);
        game.log.unshift(`${player.name} Kobzos Hírnökének utolsó dala${drawn.length ? ' 1 lapot húzott' : ' elnémult, mert elfogyott a pakli'}.`);
      }
      if (card.id === 'hamufonix' && !card.reborn) {
        const reborn = makeCard('hamufonix'); reborn.reborn = true; player.hand.push(reborn);
        game.log.unshift(`${player.name} Hamufőnixe újjászületett a hamuból, és visszatért a kézbe.`);
      }
    }
  }
}

function guardianAttackReduction(player) { return player.board.some(card => card.id === 'kofal') ? 1 : 0; }
function damageGuardian(game, targetIndex, amount, attackDamage = false) {
  const target = game.players[targetIndex];
  if (target.guardianHp <= 0 || amount <= 0) return { dealt: 0, destroyed: false, remaining: target.guardianHp, blocked: 0 };
  const blocked = attackDamage ? Math.min(amount, guardianAttackReduction(target)) : 0;
  const finalAmount = Math.max(0, amount - blocked);
  const before = target.guardianHp;
  target.guardianHp = Math.max(0, before - finalAmount);
  target.coreOpen = target.guardianHp === 0;
  return { dealt: before - target.guardianHp, destroyed: before > 0 && target.guardianHp === 0, remaining: target.guardianHp, blocked };
}

function healGuardian(player, amount) {
  if (player.guardianHp <= 0 || player.guardianHp >= GUARDIAN_MAX_HP || amount <= 0) return 0;
  const before = player.guardianHp;
  player.guardianHp = Math.min(GUARDIAN_MAX_HP, before + amount);
  return player.guardianHp - before;
}

function returnOldestRune(player) {
  const index = player.runes.length ? 0 : -1;
  if (index < 0) return null;
  const [rune] = player.runes.splice(index, 1);
  if (!rune?.id || !CARD_LIBRARY[rune.id]) return null;
  const card = makeCard(rune.id);
  player.hand.push(card);
  return card;
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
    } else { const hit = damageGuardian(game, enemyIndex(playerIndex), 1); if (hit.dealt) meta.guardianDamage = hit.dealt; }
  }
  if (card.id === 'parazs') {
    if (enemy.board.length) {
      const target = enemy.board[Math.floor(game.rng() * enemy.board.length)];
      target.damage += 2; meta.targets.push(target.uid);
      if (target.hp - target.damage > 0) target.burn = Math.max(target.burn || 0, 1);
      cleanupDead(game);
    } else { const hit = damageGuardian(game, enemyIndex(playerIndex), 1); if (hit.dealt) meta.guardianDamage = hit.dealt; }
  }
  if (card.id === 'forras') {
    const lowHand = player.hand.length <= 3;
    draw(player, lowHand ? 2 : 1);
    const hurt = player.board.filter(unit => unit.damage > 0).sort((a,b) => b.damage - a.damage)[0];
    if (hurt) hurt.damage = Math.max(0, hurt.damage - 1);
    else healGuardian(player, 1);
  }
  if (card.id === 'vereshold') { const creatures=player.board.filter(unit => unit.type === 'creature'); creatures.forEach(unit => { unit.bonusAtk += 1; }); if (creatures.length >= 2) draw(player, 1); }
  if (card.id === 'rovaskor') player.discount = 3;
  if (card.id === 'korepesztes') { const hit = damageGuardian(game, enemyIndex(playerIndex), 3); meta.guardianDamage = hit.dealt; }
  if (card.id === 'mennydorges') {
    const targets = [...enemy.board]; targets.forEach(unit => { unit.damage += 1; meta.targets.push(unit.uid); }); cleanupDead(game); if (targets.length >= 2) draw(player, 1);
  }
  if (card.id === 'langostrom') { const hit = damageGuardian(game, enemyIndex(playerIndex), 4); meta.guardianDamage = hit.dealt; }
  if (card.id === 'aradas') { const healed = healGuardian(player, 4); if (healed >= 3) draw(player, 1); meta.guardianHeal = healed; }
  if (card.id === 'osokhangja') { const restored = returnOldestRune(player); draw(player, 1); meta.restoredRune = restored?.id || null; }
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
    if (card.id === 'turul' && player.guardianHp < enemy.guardianHp) { card.atk++; card.hp++; }
    if (card.id === 'betyar' && player.runePlayed) card.bonusAtk = 1;
    if (card.id === 'taltos') draw(player, 1);
    if (card.id === 'deak' && player.hand.length <= 4) draw(player, 1);
    if (card.id === 'javas') {
      const healed = healGuardian(player, 2);
      if (!healed) draw(player, 1);
    }
    if (card.id === 'rovasvalto' && player.runes.length >= 3) {
      const restored = returnOldestRune(player);
      if (restored) game.log.unshift(`${player.name} visszafejtette egy korábbi rúnáját: ${restored.name}.`);
    }
    if (card.id === 'orkokovac') healGuardian(player, 3);
    if (card.id === 'forrastunder') { if (player.hand.length >= 5) healGuardian(player, 3); else draw(player, 1); }
    if (card.id === 'lidercsapat' && (player.deaths || 0) >= 2) { card.atk++; card.hp++; }
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

export function moveCard(game, playerIndex, uidToMove, lane) {
  if (game.winner !== null || game.active !== playerIndex || !validLane(lane)) return false;
  const player = game.players[playerIndex];
  const card = player.board.find(unit => unit.uid === uidToMove);
  if (!card || card.id !== 'csodaszarvas' || card.exhausted || card.moved || Math.abs(card.lane - lane) !== 1 || laneCard(player, lane)) return false;
  const fromLane = card.lane;
  card.lane = lane;
  card.moved = true;
  game.log.unshift(`${card.name} átvándorolt a ${fromLane + 1}. folyosóból a ${lane + 1}. folyosóba.`);
  recordEvent(game, { type: 'move', playerIndex, cardUid: card.uid, cardId: card.id, fromLane, lane });
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
  const guardianAlive = enemy.guardianHp > 0;
  if (!targetUid && opposite && !(attacker.bypassShield && guardianAlive)) return false;
  if (!targetUid && !guardianAlive && opposite) return false;
  attacker.exhausted = true;
  const attackPower = attacker.atk + attacker.bonusAtk;
  if (target) {
    const counterPower = target.atk + target.bonusAtk;
    target.damage += Math.max(0, attackPower - combatReduction(enemy, target));
    attacker.damage += Math.max(0, counterPower - combatReduction(player, attacker));
    const targetDied = target.hp - target.damage <= 0;
    const attackerDied = attacker.hp - attacker.damage <= 0;
    cleanupDead(game);
    let trampleShield = false;
    if (attacker.id === 'sarkany' && targetDied && !attackerDied && enemy.guardianHp > 0) { damageGuardian(game, enemyIndex(playerIndex), 1, true); trampleShield = true; }
    game.log.unshift(`${attacker.name} és ${target.name} összecsaptak a ${attacker.lane + 1}. folyosóban.`);
    recordEvent(game, { type: 'attack', playerIndex, attackerUid, targetUid, targetKind: 'creature', lane: attacker.lane, targetDied, attackerDied, trampleShield });
  } else if (guardianAlive) {
    const guardianBonus = (attacker.siege || 0) + (attacker.id === 'betoro' && enemy.guardianHp < GUARDIAN_MAX_HP ? 1 : 0);
    const guardianPower = attackPower + guardianBonus;
    const hit = damageGuardian(game, enemyIndex(playerIndex), guardianPower, true);
    if (attacker.id === 'foldrengeto' && hit.dealt > 0) healGuardian(player, 1);
    game.log.unshift(`${attacker.name} ${hit.dealt} sebzést mért az Őrkő-életre${guardianBonus ? ` (${guardianBonus} támadóbónusz)` : ''}${hit.blocked ? `, a Kőfal ${hit.blocked}-et felfogott` : ''}${hit.destroyed ? ', az Őrkő-védelem összeomlott' : ''}.`);
    recordEvent(game, { type: 'attack', playerIndex, attackerUid, targetUid: null, targetKind: 'shield', lane: attacker.lane, bypassed: Boolean(opposite), amount: hit.dealt, rawAmount: guardianPower, guardianBonus, guardianBlocked: hit.blocked, guardianRemaining: hit.remaining, guardianDestroyed: hit.destroyed });
  } else if (enemy.coreOpen) {
    enemy.coreHp = Math.max(0, enemy.coreHp - attackPower);
    const destroyed = enemy.coreHp === 0;
    if (destroyed) {
      game.winner = playerIndex;
      game.log.unshift(`${attacker.name} ${attackPower} sebzést mért a Magra. ${player.name} megnyerte a párbajt!`);
    } else game.log.unshift(`${attacker.name} ${attackPower} sebzést mért a Magra. A Mag életereje: ${enemy.coreHp}/${CORE_MAX_HP}.`);
    recordEvent(game, { type: 'attack', playerIndex, attackerUid, targetUid: null, targetKind: 'core', lane: attacker.lane, amount: attackPower, coreRemaining: enemy.coreHp, coreDestroyed: destroyed });
  } else { attacker.exhausted = false; return false; }
  checkWinner(game);
  return true;
}

function checkWinner(game) {
  if (game.winner !== null) return;
  for (let i = 0; i < 2; i++) {
    if (game.players[i].coreHp <= 0) {
      game.winner = enemyIndex(i);
      recordEvent(game, { type: 'victory', playerIndex: game.winner, reason: 'core' });
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

export function endTurn(game, playerIndex = game.active) {
  if (game.winner !== null || playerIndex !== game.active) return false;
  const current = game.players[game.active];
  current.spark = false;
  current.board.forEach(card => { card.bonusAtk = 0; });
  game.active = enemyIndex(game.active);
  game.turn++;
  const next = game.players[game.active];
  next.runePlayed = false;
  next.discount = 0;
  next.runes.forEach(rune => { rune.used = false; });
  next.board.forEach(card => { card.exhausted = card.passive === true; card.moved = false; });
  resolveStartOfTurnEffects(game, game.active);
  if (!next.deck.length) {
    next.fatigue = (next.fatigue || 0) + 1;
    const fatigueDamage = next.fatigue;
    next.coreHp = Math.max(0, next.coreHp - fatigueDamage);
    if (next.coreHp === 0) {
      game.winner = enemyIndex(game.active);
      game.log.unshift(`${next.name} kimerült. ${game.players[game.winner].name} megnyerte a párbajt!`);
      recordEvent(game, { type: 'victory', playerIndex: game.winner, reason: 'fatigue', fatigue: next.fatigue, amount: fatigueDamage });
      return true;
    }
    game.log.unshift(`${next.name} nem tudott lapot húzni: ${fatigueDamage} kimerüléssebzést szenvedett a Magja.`);
    recordEvent(game, { type: 'fatigue', playerIndex: game.active, amount: fatigueDamage, coreRemaining: next.coreHp });
  } else draw(next, 1);
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
  if (card.id === 'szellovas') value += enemy.guardianHp > 0 ? (style === 'aggro' ? 1.8 : 1.15) : .2;
  if (card.id === 'zivatar') value += enemy.board.length ? 2 + Math.min(2, enemy.board.length) * .3 : .8;
  if (card.id === 'parazs') value += enemy.board.length ? 1.8 : .65;
  if (card.id === 'forras') value += 2.0;
  if (card.id === 'vereshold') { const count=player.board.filter(unit => unit.type === 'creature').length; value += count * .7 + (count >= 2 ? .8 : 0); }
  if (card.id === 'rovaskor') value += player.hand.some(other => other.type === 'creature' && other.uid !== card.uid) ? 1.5 : -.6;
  if (card.id === 'deak') value += player.hand.length <= 4 ? 1.2 : .2;
  if (card.id === 'javas') value += player.guardianHp > 0 && player.guardianHp < GUARDIAN_MAX_HP ? 1.25 : .85;
  if (card.id === 'kobzos') value += .75;
  if (card.id === 'rovasvalto') value += player.runes.length >= 3 && player.hand.length <= 4 ? 1.0 : -.2;
  if (card.id === 'csodaszarvas') value += style === 'aggro' ? 1.05 : .7;
  if (card.id === 'ostromlo') value += enemy.guardianHp > 0 ? (style === 'aggro' ? 1.45 : .85) : .15;
  if (card.id === 'orkokovac') value += player.guardianHp > 0 && player.guardianHp < GUARDIAN_MAX_HP ? 1.1 : .25;
  if (card.id === 'betoro') value += enemy.guardianHp > 0 && enemy.guardianHp < GUARDIAN_MAX_HP ? .9 : .35;
  if (card.id === 'korepesztes') value += enemy.guardianHp > 0 ? (style === 'aggro' ? 2.0 : 1.35) : -.5;
  if (card.id === 'villamvadasz') value += enemy.guardianHp > 0 ? 1.0 : .2;
  if (card.id === 'mennydorges') value += enemy.board.length * .55;
  if (card.id === 'hamufonix') value += .8;
  if (card.id === 'langostrom') value += enemy.guardianHp > 0 ? 1.8 : -.8;
  if (card.id === 'kofal') value += style === 'control' ? 1.8 : .5;
  if (card.id === 'foldrengeto') value += player.guardianHp < GUARDIAN_MAX_HP ? .7 : .25;
  if (card.id === 'forrastunder') value += 1.1;
  if (card.id === 'aradas') value += player.guardianHp <= GUARDIAN_MAX_HP - 3 ? 1.4 : -.4;
  if (card.id === 'osokhangja') value += player.runes.length ? 1.0 : .35;
  if (card.id === 'lidercsapat') value += (player.deaths || 0) >= 2 ? 1.0 : .25;
  return value;
}

function chooseLane(game, playerIndex, card, style) {
  const player = game.players[playerIndex], enemy = game.players[enemyIndex(playerIndex)];
  const choices = openLanes(player).map(lane => {
    const opposing = laneCard(enemy, lane);
    let score = game.rng() * .08;
    if (!opposing) {
      if (enemy.coreOpen) score += style === 'aggro' ? 4.2 : 2.3;
      else if (enemy.guardianHp > 0) {
        score += style === 'aggro' ? 3.4 : 1.6;
        score += (GUARDIAN_MAX_HP - enemy.guardianHp) / 8 * (style === 'aggro' ? .8 : .45);
        if (['ostromlo','betoro','villamvadasz','foldrengeto'].includes(card.id)) score += 1.0;
      }
    }
    if ((card.id === 'javas' || card.id === 'orkokovac' || card.id === 'forrastunder') && player.guardianHp > 0 && player.guardianHp < GUARDIAN_MAX_HP) score += 1.4;
    if (opposing) {
      const remaining = opposing.hp - opposing.damage;
      if (card.type === 'structure') score += 2.2 + opposing.atk * .25;
      else {
        if (card.atk >= remaining) score += 2.8;
        if (card.hp > opposing.atk) score += .7;
      }
      if (card.bypassShield && game.players[enemyIndex(playerIndex)].guardianHp > 0) score += 1.8;
      if (style === 'control') score += opposing.atk * .18;
    }
    return { lane, score };
  });
  choices.sort((a,b) => b.score - a.score);
  return choices[0]?.lane ?? null;
}

function shouldBotPlay(card, game, playerIndex) {
  const player = game.players[playerIndex], enemy = game.players[enemyIndex(playerIndex)];
  if (card.id === 'forras') {
    const lowHand = player.hand.length <= 4;
    const hurtUnit = player.board.some(unit => unit.damage > 0);
    const hurtGuardian = player.guardianHp > 0 && player.guardianHp < GUARDIAN_MAX_HP;
    return lowHand || hurtUnit || hurtGuardian;
  }
  if (card.id === 'vereshold') return player.board.some(unit => unit.type === 'creature' && !unit.exhausted);
  if (card.id === 'rovaskor') return player.hand.some(other => other.uid !== card.uid && other.type === 'creature');
  if (card.id === 'korepesztes' || card.id === 'langostrom') return enemy.guardianHp > 0;
  if (card.id === 'aradas') return player.guardianHp > 0 && player.guardianHp <= GUARDIAN_MAX_HP - 3;
  return true;
}

export function botTakeTurn(game, playerIndex, style = 'value') {
  if (game.active !== playerIndex || game.winner !== null) return;
  const ai = game.players[playerIndex];
  const enemy = game.players[enemyIndex(playerIndex)];
  if (!ai.runePlayed && ai.hand.length > 2 && ai.runes.length < MAX_RUNES) {
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
    const playable = ai.hand.filter(card => canAfford(ai, card) && (!isBoardCard(card) || openLanes(ai).length) && shouldBotPlay(card, game, playerIndex));
    if (!playable.length) break;
    playable.sort((a,b) => cardValue(b, game, playerIndex, style) - cardValue(a, game, playerIndex, style));
    const card = playable[0];
    const lane = isBoardCard(card) ? chooseLane(game, playerIndex, card, style) : null;
    if (!playCard(game, playerIndex, card.uid, lane)) break;
  }
  for (const card of ai.board.filter(unit => unit.id === 'csodaszarvas' && !unit.exhausted && !unit.moved)) {
    const currentOpposite = laneCard(enemy, card.lane);
    const adjacent = [card.lane - 1, card.lane + 1].filter(lane => validLane(lane) && !laneCard(ai, lane));
    const candidates = adjacent.filter(lane => !laneCard(enemy, lane) && enemy.guardianHp > 0);
    if (currentOpposite && candidates.length && (style !== 'control' || currentOpposite.atk >= card.hp - card.damage)) moveCard(game, playerIndex, card.uid, candidates[0]);
  }
  const attackers = [...ai.board].filter(card => card.type === 'creature' && !card.passive);
  for (const card of attackers) {
    if (card.exhausted || game.winner !== null) continue;
    const opposite = laneCard(enemy, card.lane);
    if (opposite) {
      const shouldBypass = card.bypassShield && enemy.guardianHp > 0 && (style === 'aggro' || (style === 'value' && opposite.hp - opposite.damage > card.atk + card.bonusAtk));
      attack(game, playerIndex, card.uid, shouldBypass ? null : opposite.uid);
    } else attack(game, playerIndex, card.uid, null);
  }
  if (game.winner === null) endTurn(game);
}

export function aiTakeTurn(game) { return botTakeTurn(game, 1, 'value'); }
