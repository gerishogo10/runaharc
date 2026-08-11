let audioContext = null;
let soundOn = true;
try { soundOn = localStorage.getItem('runaharc-sound') !== 'off'; } catch {}

function getAudioContext() {
  if (!audioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioContext = new Ctx();
  }
  return audioContext;
}

export function primeAudio() {
  const ctx = getAudioContext();
  if (ctx?.state === 'suspended') ctx.resume().catch(() => {});
}

export function setSoundEnabled(value) {
  soundOn = Boolean(value);
  try { localStorage.setItem('runaharc-sound', soundOn ? 'on' : 'off'); } catch {}
  if (soundOn) primeAudio();
  return soundOn;
}

export function isSoundEnabled() { return soundOn; }

function tone({freq=220, endFreq=freq, duration=.12, type='sine', gain=.055, delay=0}) {
  if (!soundOn) return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') return;
  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), start + duration);
  amp.gain.setValueAtTime(.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + .012);
  amp.gain.exponentialRampToValueAtTime(.0001, start + duration);
  osc.connect(amp).connect(ctx.destination);
  osc.start(start); osc.stop(start + duration + .02);
}

function noise(duration=.08, gain=.035, delay=0) {
  if (!soundOn) return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') return;
  const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i=0;i<length;i++) data[i]=(Math.random()*2-1)*(1-i/length);
  const source=ctx.createBufferSource(), amp=ctx.createGain(), filter=ctx.createBiquadFilter();
  filter.type='bandpass';filter.frequency.value=680;filter.Q.value=.8; amp.gain.value=gain;
  source.buffer=buffer;source.connect(filter).connect(amp).connect(ctx.destination);
  const start=ctx.currentTime+delay;source.start(start);source.stop(start+duration+.01);
}

export function playSound(kind) {
  if (!soundOn) return;
  primeAudio();
  if (kind === 'rune') {
    tone({freq:720,endFreq:980,duration:.12,type:'sine',gain:.035});
    tone({freq:1080,endFreq:1320,duration:.11,type:'triangle',gain:.018,delay:.045});
  } else if (kind === 'summon') {
    tone({freq:135,endFreq:260,duration:.22,type:'triangle',gain:.045});
    tone({freq:390,endFreq:610,duration:.16,type:'sine',gain:.025,delay:.08});
  } else if (kind === 'spell') {
    tone({freq:520,endFreq:190,duration:.24,type:'sawtooth',gain:.035});
    noise(.16,.018,.03);
  } else if (kind === 'attack') {
    tone({freq:170,endFreq:62,duration:.16,type:'sawtooth',gain:.05});
    noise(.11,.045,.025);
  } else if (kind === 'shield') {
    tone({freq:180,endFreq:70,duration:.16,type:'square',gain:.04});
    tone({freq:940,endFreq:430,duration:.2,type:'triangle',gain:.026,delay:.035});
    noise(.15,.035,.02);
  } else if (kind === 'core') {
    tone({freq:95,endFreq:42,duration:.4,type:'sawtooth',gain:.055});
    tone({freq:330,endFreq:110,duration:.34,type:'triangle',gain:.03,delay:.04});
    noise(.24,.045,.02);
  } else if (kind === 'victory') {
    [392,523.25,659.25].forEach((freq,i)=>tone({freq,endFreq:freq*1.02,duration:.34,type:'triangle',gain:.028,delay:i*.08}));
  }
}

function pulse(el, cls, duration=560) {
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  window.setTimeout(()=>el.classList.remove(cls), duration);
}

export function playGameEvent(event, viewerSeat=0) {
  if (!event) return;
  const arena=document.getElementById('arena') || document.querySelector('.arena');
  const actorIsViewer=event.playerIndex===viewerSeat;
  const actorCard=event.attackerUid ? document.querySelector(`[data-uid="${event.attackerUid}"]`) : null;
  const targetCard=event.targetUid ? document.querySelector(`[data-uid="${event.targetUid}"]`) : null;
  if (event.type === 'rune') {
    playSound('rune'); pulse(actorIsViewer?document.getElementById('playerRunes'):document.getElementById('enemyRunes'),'fx-rune',500);
  } else if (event.type === 'summon') {
    playSound('summon');
    const summoned=event.cardUid ? document.querySelector(`[data-uid="${event.cardUid}"]`) : null;
    pulse(summoned,'fx-summon',650);
  } else if (event.type === 'spell') {
    playSound('spell'); pulse(arena,'fx-spell',620);
  } else if (event.type === 'attack') {
    playSound(event.targetKind==='shield'?'shield':event.targetKind==='core'?'core':'attack');
    pulse(actorCard,'fx-attack',520); pulse(targetCard,'fx-hit',520);
    pulse(arena,event.targetKind==='shield'?'fx-shield':event.targetKind==='core'?'fx-core':'fx-combat',620);
  } else if (event.type === 'victory') {
    playSound('victory'); pulse(arena,'fx-victory',1000);
  }
}
