import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, placeRune, playCard, attack, endTurn, availableRunes, makeCard, openLanes } from '../engine.js';
const rng = () => 0.42;

function ready(card, lane = 0) { card.exhausted = false; card.lane = lane; return card; }

test('players start with five 5 HP Őrkövek and a 10 HP Mag',()=>{const g=createGame(rng);for(const p of g.players){assert.deepEqual(p.guardians,[5,5,5,5,5]);assert.equal(p.shields,5);assert.equal(p.coreHp,10);assert.equal(p.coreOpen,false)}});

test('a no-target damage spell chips an intact Őrkő instead of the Mag',()=>{const g=createGame(()=>0),p=g.players[0];p.runes=[{used:false},{used:false},{used:false}];const z=makeCard('zivatar');p.hand=[z];assert.equal(playCard(g,0,z.uid),true);assert.deepEqual(g.players[1].guardians,[4,5,5,5,5]);assert.equal(g.players[1].coreHp,10);assert.equal(g.lastEvent.guardianLane,0)});

test('rune placement is once per turn and spends a hand card',()=>{const g=createGame(rng),p=g.players[0],n=p.hand.length,u=p.hand[0].uid;assert.equal(placeRune(g,0,u),true);assert.equal(p.hand.length,n-1);assert.equal(p.runes.length,1);assert.equal(placeRune(g,0,p.hand[0].uid),false)});
test('runes refresh on next own turn',()=>{const g=createGame(rng),p=g.players[0];placeRune(g,0,p.hand[0].uid);p.runes[0].used=true;endTurn(g);endTurn(g);assert.equal(availableRunes(p),1)});
test('summoning requires one of five empty lanes',()=>{const g=createGame(rng),p=g.players[0];p.runes=[{used:false},{used:false}];const c=makeCard('turul');p.hand=[c];assert.equal(playCard(g,0,c.uid),false);assert.equal(playCard(g,0,c.uid,5),false);assert.equal(playCard(g,0,c.uid,2),true);assert.equal(p.board[0].lane,2)});
test('cannot summon onto an occupied lane',()=>{const g=createGame(rng),p=g.players[0];p.runes=[{used:false},{used:false},{used:false},{used:false}];const a=makeCard('liderc'),b=makeCard('turul');a.lane=1;p.board=[a];p.hand=[b];assert.equal(playCard(g,0,b.uid,1),false);assert.ok(openLanes(p).includes(0));assert.ok(!openLanes(p).includes(1))});
test('creature can attack only the opposing lane',()=>{const g=createGame(rng),a=ready(makeCard('turul'),2),wrong=ready(makeCard('liderc'),1),right=ready(makeCard('liderc'),2);g.players[0].board=[a];g.players[1].board=[wrong,right];assert.equal(attack(g,0,a.uid,wrong.uid),false);assert.equal(a.exhausted,false);assert.equal(attack(g,0,a.uid,right.uid),true)});
test('ordinary creature cannot attack an Őrkő through a blocker',()=>{const g=createGame(rng),a=ready(makeCard('turul'),2),b=ready(makeCard('bastya'),2);g.players[0].board=[a];g.players[1].board=[b];assert.equal(attack(g,0,a.uid),false);assert.equal(g.players[1].guardians[2],5);assert.equal(a.exhausted,false)});
test('open lane deals attack power to its Őrkő',()=>{const g=createGame(rng),a=ready(makeCard('turul'),2);g.players[0].board=[a];assert.equal(attack(g,0,a.uid),true);assert.equal(g.players[1].guardians[2],3);assert.equal(g.players[1].shields,5);assert.equal(g.lastEvent.amount,2);assert.equal(g.lastEvent.guardianRemaining,3)});

test('an Őrkő breaks at zero without overflowing into the Mag',()=>{const g=createGame(rng),a=ready(makeCard('sarkany'),2);g.players[0].board=[a];g.players[1].guardians[2]=3;assert.equal(attack(g,0,a.uid),true);assert.equal(g.players[1].guardians[2],0);assert.equal(g.players[1].shields,4);assert.equal(g.players[1].coreHp,10);assert.equal(g.lastEvent.guardianDestroyed,true)});

test('a destroyed lane Őrkő does not expose the Mag while other Őrkövek stand',()=>{const g=createGame(rng),a=ready(makeCard('turul'),2);g.players[0].board=[a];g.players[1].guardians[2]=0;g.players[1].shields=4;assert.equal(attack(g,0,a.uid),false);assert.equal(a.exhausted,false);assert.equal(g.players[1].coreHp,10)});

test('after all five Őrkövek fall, attacks reduce the 10 HP Mag by attack power',()=>{const g=createGame(rng),a=ready(makeCard('betyar'),2);a.bonusAtk=1;g.players[0].board=[a];g.players[1].guardians=[0,0,0,0,0];g.players[1].shields=0;g.players[1].coreOpen=true;assert.equal(attack(g,0,a.uid),true);assert.equal(g.players[1].coreHp,6);assert.equal(g.winner,null);a.exhausted=false;g.players[1].coreHp=4;assert.equal(attack(g,0,a.uid),true);assert.equal(g.players[1].coreHp,0);assert.equal(g.winner,0)});
test('Széljáró can bypass a blocker to damage that lane Őrkő but not the Mag',()=>{const g=createGame(rng),a=ready(makeCard('szellovas'),3),b=ready(makeCard('bastya'),3);g.players[0].board=[a];g.players[1].board=[b];assert.equal(attack(g,0,a.uid),true);assert.equal(g.players[1].guardians[3],3);a.exhausted=false;g.players[1].guardians=[0,0,0,0,0];g.players[1].shields=0;g.players[1].coreOpen=true;assert.equal(attack(g,0,a.uid),false);assert.equal(g.players[1].coreHp,10);assert.equal(g.winner,null)});
test('Rovásbástya is passive and cannot attack',()=>{const g=createGame(rng),b=ready(makeCard('bastya'),0);g.players[0].board=[b];assert.equal(attack(g,0,b.uid),false);assert.equal(b.exhausted,false)});
test('destroyed Rovásbástya replaces itself with a drawn card',()=>{const g=createGame(rng),a=ready(makeCard('sarkany'),0),b=ready(makeCard('bastya'),0);b.damage=1;g.players[0].board=[a];g.players[1].board=[b];const before=g.players[1].hand.length;assert.equal(attack(g,0,a.uid,b.uid),true);assert.equal(g.players[1].board.length,0);assert.equal(g.players[1].hand.length,before+1)});
test('Zivatarige damages the chosen random lane and adjacent lanes',()=>{const g=createGame(rng),p=g.players[0];p.runes=[{used:false},{used:false},{used:false}];const z=makeCard('zivatar');p.hand=[z];const e=g.players[1];e.board=[ready(makeCard('bastya'),0),ready(makeCard('bastya'),1),ready(makeCard('bastya'),2)];g.rng=()=>0.4;assert.equal(playCard(g,0,z.uid),true);assert.equal(e.board.find(c=>c.lane===1).damage,2);assert.equal(e.board.find(c=>c.lane===0).damage,1);assert.equal(e.board.find(c=>c.lane===2).damage,1);assert.equal(g.lastEvent.element,'vihar')});
test('Parázsige leaves delayed fire damage on a survivor',()=>{const g=createGame(rng),p=g.players[0];p.runes=[{used:false},{used:false}];const spell=makeCard('parazs');p.hand=[spell];const target=ready(makeCard('bastya'),0);g.players[1].board=[target];g.rng=()=>0;assert.equal(playCard(g,0,spell.uid),true);assert.equal(target.damage,2);assert.equal(target.burn,1);endTurn(g);assert.equal(target.damage,3);assert.equal(target.burn,0)});

test('Rovásbástya reduces combat damage to an adjacent ally by one',()=>{const g=createGame(rng),a=ready(makeCard('betyar'),1),target=ready(makeCard('turul'),1),wall=ready(makeCard('bastya'),2);a.bonusAtk=0;g.players[0].board=[a];g.players[1].board=[target,wall];assert.equal(attack(g,0,a.uid,target.uid),true);assert.equal(target.damage,2)});

test('Bakonyi Sárkány Áttörése 1 sebzést okoz ugyanazon folyosó Őrkövének',()=>{const g=createGame(rng),a=ready(makeCard('sarkany'),1),target=ready(makeCard('liderc'),1);g.players[0].board=[a];g.players[1].board=[target];assert.equal(attack(g,0,a.uid,target.uid),true);assert.equal(g.players[1].guardians[1],4);assert.equal(g.lastEvent.trampleShield,true)});

test('spell event exposes readable card information for both clients',()=>{const g=createGame(rng),p=g.players[0];p.runes=[{used:false},{used:false}];const spell=makeCard('forras');p.hand=[spell];assert.equal(playCard(g,0,spell.uid),true);assert.equal(g.lastEvent.type,'spell');assert.equal(g.lastEvent.cardName,'Ősforrás');assert.match(g.lastEvent.cardText,/Húzz 1 lapot/)});

test('Ősforrás alacsony kéznél két lapot húz és legfeljebb 1-et gyógyít',()=>{const g=createGame(rng),p=g.players[0];p.runes=[{used:false},{used:false}];const spell=makeCard('forras');p.hand=[spell];const ally=ready(makeCard('turul'),0);ally.damage=2;p.board=[ally];const before=p.deck.length;assert.equal(playCard(g,0,spell.uid),true);assert.equal(p.hand.length,2);assert.equal(p.deck.length,before-2);assert.equal(ally.damage,1)});

test('Ősforrás nagyobb kéznél csak egy lapot húz',()=>{const g=createGame(rng),p=g.players[0];p.runes=[{used:false},{used:false}];const spell=makeCard('forras');p.hand=[spell,makeCard('turul'),makeCard('liderc'),makeCard('betyar'),makeCard('parazs')];const before=p.deck.length;assert.equal(playCard(g,0,spell.uid),true);assert.equal(p.hand.length,5);assert.equal(p.deck.length,before-1)});
test('invalid attack target does not consume attacker action',()=>{const g=createGame(rng),a=ready(makeCard('turul'),0);g.players[0].board=[a];assert.equal(attack(g,0,a.uid,'missing'),false);assert.equal(a.exhausted,false)});
test('üres paklinál minden sikertelen kör eleji húzás fix 1 Kimerülés-sebzést okoz',()=>{const g=createGame(rng);g.players[1].deck=[];assert.equal(endTurn(g),true);assert.equal(g.winner,null);assert.equal(g.players[1].fatigue,1);assert.equal(g.players[1].coreHp,9);assert.equal(g.lastEvent.type,'fatigue');assert.equal(g.lastEvent.amount,1);endTurn(g);endTurn(g);assert.equal(g.players[1].fatigue,2);assert.equal(g.players[1].coreHp,8)});
test('mindkét játékos öt lappal kezd, a második játékos pedig húz az első saját körében',()=>{const g=createGame(rng);assert.equal(g.players[0].hand.length,5);assert.equal(g.players[1].hand.length,5);endTurn(g);assert.equal(g.players[1].hand.length,6)});
test('game events include lane information for summons and attacks',()=>{const g=createGame(rng),p=g.players[0];p.runes=[{used:false},{used:false}];const c=makeCard('turul');p.hand=[c];assert.equal(playCard(g,0,c.uid,4),true);assert.equal(g.lastEvent.lane,4);c.exhausted=false;assert.equal(attack(g,0,c.uid),true);assert.equal(g.lastEvent.lane,4)});

test('default pakli 30 lapos és tartalmazza az új kézgazdasági és taktikai lapokat', async()=>{
  const { DEFAULT_DECK_LIST } = await import('../engine.js');
  assert.equal(DEFAULT_DECK_LIST.length,30);
  for(const id of ['deak','javas','kobzos','rovasvalto','csodaszarvas','ostromlo','orkokovac','betoro','korepesztes']) assert.ok(DEFAULT_DECK_LIST.includes(id));
});

test('Rúnavisszhang a harmadik rúnától kis kéznél visszahúz egy lapot',()=>{
  const g=createGame(rng),p=g.players[0];
  p.runes=[{id:'liderc',name:'Mocsári Lidérc',used:false},{id:'turul',name:'Turul Őrszem',used:false}];
  p.hand=[makeCard('liderc'),makeCard('turul'),makeCard('betyar'),makeCard('forras')];
  p.deck=[makeCard('vasorr')];
  const uid=p.hand[0].uid;
  assert.equal(placeRune(g,0,uid),true);
  assert.equal(p.runes.length,3);
  assert.equal(p.hand.length,4);
  assert.equal(g.lastEvent.runeEcho,true);
  assert.equal(g.telemetry.runeEchoes[0],1);
});

test('Rúnavisszhang nem aktiválódik a második rúnánál',()=>{
  const g=createGame(rng),p=g.players[0];
  p.runes=[{id:'liderc',name:'Mocsári Lidérc',used:false}];
  p.hand=[makeCard('liderc'),makeCard('turul'),makeCard('betyar'),makeCard('forras')];
  p.deck=[makeCard('vasorr')];
  assert.equal(placeRune(g,0,p.hand[0].uid),true);
  assert.equal(p.hand.length,3);
  assert.equal(g.lastEvent.runeEcho,false);
});

test('Rovásíró Deák kis kéznél húz egy lapot',()=>{
  const g=createGame(rng),p=g.players[0];p.runes=[{used:false},{used:false}];
  const c=makeCard('deak');p.hand=[c,makeCard('liderc'),makeCard('forras')];p.deck=[makeCard('turul')];
  assert.equal(playCard(g,0,c.uid,0),true);assert.equal(p.hand.length,3);
});

test('Forrásjáró Javas a saját folyosó sérült Őrkövét gyógyítja, ép Őrkőnél húz',()=>{
  const g=createGame(rng),p=g.players[0];p.runes=[{used:false},{used:false},{used:false}];p.guardians[2]=2;
  let c=makeCard('javas');p.hand=[c];p.deck=[makeCard('turul')];assert.equal(playCard(g,0,c.uid,2),true);assert.equal(p.guardians[2],4);assert.equal(p.hand.length,0);
  const g2=createGame(rng),p2=g2.players[0];p2.runes=[{used:false},{used:false},{used:false}];c=makeCard('javas');p2.hand=[c];p2.deck=[makeCard('turul')];assert.equal(playCard(g2,0,c.uid,2),true);assert.equal(p2.guardians[2],5);assert.equal(p2.hand.length,1);
});

test('Kobzos Hírnök elpusztulásakor lapot húz',()=>{
  const g=createGame(rng),a=ready(makeCard('sarkany'),0),k=ready(makeCard('kobzos'),0);g.players[0].board=[a];g.players[1].board=[k];g.players[1].hand=[];g.players[1].deck=[makeCard('forras')];
  assert.equal(attack(g,0,a.uid,k.uid),true);assert.equal(g.players[1].board.length,0);assert.equal(g.players[1].hand.length,1);
});

test('Rovásváltó visszahozza a legrégebbi rúnát, de csökkenti a rúnaállományt',()=>{
  const g=createGame(rng),p=g.players[0];p.runes=[{id:'forras',name:'Ősforrás',used:false},{id:'liderc',name:'Mocsári Lidérc',used:false},{id:'turul',name:'Turul Őrszem',used:false}];
  const c=makeCard('rovasvalto');p.hand=[c];assert.equal(playCard(g,0,c.uid,1),true);assert.equal(p.runes.length,2);assert.equal(p.hand.length,1);assert.equal(p.hand[0].id,'forras');
});

test('Csodaszarvas körönként egyszer szomszédos üres folyosóra vándorolhat', async()=>{
  const { moveCard } = await import('../engine.js');const g=createGame(rng),c=ready(makeCard('csodaszarvas'),2);g.players[0].board=[c];
  assert.equal(moveCard(g,0,c.uid,4),false);assert.equal(moveCard(g,0,c.uid,3),true);assert.equal(c.lane,3);assert.equal(c.exhausted,false);assert.equal(moveCard(g,0,c.uid,2),false);
  endTurn(g);endTurn(g);assert.equal(c.moved,false);
});

test('Kárpáti Ostromló +1 ostromsebzést okoz Őrkőnek, de Mag ellen nem',()=>{
  const g=createGame(rng),c=ready(makeCard('ostromlo'),0);g.players[0].board=[c];assert.equal(attack(g,0,c.uid),true);assert.equal(g.players[1].guardians[0],2);assert.equal(g.lastEvent.guardianBonus,1);
  c.exhausted=false;g.players[1].guardians=[0,0,0,0,0];g.players[1].shields=0;g.players[1].coreOpen=true;assert.equal(attack(g,0,c.uid),true);assert.equal(g.players[1].coreHp,8);
});

test('Őrkőkovács csak álló, sérült Őrkövet javít',()=>{
  const g=createGame(rng),p=g.players[0];p.runes=[{used:false},{used:false},{used:false}];p.guardians[1]=3;let c=makeCard('orkokovac');p.hand=[c];assert.equal(playCard(g,0,c.uid,1),true);assert.equal(p.guardians[1],5);
  const g2=createGame(rng),p2=g2.players[0];p2.runes=[{used:false},{used:false},{used:false}];p2.guardians[1]=0;c=makeCard('orkokovac');p2.hand=[c];assert.equal(playCard(g2,0,c.uid,1),true);assert.equal(p2.guardians[1],0);
});

test('Parázsló Betörő csak már sérült Őrkő ellen kap +1 sebzést',()=>{
  const g=createGame(rng),c=ready(makeCard('betoro'),0);g.players[0].board=[c];assert.equal(attack(g,0,c.uid),true);assert.equal(g.players[1].guardians[0],2);assert.equal(g.lastEvent.guardianBonus,0);
  c.exhausted=false;assert.equal(attack(g,0,c.uid),true);assert.equal(g.players[1].guardians[0],0);assert.equal(g.lastEvent.guardianBonus,1);
});


test('legfeljebb hét rúna helyezhető le',()=>{const g=createGame(rng),p=g.players[0];p.runes=Array.from({length:7},(_,i)=>({id:'liderc',name:'Mocsári Lidérc',uid:`r${i}`,used:false}));p.hand=[makeCard('turul')];assert.equal(placeRune(g,0,p.hand[0].uid),false);assert.equal(p.hand.length,1)});

test('Kőrepesztés két rúnás ostromige',()=>{assert.equal(makeCard('korepesztes').cost,2)});

test('Kőrepesztés a legsebezhetőbb még álló Őrkövet sebzi védő lény mellett is',()=>{const g=createGame(rng),p=g.players[0];p.runes=[{used:false},{used:false},{used:false}];const spell=makeCard('korepesztes');p.hand=[spell];g.players[1].guardians=[5,2,4,0,5];g.players[1].shields=4;g.players[1].board=[ready(makeCard('bastya'),1)];assert.equal(playCard(g,0,spell.uid),true);assert.equal(g.players[1].guardians[1],0);assert.equal(g.lastEvent.guardianLane,1);assert.equal(g.players[1].board.length,1)});

test('üres kéz és üres pálya önmagában nem okoz azonnali vereséget; a Kimerülés dönt',()=>{
  const g=createGame(rng),p=g.players[0];p.deck=[];p.hand=[];p.board=[];p.runes=[{id:'liderc',name:'Mocsári Lidérc',used:false}];
  const enemy=g.players[1];enemy.board=[ready(makeCard('turul'),0)];
  assert.equal(attack(g,0,enemy.board[0]?.uid||'none'),false);
  assert.equal(g.winner,null);
});


