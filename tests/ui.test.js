import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

for (const file of ['online.html','index.source.html']) {
  test(`${file}: the action panel is between the arena and the hand`,()=>{const html=fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8');const arenaEnd=html.indexOf('</section>',html.indexOf('class="arena"'));const action=html.indexOf('id="actionPanel"');const hand=html.indexOf('class="hand-panel"');assert.ok(arenaEnd>=0 && action>arenaEnd && hand>action)});
  test(`${file}: exposes an accessible sound toggle`,()=>{const html=fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8');assert.match(html,/id="soundBtn"/);assert.match(html,/aria-pressed="true"/)});
  test(`${file}: contains the shared spell reveal surface`,()=>{const html=fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8');assert.match(html,/id="spellReveal"/)});
}

test('card titles and attack values remain explicitly white',()=>{const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');assert.match(css,/\.card-name\{[^}]*color:#fff!important/);assert.match(css,/\.stats \.atk\{[^}]*color:#fff!important/)});
test('battlefield exposes five visual lanes and summoning targets',()=>{const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');const game=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');assert.match(css,/grid-template-columns:repeat\(5/);assert.match(css,/\.lane-slot\.summon-target/);assert.match(game,/for \(let lane = 0; lane < 5; lane\+\+\)/)});
test('spell reveal lasts long enough to read and can be dismissed',()=>{const js=fs.readFileSync(new URL('../online.js',import.meta.url),'utf8');assert.match(js,/showSpellReveal/);assert.match(js,/4200/);assert.match(js,/spellReveal\?\.addEventListener\('click'/)});
test('desktop game-active mode remains a single-screen battle',()=>{const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');assert.match(css,/@media \(min-width:900px\) and \(min-height:760px\)/);assert.match(css,/body\.game-active\{height:100dvh;min-height:0;overflow:hidden\}/);assert.match(css,/body\.game-active \.online-panel\{display:none\}/);assert.match(css,/body\.game-active \.log\{display:none\}/)});
test('mobile keeps the sound control visible',()=>{const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');assert.match(css,/@media\(max-width:720px\)\{\.topbar \.sound-toggle\{display:inline-flex!important/)});
test('card artwork avoids per-card turbulence filters',()=>{const art=fs.readFileSync(new URL('../art.js',import.meta.url),'utf8');assert.doesNotMatch(art,/feTurbulence/)});


test('compact cards use readable keywords instead of tiny full rules text',()=>{const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');const online=fs.readFileSync(new URL('../online.js',import.meta.url),'utf8');assert.match(css,/\.card-text\{display:none!important\}/);assert.match(css,/\.card-keywords/);assert.match(online,/cardKeyword/);assert.match(online,/class="card-keywords"/)});
test('selected-card panel exposes metadata and full rules text',()=>{const html=fs.readFileSync(new URL('../online.html',import.meta.url),'utf8');const js=fs.readFileSync(new URL('../online.js',import.meta.url),'utf8');assert.match(html,/id="selectedMeta"/);assert.match(js,/els\.selectedMeta\.textContent = cardMetaText\(selected\)/);assert.match(js,/els\.selectedText\.textContent = selected\.text/)});
test('desktop lanes are centered and capped instead of stretching across the arena',()=>{const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');assert.match(css,/\.board-row\{width:min\(1080px,calc\(100% - 28px\)\)/);assert.match(css,/\.lane-slot:before/)});


test('fortress UI shows five damageable Őrkövek and Mag HP',()=>{const html=fs.readFileSync(new URL('../online.html',import.meta.url),'utf8');const js=fs.readFileSync(new URL('../online.js',import.meta.url),'utf8');assert.match(html,/id="playerCore"/);assert.match(html,/id="enemyCore"/);assert.match(js,/guardian.*\/5 életerő/s);assert.match(js,/MAG \$\{player\.coreHp\}\/10/)});
test('direct attack buttons use the current lane Őrkő HP and Mag HP',()=>{const js=fs.readFileSync(new URL('../online.js',import.meta.url),'utf8');assert.match(js,/enemy\.guardians\[live\.lane\]/);assert.match(js,/MAG MEGTÁMADÁSA · \$\{enemy\.coreHp\}\/10 ÉP/)});
test('v8 UI megjeleníti a Rúnavisszhangot és a Csodaszarvas Vándorlását',()=>{const game=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');const online=fs.readFileSync(new URL('../online.js',import.meta.url),'utf8');assert.match(game,/VISSZHANG/);assert.match(online,/VISSZHANG/);assert.match(game,/VÁNDORLÁS →/);assert.match(online,/kind: 'move'/)});
test('v8 új lapjai egyedi artwork kulcsot kapnak',()=>{const art=fs.readFileSync(new URL('../art.js',import.meta.url),'utf8');for(const id of ['deak','javas','kobzos','rovasvalto','csodaszarvas','ostromlo','orkokovac','betoro','korepesztes']) assert.match(art,new RegExp(`\\b${id}:`))});

