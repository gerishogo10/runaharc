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
