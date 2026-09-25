(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const {storageKey,cleanAnswers,stats,answer} = HuntGame;
  const total=STATIONS.length, riskTotal=STATIONS.filter(s=>s.risk).length;
  let mode='stand', answers={}, demoAnswers={}, station=null, stream=null, frame=0, cameraToken=0;
  let detector=null, lastScan=0, stableId=null, stableCount=0, scanCooldown=0;
  const capture=document.createElement('canvas');
  const captureContext=capture.getContext('2d',{willReadFrequently:true});
  const symbols={plant:'🪴',bucket:'🪣',flowers:'💐',can:'💧',jar:'🥫',bottle:'🍶',sand:'🏖️',leaves:'🍂'};
  function readSaved(){try{return cleanAnswers(JSON.parse(localStorage.getItem(storageKey)),STATIONS);}catch{return {};}}
  function persist(){if(mode==='demo'){demoAnswers={...answers};return;}try{localStorage.setItem(storageKey,JSON.stringify(answers));}catch{$('announcement').textContent='Il browser non permette di salvare i progressi. Puoi continuare a giocare in questa pagina.';}}
  function view(name){for(const id of ['home','play','results']) $(id).hidden=id!==name;window.scrollTo(0,0);}
  function updateSaved(){const n=stats(readSaved(),STATIONS).done;$('saved').hidden=!n;$('saved').textContent=n===total?'Hai già completato la caccia. Riapri i tuoi risultati.':`Hai già esplorato ${n} stazioni. Riprendi da dove eri rimasto.`;$('start').innerHTML=n?'Riprendi la caccia <span aria-hidden="true">↗</span>':'Inizia la caccia <span aria-hidden="true">↗</span>';}
  function refresh(){
    const s=stats(answers,STATIONS);$('score').textContent=s.score;$('progress-text').textContent=`${s.done} / ${total} esplorati`;$('progress-bar').style.width=`${s.done/total*100}%`;$('found-count').textContent=`${s.found} / ${riskTotal} focolai`;
    $('journal-list').innerHTML=STATIONS.map(item=>{const done=Object.hasOwn(answers,item.id),correct=done&&answers[item.id]===item.risk;return `<button class="journal-row ${done?'done':''} ${done&&!correct?'wrong':''}" data-review="${item.id}" ${done?'':'disabled'}><span class="journal-number">${done?(correct?'✓':'!'):item.code}</span><span>${done?item.name:`Stazione ${item.code}`}<small>${done?(item.risk?'Potenziale focolaio':'Falso amico'):'Ancora da esplorare'}</small></span>${done?`<span class="row-score">${correct?'+100':'0'} PT</span>`:''}</button>`;}).join('');
    $('demo-stations').innerHTML=STATIONS.map(item=>`<button class="demo-station ${Object.hasOwn(answers,item.id)?'visited':''}" data-demo="${item.id}" aria-label="Esplora stazione ${item.code}">${item.code}${Object.hasOwn(answers,item.id)?' ✓':''}</button>`).join('');
  }
  function begin(nextMode){stopCamera();mode=nextMode;answers=mode==='demo'?{...demoAnswers}:readSaved();$('mode-label').textContent=mode==='demo'?'MODALITÀ DEMO':'CACCIA ALLO STAND';$('demo-picker').hidden=mode!=='demo';$('scanner').hidden=mode==='demo';$('manual-form').hidden=true;$('manual-error').textContent='';$('manual-toggle').hidden=mode==='demo';refresh();if(stats(answers,STATIONS).complete){finish();return;}view('play');if(mode==='stand')startCamera();}
  function cameraMessage(message){$('camera-message').textContent=message;$('camera-placeholder').hidden=false;$('scan-label').hidden=true;}
  function stopCamera(){cameraToken++;cancelAnimationFrame(frame);if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;$('video').srcObject=null;$('camera-stop').hidden=true;$('camera-start').disabled=false;$('camera-start').textContent='Attiva fotocamera';$('overlay').getContext('2d').clearRect(0,0,$('overlay').width,$('overlay').height);stableId=null;stableCount=0;cameraMessage('Attiva la fotocamera e inquadra un marker dello stand.');}
  async function startCamera(){
    if(stream)return;
    if(!window.isSecureContext || !navigator.mediaDevices?.getUserMedia){cameraMessage('La fotocamera richiede un sito HTTPS (oppure localhost sul computer). Puoi continuare inserendo il codice della stazione.');$('manual-form').hidden=false;return;}
    const token=++cameraToken;$('camera-start').disabled=true;$('camera-start').textContent='Apertura…';
    try{
      if(!detector)detector=new AR.Detector({dictionaryName:'ARUCO_MIP_36h12',maxHammingDistance:3});
      const acquired=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}}});
      if(token!==cameraToken){acquired.getTracks().forEach(t=>t.stop());return;}
      stream=acquired;$('video').srcObject=stream;await $('video').play();
      if(token!==cameraToken)return;
      stream.getVideoTracks()[0].addEventListener('ended',()=>{if(token!==cameraToken)return;stopCamera();cameraMessage('La fotocamera si è interrotta. Riattivala o usa il codice della stazione.');});
      $('camera-placeholder').hidden=true;$('camera-stop').hidden=false;$('scan-label').hidden=false;$('scan-label').textContent='Inquadra un marker, tenendo fermo il telefono';lastScan=0;frame=requestAnimationFrame(tick);
    }catch(error){
      if(token!==cameraToken)return;stopCamera();
      const messages={NotAllowedError:'Accesso alla fotocamera non consentito. Puoi abilitarlo nelle impostazioni del browser oppure inserire il codice della stazione.',NotFoundError:'Non è stata trovata una fotocamera. Inserisci il codice della stazione per giocare.',NotReadableError:'La fotocamera è occupata da un’altra app. Chiudila e riprova, oppure usa il codice della stazione.'};
      cameraMessage(messages[error.name] || 'Non riesco ad avviare la fotocamera. Riprova oppure inserisci il codice della stazione.');$('manual-form').hidden=false;
    }finally{if(token===cameraToken){$('camera-start').disabled=false;$('camera-start').textContent='Attiva fotocamera';}}
  }
  function tick(time){
    if(!stream)return;frame=requestAnimationFrame(tick);
    if(time-lastScan<130||$('video').readyState<2||$('station-dialog').open)return;
    lastScan=time;const video=$('video');const scale=Math.min(1,640/video.videoWidth);capture.width=Math.round(video.videoWidth*scale);capture.height=Math.round(video.videoHeight*scale);if(!capture.width||!capture.height)return;
    try{
      captureContext.drawImage(video,0,0,capture.width,capture.height);
      const markers=detector.detect(captureContext.getImageData(0,0,capture.width,capture.height));
      const known=markers.filter(m=>STATIONS.some(s=>s.id===m.id));
      const overlay=$('overlay');overlay.width=capture.width;overlay.height=capture.height;const ctx=overlay.getContext('2d');
      for(const marker of known){ctx.strokeStyle='#b5ee65';ctx.lineWidth=4;ctx.beginPath();marker.corners.forEach((c,i)=>i?ctx.lineTo(c.x,c.y):ctx.moveTo(c.x,c.y));ctx.closePath();ctx.stroke();}
      const candidate=known.find(m=>!Object.hasOwn(answers,m.id));
      if(candidate){const s=STATIONS.find(s=>s.id===candidate.id);$('scan-label').textContent=`Stazione ${s.code} trovata · tieni fermo il telefono`;if(stableId===candidate.id)stableCount++;else{stableId=candidate.id;stableCount=1;}if(stableCount>=3&&time>scanCooldown){stableCount=0;openStation(candidate.id);}}
      else{stableId=null;stableCount=0;$('scan-label').textContent=known.length?'Già esplorata! Cerca un altro oggetto.':'Inquadra un marker, tenendo fermo il telefono';}
    }catch{stopCamera();cameraMessage('La lettura del marker si è interrotta. Riattiva la fotocamera o inserisci il codice della stazione.');$('manual-form').hidden=false;}
  }
  function openStation(id){station=STATIONS.find(s=>s.id===Number(id));if(!station)return;renderStation();if(!$('station-dialog').open)$('station-dialog').showModal();}
  function renderStation(){
    const s=station,done=Object.hasOwn(answers,s.id),correct=done&&answers[s.id]===s.risk;
    $('station-content').innerHTML=`<div class="eyebrow">STAZIONE ${s.code} / ${total}</div><span class="station-icon" aria-hidden="true">${symbols[s.icon]}</span><h2 id="station-title">${s.name}</h2><p>${s.scene}</p>${done?`<div class="answer-banner ${correct?'':'incorrect'}">${correct?'✓ Esatto! +100 punti':'Un indizio per la prossima volta · 0 punti'}</div><h3>${s.risk?'È un potenziale focolaio larvale.':'È un falso amico, in queste condizioni.'}</h3><p>${s.fact}</p><div class="action-box"><strong>IL GESTO CHE CONTA</strong><p>${s.action}</p></div><button class="button primary full" id="continue-hunt">${stats(answers,STATIONS).complete?'Scopri il risultato':'Continua la caccia'} →</button>`:`<h3>Qui possono svilupparsi le larve?</h3><div class="choice-buttons"><button class="button primary" data-answer="true">Sì, è un focolaio</button><button class="button secondary" data-answer="false">No, falso amico</button></div><p class="question-hint">+100 punti per ogni risposta corretta. Osserva le condizioni descritte.</p>`}`;
  }
  function closeStation(){if($('station-dialog').open)$('station-dialog').close();}
  $('station-content').addEventListener('click',e=>{const choice=e.target.closest('[data-answer]');if(choice){if(answer(answers,station,choice.dataset.answer==='true')){persist();refresh();renderStation();$('continue-hunt').focus();$('announcement').textContent=answers[station.id]===station.risk?'Risposta corretta. Cento punti!':'Risposta registrata. Leggi la spiegazione.';}}if(e.target.closest('#continue-hunt'))closeStation();});
  $('station-dialog').addEventListener('close',()=>{scanCooldown=performance.now()+2000;stableId=null;stableCount=0;if(stats(answers,STATIONS).complete)finish();});
  $('close-dialog').onclick=closeStation;
  function finish(){
    stopCamera();const s=stats(answers,STATIONS);view('results');
    $('results').innerHTML=`<div class="result-mark" aria-hidden="true">✳</div><div class="eyebrow">${mode==='demo'?'DEMO COMPLETATA':'MISSIONE COMPLETATA'}</div><h1>${s.correct===total?'Occhio da ricercatore!':'Ora sai dove guardare.'}</h1><p>Hai esplorato tutti gli oggetti.<br>La prossima scoperta può cominciare dal tuo balcone.</p><div class="result-stats"><div><strong>${s.score}</strong><span>punti su ${total*100}</span></div><div><strong>${s.correct} / ${total}</strong><span>risposte corrette</span></div><div><strong>${s.found} / ${riskTotal}</strong><span>focolai riconosciuti</span></div></div><div class="takeaway"><h2>Una piccola abitudine. Ogni settimana.</h2><p>Controlla i contenitori all’aperto: svuota e pulisci quelli che trattengono acqua, capovolgili o coprili. Per prevenire le zanzare, comincia dai ristagni.</p></div><details class="result-review"><summary>Rivedi tutte le scoperte</summary>${STATIONS.map(item=>`<article><h3>${item.code} · ${item.name} — ${item.risk?'potenziale focolaio':'falso amico'} ${answers[item.id]===item.risk?'✓':'· da ripassare'}</h3><p>${item.fact} ${item.action}</p></article>`).join('')}</details><div class="choice-buttons"><button id="new-game" class="button primary">Ricomincia la caccia ↗</button><button id="result-home" class="button secondary">Torna all’inizio</button></div>${mode==='demo'?'<p class="question-hint">Questa era una prova. I progressi della caccia allo stand sono separati.</p>':''}`;
    $('new-game').onclick=()=>$('reset-dialog').showModal();$('result-home').onclick=goHome;
  }
  function goHome(){stopCamera();view('home');updateSaved();}
  $('reset-cancel').onclick=()=>$('reset-dialog').close();$('reset-confirm').onclick=()=>{answers={};persist();$('reset-dialog').close();begin(mode);};
  $('start').onclick=()=>begin('stand');$('back').onclick=goHome;
  $('camera-start').onclick=startCamera;$('camera-stop').onclick=stopCamera;
  $('manual-toggle').onclick=()=>{$('manual-form').hidden=!$('manual-form').hidden;if(!$('manual-form').hidden)$('station-code').focus();};
  $('manual-form').onsubmit=e=>{e.preventDefault();const code=$('station-code').value.trim().padStart(2,'0'),s=STATIONS.find(s=>s.code===code);if(!s){$('manual-error').textContent='Inserisci un codice tra 01 e 08.';return;}$('manual-error').textContent='';openStation(s.id);$('station-code').value='';};
  $('demo-stations').onclick=e=>{const b=e.target.closest('[data-demo]');if(b)openStation(b.dataset.demo);};
  $('journal-list').onclick=e=>{const b=e.target.closest('[data-review]');if(b&&!b.disabled)openStation(b.dataset.review);};
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopCamera();}});window.addEventListener('pagehide',stopCamera);updateSaved();
})();
