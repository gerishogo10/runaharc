import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
const port=8098;const child=spawn(process.execPath,['server.js'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});const wait=ms=>new Promise(r=>setTimeout(r,ms));
try{
  let health;for(let i=0;i<20;i++){try{health=await fetch(`http://127.0.0.1:${port}/health`);if(health.ok)break}catch{}await wait(100)}assert.equal(health?.status,200);
  const root=await fetch(`http://127.0.0.1:${port}/`);assert.equal(root.status,200);assert.match(await root.text(),/id="actionPanel"/);
  const builder=await fetch(`http://127.0.0.1:${port}/deckbuilder.html`);assert.equal(builder.status,200);assert.match(await builder.text(),/id="collectionGrid"/);
  const builderJs=await fetch(`http://127.0.0.1:${port}/deckbuilder.js`);assert.equal(builderJs.status,200);assert.match(await builderJs.text(),/PRESET_DECKS/);
  const effects=await fetch(`http://127.0.0.1:${port}/effects.js`);assert.equal(effects.status,200);assert.match(await effects.text(),/playGameEvent/);
  const secret=await fetch(`http://127.0.0.1:${port}/server.js`);assert.equal(secret.status,404);console.log('http smoke: ok');
}finally{child.kill('SIGTERM')}
