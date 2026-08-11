import fs from 'node:fs';
const files=['engine.js','game.js'];let bad=0;
for(const f of files){const s=fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');if(/console\.log|debugger/.test(s)){console.error(`${f}: debug statement found`);bad++;}if(/\t/.test(s)){console.error(`${f}: tab found`);bad++;}}
if(bad)process.exit(1);console.log('lint: ok');
