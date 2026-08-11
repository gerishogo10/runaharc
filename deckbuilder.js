import { cardArtwork } from './art.js';
import { CARD_LIBRARY, DEFAULT_DECK_LIST, DECK_SIZE, MAX_COPIES, MAX_DECK_ELEMENTS, PRESET_DECKS, validateDeckList } from './engine.js';

export const DECK_STORAGE_KEY = 'runaharc.deck.v11';
const $ = id => document.getElementById(id);
const elementNames = { tuz:'TŰZ', vihar:'VIHAR', fold:'FÖLD', viz:'VÍZ', szellem:'SZELLEM', semleges:'SEMLEGES' };
let deck = loadSavedDeck();
let filter = 'all';

export function loadSavedDeck() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DECK_STORAGE_KEY) || 'null');
    if (validateDeckList(parsed).ok) return [...parsed];
  } catch {}
  return [...DEFAULT_DECK_LIST];
}
export function saveDeckList(list) { localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(list)); }

function counts() { return deck.reduce((m,id)=>(m[id]=(m[id]||0)+1,m),{}); }
function toast(message) { const el=$('toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove('show'),1900); }
function add(id) {
  const c=counts(); if ((c[id]||0)>=MAX_COPIES || deck.length>=DECK_SIZE) return;
  const candidate=[...deck,id]; const v=validateDeckList(candidate);
  const tooManyElements=v.elements.length>MAX_DECK_ELEMENTS;
  if (tooManyElements) return toast('Ez már egy harmadik elemet adna a paklihoz.');
  deck=candidate; render();
}
function remove(id) { const i=deck.lastIndexOf(id); if(i>=0){deck.splice(i,1);render();} }
function applyPreset(key){ deck=[...PRESET_DECKS[key].cards]; render(); toast(`${PRESET_DECKS[key].name} betöltve.`); }
function cardTile(card,copies){
  const type=card.type==='creature'?'LÉNY':card.type==='structure'?'BÁSTYA':'IGE';
  const stats=card.type==='creature'?`⚔ ${card.atk} · ♥ ${card.hp}`:card.type==='structure'?`🛡 ${card.hp}`:'';
  return `<article class="builder-card element-${card.element}"><div class="builder-art">${cardArtwork(card.id,`deck-${card.id}`)}</div><div class="builder-card-body"><div class="builder-card-title"><span class="cost">${card.cost}</span><div><b>${card.name}</b><small>${type} · ${elementNames[card.element]}${stats?` · ${stats}`:''}</small></div><strong>${copies}/3</strong></div><p>${card.text}</p><div class="builder-controls"><button type="button" data-remove="${card.id}" ${copies===0?'disabled':''}>−</button><button type="button" data-add="${card.id}" ${copies>=MAX_COPIES||deck.length>=DECK_SIZE?'disabled':''}>+</button></div></div></article>`;
}
function render(){
  const c=counts(); const validation=validateDeckList(deck);
  $('deckCount').textContent=`${deck.length} / ${DECK_SIZE}`;
  $('deckStatus').textContent=`${deck.length}/${DECK_SIZE} lap · ${validation.elements.map(x=>elementNames[x]).join(' + ')||'nincs elem'} · max. ${MAX_COPIES} példány`;
  $('deckElements').innerHTML=validation.elements.map(x=>`<span>${elementNames[x]}</span>`).join('') || '<span>Válassz legfeljebb 2 elemet</span>';
  $('deckErrors').textContent=validation.ok?'A pakli szabályos és menthető.':validation.errors.join(' ');
  $('deckErrors').classList.toggle('ok',validation.ok);
  $('saveDeck').disabled=!validation.ok;
  $('deckList').innerHTML=Object.entries(c).sort((a,b)=>CARD_LIBRARY[a[0]].cost-CARD_LIBRARY[b[0]].cost||CARD_LIBRARY[a[0]].name.localeCompare(CARD_LIBRARY[b[0]].name,'hu')).map(([id,n])=>`<button type="button" data-remove="${id}"><span>${n}×</span><b>${CARD_LIBRARY[id].name}</b><small>${CARD_LIBRARY[id].cost} rúna · ${elementNames[CARD_LIBRARY[id].element]}</small></button>`).join('');
  const cards=Object.values(CARD_LIBRARY).filter(card=>filter==='all'||card.element===filter).sort((a,b)=>a.cost-b.cost||a.name.localeCompare(b.name,'hu'));
  $('collectionGrid').innerHTML=cards.map(card=>cardTile(card,c[card.id]||0)).join('');
  document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>add(b.dataset.add));
  document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>remove(b.dataset.remove));
}

$('deckPresets').innerHTML=Object.entries(PRESET_DECKS).map(([key,p])=>`<button type="button" data-preset="${key}"><b>${p.name}</b><small>${p.description}</small></button>`).join('');
document.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>applyPreset(b.dataset.preset));
$('clearDeck').onclick=()=>{deck=[];render();};
$('elementFilter').onchange=e=>{filter=e.target.value;render();};
$('saveDeck').onclick=()=>{const v=validateDeckList(deck);if(!v.ok)return toast(v.errors[0]);saveDeckList(deck);toast('Pakli elmentve. Az online és AI mód ezt fogja használni.');};
render();
