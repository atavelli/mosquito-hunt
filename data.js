(function(root) {
  const stations = [
  {
    "id": 17,
    "code": "01",
    "name": "La bottiglia ben chiusa",
    "icon": "bottle",
    "scene": "Una bottiglia con acqua, chiusa da un tappo integro e avvitato.",
    "risk": false,
    "fact": "Il tappo ben chiuso impedisce alle zanzare di accedere all’acqua. Qui il dettaglio decisivo è la chiusura.",
    "action": "Mantieni il tappo avvitato e non lasciare contenitori aperti all’esterno."
  },
  {
    "id": 42,
    "code": "02",
    "name": "Il sottovaso",
    "icon": "plant",
    "scene": "Un sottovaso con acqua rimasta dopo l’annaffiatura.",
    "risk": true,
    "fact": "L’acqua che rimane nel sottovaso può ospitare le larve. Anche un piccolo contenitore merita attenzione.",
    "action": "Svuota e pulisci il sottovaso regolarmente, almeno una volta alla settimana."
  },
  {
    "id": 73,
    "code": "03",
    "name": "Le foglie asciutte",
    "icon": "leaves",
    "scene": "Alcune foglie secche su un vassoio asciutto al coperto, senza acqua raccolta.",
    "risk": false,
    "fact": "In queste condizioni le foglie non sono un focolaio larvale: manca l’acqua in cui le larve si sviluppano.",
    "action": "Rimuovi le foglie da grondaie e scarichi: se li ostruiscono, possono favorire ristagni."
  },
  {
    "id": 105,
    "code": "04",
    "name": "Il vaso con fiori recisi",
    "icon": "flowers",
    "scene": "Un vaso aperto con fiori recisi, lasciato all’aperto con la stessa acqua da diversi giorni.",
    "risk": true,
    "fact": "L’acqua del vaso, se accessibile alle zanzare e lasciata ferma, può permettere lo sviluppo delle larve. Anche un contenitore decorativo può diventare un potenziale focolaio.",
    "action": "Cambia regolarmente l’acqua, almeno una volta alla settimana, e pulisci le pareti interne del vaso."
  },
  {
    "id": 138,
    "code": "05",
    "name": "Il secchio in giardino",
    "icon": "bucket",
    "scene": "Un secchio aperto, lasciato all’aperto con acqua piovana.",
    "risk": true,
    "fact": "Un secchio aperto può raccogliere acqua e diventare un sito di sviluppo per le larve.",
    "action": "Svuotalo, puliscilo e riponilo capovolto o al coperto."
  },
  {
    "id": 166,
    "code": "06",
    "name": "La ciotola di sabbia",
    "icon": "sand",
    "scene": "Una ciotola al coperto, riempita di sabbia completamente asciutta, senza acqua.",
    "risk": false,
    "fact": "La sabbia asciutta non offre l’acqua necessaria allo sviluppo delle larve di zanzara. Conta ciò che contiene la ciotola, non soltanto la sua forma.",
    "action": "Tienila al coperto: se la pioggia vi crea un ristagno, la situazione cambia."
  },
  {
    "id": 201,
    "code": "07",
    "name": "Il secchio capovolto",
    "icon": "bucket",
    "scene": "Un secchio capovolto, asciutto, senza cavità che raccolgano acqua.",
    "risk": false,
    "fact": "In questa situazione non c’è acqua in cui le larve possano svilupparsi. Capovolgere i contenitori è una buona abitudine.",
    "action": "Controlla che anche il fondo non trattenga acqua dopo la pioggia."
  },
  {
    "id": 229,
    "code": "08",
    "name": "L’annaffiatoio dimenticato",
    "icon": "can",
    "scene": "Un annaffiatoio aperto con acqua ferma da diversi giorni.",
    "risk": true,
    "fact": "L’acqua residua in un annaffiatoio accessibile alle zanzare può consentire lo sviluppo delle larve.",
    "action": "Dopo l’uso svuotalo completamente e conservalo al riparo dalla pioggia."
  },
  {
    "id": 8,
    "code": "09",
    "name": "Il vaso senza ristagni",
    "icon": "plant",
    "scene": "Una pianta in un vaso drenante, senza sottovaso e senza acqua raccolta.",
    "risk": false,
    "fact": "In questo scenario non c’è acqua stagnante disponibile per lo sviluppo delle larve. La pianta, da sola, non è un focolaio larvale.",
    "action": "Mantieni il drenaggio libero e controlla che non si formino ristagni."
  },
  {
    "id": 61,
    "code": "10",
    "name": "Il barattolo abbandonato",
    "icon": "jar",
    "scene": "Un barattolo senza coperchio in cui si è raccolta acqua.",
    "risk": true,
    "fact": "Anche un piccolo rifiuto può raccogliere acqua e offrire un sito di sviluppo alle larve.",
    "action": "Rimuovi il contenitore e smaltiscilo nella raccolta corretta."
  }
];
  root.STATIONS = stations;
  if (typeof module !== 'undefined') module.exports = stations;
})(typeof window !== 'undefined' ? window : globalThis);
