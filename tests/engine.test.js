import test from 'node:test'; import assert from 'node:assert/strict';
import {createGame,placeRune,playCard,attack,endTurn,availableRunes,makeCard} from '../engine.js';
const rng=()=>0.42;
test('rune placement is once per turn and spends a hand card',()=>{const g=createGame(rng),p=g.players[0],n=p.hand.length,u=p.hand[0].uid;assert.equal(placeRune(g,0,u),true);assert.equal(p.hand.length,n-1);assert.equal(p.runes.length,1);assert.equal(placeRune(g,0,p.hand[0].uid),false)});
test('runes refresh on next own turn',()=>{const g=createGame(rng),p=g.players[0];placeRune(g,0,p.hand[0].uid);p.runes[0].used=true;endTurn(g);endTurn(g);assert.equal(availableRunes(p),1)});
test('direct attack breaks shields then core wins',()=>{const g=createGame(rng),p=g.players[0];const c=makeCard('sarkany');c.exhausted=false;p.board=[c];g.players[1].shields=1;assert.equal(attack(g,0,c.uid),true);assert.equal(g.players[1].shields,0);c.exhausted=false;assert.equal(attack(g,0,c.uid),true);assert.equal(g.winner,0)});
test('combat damage removes defeated creature',()=>{const g=createGame(rng);const a=makeCard('turul'),b=makeCard('lidérc');a.exhausted=false;g.players[0].board=[a];g.players[1].board=[b];attack(g,0,a.uid,b.uid);assert.equal(g.players[1].board.length,0)});
test('cannot play unaffordable card',()=>{const g=createGame(rng),p=g.players[0];const c=makeCard('sarkany');p.hand=[c];assert.equal(playCard(g,0,c.uid),false);assert.equal(p.hand.length,1)});

test('invalid attack target does not consume attacker action',()=>{const g=createGame(rng);const a=makeCard('turul');a.exhausted=false;g.players[0].board=[a];assert.equal(attack(g,0,a.uid,'missing'),false);assert.equal(a.exhausted,false)});

test('player loses when starting a turn with an empty deck',()=>{const g=createGame(rng);g.players[1].deck=[];assert.equal(endTurn(g),true);assert.equal(g.winner,0)});
test('neither player draws on their first own turn',()=>{const g=createGame(rng);assert.equal(g.players[0].hand.length,5);assert.equal(g.players[1].hand.length,5);endTurn(g);assert.equal(g.players[1].hand.length,5);endTurn(g);assert.equal(g.players[0].hand.length,6)});
