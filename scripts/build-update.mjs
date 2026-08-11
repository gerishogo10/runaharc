import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out=path.resolve(process.argv[2] || path.join(root,'dist-update'));
const files=[
  'README.md','RENDER-START-HERE.md','balance-report.json','archetype-report.json','element-report.json','deckbuilder.html','deckbuilder.js','art.js','effects.js','engine.js','game.js','index.html','index.source.html',
  'online.html','online.js','package.json','render.yaml','runaharc-standalone.html','server.js','styles.css',
  'scripts/balance.js','scripts/archetype-balance.js','scripts/element-balance.js','scripts/build-standalone.mjs','scripts/build-update.mjs','scripts/lint.js',
  'tests/engine.test.js','tests/http-smoke.mjs','tests/online-e2e.mjs','tests/ui.test.js','tests/browser-e2e.mjs'
];
fs.rmSync(out,{recursive:true,force:true});
for(const rel of files){const src=path.join(root,rel);if(!fs.existsSync(src))throw new Error(`Hiányzó frissítőfájl: ${rel}`);const dest=path.join(out,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(src,dest)}
console.log(`update bundle: ${files.length} files -> ${out}`);
