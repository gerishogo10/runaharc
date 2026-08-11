import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
const port=8097;
const child=spawn(process.execPath,['server.js'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function next(ws,type){return new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(new Error('timeout '+type)),3000);const h=e=>{const m=JSON.parse(e.data);if(m.type===type){clearTimeout(t);ws.removeEventListener('message',h);resolve(m)}};ws.addEventListener('message',h)})}
async function action(ws,msg,a,b){const pa=next(a,'state'),pb=next(b,'state');ws.send(JSON.stringify({type:'action',...msg}));return Promise.all([pa,pb])}
try{
  await wait(150);
  const a=new WebSocket(`ws://127.0.0.1:${port}/ws`),b=new WebSocket(`ws://127.0.0.1:${port}/ws`);
  await Promise.all([new Promise(r=>a.onopen=r),new Promise(r=>b.onopen=r)]);
  a.send(JSON.stringify({type:'create',name:'A'}));const room=await next(a,'room');assert.equal(room.seat,0);
  const stateA=next(a,'state'),stateB=next(b,'state');b.send(JSON.stringify({type:'join',code:room.code,name:'B'}));
  let [sa,sb]=await Promise.all([stateA,stateB]);
  assert.equal(sa.state.players[0].name,'A');assert.equal(sb.state.players[1].name,'B');assert.equal(sa.state.players[1].hand.length,0);assert.equal(sb.state.players[0].hand.length,0);
  const firstRune=sa.state.players[0].hand[0].uid;[sa,sb]=await action(a,{kind:'rune',uid:firstRune},a,b);assert.equal(sa.state.players[0].runes.length,1);assert.equal(sa.state.lastEvent.type,'rune');
  let summoned=false;
  for(let step=0;step<12&&!summoned;step++){
    const active=sa.state.active;
    const ws=active===0?a:b;const own=active===0?sa:sb;const me=own.state.players[active];
    if(!me.runePlayed&&me.hand.length){[sa,sb]=await action(ws,{kind:'rune',uid:me.hand[0].uid},a,b)}
    const view=active===0?sa:sb;const p=view.state.players[active];const available=p.runes.filter(r=>!r.used).length;
    if(active===0){const candidate=p.hand.find(c=>(c.type==='creature'||c.type==='structure')&&Math.max(0,c.cost-(c.type==='creature'?p.discount:0))<=available);if(candidate){[sa,sb]=await action(a,{kind:'play',uid:candidate.uid,lane:2},a,b);const ownCard=sa.state.players[0].board.find(c=>c.uid===candidate.uid);const seenByOpponent=sb.state.players[0].board.find(c=>c.uid===candidate.uid);assert.equal(ownCard?.lane,2);assert.equal(seenByOpponent?.lane,2);summoned=true;break}}
    [sa,sb]=await action(ws,{kind:'end'},a,b);
  }
  assert.equal(summoned,true,'expected a legal lane summon during E2E');
  a.close();b.close();console.log('online e2e: ok');
}finally{child.kill('SIGTERM')}
