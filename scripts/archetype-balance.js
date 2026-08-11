import { createGame, botTakeTurn, PRESET_DECKS } from '../engine.js';
function rngFrom(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296}}
const perPair=Number(process.env.PER_PAIR||2500);const styles=['aggro','value','control'];const entries=Object.entries(PRESET_DECKS);const results={};let total=0,timeouts=0,turns=0,fatigueWins=0,coreWins=0;
function run(g,style){let guard=0;while(g.winner===null&&guard++<180)botTakeTurn(g,g.active,style);return g.winner!==null}
for(let i=0;i<entries.length;i++)for(let j=i;j<entries.length;j++){
  const [ka,a]=entries[i],[kb,b]=entries[j];const key=`${ka}__${kb}`;let games=0,winsA=0,winsB=0,p1wins=0,pairTurns=0,pairFatigue=0;
  const directions=i===j?1:2;
  for(let d=0;d<directions;d++)for(let n=0;n<perPair;n++){
    const swap=d===1;const d0=swap?b.cards:a.cards,d1=swap?a.cards:b.cards;const rng=rngFrom((((i+1)*73856093)^((j+1)*19349663)^((d+1)*83492791)^((n+1)*2654435761))>>>0);const g=createGame(rng,['A','B'],[d0,d1]);const style=styles[(n+d+i+j)%styles.length];
    if(!run(g,style)){timeouts++;continue}games++;total++;turns+=g.turn;pairTurns+=g.turn;if(g.winner===0)p1wins++;const logicalWinner=swap?1-g.winner:g.winner;if(logicalWinner===0)winsA++;else winsB++;if(g.lastEvent?.type==='victory'&&g.lastEvent.reason==='fatigue'){fatigueWins++;pairFatigue++}else coreWins++;
  }
  results[key]={a:ka,b:kb,games,winsA,winsB,winRateA:games?winsA/games:null,firstPlayerWinRate:games?p1wins/games:null,averageTurn:games?pairTurns/games:null,fatigueRate:games?pairFatigue/games:null};
}
console.log(JSON.stringify({perPair,total,timeouts,averageTurn:total?turns/total:null,firstNote:'Non-mirror pairings are run in both seat directions.',winCauses:{core:coreWins,fatigue:fatigueWins},matchups:results},null,2));
