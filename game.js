(function(root){
  const storageKey = 'mosquito-hunt-v2';
  function cleanAnswers(input,stations){
    const output={};
    for(const s of stations) if(input && typeof input[s.id]==='boolean') output[s.id]=input[s.id];
    return output;
  }
  function stats(answers,stations){
    const done=stations.filter(s=>typeof answers[s.id]==='boolean');
    const correct=done.filter(s=>answers[s.id]===s.risk).length;
    const found=done.filter(s=>s.risk && answers[s.id]===true).length;
    return {done:done.length,correct,found,score:correct*100,complete:done.length===stations.length};
  }
  function answer(answers,station,value){
    if(typeof value!=='boolean' || Object.hasOwn(answers,station.id)) return false;
    answers[station.id]=value;return true;
  }
  root.HuntGame={storageKey,cleanAnswers,stats,answer};
  if(typeof module!=='undefined') module.exports=root.HuntGame;
})(typeof window!=='undefined'?window:globalThis);
