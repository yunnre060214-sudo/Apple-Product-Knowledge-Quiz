import { VERSION, CATEGORIES, LEVELS, drawQuestions, filterBank, createSession, hydrateSession, grade, updateWrongBook } from '../src/engine.mjs';

const $ = s => document.querySelector(s);
const main = $('#main');
const modal = $('#modal');
const KEY = 'apple-quiz:v1:';
let storageFailed = false;
const read = (name, fallback) => { try { return JSON.parse(localStorage.getItem(KEY + name)) ?? fallback; } catch { return fallback; } };
const write = (name, value) => { try { localStorage.setItem(KEY + name, JSON.stringify(value)); } catch { if (!storageFailed) { storageFailed = true; toast('浏览器未允许本地存储，本次答题仍可继续，刷新后进度可能丢失。'); } } };
const remove = name => { try { localStorage.removeItem(KEY + name); } catch { /* Storage is optional. */ } };
const safeArray = value => Array.isArray(value) ? value : [];
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icon = (name, cls = '') => `<svg viewBox="0 0 24 24" aria-hidden="true" class="${cls}">${({ arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>', back: '<path d="M19 12H5m6-6-6 6 6 6"/>', clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>', flag: '<path d="M6 21V4m0 0c4-4 8 4 12 0v10c-4 4-8-4-12 0"/>', shuffle: '<path d="m17 3 4 4-4 4m0 2 4 4-4 4M3 7h3c5 0 7 10 12 10h3M3 17h3c2 0 3-2 4-4m3-2c1-2 3-4 5-4h3"/>', book: '<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15"/>', shield: '<path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z"/><path d="m8 12 3 3 5-6"/>', download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>', check: '<path d="m5 12 4 4L19 6"/>', history: '<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7m2-4v6l4 2"/>', retry: '<path d="M20 7a9 9 0 1 0 1 8m-1-8V2m0 5h-5"/>', share: '<path d="M12 16V2m-5 5 5-5 5 5M6 9H3v13h18V9h-3"/>' })[name] || ''}</svg>`;
const formatTime = seconds => { const n = Math.max(0, Math.floor(seconds)); return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`; };
const levelName = d => LEVELS[d]?.name || '综合';
const countLabel = n => Number(n).toLocaleString('en-US');
const initialConfig = { difficulty: 'mixed', count: 20, categories: Object.keys(CATEGORIES), mode: 'exam', secondsPerQuestion: 0 };
const savedConfig = read('config', {});
let config = { ...initialConfig, ...savedConfig };
if (!['mixed', ...Object.keys(LEVELS)].includes(config.difficulty)) config.difficulty = 'mixed';
config.categories = safeArray(config.categories).filter(c => CATEGORIES[c]);
if (!config.categories.length) config.categories = [...initialConfig.categories];
config.count = Math.min(500, Math.max(5, Number(config.count) || 20));
if (!['exam', 'practice'].includes(config.mode)) config.mode = 'exam';
if (![0, 30, 60, 90].includes(Number(config.secondsPerQuestion))) config.secondsPerQuestion = 0;
let bank = [], lookup = new Map(), bankMeta = {}, session = null, questions = [], view = 'home', report = null;
let wrongBook = safeArray(read('wrong', [])).filter(x => typeof x === 'string');
let seen = safeArray(read('seen', [])).filter(x => typeof x === 'string');
let history = safeArray(read('history', [])).filter(x => x && typeof x.id === 'string' && Number.isFinite(x.score) && x.config && Number.isFinite(x.endedAt));
let reviewFilter = 'incorrect', reviewPage = 0, wrongPage = 0, timerHandle, toastHandle;
let customCountOpen = ![10, 20, 50, 100, 200].includes(config.count);
let pendingStart = null;

function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastHandle); toastHandle = setTimeout(() => $('#toast').classList.remove('visible'), 4000); }
function showDialog(title, body, buttons = '') { $('#modal-content').innerHTML = `<h2 id="modal-title">${title}</h2>${body}${buttons ? `<div class="dialog-actions">${buttons}</div>` : ''}`; if (!modal.open) modal.showModal(); }
function closeDialog() { modal.close(); }
function focusMain(scroll = true) { if (scroll) window.scrollTo({ top: 0, behavior: 'instant' }); main.focus({ preventScroll: true }); }
function setView(next) { view = next; document.querySelectorAll('.nav-link').forEach(b => b.classList.toggle('active', b.dataset.action === (next === 'wrongbook' ? 'wrongbook' : next === 'history' ? 'history' : 'home'))); }
function updateWrongCount() { $('#wrong-count').textContent = wrongBook.length; }
function saveSession() { if (session) write('session', session); }
function badge(q) { return `<div class="badges"><span class="badge category" style="--cat:${CATEGORIES[q.category].color}">${CATEGORIES[q.category].name}</span><span class="badge">${levelName(q.difficulty)}</span></div>`; }
function sources(q) { return `<div class="sources">${q.sources.map((url, i) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">Apple 官方资料${q.sources.length > 1 ? ` ${i + 1}` : ''} ↗</a>`).join('')}</div>`; }
function explanation(q, correct) { return `<div class="explanation"><strong style="color:var(--${correct ? 'green' : 'red'})">${correct ? '回答正确' : '答案解析'}</strong><p>${escape(q.explanation)}</p>${sources(q)}</div>`; }

function renderHome() {
  setView('home'); stopTimer();
  const saved = hydrateSession(read('session', null), bank);
  main.innerHTML = `<section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="live-dot"></span> A LITTLE CURIOSITY. A LOT TO DISCOVER.</p><h1>Think you<br>know <span class="gradient-word">Apple?</span></h1><p class="hero-description">从口袋里的 iPhone，到改变创作的 Mac。<br>那些你熟悉的产品，还有多少你没发现的细节？</p><div class="hero-stat"><div><strong>${countLabel(bank.length)}</strong>原创题目</div><span></span><div><strong>8</strong>知识领域</div><span></span><div><strong>4</strong>难度档位</div></div></div><div class="device-scene" aria-hidden="true"><div class="scene-halo"></div><div class="orbit"></div><div class="orbit two"></div><span class="scene-label">DESIGNED TO<br>MAKE YOU THINK.</span><div class="floating-chip">A / M</div><div class="laptop"><div class="laptop-screen"></div><div class="laptop-base"></div></div><div class="device-phone"><div class="phone-glass"><span class="phone-time">9:41</span><span class="phone-date">THINK DIFFERENT. THINK DEEPER.</span></div></div><div class="mini-watch"><i class="watch-rings"></i></div><span class="little-star">✧</span><span class="scene-caption">one more question.</span></div></section>
  ${saved ? `<aside class="resume-banner">${icon('history')}<p>你还有一场未完成的测验<small>已答 ${Object.keys(saved.answers).length} / ${saved.questions.length} 题 · ${levelName(saved.config.difficulty)} · ${saved.config.mode === 'practice' ? '练习模式' : '测验模式'}</small></p><button class="secondary-button" data-action="resume">继续答题 ${icon('arrow')}</button></aside>` : ''}
  <section class="setup panel" aria-labelledby="setup-title"><div class="setup-main"><div class="section-heading"><h2 id="setup-title">定制你的挑战</h2><small>全新组卷，每次都有新发现</small></div><fieldset><legend class="field-title"><span class="step-number">01</span>选择难度</legend><div class="difficulty-options">${[['mixed','综合','MIX'],['easy','入门','01'],['medium','进阶','02'],['hard','困难','03'],['expert','专家','04']].map(([id, name, label]) => `<button type="button" class="choice ${config.difficulty === id ? 'selected' : ''}" data-difficulty="${id}" aria-pressed="${config.difficulty === id}"><span>${label}</span>${name}</button>`).join('')}</div><p class="field-hint" id="difficulty-hint">${difficultyHint()}</p></fieldset><fieldset><legend class="field-title"><span class="step-number">02</span>选择题量</legend><div class="count-options">${[10,20,50,100,200].map(n => `<button type="button" class="choice ${config.count === n && !customCountOpen ? 'selected' : ''}" data-count="${n}" aria-pressed="${config.count === n && !customCountOpen}">${n}<small>题</small></button>`).join('')}<button type="button" class="choice ${customCountOpen ? 'selected' : ''}" data-action="custom-count" aria-pressed="${customCountOpen}">自定</button></div><div class="custom-count" ${customCountOpen ? '' : 'hidden'}><label for="custom-count">题目数量</label><input id="custom-count" type="number" min="5" max="500" step="1" value="${config.count}" inputmode="numeric"><small class="muted">5 至 500 题</small></div></fieldset><fieldset><legend class="field-title"><span class="step-number">03</span>选择知识领域 <button type="button" class="text-button category-all" data-action="all-categories">${config.categories.length === 8 ? '清空选择' : '全部选择'}</button></legend><div class="category-options">${Object.entries(CATEGORIES).map(([id,c]) => `<button type="button" class="category-chip ${config.categories.includes(id) ? 'selected' : ''}" data-category="${id}" style="--cat:${c.color}" aria-pressed="${config.categories.includes(id)}"><span class="cat-dot" aria-hidden="true"></span>${c.name}<b>${bank.filter(q => q.category === id).length}</b></button>`).join('')}</div><p class="field-hint" id="pool-hint"></p></fieldset></div><aside class="setup-side"><p class="eyebrow">YOUR NEXT CHALLENGE</p><h3 class="paper-title">准备好了吗？</h3><p class="paper-description">让熟悉变成了解。<br>选好设置，来一场知识探索。</p><div class="paper-facts"><div><span>本次题量</span><b id="paper-count"></b></div><div><span>难度</span><b id="paper-level">${levelName(config.difficulty)}</b></div><div><span>题型</span><b>四选一 · 单项选择</b></div></div><div class="separator"></div><div class="mode-switch" role="group" aria-label="答题模式"><button data-mode="exam" class="${config.mode === 'exam' ? 'selected' : ''}" aria-pressed="${config.mode === 'exam'}">测验模式</button><button data-mode="practice" class="${config.mode === 'practice' ? 'selected' : ''}" aria-pressed="${config.mode === 'practice'}">练习模式</button></div><p class="field-hint" id="mode-hint">${modeHint()}</p><label class="timer-select" ${config.mode === 'practice' ? 'hidden' : ''}>限时设置<select id="timer-select" aria-label="每题计入的总时限">${[[0,'不限时'],[30,'每题 30 秒'],[60,'每题 60 秒'],[90,'每题 90 秒']].map(([n,label]) => `<option value="${n}" ${Number(config.secondsPerQuestion) === n ? 'selected' : ''}>${label}</option>`).join('')}</select></label><div class="start-wrap"><button type="button" class="primary-button" id="start-button" data-action="start">开始挑战 ${icon('arrow')}</button><p class="start-footnote">无需登录 · 进度自动保存在此浏览器</p></div></aside></section><section class="features-strip" aria-label="测验特色"><div class="feature">${icon('shuffle')}<div><strong>每一场，都不一样</strong><p>题目、选项随机排列，优先抽取近期未答题。</p></div></div><div class="feature">${icon('book')}<div><strong>答完，更懂一点</strong><p>逐题解析与 Apple 官方来源，知识有据可查。</p></div></div><div class="feature">${icon('shield')}<div><strong>随时暂停，接着探索</strong><p>自动保存答题进度，错题可以反复练习。</p></div></div></section>`;
  refreshPool();
}
function difficultyHint() { return config.difficulty === 'mixed' ? '四档难度混合，兼顾产品常识、型号细节与比较推理。' : ({ easy: '认识产品形态、接口和常见功能，适合轻松热身。', medium: '辨别产品代际、芯片和关键规格，考验你的熟悉程度。', hard: '深入显示技术、连接能力与兼容关系，留意题目的限定条件。', expert: '结合多个条件选型、比较或计算，需要把知识串联起来。' })[config.difficulty]; }
function modeHint() { return config.mode === 'exam' ? '交卷后统一公布答案，可随时返回修改。' : '逐题确认并查看解析，确认后的答案会锁定。'; }
function refreshPool() {
  if (view !== 'home') return;
  const n = filterBank(bank, config).length;
  $('#pool-hint').textContent = !config.categories.length ? '至少选择一个知识领域。' : `符合条件 ${countLabel(n)} 题${n < config.count ? `，本次将抽取全部 ${n} 题。` : '，同一场测验不会重复。'}`;
  $('#paper-count').textContent = `${Math.min(config.count, n)} 题`;
  $('#start-button').disabled = n === 0;
  write('config', config);
}
function startRequest(overrides = {}) {
  const next = { ...config, ...overrides };
  const pending = hydrateSession(read('session', null), bank);
  if (pending) {
    pendingStart = next;
    showDialog('开始新的挑战？', '<p>新挑战会替换当前未完成的答题进度。你也可以继续完成上一场。</p>', '<button class="secondary-button" data-action="resume">继续上一场</button><button class="primary-button" data-action="replace-session">开始新挑战</button>');
  } else startQuiz(next);
}
function startQuiz(next) {
  closeDialog();
  const random = new Uint32Array(1);
  crypto.getRandomValues(random);
  const seed = random[0];
  questions = drawQuestions(bank, next, seed, seen);
  if (!questions.length) { toast('当前条件下没有可抽取的题目。'); return; }
  const actualConfig = { ...next, count: questions.length };
  session = createSession(questions, actualConfig, seed);
  saveSession();
  renderQuiz(); focusMain(); startTimer();
}
function resumeQuiz() {
  closeDialog();
  const restored = hydrateSession(read('session', null), bank);
  if (!restored) { remove('session'); toast('这份进度无法恢复，请开始新挑战。'); renderHome(); return; }
  questions = restored.hydratedQuestions;
  delete restored.hydratedQuestions;
  session = restored;
  if (session.deadline && session.deadline <= Date.now()) { finishQuiz(true); return; }
  renderQuiz(); focusMain(); startTimer();
}
function renderQuiz() {
  setView('quiz');
  const q = questions[session.index];
  const answer = session.answers[q.id];
  const confirmed = session.confirmed.includes(q.id);
  const practice = session.config.mode === 'practice';
  const flag = session.flags.includes(q.id);
  const answered = Object.keys(session.answers).length;
  main.innerHTML = `<div class="quiz-header"><button class="back-button" data-action="leave-quiz">${icon('back')}保存并返回</button><div class="quiz-meta"><span>${levelName(session.config.difficulty)} · ${practice ? '练习' : '测验'}</span><span class="quiz-time mono" id="quiz-clock">${icon('clock')}<span></span></span></div></div><div class="quiz-progress"><div class="progress-track" role="progressbar" aria-label="已作答进度" aria-valuenow="${answered}" aria-valuemin="0" aria-valuemax="${questions.length}"><span style="width:${answered / questions.length * 100}%"></span></div><span class="progress-caption mono">已答 ${answered} / ${questions.length}</span></div><div class="quiz-layout"><section class="question-card panel" aria-labelledby="question-prompt"><div class="question-toolbar">${badge(q)}<button class="flag-button ${flag ? 'flagged' : ''}" data-action="flag" aria-pressed="${flag}">${icon('flag')}${flag ? '已标记' : '稍后复查'}</button></div><p class="question-number mono">QUESTION ${String(session.index + 1).padStart(2, '0')} <span class="muted">/ ${String(questions.length).padStart(2, '0')}</span></p><h1 class="question-prompt" id="question-prompt">${escape(q.prompt)}</h1><div class="answers" role="group" aria-label="单选答案">${q.options.map((o,i) => { const cls = confirmed ? o === q.answer ? 'correct' : answer === o ? 'wrong' : '' : answer === o ? 'selected' : ''; return `<button type="button" class="answer ${cls}" data-answer="${i}" aria-pressed="${answer === o}" ${confirmed ? 'disabled' : ''}><span class="letter" aria-hidden="true">${'ABCD'[i]}</span><span class="answer-text">${escape(o)}</span>${confirmed && o === q.answer ? '<span class="answer-state">正确答案</span>' : confirmed && answer === o ? '<span class="answer-state">你的答案</span>' : ''}</button>`; }).join('')}</div>${confirmed ? explanation(q, answer === q.answer) : ''}<div class="question-navigation"><button class="secondary-button" data-action="previous" ${session.index === 0 ? 'disabled' : ''}>${icon('back')}上一题</button>${practice && !confirmed ? `<button class="primary-button" data-action="confirm-answer" ${answer ? '' : 'disabled'}>确认答案 ${icon('check')}</button>` : `<button class="primary-button" data-action="${session.index === questions.length - 1 ? 'submit' : 'next'}">${session.index === questions.length - 1 ? '提交答卷' : '下一题'} ${icon('arrow')}</button>`}</div><p class="key-hint">键盘 1–4 选择 · ← → 切题 · Enter ${practice && !confirmed ? '确认答案' : '下一题'}</p></section><aside class="quiz-sidebar"><div class="question-map panel"><h3>答题卡 <span class="muted mono">${questions.length} 题</span></h3><div class="map-grid">${questions.map((item,i) => `<button type="button" class="map-cell ${session.answers[item.id] ? 'answered' : ''} ${i === session.index ? 'current' : ''} ${session.flags.includes(item.id) ? 'flagged' : ''}" data-jump="${i}" ${i === session.index ? 'aria-current="step"' : ''} aria-label="第 ${i + 1} 题，${session.answers[item.id] ? '已答' : '未答'}${session.flags.includes(item.id) ? '，已标记' : ''}">${i + 1}</button>`).join('')}</div><div class="map-legend"><span><i class="done"></i>已答</span><span><i></i>未答</span><span><i class="mark"></i>标记</span></div><button class="secondary-button map-submit" data-action="submit">提交答卷</button></div><p class="sidebar-note">${practice ? '确认后立即查看解析。你可以跳过暂时没有把握的题，交卷前再来思考。' : '所有题目均为单项选择。交卷前可以修改答案，未作答的题目按错误计入总分。'}${session.deadline ? '<br>限时为全卷共享，离开页面后仍继续计时。' : ''}</p></aside></div>`;
  updateClock();
}
function selectAnswer(index) {
  if (!session || session.confirmed.includes(questions[session.index].id)) return;
  if (session.deadline && session.deadline <= Date.now()) { finishQuiz(true); return; }
  const q = questions[session.index];
  if (!q.options[index]) return;
  session.answers[q.id] = q.options[index]; saveSession();
  const focusedIndex = index;
  renderQuiz(); document.querySelector(`[data-answer="${focusedIndex}"]`)?.focus({ preventScroll: true });
}
function moveQuestion(index) { session.index = Math.max(0, Math.min(questions.length - 1, index)); saveSession(); renderQuiz(); $('#question-prompt').setAttribute('tabindex', '-1'); $('#question-prompt').focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }
function confirmAnswer() {
  const q = questions[session.index];
  if (!session.answers[q.id]) return;
  if (!session.confirmed.includes(q.id)) session.confirmed.push(q.id);
  saveSession(); renderQuiz(); $('.explanation').setAttribute('tabindex', '-1'); $('.explanation').focus({ preventScroll: true });
}
function stopTimer() { clearInterval(timerHandle); }
function startTimer() { stopTimer(); updateClock(); timerHandle = setInterval(updateClock, 1000); }
function updateClock() {
  if (view !== 'quiz' || !session) return;
  if (session.deadline && session.deadline <= Date.now()) { finishQuiz(true); return; }
  const clock = $('#quiz-clock'); if (!clock) return;
  const seconds = session.deadline ? Math.ceil((session.deadline - Date.now()) / 1000) : Math.floor((Date.now() - session.startedAt) / 1000);
  clock.querySelector('span').textContent = `${session.deadline ? '剩余 ' : ''}${formatTime(seconds)}`;
  clock.classList.toggle('urgent', !!session.deadline && seconds < 60);
  clock.setAttribute('aria-label', `${session.deadline ? '剩余' : '已用'} ${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒`);
}
function requestSubmit() {
  if (session.deadline && session.deadline <= Date.now()) { finishQuiz(true); return; }
  const missing = questions.length - Object.keys(session.answers).length;
  const unconfirmed = session.config.mode === 'practice' ? questions.filter(q => session.answers[q.id] && !session.confirmed.includes(q.id)).length : 0;
  showDialog('提交这份答卷？', `<p>${missing ? `还有 <b>${missing}</b> 题未作答，未答题目按错误计入成绩。` : '你已完成所有题目。提交后可以查看成绩、逐题解析和官方资料。'}${session.flags.length ? ` 已标记 ${session.flags.length} 题待复查。` : ''}${unconfirmed ? ` 有 ${unconfirmed} 题已选择但未确认，将按所选答案计分。` : ''}</p>`, '<button class="secondary-button" data-action="close-modal">继续检查</button><button class="primary-button" data-action="finish">确认交卷</button>');
}
function finishQuiz(timedOut = false) {
  if (!session) return;
  closeDialog(); stopTimer();
  const endedAt = timedOut && session.deadline ? session.deadline : Date.now();
  report = { ...grade(questions, session.answers, session.startedAt, endedAt), id: session.id, config: session.config, endedAt, timedOut, questionIds: questions.map(q => q.id) };
  wrongBook = updateWrongBook(wrongBook, report); write('wrong', wrongBook); updateWrongCount();
  seen = [...new Set([...seen, ...questions.map(q => q.id)])].slice(-Math.max(400, Math.floor(bank.length * .7))); write('seen', seen);
  const compact = { id: report.id, score: report.score, total: report.total, correct: report.correct, endedAt, duration: report.duration, config: { difficulty: session.config.difficulty, mode: session.config.mode, categories: session.config.categories } };
  history = [compact, ...history.filter(h => h.id !== compact.id)].slice(0, 40); write('history', history);
  write('last-report', report); remove('session'); session = null;
  reviewFilter = 'incorrect'; reviewPage = 0; renderResults(); focusMain();
  if (timedOut) toast('答题时间已到，已自动提交答卷。');
}
function statRows(groups, dictionary) { return Object.entries(groups).map(([id,n]) => `<div class="stat-row"><span>${dictionary[id]?.name || id}</span><div class="progress-track"><span style="width:${n.correct/n.total*100}%;${dictionary[id]?.color ? `background:${dictionary[id].color}` : ''}"></span></div><span>${n.correct} / ${n.total}</span></div>`).join(''); }
function renderResults() {
  if (!report) { renderHistory(); return; }
  setView('results'); stopTimer();
  const title = report.score === 100 ? '所有好奇，都有回响。' : report.score >= 80 ? '你很懂 Apple。' : report.score >= 60 ? '了解，比熟悉更进一步。' : '好奇心，才是最好的开始。';
  main.innerHTML = `<div class="page-top"><div><p class="eyebrow">YOUR KNOWLEDGE, DISCOVERED.</p><h1>挑战完成</h1></div><button class="back-button" data-action="home">返回首页 ${icon('arrow')}</button></div><section class="result-hero panel"><div class="score-ring" style="--score:${report.score}" role="img" aria-label="总分 ${report.score} 分"><div class="score-number mono"><strong>${report.score}</strong><small>总分 / 100</small></div></div><div class="result-heading"><p class="eyebrow">${levelName(report.config.difficulty)} · ${report.config.mode === 'practice' ? '练习模式' : '测验模式'}${report.timedOut ? ' · 限时结束' : ''}</p><h2>${title}</h2><p>答对 ${report.correct} / ${report.total} 题。每一个新发现，都在扩展你的知识版图。</p><div class="result-facts"><div><strong>${report.score}%</strong>正确率</div><div><strong>${formatTime(report.duration)}</strong>本次用时</div><div><strong>${report.bestStreak}</strong>最长连续答对</div><div><strong>${report.weightedScore}</strong>难度加权分</div></div></div></section><div class="result-actions"><button class="primary-button" data-action="another">再挑战一次 ${icon('shuffle')}</button><button class="secondary-button" data-action="retry-result" ${report.correct === report.total ? 'disabled' : ''}>${icon('retry')}重练本次错题</button><button class="secondary-button" data-action="export">${icon('download')}导出答题报告</button><button class="secondary-button" data-action="share">${icon('share')}复制成绩</button></div><div class="result-grid"><section class="panel stats-panel"><h3>你的产品知识版图</h3><div class="stat-rows">${statRows(report.categories, CATEGORIES)}</div></section><section class="panel stats-panel"><h3>不同难度的表现</h3><div class="stat-rows">${statRows(report.levels, LEVELS)}</div><p class="field-hint">每题等权计入总分；加权分按入门至专家 1、2、3、4 分计算。未答 ${report.unanswered} 题。</p></section></div><section class="review-section"><div class="review-heading"><h2>把答案变成知识</h2><div class="filter-tabs" role="group" aria-label="解析筛选">${[['incorrect',`错题 ${report.total-report.correct}`],['all','全部题目']].map(([id,name]) => `<button data-review-filter="${id}" class="${reviewFilter === id ? 'selected' : ''}" aria-pressed="${reviewFilter === id}">${name}</button>`).join('')}</div></div><div id="review-list"></div></section>`;
  renderReview();
}
function reviewCard(q, row, number, reveal = true) {
  const state = row?.state;
  return `<article class="review-card panel"><div class="question-toolbar">${badge(q)}<span>${number ? `第 ${number} 题 · ` : ''}${row ? `<span class="status-label ${state}">${state === 'correct' ? '回答正确' : state === 'unanswered' ? '未作答' : '回答错误'}</span>` : `<span class="mono">${escape(q.id)}</span>`}</span></div><h3>${escape(q.prompt)}</h3>${reveal ? `${row && state !== 'correct' ? `<p class="review-answer wrong">你的答案：${row.answer ? escape(row.answer) : '未作答'}</p>` : ''}<p class="review-answer correct">正确答案：${escape(q.answer)}</p><div class="explanation"><p>${escape(q.explanation)}</p>${sources(q)}</div>` : ''}</article>`;
}
function pagination(page, total, action) { return total > 1 ? `<div class="pagination"><button class="secondary-button" data-${action}="${page-1}" ${page===0?'disabled':''}>上一页</button><span>${page+1} / ${total}</span><button class="secondary-button" data-${action}="${page+1}" ${page===total-1?'disabled':''}>下一页</button></div>` : ''; }
function renderReview() {
  const rows = report.rows.map((r,i) => ({ row:r, q:lookup.get(r.id), i })).filter(x => x.q && (reviewFilter==='all' || x.row.state!=='correct'));
  const total = Math.ceil(rows.length / 12); reviewPage=Math.max(0,Math.min(reviewPage,total-1));
  $('#review-list').innerHTML = rows.length ? rows.slice(reviewPage*12,(reviewPage+1)*12).map(x => reviewCard(x.q,x.row,x.i+1)).join('') + pagination(reviewPage,total,'review-page') : '<div class="empty-state panel"><div class="empty-symbol">'+icon('check')+'</div><h2>这场挑战，没有错题。</h2><p>也可以切换到「全部题目」，回看每一道题的解析。</p></div>';
}
function renderWrongbook() {
  setView('wrongbook'); stopTimer();
  const wrong = wrongBook.map(id=>lookup.get(id)).filter(Boolean); const pages=Math.ceil(wrong.length/12); wrongPage=Math.max(0,Math.min(wrongPage,pages-1));
  main.innerHTML=`<div class="page-top"><div><p class="eyebrow">A SECOND LOOK. A NEW DISCOVERY.</p><h1>错题本</h1><p>收藏每一次暂时的不确定。重练答对后，题目会自动移出。</p></div></div>${wrong.length?`<div class="wrongbook-toolbar"><p>共 ${wrong.length} 道待掌握的题 · 包含未作答题目</p><button class="primary-button" data-action="retry-all">重练错题 ${icon('arrow')}</button></div>${wrong.slice(wrongPage*12,(wrongPage+1)*12).map(q=>reviewCard(q,null)).join('')}${pagination(wrongPage,pages,'wrong-page')}`:`<div class="panel empty-state"><div class="empty-symbol">${icon('book')}</div><h2>下一次发现，从这里开始。</h2><p>完成一场测验，答错和未作答的题目会自动汇集到这里。</p><button class="primary-button" data-action="home">去挑战 ${icon('arrow')}</button></div>`}`;
}
function renderHistory() {
  setView('history');stopTimer();
  const total=history.reduce((n,r)=>n+r.total,0), correct=history.reduce((n,r)=>n+r.correct,0);
  main.innerHTML=`<div class="page-top"><div><p class="eyebrow">EVERY QUESTION COUNTS.</p><h1>答题记录</h1><p>你的好奇心，值得被记录。最多保留最近 40 场，仅存于此浏览器。</p></div></div>${history.length?`<section class="panel history-summary"><div><strong>${history.length}</strong><span>已完成挑战</span></div><div><strong>${total}</strong><span>累计作答</span></div><div><strong>${Math.round(correct/total*100)}%</strong><span>累计正确率</span></div></section>${history.map(h=>`<article class="panel history-row"><div class="history-score mono">${h.score}<small class="muted"> 分</small></div><div class="history-info"><strong>${levelName(h.config.difficulty)} · ${h.total} 题 · ${h.config.mode==='practice'?'练习模式':'测验模式'}</strong><p>${new Date(h.endedAt).toLocaleString('zh-CN')} · 答对 ${h.correct} 题 · ${formatTime(h.duration)}</p></div>${h.id===read('last-report',null)?.id?'<button class="secondary-button" data-action="last-result">查看解析</button>':'<span>已完成</span>'}</article>`).join('')}`:`<div class="panel empty-state"><div class="empty-symbol">${icon('history')}</div><h2>第一场挑战，等你开始。</h2><p>完成答题后，可以在这里看到你的成绩与进步。</p><button class="primary-button" data-action="home">开始探索 ${icon('arrow')}</button></div>`}`;
}
function renderAbout() {
  showDialog('关于这份题库', `<p>Apple Product Knowledge Quiz 是独立制作的知识测验，与 Apple Inc. 无隶属或赞助关系。题干、选项和解析为本项目原创，产品事实以对应的 Apple 技术规格、支持文档和 Newsroom 为依据。</p><div class="bank-overview">${Object.entries(CATEGORIES).map(([id,c])=>`<div><span>${c.name}</span><b>${bank.filter(q=>q.category===id).length} 题</b></div>`).join('')}</div><p class="about-text">当前共 ${countLabel(bank.length)} 题，资料核对日期 ${bankMeta.reviewedAt || '2026-10-15'}。型号题均指题目明确指定的设备；续航、显示尺寸、传输速率按题目所述官方测试或标称口径，功能可用性以当地官方资料为准。</p><p class="about-text">成绩与进度保存在当前浏览器，不设账户，不上传答题记录。更换设备或清除浏览器数据后，记录不会保留。<a href="https://github.com/yunnre060214-sudo/Apple-Product-Knowledge-Quiz/issues" target="_blank" rel="noopener noreferrer">发现题目问题？反馈到 GitHub ↗</a></p>`);
}
function exportReport() {
  if (!report) return;
  const lines=['# Apple Product Knowledge Quiz 答题报告','',`日期：${new Date(report.endedAt).toLocaleString('zh-CN')}`,`难度：${levelName(report.config.difficulty)}；模式：${report.config.mode==='practice'?'练习':'测验'}`,`成绩：${report.score}/100；答对 ${report.correct}/${report.total}；用时 ${formatTime(report.duration)}；难度加权分 ${report.weightedScore}`, '', '评分：每题等权计算百分制总分，未答计错；加权分按四档难度 1、2、3、4 分折算为百分制。', '', ...report.rows.flatMap((row,i)=>{const q=lookup.get(row.id);if(!q)return[];return [`## ${i+1}. ${q.prompt}`, '', `领域：${CATEGORIES[q.category].name}；难度：${levelName(q.difficulty)}`,`你的答案：${row.answer||'未作答'}；${row.state==='correct'?'正确':'错误'}`,`正确答案：${q.answer}`, '', `解析：${q.explanation}`, '', ...q.sources.map(u=>`来源：${u}`), ''];})];
  const blob=new Blob(['\uFEFF'+lines.join('\n')],{type:'text/markdown;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`Apple-Quiz-${new Date(report.endedAt).toISOString().slice(0,10)}-${report.score}.md`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('答题报告已导出。');
}
async function shareResult() {
  const text=`我在 Apple Product Knowledge Quiz 的${levelName(report.config.difficulty)}挑战中答对了 ${report.correct}/${report.total} 题，获得 ${report.score} 分！\n${new URL('./',location.href).href}`;
  try { await navigator.clipboard.writeText(text);toast('成绩已复制，可以分享了。'); } catch { showDialog('分享你的成绩',`<p>复制下面的文字即可分享：</p><textarea readonly aria-label="成绩分享文字" style="width:100%;height:135px;margin-top:15px;padding:12px;background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:9px">${escape(text)}</textarea>`); }
}
function navigate(action) { if (view==='quiz') saveSession(); if(action==='home')renderHome();else if(action==='wrongbook')renderWrongbook();else renderHistory(); focusMain(); }
document.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.difficulty){config.difficulty=b.dataset.difficulty;renderHome();return;}
  if(b.dataset.count){config.count=Number(b.dataset.count);customCountOpen=false;renderHome();return;}
  if(b.dataset.category){const id=b.dataset.category;config.categories=config.categories.includes(id)?config.categories.filter(c=>c!==id):[...config.categories,id];renderHome();return;}
  if(b.dataset.mode){config.mode=b.dataset.mode;renderHome();return;}
  if(b.dataset.answer!==undefined){selectAnswer(Number(b.dataset.answer));return;}
  if(b.dataset.jump!==undefined){moveQuestion(Number(b.dataset.jump));return;}
  if(b.dataset.reviewFilter){reviewFilter=b.dataset.reviewFilter;reviewPage=0;renderResults();return;}
  if(b.dataset.reviewPage!==undefined){reviewPage=Number(b.dataset.reviewPage);renderReview();$('.review-section').scrollIntoView();return;}
  if(b.dataset.wrongPage!==undefined){wrongPage=Number(b.dataset.wrongPage);renderWrongbook();focusMain();return;}
  const action=b.dataset.action;
  if(['home','wrongbook','history'].includes(action)){navigate(action);return;}
  switch(action){
    case 'reload':location.reload();break;
    case 'about':renderAbout();break;
    case 'close-modal':closeDialog();break;
    case 'custom-count':customCountOpen=true;renderHome();$('#custom-count').focus();break;
    case 'all-categories':config.categories=config.categories.length===8?[]:Object.keys(CATEGORIES);renderHome();break;
    case 'start':startRequest();break;
    case 'replace-session':startQuiz(pendingStart);pendingStart=null;break;
    case 'resume':resumeQuiz();break;
    case 'leave-quiz':saveSession();renderHome();focusMain();break;
    case 'previous':moveQuestion(session.index-1);break;
    case 'next':moveQuestion(session.index+1);break;
    case 'confirm-answer':confirmAnswer();break;
    case 'flag':{const id=questions[session.index].id;session.flags=session.flags.includes(id)?session.flags.filter(i=>i!==id):[...session.flags,id];saveSession();renderQuiz();break;}
    case 'submit':requestSubmit();break;
    case 'finish':finishQuiz();break;
    case 'another':startRequest({...report.config,ids:undefined});break;
    case 'retry-result':startRequest({difficulty:'mixed',categories:Object.keys(CATEGORIES),ids:report.rows.filter(r=>r.state!=='correct').map(r=>r.id),count:report.total-report.correct,mode:'practice',secondsPerQuestion:0});break;
    case 'retry-all':startRequest({difficulty:'mixed',categories:Object.keys(CATEGORIES),ids:wrongBook,count:Math.min(wrongBook.length,500),mode:'practice',secondsPerQuestion:0});break;
    case 'last-result':report=read('last-report',null);reviewPage=0;renderResults();focusMain();break;
    case 'export':exportReport();break;
    case 'share':void shareResult();break;
  }
});
document.addEventListener('change',event=>{
  if(event.target.id==='custom-count'){const n=Number(event.target.value);if(!Number.isInteger(n)||n<5||n>500){event.target.value=config.count;toast('自定义题量请输入 5 至 500 之间的整数。');return;}config.count=n;refreshPool();}
  if(event.target.id==='timer-select'){config.secondsPerQuestion=Number(event.target.value);write('config',config);}
});
document.addEventListener('keydown',event=>{
  if(view!=='quiz'||modal.open||event.ctrlKey||event.metaKey||event.altKey||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;
  if(/^[1-4]$/.test(event.key)){event.preventDefault();selectAnswer(Number(event.key)-1);}
  else if(event.key==='ArrowLeft'){event.preventDefault();moveQuestion(session.index-1);}
  else if(event.key==='ArrowRight'){event.preventDefault();moveQuestion(session.index+1);}
  else if(event.key==='Enter' && (!event.target.closest('button') || event.target.closest('[data-answer]'))){event.preventDefault();if(session.config.mode==='practice'&&!session.confirmed.includes(questions[session.index].id))confirmAnswer();else if(session.index===questions.length-1)requestSubmit();else moveQuestion(session.index+1);}
});
document.addEventListener('visibilitychange',()=>{if(view==='quiz'){saveSession();if(document.visibilityState==='visible')updateClock();}});
window.addEventListener('pagehide',saveSession);
const media=window.matchMedia('(prefers-color-scheme: dark)');
let theme=read('theme',null);
function applyTheme(){const dark=theme?theme==='dark':media.matches;document.documentElement.dataset.theme=dark?'dark':'light';$('#theme-toggle').setAttribute('aria-label',dark?'切换浅色外观':'切换深色外观');document.querySelector('meta[name="theme-color"]').content=dark?'#151619':'#f6f7f9';}
$('#theme-toggle').addEventListener('click',()=>{theme=document.documentElement.dataset.theme==='dark'?'light':'dark';write('theme',theme);applyTheme();});media.addEventListener('change',applyTheme);applyTheme();

async function init() {
  try{
    const response=await fetch(new URL('../questions.json?v='+VERSION,import.meta.url));
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    if(data.version!==VERSION||!Array.isArray(data.questions)||!data.questions.length)throw new Error('题库版本与网站不匹配');
    bank=data.questions;bankMeta=data;lookup=new Map(bank.map(q=>[q.id,q]));
    wrongBook=wrongBook.filter(id=>lookup.has(id));write('wrong',wrongBook);seen=seen.filter(id=>lookup.has(id));updateWrongCount();
    const saved=read('session',null);if(saved&&!hydrateSession(saved,bank)){remove('session');toast('题库已更新，已保留成绩与错题，请开始新挑战。');}
    renderHome();
  }catch(error){main.innerHTML=`<div class="empty-state panel" style="margin-top:60px"><h1 style="font-size:27px">题库暂时未能加载</h1><p>请检查网络后重试。首次部署需要等待 GitHub Pages 完成发布。</p><button class="primary-button" data-action="reload">重新加载</button><p class="source-label">${escape(error.message)}</p></div>`;}
}
void init();
