import { createGame, botTakeTurn, CARD_LIBRARY, DEFAULT_DECK_LIST, DECK_SIZE } from '../engine.js';

function rngFrom(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296}}
const mirrorGames=Number(process.env.GAMES||100000), diverseGames=Number(process.env.DIVERSE_GAMES||0), styles=['aggro','value','control'];
const cardIds=Object.keys(CARD_LIBRARY);
const rec=Object.fromEntries(cardIds.map(id=>[id,{plays:0,playersPlaying:0,winsWhenPlayed:0,runes:0}]));
const wins=[0,0],winCauses={core:0,fatigue:0,other:0},byStyle=Object.fromEntries(styles.map(s=>[s,{games:0,wins:[0,0],turns:0}]));let turns=0,timeouts=0;
const handEconomy={turn6:{samples:0,total:0,low:0},turn8:{samples:0,total:0,low:0},echoes:0};
function sampleHand(bucket,hand){bucket.samples++;bucket.total+=hand; if(hand<=2)bucket.low++}
function runGame(g,style,trackEconomy=false){let guard=0;const ownTurns=[0,0];while(g.winner===null&&guard++<180){const active=g.active;ownTurns[active]++;if(trackEconomy){if(ownTurns[active]===6)sampleHand(handEconomy.turn6,g.players[active].hand.length);if(ownTurns[active]===8)sampleHand(handEconomy.turn8,g.players[active].hand.length)}botTakeTurn(g,active,style)}if(trackEconomy)handEconomy.echoes+=(g.telemetry?.runeEchoes?.[0]||0)+(g.telemetry?.runeEchoes?.[1]||0);return g.winner!==null}
for(let n=1;n<=mirrorGames;n++){
  const rng=rngFrom((n*2654435761)>>>0),g=createGame(rng),style=styles[n%styles.length];
  if(!runGame(g,style,true)){timeouts++;continue}
  wins[g.winner]++;turns+=g.turn;const last=g.lastEvent;if(last?.type==='attack'&&last.targetKind==='core'&&last.coreDestroyed)winCauses.core++;else if(last?.type==='victory'&&last.reason==='fatigue')winCauses.fatigue++;else winCauses.other++;const bs=byStyle[style];bs.games++;bs.wins[g.winner]++;bs.turns+=g.turn;
  for(let i=0;i<2;i++){
    const set=new Set(g.telemetry.plays[i]);for(const id of g.telemetry.plays[i])rec[id].plays++;
    for(const id of set){rec[id].playersPlaying++;if(g.winner===i)rec[id].winsWhenPlayed++}
    for(const id of g.telemetry.runes[i])if(rec[id])rec[id].runes++;
  }
}
const totalPlays=Object.values(rec).reduce((a,x)=>a+x.plays,0);
for(const r of Object.values(rec)){r.winRateWhenPlayed=r.playersPlaying?r.winsWhenPlayed/r.playersPlaying:null;r.playShare=totalPlays?r.plays/totalPlays:0}
for(const s of styles){const x=byStyle[s];x.firstPlayerWinRate=x.games?x.wins[0]/x.games:null;x.averageTurn=x.games?x.turns/x.games:null}
for(const b of [handEconomy.turn6,handEconomy.turn8]){b.average=b.samples?b.total/b.samples:null;b.lowRate=b.samples?b.low/b.samples:null}
handEconomy.echoesPerGame=mirrorGames-timeouts?handEconomy.echoes/(mirrorGames-timeouts):null;

function randomDeck(rng){
  const ids=cardIds;let attempts=0;
  while(attempts++<120){
    const deck=[],counts={};
    while(deck.length<DECK_SIZE){const id=ids[Math.floor(rng()*ids.length)];if((counts[id]||0)>=3)continue;counts[id]=(counts[id]||0)+1;deck.push(id)}
    const board=deck.filter(id=>CARD_LIBRARY[id].type!=='spell').length;
    const cheap=deck.filter(id=>CARD_LIBRARY[id].cost<=2).length;
    const drawish=deck.filter(id=>['taltos','forras','deak','javas','kobzos','rovasvalto','bastya'].includes(id)).length;
    if(board>=18&&board<=25&&cheap>=7&&drawish<=12)return deck;
  }
  return [...DEFAULT_DECK_LIST];
}
const diverse=Object.fromEntries(cardIds.map(id=>[id,{playerDecks:0,wins:0,totalCopies:0,winnerCopies:0,loserCopies:0}]))
let diverseCompleted=0,diverseTimeouts=0,diverseTurns=0;
for(let n=1;n<=diverseGames;n++){
  const rng=rngFrom(((n+mirrorGames)*2246822519)>>>0),d0=randomDeck(rng),d1=randomDeck(rng),g=createGame(rng,['A','B'],[d0,d1]),style=styles[n%styles.length];
  if(!runGame(g,style,false)){diverseTimeouts++;continue}diverseCompleted++;diverseTurns+=g.turn;
  const loser=1-g.winner;
  for(let i=0;i<2;i++){
    const original=i===0?d0:d1;const copyMap={};for(const id of original)copyMap[id]=(copyMap[id]||0)+1;
    for(const [id,copies] of Object.entries(copyMap)){const r=diverse[id];r.playerDecks++;r.totalCopies+=copies;if(g.winner===i)r.wins++}
  }
  const wc={};for(const id of (g.winner===0?d0:d1))wc[id]=(wc[id]||0)+1;const lc={};for(const id of (loser===0?d0:d1))lc[id]=(lc[id]||0)+1;
  for(const id of cardIds){diverse[id].winnerCopies+=wc[id]||0;diverse[id].loserCopies+=lc[id]||0}
}
for(const r of Object.values(diverse)){r.winRateWhenPresent=r.playerDecks?r.wins/r.playerDecks:null;r.copyDeltaPerGame=diverseCompleted?(r.winnerCopies-r.loserCopies)/diverseCompleted:0;r.averageCopiesWhenPresent=r.playerDecks?r.totalCopies/r.playerDecks:null}

console.log(JSON.stringify({deckSize:DECK_SIZE,mirror:{games:mirrorGames,completed:mirrorGames-timeouts,timeouts,wins,firstPlayerWinRate:wins[0]/Math.max(1,mirrorGames-timeouts),averageTurn:turns/Math.max(1,mirrorGames-timeouts),winCauses,byStyle,handEconomy,cards:rec},diverse:{games:diverseGames,completed:diverseCompleted,timeouts:diverseTimeouts,averageTurn:diverseCompleted?diverseTurns/diverseCompleted:null,cards:diverse}},null,2));
