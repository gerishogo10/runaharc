import { createGame, botTakeTurn, CARD_LIBRARY, DEFAULT_DECK_LIST } from '../engine.js';

function rngFrom(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296}}
const mirrorGames=Number(process.env.GAMES||100000), diverseGames=Number(process.env.DIVERSE_GAMES||0), styles=['aggro','value','control'];
const rec=Object.fromEntries(Object.keys(CARD_LIBRARY).map(id=>[id,{plays:0,playersPlaying:0,winsWhenPlayed:0,runes:0}]));
const wins=[0,0],byStyle=Object.fromEntries(styles.map(s=>[s,{games:0,wins:[0,0],turns:0}]));let turns=0,timeouts=0;
function runGame(g,style){let guard=0;while(g.winner===null&&guard++<140)botTakeTurn(g,g.active,style);return g.winner!==null}
for(let n=1;n<=mirrorGames;n++){
  const rng=rngFrom((n*2654435761)>>>0),g=createGame(rng),style=styles[n%styles.length];
  if(!runGame(g,style)){timeouts++;continue}
  wins[g.winner]++;turns+=g.turn;const bs=byStyle[style];bs.games++;bs.wins[g.winner]++;bs.turns+=g.turn;
  for(let i=0;i<2;i++){
    const set=new Set(g.telemetry.plays[i]);for(const id of g.telemetry.plays[i])rec[id].plays++;
    for(const id of set){rec[id].playersPlaying++;if(g.winner===i)rec[id].winsWhenPlayed++}
    for(const id of g.telemetry.runes[i])rec[id].runes++;
  }
}
const totalPlays=Object.values(rec).reduce((a,x)=>a+x.plays,0);
for(const r of Object.values(rec)){r.winRateWhenPlayed=r.playersPlaying?r.winsWhenPlayed/r.playersPlaying:null;r.playShare=totalPlays?r.plays/totalPlays:0}
for(const s of styles){const x=byStyle[s];x.firstPlayerWinRate=x.games?x.wins[0]/x.games:null;x.averageTurn=x.games?x.turns/x.games:null}

function randomDeck(rng){
  const ids=Object.keys(CARD_LIBRARY);let attempts=0;
  while(attempts++<100){
    const deck=[],counts={};
    while(deck.length<20){const id=ids[Math.floor(rng()*ids.length)];if((counts[id]||0)>=3)continue;counts[id]=(counts[id]||0)+1;deck.push(id)}
    const board=deck.filter(id=>CARD_LIBRARY[id].type!=='spell').length;
    const cheap=deck.filter(id=>CARD_LIBRARY[id].cost<=2).length;
    if(board>=10&&board<=15&&cheap>=5)return deck;
  }
  return [...DEFAULT_DECK_LIST];
}
const diverse=Object.fromEntries(Object.keys(CARD_LIBRARY).map(id=>[id,{playerDecks:0,wins:0,totalCopies:0,winnerCopies:0,loserCopies:0}]));
let diverseCompleted=0,diverseTimeouts=0,diverseTurns=0;
for(let n=1;n<=diverseGames;n++){
  const rng=rngFrom(((n+mirrorGames)*2246822519)>>>0),d0=randomDeck(rng),d1=randomDeck(rng),g=createGame(rng,['A','B'],[d0,d1]),style=styles[n%styles.length];
  if(!runGame(g,style)){diverseTimeouts++;continue}diverseCompleted++;diverseTurns+=g.turn;
  const loser=1-g.winner;
  for(let i=0;i<2;i++){
    const counts=g.players[i].deck.concat(g.players[i].hand,g.players[i].board.map(c=>c.id),g.players[i].runes.map(r=>r.id));
    // Use original deck lists because runtime zones can omit destroyed or spent spells.
    const original=i===0?d0:d1;const copyMap={};for(const id of original)copyMap[id]=(copyMap[id]||0)+1;
    for(const [id,copies] of Object.entries(copyMap)){const r=diverse[id];r.playerDecks++;r.totalCopies+=copies;if(g.winner===i)r.wins++}
  }
  const wc={};for(const id of (g.winner===0?d0:d1))wc[id]=(wc[id]||0)+1;const lc={};for(const id of (loser===0?d0:d1))lc[id]=(lc[id]||0)+1;
  for(const id of Object.keys(CARD_LIBRARY)){diverse[id].winnerCopies+=wc[id]||0;diverse[id].loserCopies+=lc[id]||0}
}
for(const r of Object.values(diverse)){r.winRateWhenPresent=r.playerDecks?r.wins/r.playerDecks:null;r.copyDeltaPerGame=diverseCompleted?(r.winnerCopies-r.loserCopies)/diverseCompleted:0;r.averageCopiesWhenPresent=r.playerDecks?r.totalCopies/r.playerDecks:null}

console.log(JSON.stringify({mirror:{games:mirrorGames,completed:mirrorGames-timeouts,timeouts,wins,firstPlayerWinRate:wins[0]/Math.max(1,mirrorGames-timeouts),averageTurn:turns/Math.max(1,mirrorGames-timeouts),byStyle,cards:rec},diverse:{games:diverseGames,completed:diverseCompleted,timeouts:diverseTimeouts,averageTurn:diverseCompleted?diverseTurns/diverseCompleted:null,cards:diverse}},null,2));
