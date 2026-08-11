import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { DEFAULT_DECK_LIST, PRESET_DECKS, GUARDIAN_MAX_HP, CORE_MAX_HP } from '../engine.js';
const port=8097;
const child=spawn(process.execPath,['server.js'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function next(ws,type){return new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(new Error('timeout '+type)),4000);const h=e=>{const m=JSON.parse(e.data);if(m.type===type){clearTimeout(t);ws.removeEventListener('message',h);resolve(m)}};ws.addEventListener('message',h)})}
async function action(ws,msg,a,b){const pa=next(a,'state'),pb=next(b,'state');ws.send(JSON.stringify({type:'action',...msg}));return Promise.all([pa,pb])}
try{
  await wait(180);
  // Invalid custom deck is rejected at the server boundary.
  const bad=new WebSocket(`ws://127.0.0.1:${port}/ws`);await new Promise(r=>bad.onopen=r);bad.send(JSON.stringify({type:'create',name:'Hibás',deck:['turul']}));const badErr=await next(bad,'error');assert.match(badErr.message,/pakli nem szabályos/i);bad.close();

  const a=new WebSocket(`ws://127.0.0.1:${port}/ws`),b=new WebSocket(`ws://127.0.0.1:${port}/ws`);
  await Promise.all([new Promise(r=>a.onopen=r),new Promise(r=>b.onopen=r)]);
  a.send(JSON.stringify({type:'create',name:'A',deck:PRESET_DECKS.ostrom.cards}));const room=await next(a,'room');assert.equal(room.seat,0);
  const stateA=next(a,'state'),stateB=next(b,'state');b.send(JSON.stringify({type:'join',code:room.code,name:'B',deck:DEFAULT_DECK_LIST}));
  let [sa,sb]=await Promise.all([stateA,stateB]);
  assert.equal(sa.state.protocolVersion,11);assert.equal(sa.state.players[0].name,'A');assert.equal(sb.state.players[1].name,'B');assert.equal(sa.state.players[1].hand.length,0);assert.equal(sb.state.players[0].hand.length,0);assert.equal(sa.state.players[0].handCount,5);assert.equal(sb.state.players[1].handCount,6);assert.equal(sb.state.players[1].spark,true);assert.equal(sa.state.players[0].guardianHp,GUARDIAN_MAX_HP);assert.equal(sa.state.players[0].coreHp,CORE_MAX_HP);
  assert.equal(sa.state.players[0].deckCount,25);assert.equal(sb.state.players[1].deckCount,24);
  b.send(JSON.stringify({type:'action',kind:'end'}));const denied=await next(b,'error');assert.match(denied.message,/nem szabályos/);assert.equal(sa.state.active,0);

  const firstRune=sa.state.players[0].hand[0].uid;[sa,sb]=await action(a,{kind:'rune',uid:firstRune},a,b);assert.equal(sa.state.players[0].runes.length,1);assert.equal(sa.state.lastEvent.type,'rune');
  let summoned=false;
  for(let step=0;step<16&&!summoned;step++){
    const active=sa.state.active,ws=active===0?a:b,view=active===0?sa:sb,me=view.state.players[active];
    if(!me.runePlayed&&me.hand.length){[sa,sb]=await action(ws,{kind:'rune',uid:me.hand[0].uid},a,b)}
    const now=active===0?sa:sb,p=now.state.players[active],available=p.runes.filter(r=>!r.used).length;
    if(active===0){const candidate=p.hand.find(c=>(c.type==='creature'||c.type==='structure')&&Math.max(0,c.cost-(c.type==='creature'?p.discount:0))<=available);if(candidate){[sa,sb]=await action(a,{kind:'play',uid:candidate.uid,lane:2},a,b);assert.equal(sa.state.players[0].board.find(c=>c.uid===candidate.uid)?.lane,2);assert.equal(sb.state.players[0].board.find(c=>c.uid===candidate.uid)?.lane,2);summoned=true;break}}
    [sa,sb]=await action(ws,{kind:'end'},a,b);
  }
  assert.equal(summoned,true,'expected a legal lane summon during E2E');
  a.close();b.close();console.log('online e2e: ok');
}finally{child.kill('SIGTERM')}
