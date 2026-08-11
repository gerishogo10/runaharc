import fs from 'node:fs';

const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const stripExports = source => source.replace(/^export\s+/gm, '');
const html = read('index.source.html');
const css = read('styles.css');
const art = stripExports(read('art.js'));
const effects = stripExports(read('effects.js'));
const engine = stripExports(read('engine.js'));
let game = read('game.js');
game = game.replace(/^import .*?;\s*$/gm, '').trim();

const bundled = `
(() => {\n${art}\nwindow.__runaharcArt = { cardArtwork };\n})();
(() => {\n${effects}\nwindow.__runaharcEffects = { isSoundEnabled, playGameEvent, primeAudio, setSoundEnabled };\n})();
(() => {\n${engine}\nwindow.__runaharcEngine = { CARD_LIBRARY, createGame, availableRunes, cardCost, placeRune, playCard, attack, moveCard, endTurn, aiTakeTurn, openLanes, MAX_RUNES, DEFAULT_DECK_LIST, validateDeckList, GUARDIAN_MAX_HP, CORE_MAX_HP };\n})();
(() => {\nconst { cardArtwork } = window.__runaharcArt;\nconst { CARD_LIBRARY, createGame, availableRunes, cardCost, placeRune, playCard, attack, moveCard, endTurn, aiTakeTurn, openLanes, MAX_RUNES, DEFAULT_DECK_LIST, validateDeckList, GUARDIAN_MAX_HP, CORE_MAX_HP } = window.__runaharcEngine;\nconst { isSoundEnabled, playGameEvent, primeAudio, setSoundEnabled } = window.__runaharcEffects;\n${game}\n})();`;

const out = html
  .replace('<link rel="stylesheet" href="styles.css" />', `<style>\n${css}\n</style>`)
  .replace('<script type="module" src="game.js"></script>', `<script>\n${bundled}\n</script>`);

for (const file of ['index.html', 'runaharc-standalone.html']) fs.writeFileSync(new URL(`../${file}`, import.meta.url), out);
console.log('standalone build: ok');
