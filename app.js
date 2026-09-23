(() => {
  'use strict';
  const names={FN1:'Recognize functions',FN2:'Function notation',FN3:'Domain, range, and graph behavior',FN4:'Function transformations',FN5:'Operations and composition',FN6:'Inverse functions',LF1:'Slope and average rate of change',LF2:'Equations of lines',LF3:'Graphing linear functions',LF5:'Linear models',PR1:'Quadratic graphs',PR2:'Quadratic models',TR1:'Degrees and radians',TR2:'Coterminal angles and arcs',TR5:'Reference angles and trig values',PF1:'Sine and cosine graph properties'};
  const $=id=>document.getElementById(id);
  const storeKey='math172-practice-marks-v1';
  let marks={};try{marks=JSON.parse(localStorage.getItem(storeKey)||'{}')}catch{marks={}}
  let mode='mixed',selected='FN1',deck=[],position=0,summaryVisible=false,sessionAttempted=new Set();
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const counts={};for(const q of QUESTION_BANK)counts[q.objective]=(counts[q.objective]||0)+1;
  const codes=Object.keys(names);
  function save(){try{localStorage.setItem(storeKey,JSON.stringify(marks))}catch{}$('reviewCount').textContent=Object.values(marks).filter(x=>x==='review').length}
  function listObjectives(){
    $('objectiveList').innerHTML='';
    for(const code of codes){const b=document.createElement('button');b.type='button';b.className='objective'+(selected===code?' active':'');b.setAttribute('aria-pressed',selected===code?'true':'false');b.innerHTML=`<span><b>${code}</b> · ${names[code]}</span><em>${counts[code]||0}</em>`;b.addEventListener('click',()=>{mode='objective';selected=code;syncMode();listObjectives();start()});$('objectiveList').append(b)}
  }
  function label(){return mode==='mixed'?'Mixed practice':mode==='review'?'Practice again':`${selected} · ${names[selected]}`}
  function syncMode(){ $('mixedBtn').classList.toggle('active',mode==='mixed');$('objectiveBtn').classList.toggle('active',mode==='objective');$('mixedBtn').setAttribute('aria-pressed',String(mode==='mixed'));$('objectiveBtn').setAttribute('aria-pressed',String(mode==='objective'));$('objectivePanel').hidden=mode!=='objective'}
  function start(){
    const pool=mode==='mixed'?QUESTION_BANK:mode==='review'?QUESTION_BANK.filter(q=>marks[q.id]==='review'):QUESTION_BANK.filter(q=>q.objective===selected);
    deck=shuffle(pool);position=0;summaryVisible=false;sessionAttempted=new Set();render()
  }
  function showQuestion(){
    summaryVisible=false;$('summary').hidden=true;$('question').hidden=false;$('navigation').hidden=false;
    render();$('question').focus()
  }
  function showSummary(){
    if(!deck.length)return;
    summaryVisible=true;$('question').hidden=true;$('navigation').hidden=true;$('summary').hidden=false;
    $('sessionLabel').textContent='Objective review';$('counter').textContent=`${sessionAttempted.size} of ${deck.length} attempted`;
    $('progressFill').style.width='100%';
    $('summaryIntro').textContent=`You attempted ${sessionAttempted.size} of ${deck.length} questions in this set. Your marks show what to revisit.`;
    const rows=$('summaryRows');rows.innerHTML='';
    for(const code of codes){
      const questions=deck.filter(q=>q.objective===code);if(!questions.length)continue;
      const attempted=questions.filter(q=>sessionAttempted.has(q.id));
      const tr=document.createElement('tr');
      const first=document.createElement('td');const button=document.createElement('button');button.type='button';button.className='objective-link';button.textContent=`${code} · ${names[code]}`;
      button.setAttribute('aria-label',`Practice ${code}: ${names[code]}`);
      button.onclick=()=>{mode='objective';selected=code;syncMode();listObjectives();start();$('question').focus()};first.append(button);tr.append(first);
      for(const num of [questions.length,attempted.length,attempted.filter(q=>marks[q.id]==='got').length,attempted.filter(q=>marks[q.id]==='review').length]){
        const td=document.createElement('td');td.textContent=String(num);tr.append(td)
      }
      rows.append(tr)
    }
    $('summary').focus()
  }
  function render(){
    if(summaryVisible){showSummary();return}
    const has=deck.length>0,q=deck[position];
    $('sessionLabel').textContent=label();$('counter').textContent=has?`Question ${position+1} of ${deck.length}`:'No questions in this set';
    $('progressFill').style.width=has?`${(position+1)/deck.length*100}%`:'0%';
    $('questionTitle').textContent=has?'Work this problem':'Nothing marked for review yet';
    $('objectiveTag').textContent=has?`${q.objective} · ${names[q.objective]}`:'';
    $('objectiveTag').hidden=!has||mode!=='objective';
    $('sourceTag').textContent=has?'Practice exam #'+q.id:'';
    $('prompt').innerHTML=has?q.prompt.join(''):'<p>Choose a learning objective or mark a question “Practice again” to build this set.</p>';
    $('graphWrap').hidden=!has||!q.image;
    if(has&&q.image){
      const descriptions={
        13:'Graph of f with closed endpoints at (−4, 3) and (5, 1), a minimum at (−1, −4), and a maximum at (2, 5).',
        14:'Graph of g with closed endpoints at (−6, −2) and (3, 4), a maximum at (−3, 6), and a minimum at (0, −3).',
        33:'Two coordinate grids: A compares absolute value graphs; B compares square root graphs.',
        34:'A line on a square coordinate grid passing through (0, 3) and (2, −1).',
        35:'Graph A is a parabola; Graph B is a circle. A vertical test line is shown in each graph.',
        36:'Square root graph with a secant line through A (1, 1) and B (4, 2).',
        37:'Dashed square root graph begins at (0, 0); a solid reflected and shifted curve begins at (−2, 0).'
      };
      const captions={33:'A. Absolute value  ·  B. Square root',34:'Read the labeled points from the graph.',35:'The dashed lines illustrate the Vertical Line Test.',36:'The secant line connects A and B.',37:'Compare the two starting points and the direction of each curve.'};
      $('graph').src=q.image;$('graph').alt=descriptions[q.id]||'Coordinate graph accompanying the question.';
      $('graphCaption').textContent=captions[q.id]||'The labeled turning points and endpoints are part of the question.';
    }
    $('answerBody').innerHTML=has?q.answer:'';$('answer').hidden=true;$('selfCheck').hidden=true;
    $('revealBtn').textContent='Reveal answer';$('revealBtn').setAttribute('aria-expanded','false');$('revealBtn').disabled=!has;
    const state=has?marks[q.id]:null;
    $('gotItBtn').setAttribute('aria-pressed',state==='got'?'true':'false');$('reviewMarkBtn').setAttribute('aria-pressed',state==='review'?'true':'false');
    $('prevBtn').disabled=!has||position===0;$('nextBtn').disabled=!has;
    $('nextBtn').textContent=position===deck.length-1?'Review this set →':'Next question →';
    $('reviewBtn').disabled=!Object.values(marks).some(x=>x==='review');$('summaryBtn').hidden=!sessionAttempted.size;
    save()
  }
  $('mixedBtn').onclick=()=>{mode='mixed';syncMode();start()};
  $('objectiveBtn').onclick=()=>{mode='objective';syncMode();start()};
  $('reviewBtn').onclick=()=>{mode='review';syncMode();start()};
  $('summaryBtn').onclick=showSummary;
  $('restartBtn').onclick=start;
  $('backBtn').onclick=showQuestion;
  $('prevBtn').onclick=()=>{if(position>0){position--;render();$('question').focus()}};
  $('nextBtn').onclick=()=>{if(position>=deck.length-1)showSummary();else{position++;render();$('question').focus()}};
  $('revealBtn').onclick=()=>{
    const q=deck[position];if(!q)return;
    const show=$('answer').hidden;$('answer').hidden=!show;$('selfCheck').hidden=!show;
    $('objectiveTag').hidden=!show&&mode!=='objective';
    $('revealBtn').textContent=show?'Hide answer':'Reveal answer';$('revealBtn').setAttribute('aria-expanded',String(show));
    if(show){sessionAttempted.add(q.id);$('summaryBtn').hidden=false}
  };
  for(const [id,value] of [['gotItBtn','got'],['reviewMarkBtn','review']])$(id).onclick=()=>{
    const q=deck[position];if(!q)return;
    if(marks[q.id]===value)delete marks[q.id];else marks[q.id]=value;
    for(const [button,kind] of [['gotItBtn','got'],['reviewMarkBtn','review']])$(button).setAttribute('aria-pressed',marks[q.id]===kind?'true':'false');
    save();$('reviewBtn').disabled=!Object.values(marks).some(x=>x==='review')
  };
  listObjectives();start();
})();
