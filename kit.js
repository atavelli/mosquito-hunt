(() => {
  const $=id=>document.getElementById(id), dictionary=new AR.Dictionary('ARUCO_MIP_36h12');
  $('station-guide').innerHTML=STATIONS.map(s=>`<tr><td><strong>${s.code}</strong></td><td><strong>${s.name}</strong><br>${s.scene}</td><td>${s.risk?'Potenziale focolaio':'Falso amico'}</td></tr>`).join('');
  $('markers').innerHTML=STATIONS.map(s=>`<article class="marker-card"><div class="marker-brand">MOSQUITO HUNT · TROVA I FOCOLAI</div>${dictionary.generateSVG(s.id)}<h3>STAZIONE ${s.code}</h3><p>Inquadra questo simbolo dall’app.<br>Fotocamera non disponibile? Inserisci il codice ${s.code}.</p></article>`).join('');
  const pdfLink=document.createElement('a');pdfLink.className='button primary';pdfLink.href='output/pdf/mosquito-hunt-marker.pdf';pdfLink.download='mosquito-hunt-marker.pdf';pdfLink.textContent='Scarica PDF dei marker ↓';$('print-markers').before(pdfLink);$('print-markers').textContent='Stampa dal browser ↗';$('print-markers').className='button secondary';
  function print(kind){$('kit').className=`kit print-${kind}`;window.print();}
  $('print-markers').onclick=()=>print('markers');$('print-guide').onclick=()=>print('guide');$('print-poster').onclick=()=>print('poster');
  let qrSvg='';
  $('qr-form').onsubmit=e=>{e.preventDefault();$('poster').hidden=true;qrSvg='';try{
    const url=new URL($('public-url').value.trim());
    if(url.protocol!=='https:'||url.username||url.password||/^(localhost|127\.|192\.168\.|10\.|\[::1\]|172\.(1[6-9]|2\d|3[01])\.)/i.test(url.hostname))throw Error('Inserisci un indirizzo HTTPS pubblico, senza credenziali. localhost e gli indirizzi della rete locale non sono adatti al QR per i visitatori.');
    const qr=qrcode(0,'M');qr.addData(url.href);qr.make();qrSvg=qr.createSvgTag({cellSize:6,margin:24,scalable:true});$('qr-image').innerHTML=qrSvg;$('poster-url').textContent=url.href;$('poster').hidden=false;$('qr-status').textContent='QR generato. Provalo con un telefono prima della stampa: la raggiungibilità del sito non viene verificata automaticamente.';
  }catch(error){$('qr-status').textContent=error instanceof TypeError?'Inserisci un indirizzo web valido che inizi con https://.':(error.message||'Indirizzo troppo lungo per il QR. Usa un link più breve.');}};
  $('download-qr').onclick=()=>{if(!qrSvg)return;const url=URL.createObjectURL(new Blob([qrSvg],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download='mosquito-hunt-qr.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
})();
