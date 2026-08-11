import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const appPort=8101, debugPort=9231;
const browserAppHost=process.env.BROWSER_APP_HOST||'127.0.0.1';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const app=spawn(process.execPath,['server.js'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:String(appPort)},stdio:['ignore','pipe','pipe']});
const profile=`/tmp/runaharc-chrome-${process.pid}`;
fs.rmSync(profile,{recursive:true,force:true});
const chrome=spawn('/usr/bin/chromium',[
  '--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-proxy-server',`--remote-debugging-port=${debugPort}`,`--user-data-dir=${profile}`,'about:blank'
],{stdio:['ignore','pipe','pipe']});

class Cdp {
  constructor(url){this.ws=new WebSocket(url);this.id=0;this.pending=new Map();this.errors=[];this.ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&this.pending.has(m.id)){const {resolve,reject}=this.pending.get(m.id);this.pending.delete(m.id);m.error?reject(new Error(m.error.message)):resolve(m.result);return}if(m.method==='Runtime.exceptionThrown')this.errors.push(m.params.exceptionDetails.text||'Runtime exception');if(m.method==='Log.entryAdded'&&m.params.entry.level==='error')this.errors.push(m.params.entry.text)};}
  open(){return new Promise((resolve,reject)=>{this.ws.onopen=resolve;this.ws.onerror=reject})}
  send(method,params={}){return new Promise((resolve,reject)=>{const id=++this.id;this.pending.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}))})}
  async eval(expression){const r=await this.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text||'evaluation failed');return r.result.value}
  close(){this.ws.close()}
}

async function waitHttp(url){for(let i=0;i<60;i++){try{const r=await fetch(url);if(r.ok)return r}catch{}await wait(100)}throw new Error(`timeout waiting for ${url}`)}
async function newPage(url){const target=await (await fetch(`http://127.0.0.1:${debugPort}/json/new?${url}`,{method:'PUT'})).json();const c=new Cdp(target.webSocketDebuggerUrl);await c.open();await c.send('Runtime.enable');await c.send('Page.enable');await c.send('Log.enable');return c}
async function until(c,expr,label){for(let i=0;i<80;i++){try{if(await c.eval(expr))return}catch{}await wait(100)}throw new Error(`timeout: ${label}`)}

let a,b;
try{
  await waitHttp(`http://127.0.0.1:${appPort}/health`);await waitHttp(`http://127.0.0.1:${debugPort}/json/version`);
  a=await newPage(`http://${browserAppHost}:${appPort}/`);
  await until(a,"document.readyState==='complete' && !!document.querySelector('#nameInput')",'page A ready');
  await a.eval("document.querySelector('#nameInput').value='A';document.querySelector('#createRoom').click();true");
  await until(a,"document.querySelector('#roomCode')?.textContent.length===5",'room code');
  const code=await a.eval("document.querySelector('#roomCode').textContent");
  b=await newPage(`http://${browserAppHost}:${appPort}/`);
  await until(b,"document.readyState==='complete' && !!document.querySelector('#nameInput')",'page B ready');
  await b.eval(`document.querySelector('#nameInput').value='B';document.querySelector('#roomInput').value=${JSON.stringify(code)};document.querySelector('#joinRoom').click();true`);
  await until(a,"document.body.classList.contains('game-active')",'A game active');
  await until(b,"document.body.classList.contains('game-active')",'B game active');
  assert.match(await a.eval("document.querySelector('#turnPill').textContent"),/TE KÖVETKEZEL/);
  assert.equal(await a.eval("document.querySelector('#endTurnBtn').disabled"),false);
  assert.equal(await b.eval("document.querySelector('#endTurnBtn').disabled"),true);

  await a.eval("document.querySelector('#hand .card').click();true");
  const selectedName=await a.eval("document.querySelector('#selectedName').textContent");
  const selectedText=await a.eval("document.querySelector('#selectedText').textContent");
  const actionLabels=await a.eval("[...document.querySelectorAll('#actions button')].map(x=>x.textContent)");
  assert.notEqual(selectedName,'Nincs kiválasztott lap');
  assert.ok(selectedText.length>8);
  assert.ok(actionLabels.some(x=>x.includes('RÚNÁVÁ ALAKÍTOM')));

  await a.eval("[...document.querySelectorAll('#actions button')].find(x=>x.textContent.includes('RÚNÁVÁ ALAKÍTOM')).click();true");
  await until(a,"document.querySelector('#playerRunes').textContent.includes('/ 1')",'rune placed');
  assert.match(await a.eval("document.querySelector('#selectedName').textContent"),/Nincs kiválasztott lap/);

  await a.eval("document.querySelector('#endTurnBtn').click();true");
  await until(a,"document.querySelector('#turnPill').textContent.includes('AZ ELLENFÉL KÖVETKEZIK')",'turn switched A');
  await until(b,"document.querySelector('#turnPill').textContent.includes('TE KÖVETKEZEL')",'turn switched B');
  assert.equal(await a.eval("document.querySelector('#endTurnBtn').disabled"),true);
  const bHandBefore=await b.eval("document.querySelectorAll('#hand .card').length");
  await a.eval("document.querySelector('#endTurnBtn').click();true");await wait(250);
  assert.match(await b.eval("document.querySelector('#turnPill').textContent"),/TE KÖVETKEZEL/);
  assert.equal(await b.eval("document.querySelectorAll('#hand .card').length"),bHandBefore);

  await b.eval("document.querySelector('#hand .card').click();true");
  assert.notEqual(await b.eval("document.querySelector('#selectedName').textContent"),'Nincs kiválasztott lap');
  assert.equal(a.errors.length,0,`A browser errors: ${a.errors.join(' | ')}`);assert.equal(b.errors.length,0,`B browser errors: ${b.errors.join(' | ')}`);
  const shot=await a.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/mnt/data/runaharc-v11-browser.png',Buffer.from(shot.data,'base64'));
  console.log('browser e2e: ok');
}finally{
  a?.close();b?.close();chrome.kill('SIGTERM');app.kill('SIGTERM');await wait(300);try{fs.rmSync(profile,{recursive:true,force:true})}catch{};
}
