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
    "id": 138,
    "code": "04",
    "name": "Il secchio in giardino",
    "icon": "bucket",
    "scene": "Un secchio aperto, lasciato all’aperto con acqua piovana.",
    "risk": true,
    "fact": "Un secchio aperto può raccogliere acqua e diventare un sito di sviluppo per le larve.",
    "action": "Svuotalo, puliscilo e riponilo capovolto o al coperto."
  },
  {
    "id": 229,
    "code": "05",
    "name": "Il bicchiere pieno d’acqua",
    "icon": "watercup",
    "scene": "Un bicchiere pieno d’acqua, aperto e lasciato all’aperto con acqua ferma da diversi giorni.",
    "risk": true,
    "fact": "Anche un bicchiere può essere un potenziale focolaio: l’acqua ferma e accessibile alle zanzare può consentire lo sviluppo delle larve.",
    "action": "Svuota e pulisci il bicchiere, poi riponilo al coperto. Non lasciare contenitori con acqua stagnante all’aperto."
  },
  {
    "id": 201,
    "code": "06",
    "name": "Il bicchiere di plastica capovolto e asciutto",
    "icon": "cup",
    "scene": "Un bicchiere di plastica capovolto e asciutto, senza acqua raccolta nemmeno sul fondo rivolto verso l’alto.",
    "risk": false,
    "fact": "Nelle condizioni descritte il bicchiere non è un potenziale focolaio: è asciutto e non contiene acqua in cui le larve possano svilupparsi.",
    "action": "Riponilo al coperto e controlla che anche il fondo non trattenga acqua. Se non serve più, smaltiscilo nella raccolta corretta."
  },
  {
    "id": 8,
    "code": "07",
    "name": "Il vaso senza ristagni",
    "icon": "plant",
    "scene": "Una pianta in un vaso drenante, senza sottovaso e senza acqua raccolta.",
    "risk": false,
    "fact": "In questo scenario non c’è acqua stagnante disponibile per lo sviluppo delle larve. La pianta, da sola, non è un focolaio larvale.",
    "action": "Mantieni il drenaggio libero e controlla che non si formino ristagni."
  },
  {
    "id": 61,
    "code": "08",
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
