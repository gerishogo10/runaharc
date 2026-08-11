import { cardArtwork } from './art.js';
import { createGame, availableRunes, cardCost, placeRune, playCard, attack, endTurn, aiTakeTurn } from './engine.js';

let game = createGame();
let selected = null;
const $ = id => document.getElementById(id);
const els = Object.fromEntries(['hand','playerBoard','enemyBoard','playerShields','enemyShields','playerRunes','enemyRunes','playerMeta','enemyMeta','turnPill','selectedName','selectedText','actions','log','endTurnBtn','toast','rulesDialog','rulesBtn','closeRules'].map(id=>[id,$(id)]));

function cardEl(card, zone, owner) {
  const el = document.createElement('button'); el.type='button'; el.className=`card ${card.type} ${card.exhausted && zone==='board' ? 'exhausted' : ''} ${selected?.uid===card.uid ? 'selected' : ''}`;
  el.dataset.rarity = card.rarity; el.setAttribute('aria-label', `${card.name}, ${card.cost} rúna${card.type==='creature' ? `, ${card.atk + card.bonusAtk} támadás, ${card.hp-card.damage} életerő` : ''}`);
  el.innerHTML = `<div class="card-top"><span class="cost">${card.cost}</span><span class="card-name">${card.name}</span></div><div class="art">${cardArtwork(card.id)}</div><div class="card-text">${card.text}</div>${card.type==='creature'?`<div class="stats"><span class="atk">⚔ ${card.atk+card.bonusAtk}</span><span class="hp">♥ ${Math.max(0,card.hp-card.damage)}</span></div>`:''}<i class="rarity-gem" aria-hidden="true"></i>`;
  el.onclick = () => select(card, zone, owner); return el;
}
function renderShields(el, count) { el.innerHTML=''; for(let i=0;i<5;i++){const s=document.createElement('i');s.className=`shield ${i>=count?'broken':''}`;el.appendChild(s);} }
function renderRunes(el,p){ el.textContent=`RÚNA ${availableRunes(p)} / ${p.runes.length}`; }
function render(){
  const p=game.players[0],e=game.players[1];
  els.hand.replaceChildren(...p.hand.map(c=>cardEl(c,'hand',0))); els.playerBoard.replaceChildren(...p.board.map(c=>cardEl(c,'board',0))); els.enemyBoard.replaceChildren(...e.board.map(c=>cardEl(c,'board',1)));
  renderShields(els.playerShields,p.shields);renderShields(els.enemyShields,e.shields);renderRunes(els.playerRunes,p);renderRunes(els.enemyRunes,e);
  els.playerMeta.textContent=`${p.hand.length} kézlap · ${p.deck.length} pakli`;els.enemyMeta.textContent=`${e.hand.length} kézlap · ${e.deck.length} pakli`;
  els.turnPill.textContent=game.winner!==null?`${game.players[game.winner].name} győzött`:`${game.turn}. kör · ${game.active===0?'Te':'Ellenfél'}`;
  els.endTurnBtn.disabled=game.active!==0||game.winner!==null;
  els.log.innerHTML=game.log.slice(0,5).map(x=>`<span>${x}</span>`).join('');
  renderActions();
  if(game.winner!==null) toast(`${game.players[game.winner].name} megnyerte a párbajt.`);
}
function select(card,zone,owner){ selected={...card,zone,owner}; render(); }
function clearSelection(){selected=null;render();}
function button(label,cls,fn){const b=document.createElement('button');b.type='button';b.className=`action-btn ${cls||''}`;b.textContent=label;b.onclick=fn;return b;}
function renderActions(){
  els.actions.innerHTML='';
  if(!selected){els.selectedName.textContent='Nincs kiválasztott lap';els.selectedText.textContent='Válassz egy lapot a kezedből vagy egy támadásra kész lényt.';return;}
  els.selectedName.textContent=selected.name;els.selectedText.textContent=selected.text;
  const p=game.players[0];
  if(game.active!==0||game.winner!==null)return;
  if(selected.zone==='hand'&&selected.owner===0){
    const live=p.hand.find(c=>c.uid===selected.uid); if(!live)return;
    if(!p.runePlayed) els.actions.append(button('RÚNÁVÁ TESZEM','',()=>{placeRune(game,0,live.uid);clearSelection();}));
    if(availableRunes(p)>=cardCost(p,live)) els.actions.append(button(`KIJÁTSZOM · ${cardCost(p,live)} RÚNA`,'primary',()=>{if(playCard(game,0,live.uid)){clearSelection();}}));
  }
  if(selected.zone==='board'&&selected.owner===0){
    const live=p.board.find(c=>c.uid===selected.uid);if(!live||live.exhausted)return;
    els.actions.append(button(game.players[1].shields>0?'ŐRKŐ TÁMADÁSA':'MAG TÁMADÁSA','warn',()=>{attack(game,0,live.uid);clearSelection();}));
    game.players[1].board.forEach(t=>els.actions.append(button(`↳ ${t.name}`,'',()=>{attack(game,0,live.uid,t.uid);clearSelection();})));
  }
}
function toast(msg){els.toast.textContent=msg;els.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>els.toast.classList.remove('show'),1800)}
els.endTurnBtn.onclick=()=>{if(endTurn(game)){selected=null;render();setTimeout(()=>{aiTakeTurn(game);render();},550)}};
els.rulesBtn.onclick=()=>els.rulesDialog.showModal();els.closeRules.onclick=()=>els.rulesDialog.close();
els.rulesDialog.addEventListener('click',e=>{if(e.target===els.rulesDialog)els.rulesDialog.close()});
window.addEventListener('keydown',e=>{if(e.key==='Escape'){selected=null;render();}if(e.key==='Enter'&&game.active===0&&!game.winner)els.endTurnBtn.click();});
render();
