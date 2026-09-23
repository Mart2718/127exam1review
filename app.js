(() => {
  'use strict';
  const names={FN1:'Recognize functions',FN2:'Function notation',FN3:'Domain, range, and graph behavior',FN4:'Function transformations',FN5:'Operations and composition',FN6:'Inverse functions',LF1:'Slope and average rate of change',LF2:'Equations of lines',LF3:'Graphing linear functions',LF5:'Linear models',PR1:'Quadratic graphs',PR2:'Quadratic models',TR1:'Degrees and radians',TR2:'Coterminal angles and arcs',TR5:'Reference angles and trig values',PF1:'Sine and cosine graph properties'};
  const $=id=>document.getElementById(id);
  const storeKey='math172-practice-marks-v1';
  let marks={};try{marks=JSON.parse(localStorage.getItem(storeKey)||'{}')}catch{marks={}}
  let mode='mixed',selected='FN1',deck=[],position=0;
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const counts={};for(const q of QUESTION_BANK)counts[q.objective]=(counts[q.objective]||0)+1;
  const codes=Object.keys(names);
  function save(){try{localStorage.setItem(storeKey,JSON.stringify(marks))}catch{}$('reviewCount').textContent=Object.values(marks).filter(x=>x==='review').length}
  function listObjectives(){
    $('objectiveList').innerHTML='';
    for(const code of codes){const b=document.createElement('button');b.type='button';b.className='objective'+(selected===code?' active':'');b.setAttribute('aria-pressed',selected===code?'true':'false');b.innerHTML=`<span><b>${code}</b> · ${names[code]}</span><em>${counts[code]||0}</em>`;b.addEventListener('click',()=>{selected=code;listObjectives();start()});$('objectiveList').append(b)}
  }
  function start(){const pool=mode==='mixed'?QUESTION_BANK:mode==='review'?QUESTION_BANK.filter(q=>marks[q.id]==='review'):QUESTION_BANK.filter(q=>q.objective===selected);deck=shuffle(pool);position=0;render()}
  function render(){
    const has=deck.length>0,q=deck[position];
    $('sessionLabel').textContent=mode==='mixed'?'Mixed practice':mode==='review'?'Practice again':`${selected} · ${names[selected]}`;
    $('counter').textContent=has?`Question ${position+1} of ${deck.length}`:'No questions in this set';
    $('progressFill').style.width=has?`${(position+1)/deck.length*100}%`:'0%';
    $('questionTitle').textContent=has?'Work this problem':'Nothing marked for review yet';
    $('objectiveTag').textContent=has?q.objective:'—';
    $('sourceTag').textContent=has?(q.websiteOnly?'Website graph question':'Practice exam #'+q.id):'';
    $('prompt').innerHTML=has?q.prompt.join(''): '<p>Choose a learning objective or mark a question “Practice again” to build this set.</p>';
    $('graphWrap').hidden=!has||!q.image;
    if(has&&q.image){$('graph').src=q.image;$('graph').alt=q.id===33?'Two coordinate grids: A compares the absolute value parent function and a reflected, stretched, shifted graph; B compares the square root parent function and a shifted graph.':q.id===34?'A line on a coordinate grid passing through zero three and two negative one.':`Graph of ${q.id===13?'f':'g'} with labeled points described in the question.`;$('graphCaption').textContent=q.id===33?'A. Absolute value  ·  B. Square root':q.id===34?'Use two visible points to find the line.':'The labeled turning points and endpoints are part of the question.'}
    $('answerBody').innerHTML=has?q.answer:'';$('answer').hidden=true;$('revealBtn').textContent='Reveal answer';$('revealBtn').setAttribute('aria-expanded','false');$('revealBtn').disabled=!has;
    const state=has?marks[q.id]:null;
    $('gotItBtn').setAttribute('aria-pressed',state==='got'?'true':'false');$('reviewMarkBtn').setAttribute('aria-pressed',state==='review'?'true':'false');
    $('gotItBtn').disabled=$('reviewMarkBtn').disabled=!has;
    $('prevBtn').disabled=!has||position===0;$('nextBtn').disabled=!has;
    $('nextBtn').textContent=position===deck.length-1?'Shuffle again ↻':'Next question →';
    $('reviewBtn').disabled=!Object.values(marks).some(x=>x==='review');
    save();
  }
  $('mixedBtn').onclick=()=>{mode='mixed';syncMode();start()};
  $('objectiveBtn').onclick=()=>{mode='objective';syncMode();start()};
  function syncMode(){ $('mixedBtn').classList.toggle('active',mode==='mixed');$('objectiveBtn').classList.toggle('active',mode==='objective');$('mixedBtn').setAttribute('aria-pressed',mode==='mixed');$('objectiveBtn').setAttribute('aria-pressed',mode==='objective');$('objectivePanel').hidden=mode!=='objective'}
  $('reviewBtn').onclick=()=>{mode='review';syncMode();start()};
  $('restartBtn').onclick=start;
  $('prevBtn').onclick=()=>{if(position>0){position--;render();$('question').focus()}};
  $('nextBtn').onclick=()=>{if(position>=deck.length-1)start();else{position++;render()}$('question').focus()};
  $('revealBtn').onclick=()=>{const show=$('answer').hidden;$('answer').hidden=!show;$('revealBtn').textContent=show?'Hide answer':'Reveal answer';$('revealBtn').setAttribute('aria-expanded',String(show))};
  for(const [id,value] of [['gotItBtn','got'],['reviewMarkBtn','review']])$(id).onclick=()=>{const q=deck[position];if(!q)return;if(marks[q.id]===value)delete marks[q.id];else marks[q.id]=value;for(const [button,kind] of [['gotItBtn','got'],['reviewMarkBtn','review']])$(button).setAttribute('aria-pressed',marks[q.id]===kind?'true':'false');save();$('reviewBtn').disabled=!Object.values(marks).some(x=>x==='review')};
  listObjectives();start();
})();
