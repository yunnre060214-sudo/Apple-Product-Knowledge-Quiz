import {VERSION,CATEGORIES,LEVELS,drawQuestions,filterBank,createSession,hydrateSession,grade,updateRecent,resultTitle,easterEggs} from '../src/engine.mjs?v=2.0.0';
import {icon,scene} from './icons.mjs?v=2.0.0';
import {SITE_URL,shareText,createShareCard,downloadBlob} from './share.mjs?v=2.0.0';
const $=s=>document.querySelector(s), main=$('#main'), modal=$('#modal');
const KEY='apple-quiz:v1:';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(KEY+k))??f;}catch{return f;}};
let storageWarning=false;
const write=(k,v)=>{try{localStorage.setItem(KEY+k,JSON.stringify(v));}catch{if(!storageWarning){storageWarning=true;toast('本局可以照常玩，浏览器暂时无法保存进度。');}}};
const remove=k=>{try{localStorage.removeItem(KEY+k);}catch{}};
const arr=v=>Array.isArray(v)?v:[];
const initial={count:20,difficulty:'mixed',categories:Object.keys(CATEGORIES),mode:'exam',secondsPerQuestion:0};
let config={...initial,...read('config',{})};
config.categories=arr(config.categories).filter(c=>CATEGORIES[c]);if(!config.categories.length)config.categories=[...initial.categories];
if(!['mixed',...Object.keys(LEVELS)].includes(config.difficulty))config.difficulty='mixed';
if(!['quick','exam','practice'].includes(config.mode))config.mode='exam';
config.count=Math.min(500,Math.max(5,Math.floor(Number(config.count)||20)));
if(![0,30,60,90].includes(Number(config.secondsPerQuestion)))config.secondsPerQuestion=0;
let bank=[], meta={}, questions=[], session=null, report=null, view='home', seen=arr(read('seen',[])).filter(x=>typeof x==='string');
let autoTimer, clockTimer, toastTimer, shareUrl, shareBlob, generation=0, paused=false, finishPending=false;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt=n=>`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;
const quickConfig=topic=>({count:5,difficulty:'mixed',categories:Object.keys(CATEGORIES),mode:'quick',secondsPerQuestion:0,...(topic?{topic}: {})});
const sourceLinks=q=>q.sources.map((s,i)=>`<a href="${esc(s)}" target="_blank" rel="noopener noreferrer">${s.includes('macrumors.com')?'历史声明存档':'Apple 资料'}${q.sources.length>1?` ${i+1}`:''}${icon('external')}</a>`).join('');
function toast(s){$('#toast').textContent=s;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3500);}
function dialog(title,body){$('#modal-content').innerHTML=`<h2 id="modal-title">${title}</h2>${body}`;if(!modal.open)modal.showModal();}
function cancelAuto(){clearTimeout(autoTimer);autoTimer=null;generation++;}
function save(){if(session&&!finishPending)write('session',session);}
function visit(q){seen=updateRecent(seen,[q.id],Math.max(3000,Math.floor(bank.length*.75)));write('seen',seen);}
function enter(next){view=next;document.body.dataset.view=next;cancelAuto();clearInterval(clockTimer);main.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
function animate(el){if(!reduced())el?.animate([{opacity:0,transform:'translateY(10px) scale(.995)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:330,easing:'cubic-bezier(.2,.75,.25,1)'});}
function home(){
  enter('home');if(shareUrl){URL.revokeObjectURL(shareUrl);shareUrl=null;}
  const saved=hydrateSession(read('session',null),bank);
  main.innerHTML=`<section class="hero"><div class="hero-copy"><p class="eyebrow"><span></span> ONE MORE QUESTION.</p><h1>你以为你<br>很懂 <span class="gradient-text">Apple？</span></h1><p class="hero-description">有些冷知识，连老果粉都得猜。<br>5 题一局，让好奇心先玩起来。</p><div class="hero-actions"><button class="primary-button hero-start" data-action="quick">${icon('shuffle')}随机来 5 题${icon('arrow')}</button><button class="custom-link" data-action="custom">自己选玩法${icon('sliders')}</button></div>${saved?`<button class="resume-link" data-action="resume">${icon('history')}接着上次玩 · ${Object.keys(saved.answers).length}/${saved.questions.length} 题${icon('arrow')}</button>`:`<p class="hero-note">不用登录，不用准备。猜就完了。</p>`}</div>${scene}</section><section class="topic-section"><div class="section-label"><span>今天想猜点什么</span><span>挑个口味，直接开玩</span></div><div class="topic-grid"><button class="topic-card lavender" data-topic="surprise"><span class="topic-icon">${icon('bulb')}</span><span class="topic-copy"><strong>有点反直觉</strong><span>熟悉的苹果，意外的答案</span></span>${icon('arrow','topic-arrow')}</button><button class="topic-card peach" data-topic="stories"><span class="topic-icon">${icon('history')}</span><span class="topic-copy"><strong>苹果旧事</strong><span>经典、弯路，还有那些名场面</span></span>${icon('arrow','topic-arrow')}</button><button class="topic-card mint" data-topic="timeline"><span class="topic-icon">${icon('clock')}</span><span class="topic-copy"><strong>时间旅行</strong><span>iPhone、iPad、iOS 谁先来</span></span>${icon('arrow','topic-arrow')}</button></div></section><div class="home-bottom"><span class="bank-count">${icon('spark')}<b>${bank.length.toLocaleString('en-US')}</b> 个提问，等你的好奇心</span><button class="text-button" data-action="about">看看题库${icon('external')}</button></div>`;
  animate($('.hero-copy'));
}
function custom(){
  dialog('按你的节奏来',`<form id="custom-form"><fieldset><legend>这一局，玩几题</legend><div class="segments counts">${[5,10,20,50,100,200,500].map(n=>`<button type="button" data-count="${n}" aria-pressed="${config.count===n}" class="${config.count===n?'selected':''}">${n}</button>`).join('')}</div><label class="custom-number">自定题数<input name="count" id="count-input" type="number" min="5" max="500" value="${config.count}" required inputmode="numeric"></label></fieldset><div class="form-row"><label>难度<select name="difficulty">${[['mixed','随缘混合'],['easy','轻松猜猜'],['medium','有点讲究'],['hard','细节控'],['expert','硬核一局']].map(([v,t])=>`<option value="${v}" ${config.difficulty===v?'selected':''}>${t}</option>`).join('')}</select></label><label>玩法<select name="mode" id="mode-select">${[['quick','选完自动下一题'],['exam','自由切题，最后揭晓'],['practice','每题确认，随时看解析']].map(([v,t])=>`<option value="${v}" ${config.mode===v?'selected':''}>${t}</option>`).join('')}</select></label></div><fieldset><legend>想猜哪些<span class="muted">可多选</span></legend><div class="category-pills">${Object.entries(CATEGORIES).map(([id,c])=>`<label><input type="checkbox" name="category" value="${id}" ${config.categories.includes(id)?'checked':''}><span>${c.name}</span></label>`).join('')}</div></fieldset><label class="timer-setting" ${config.mode!=='exam'?'hidden':''}>想加一点紧张感<select name="timer">${[[0,'不限时'],[30,'总时间 = 题数 × 30 秒'],[60,'总时间 = 题数 × 60 秒'],[90,'总时间 = 题数 × 90 秒']].map(([v,t])=>`<option value="${v}" ${Number(config.secondsPerQuestion)===v?'selected':''}>${t}</option>`).join('')}</select></label><p id="pool-hint" class="muted" aria-live="polite"></p><button type="submit" class="primary-button full-width">就这么玩${icon('arrow')}</button></form>`);updatePool();
}
function formConfig(){const f=$('#custom-form'),data=new FormData(f);return {count:Number(data.get('count')),difficulty:data.get('difficulty'),mode:data.get('mode'),categories:data.getAll('category'),secondsPerQuestion:Number(data.get('timer'))};}
function updatePool(){const f=$('#custom-form');if(!f)return;const c=formConfig(),n=filterBank(bank,c).length;$('#pool-hint').textContent=n?`可选 ${n.toLocaleString('en-US')} 题${n<c.count?`，这局玩 ${n} 题`:''}`:'至少选一个你感兴趣的领域';f.querySelector('[type="submit"]').disabled=!n;}
function start(next){
  if(!bank.length)return;
  cancelAuto();modal.close();const seed=crypto.getRandomValues(new Uint32Array(1))[0];
  questions=drawQuestions(bank,next,seed,seen);if(!questions.length){toast('这个口味暂时没有题，换一组试试。');return;}
  session=createSession(questions,{...next,count:questions.length},seed);report=null;finishPending=false;shareBlob=null;save();quiz();
}
function resume(){modal.close();const s=hydrateSession(read('session',null),bank);if(!s){remove('session');toast('这局进度已过期，再来一局吧。');home();return;}questions=s.hydratedQuestions;delete s.hydratedQuestions;session=s;finishPending=false;if(s.deadline&&s.deadline<=Date.now()){finish(true);return;}quiz();}
function quiz(){
  enter('quiz');const quick=session.config.mode==='quick';
  main.innerHTML=`<section class="quiz-shell"><div class="quiz-top"><button class="back-button" data-action="home">${icon('back')}先歇会儿</button><span class="round-label">${quick?'好奇心小局':'按你的节奏'}<span id="quiz-clock" ${quick?'hidden':''}></span></span><button class="icon-button" data-action="map" aria-label="打开题目导航" ${quick?'hidden':''}>${icon('grid')}</button></div><div class="progress-row"><div class="progress-track" role="progressbar" aria-label="本局进度" aria-valuemin="0" aria-valuemax="${questions.length}" aria-valuenow="0"><span></span></div><span id="progress-label"></span></div><div id="question-stage"></div><p class="keyboard-note">${quick?'选完就走，猜错也能涨见识。':'1 至 4 选答案 · 方向键切题 · Enter 继续'}</p></section>`;
  renderQuestion();clock();clockTimer=setInterval(clock,1000);
}
function renderQuestion(){
  cancelAuto();paused=false;const q=questions[session.index],answer=session.answers[q.id],quick=session.config.mode==='quick';visit(q);
  const locked=session.confirmed.includes(q.id);
  $('#question-stage').innerHTML=`<article class="question-card" aria-labelledby="question-prompt"><div class="question-meta"><span class="question-topic">${icon(q.kind==='timeline'?'clock':q.topic==='stories'?'history':'spark')}${esc(q.tag||CATEGORIES[q.category].name)}</span>${quick?'<span class="small-dot"></span>':`<button class="flag-button" data-action="flag" aria-pressed="${session.flags.includes(q.id)}" aria-label="${session.flags.includes(q.id)?'取消留个记号':'留个记号'}">${icon('flag')}</button>`}</div><h1 id="question-prompt" tabindex="-1">${esc(q.prompt)}</h1><div class="answers" role="group" aria-label="选择一个答案">${q.options.map((o,i)=>`<button class="answer" data-answer="${i}" aria-pressed="${answer===o}"><span class="letter">${'ABCD'[i]}</span><span class="answer-text">${esc(o)}</span><span class="answer-mark"></span></button>`).join('')}</div><div id="answer-feedback" class="feedback" aria-live="polite"></div><div id="explanation-area"></div><div class="question-nav" ${quick?'hidden':''}><button class="text-button" data-action="previous" ${session.index===0?'disabled':''}>${icon('back')}上一题</button><button class="primary-button" id="advance" data-action="${session.config.mode==='practice'&&!locked?'confirm':'next'}">${session.config.mode==='practice'&&!locked?'就选这个':session.index===questions.length-1?'看看结果':'下一题'}${icon('arrow')}</button></div><div class="quick-controls" ${quick?'':'hidden'}><label class="auto-switch"><input id="auto-toggle" type="checkbox" ${read('auto',true)?'checked':''}>自动下一题</label><span id="auto-label"></span></div></article>`;
  updateOptions();updateProgress();if(locked)showFeedback(false);animate($('.question-card'));
  $('#question-prompt').focus({preventScroll:true});
}
// Selection changes four option nodes and the progress label. The shell, navigation and prompt survive.
function selectAnswer(index){
  if(view!=='quiz'||!session)return;const q=questions[session.index];if(session.confirmed.includes(q.id)||!q.options[index])return;
  if(session.deadline&&session.deadline<=Date.now()){finish(true);return;}
  session.answers[q.id]=q.options[index];
  if(session.config.mode==='quick')session.confirmed.push(q.id);
  save();updateOptions();updateProgress();
  if(session.config.mode==='quick')showFeedback(true);
}
function updateOptions(){
  const q=questions[session.index],answer=session.answers[q.id],locked=session.confirmed.includes(q.id);
  document.querySelectorAll('[data-answer]').forEach((b,i)=>{const o=q.options[i];b.classList.toggle('selected',answer===o);b.classList.toggle('correct',locked&&o===q.answer);b.classList.toggle('wrong',locked&&answer===o&&o!==q.answer);b.classList.toggle('dimmed',locked&&o!==answer&&o!==q.answer);b.setAttribute('aria-pressed',String(answer===o));b.disabled=locked;b.querySelector('.answer-mark').innerHTML=locked&&o===q.answer?icon('check'):locked&&o===answer?icon('close'):answer===o?'<span class="selection-dot"></span>':'';});
  const advance=$('#advance');if(advance&&session.config.mode==='practice')advance.disabled=!locked&&!answer;
}
function updateProgress(){
  const n=Object.keys(session.answers).length,track=$('.progress-track');track.setAttribute('aria-valuenow',n);track.firstElementChild.style.width=`${n/questions.length*100}%`;$('#progress-label').textContent=`${session.index+1} / ${questions.length}`;
  const btn=$(`[data-jump="${session.index}"]`);btn?.classList.toggle('answered',!!session.answers[questions[session.index].id]);
}
function confirmAnswer(){const q=questions[session.index];if(!session.answers[q.id])return;if(!session.confirmed.includes(q.id))session.confirmed.push(q.id);save();updateOptions();showFeedback(true);const b=$('#advance');b.dataset.action='next';b.innerHTML=`${session.index===questions.length-1?'看看结果':'下一题'}${icon('arrow')}`;b.disabled=false;}
function showFeedback(fresh){
  const q=questions[session.index],correct=session.answers[q.id]===q.answer,quick=session.config.mode==='quick';
  let streak=0;for(let i=session.index;i>=0;i--){if(session.answers[questions[i].id]!==questions[i].answer)break;streak++;}
  const line=correct?(streak>=3?`${streak} 连对，手感来了。`:'猜对了，有点东西。'):'这个答案，确实有点意外。';
  const f=$('#answer-feedback');f.className=`feedback visible ${correct?'good':'oops'}`;f.innerHTML=`<div class="feedback-line">${icon(correct?'check':'bulb')}<strong>${line}</strong><button class="text-button" data-action="explain">看个究竟${icon('arrow')}</button></div>${quick?`<button class="quick-next" data-action="next">${session.index===questions.length-1?'揭晓称号':'下一题'}${icon('arrow')}</button>`:''}`;
  if(fresh&&correct&&[3,5,10,20,50,100].includes(streak)){toast(`${streak} 连对！苹果雷达正在全速运转。`);if(streak===3)celebrate(12);}
  if(quick&&fresh)scheduleNext();else if(quick)$('#auto-label').textContent='等你点下一题';
}
function scheduleNext(){
  cancelAuto();if(view!=='quiz'||session.config.mode!=='quick')return;const q=questions[session.index];if(!session.confirmed.includes(q.id)||paused)return;
  const enabled=$('#auto-toggle')?.checked;if(!enabled){$('#auto-label').textContent='等你点下一题';return;}
  const token=generation;$('#auto-label').textContent='即将继续…';autoTimer=setTimeout(()=>{if(token===generation&&view==='quiz'&&!modal.open&&!document.hidden)nextQuestion();},1650);
}
function explain(){
  cancelAuto();paused=true;$('#auto-label').textContent='已停下，慢慢看';
  const q=questions[session.index];$('#explanation-area').innerHTML=`<div class="explanation"><p>${esc(q.explanation)}</p><div class="source-links">${sourceLinks(q)}</div></div>`;animate($('.explanation'));
}
function moveQuestion(index){
  if(!session||view!=='quiz')return;if(session.deadline&&session.deadline<=Date.now()){finish(true);return;}
  const stage=$('#question-stage');stage.style.minHeight=`${Math.max(stage.getBoundingClientRect().height,parseFloat(stage.style.minHeight)||0)}px`;
  session.index=Math.max(0,Math.min(questions.length-1,index));save();renderQuestion();
  const prompt=$('#question-prompt');if(prompt.getBoundingClientRect().bottom<24)window.scrollTo({top:Math.max(0,prompt.getBoundingClientRect().top+window.scrollY-24),behavior:'instant'});
  // Small scroll offsets survive; only deep explanation scrolling is brought back to the new prompt.
}
function nextQuestion(){if(session.config.mode==='quick'&&!session.confirmed.includes(questions[session.index].id))return;if(session.index===questions.length-1)requestFinish();else moveQuestion(session.index+1);}
function requestFinish(){
  cancelAuto();const left=questions.length-Object.keys(session.answers).length;
  if(left){dialog('这局先到这里？',`<p>还有 ${left} 题没猜。可以回去接着玩，也可以现在揭晓。</p><div class="dialog-actions"><button class="secondary-button" data-action="close">继续猜</button><button class="primary-button" data-action="finish">现在揭晓${icon('arrow')}</button></div>`);}else finish();
}
function clock(){if(view!=='quiz'||!session)return;if(session.deadline&&Date.now()>=session.deadline){finish(true);return;}const n=session.deadline?Math.max(0,Math.ceil((session.deadline-Date.now())/1000)):Math.floor((Date.now()-session.startedAt)/1000);const el=$('#quiz-clock');if(el)el.textContent=` · ${session.deadline?'还剩 ':''}${fmt(n)}`;}
function map(){cancelAuto();paused=true;dialog('随便跳，慢慢猜',`<div class="map-summary">已猜 ${Object.keys(session.answers).length}/${questions.length} 题</div><div class="map-grid">${questions.map((q,i)=>`<button class="map-cell ${session.answers[q.id]?'answered':''} ${session.flags.includes(q.id)?'flagged':''} ${i===session.index?'current':''}" data-jump="${i}" aria-label="第 ${i+1} 题${session.answers[q.id]?'，已猜':''}${session.flags.includes(q.id)?'，有记号':''}" ${i===session.index?'aria-current="step"':''}>${i+1}</button>`).join('')}</div><button class="primary-button full-width" data-action="end-round">现在揭晓${icon('arrow')}</button>`);}
function finish(timed=false){
  if(finishPending||!session)return;finishPending=true;cancelAuto();modal.close();clearInterval(clockTimer);
  report=grade(questions,session.answers,session.startedAt,Date.now());remove('session');results();if(timed)toast('时间到，这局的故事揭晓了。');
}
function results(){
  enter('result');const t=resultTitle(report),eggs=easterEggs(report);
  main.innerHTML=`<section class="result-shell"><p class="eyebrow">THAT WAS A GOOD GUESS.</p><div class="result-emblem ${t.tone}">${icon(report.score===100?'trophy':'spark')}</div><p class="result-badge">${t.badge}</p><h1 class="result-title">${t.title}</h1><p class="result-line">${t.line}</p><div class="score-row"><div class="result-score"><strong data-final="${report.score}">0</strong><span>分</span></div><span class="score-divider"></span><div class="result-stats"><span>猜对 <b>${report.correct} / ${report.total}</b> 题</span><span>这局用了 <b>${fmt(report.duration)}</b></span></div></div>${eggs.length?`<div class="egg-note">${icon('spark')}<span>${eggs.map(esc).join('<br>')}</span></div>`:''}<div class="result-actions"><button class="primary-button" data-action="quick">${icon('shuffle')}再来 5 题</button><button class="secondary-button" data-action="share-card">${icon('share')}晒晒战绩</button></div><div class="result-links"><button class="text-button" data-action="review">看看这局的冷知识${icon('arrow')}</button><button class="text-button" data-action="home">回到首页</button></div></section>`;
  animate($('.result-shell'));countUp($('.result-score strong'),report.score);if(report.score===100)celebrate(64);
}
function countUp(el,value){if(reduced()){el.textContent=value;return;}const start=performance.now();function frame(now){const p=Math.min(1,(now-start)/850);el.textContent=Math.round(value*(1-Math.pow(1-p,3)));if(p<1&&el.isConnected)requestAnimationFrame(frame);}requestAnimationFrame(frame);}
function review(){
  enter('review');main.innerHTML=`<section class="review-shell"><button class="back-button" data-action="results">${icon('back')}回到战绩</button><h1>每个答案，都有个故事。</h1><p class="muted">这一局的所有冷知识，慢慢看。</p><div class="review-list">${questions.map((q,i)=>`<details class="review-item"><summary><span class="review-state ${session.answers[q.id]===q.answer?'good':'oops'}">${icon(session.answers[q.id]===q.answer?'check':'bulb')}</span><span><small>第 ${i+1} 题</small>${esc(q.prompt)}</span>${icon('arrow')}</summary><div class="review-body"><p class="review-answer">正确答案：<b>${esc(q.answer)}</b>${session.answers[q.id]!==q.answer?`<span>你猜的是：${esc(session.answers[q.id]||'还没猜')}</span>`:''}</p><p>${esc(q.explanation)}</p><div class="source-links">${sourceLinks(q)}</div></div></details>`).join('')}</div><button class="primary-button" data-action="quick">再来 5 题${icon('arrow')}</button></section>`;
}
async function showShare(){
  const title=resultTitle(report);dialog('这一局，值得晒',`<p class="muted">带上你的称号，邀请朋友来猜。</p><div id="share-preview" class="share-preview"><span class="loader"></span></div><div class="share-buttons"><button class="primary-button" data-action="download" disabled>${icon('download')}保存图片</button><button class="secondary-button" data-action="native-share" disabled>${icon('share')}分享</button></div><button class="text-button full-width" data-action="copy">${icon('copy')}复制文字战绩</button>`);
  const currentReport=report;
  try{const generated=shareBlob || await createShareCard(report,title.title,title.line);if(report!==currentReport||!modal.open||!$('#share-preview'))return;shareBlob=generated;if(shareUrl)URL.revokeObjectURL(shareUrl);shareUrl=URL.createObjectURL(shareBlob);$('#share-preview').innerHTML=`<img src="${shareUrl}" alt="Apple 冷知识战绩：${report.score} 分，${esc(title.title)}，猜对 ${report.correct}/${report.total} 题，不服来战。">`;document.querySelectorAll('.share-buttons button').forEach(b=>b.disabled=false);}catch{if($('#share-preview'))$('#share-preview').innerHTML='<p>图片暂时没生成，先复制文字也能约朋友来猜。</p>';}
}
async function nativeShare(){if(!shareBlob)return;try{const file=new File([shareBlob],'apple-trivia.png',{type:'image/png'});if(navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title:'Apple 冷知识，不服来战'});else if(navigator.share)await navigator.share({title:'Apple 冷知识',text:shareText(report,resultTitle(report).title),url:SITE_URL});else{downloadBlob(shareBlob,`apple-trivia-${report.score}.png`);toast('战绩图已生成，发给朋友就能开战。');}}catch(e){if(e.name!=='AbortError')toast('这次没分享成功，可以保存图片再发。');}}
async function copy(){const s=shareText(report,resultTitle(report).title);try{await navigator.clipboard.writeText(s);toast('战绩已复制，不服来战。');}catch{dialog('复制你的战绩',`<textarea class="copy-text" readonly aria-label="战绩文字">${esc(s)}</textarea><p class="muted">长按或全选，即可复制。</p>`);$('.copy-text').select();}}
function celebrate(n){if(reduced())return;const box=$('#celebration');box.replaceChildren();for(let i=0;i<n;i++){const p=document.createElement('i');p.style.cssText=`--x:${Math.random()*100}vw;--drift:${(Math.random()-.5)*280}px;--r:${Math.random()*900}deg;--delay:${Math.random()*.4}s;--c:${['#af9bff','#ffbd9f','#9adacb','#f0cf74','#83b9fb'][i%5]}`;box.append(p);}setTimeout(()=>box.replaceChildren(),2500);}
function about(){dialog('为好奇心而作',`<div class="about-mark">${icon('spark')}</div><p>Apple Trivia 是一个非官方的 Apple 冷知识小游戏。默认 5 题，猜完就能领取称号。</p><p>目前有 <b>${bank.length.toLocaleString('en-US')}</b> 道题，包含产品故事、反直觉小知识、系统功能、发布年份和时间线。时间线题由产品与系统的年份记录组合生成，短局会优先抽趣味题。</p><p>每题都保留解析和 Apple 资料链接。年份采用首次发布或首次预览的公历年份，具体口径写在题目中。不同地区的上市时间可能不同。</p><p class="muted">进度仅保存在当前浏览器。无账户、无排行榜。与 Apple Inc. 无关联。v${VERSION}</p><a class="text-button" href="https://github.com/yunnre060214-sudo/Apple-Product-Knowledge-Quiz" target="_blank" rel="noopener noreferrer">查看题库与源代码${icon('external')}</a>`);}

document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.answer!==undefined){selectAnswer(Number(b.dataset.answer));return;}
  if(b.dataset.topic){start(quickConfig(b.dataset.topic));return;}
  if(b.dataset.count){config.count=Number(b.dataset.count);$('#count-input').value=b.dataset.count;document.querySelectorAll('[data-count]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));});updatePool();return;}
  if(b.dataset.jump!==undefined){modal.close();moveQuestion(Number(b.dataset.jump));return;}
  const actions={home,quick:()=>start(quickConfig()),custom,resume,about,close:()=>{modal.close();},theme:()=>{const dark=document.documentElement.dataset.theme!=='dark';document.documentElement.dataset.theme=dark?'dark':'light';write('theme',dark?'dark':'light');},next:nextQuestion,previous:()=>moveQuestion(session.index-1),confirm:confirmAnswer,explain,map,'end-round':requestFinish,finish:()=>finish(),results,review,'share-card':showShare,download:()=>shareBlob&&downloadBlob(shareBlob,`apple-trivia-${report.score}.png`),'native-share':nativeShare,copy,flag:()=>{const id=questions[session.index].id;session.flags=session.flags.includes(id)?session.flags.filter(x=>x!==id):[...session.flags,id];save();b.setAttribute('aria-pressed',String(session.flags.includes(id)));b.setAttribute('aria-label',session.flags.includes(id)?'取消留个记号':'留个记号');},reload:()=>location.reload()};actions[b.dataset.action]?.();
});
document.addEventListener('submit',e=>{if(e.target.id!=='custom-form')return;e.preventDefault();const next=formConfig();if(!Number.isInteger(next.count)||next.count<5||next.count>500||!next.categories.length)return;config=next;write('config',config);start(config);});
document.addEventListener('change',e=>{if(e.target.closest('#custom-form')){if(e.target.id==='mode-select')$('.timer-setting').hidden=e.target.value!=='exam';updatePool();}if(e.target.id==='auto-toggle'){write('auto',e.target.checked);paused=false;scheduleNext();}});
document.addEventListener('input',e=>{if(e.target.id==='count-input'){document.querySelectorAll('[data-count]').forEach(b=>{const active=Number(b.dataset.count)===Number(e.target.value);b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});updatePool();}});
document.addEventListener('keydown',e=>{if(view!=='quiz'||modal.open||e.repeat||/INPUT|SELECT|TEXTAREA|BUTTON|A/.test(document.activeElement.tagName)&&e.key==='Enter')return;if(/^[1-4]$/.test(e.key)){e.preventDefault();selectAnswer(Number(e.key)-1);}else if(e.key==='Enter'){e.preventDefault();if(session.config.mode==='practice'&&!session.confirmed.includes(questions[session.index].id))confirmAnswer();else nextQuestion();}else if(session.config.mode!=='quick'&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();e.key==='ArrowLeft'?moveQuestion(session.index-1):nextQuestion();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAuto();else if(view==='quiz'){clock();scheduleNext();}});
modal.addEventListener('close',()=>{if(view==='quiz'&&session?.config.mode==='quick'&&$('#auto-label'))$('#auto-label').textContent='等你点下一题';});
window.addEventListener('pagehide',()=>{save();cancelAuto();});
document.documentElement.dataset.theme=read('theme','light')==='dark'?'dark':'light';
async function init(){try{const res=await fetch(`./questions.json?v=${VERSION}`);if(!res.ok)throw new Error('load');const data=await res.json();if(data.version!==VERSION||!Array.isArray(data.questions))throw new Error('version');bank=data.questions;meta=data;home();}catch{main.innerHTML=`<div class="loading"><h1>冷知识还在路上。</h1><p>网络刚刚打了个盹，重新拆封试试。</p><button class="primary-button" data-action="reload">再试一次${icon('arrow')}</button></div>`;}}
init();
