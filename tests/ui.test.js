import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

for (const file of ['online.html','index.source.html']) {
  test(`${file}: the action panel is between the arena and the hand`,()=>{
    const html=fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
    const arenaEnd=html.indexOf('</section>',html.indexOf('class="arena"'));
    const action=html.indexOf('id="actionPanel"');
    const hand=html.indexOf('class="hand-panel"');
    assert.ok(arenaEnd>=0 && action>arenaEnd && hand>action);
  });
  test(`${file}: exposes an accessible sound toggle`,()=>{
    const html=fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
    assert.match(html,/id="soundBtn"/);
    assert.match(html,/aria-pressed="true"/);
  });
}

test('card titles and attack values remain explicitly white',()=>{
  const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
  assert.match(css,/\.card-name\{[^}]*color:#fff!important/);
  assert.match(css,/\.stats \.atk\{[^}]*color:#fff!important/);
});


test('enemy card hover keeps the counter-rotation and mobile keeps sound control visible',()=>{
  const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
  assert.match(css,/\.enemy-board \.card:hover,\.enemy-board \.card\.selected\{transform:rotate\(180deg\)/);
  assert.match(css,/@media\(max-width:720px\)\{\.topbar \.sound-toggle\{display:inline-flex!important/);
});

test('card artwork avoids per-card turbulence filters',()=>{
  const art=fs.readFileSync(new URL('../art.js',import.meta.url),'utf8');
  assert.doesNotMatch(art,/feTurbulence/);
});
