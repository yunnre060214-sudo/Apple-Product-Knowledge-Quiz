export const VERSION = '1.0.0';
export const CATEGORIES = {
  iphone: { name: 'iPhone', short: 'iP', color: '#3478e7' },
  ipad: { name: 'iPad', short: 'iD', color: '#8958c7' },
  mac: { name: 'Mac', short: 'Mc', color: '#b27637' },
  silicon: { name: 'Apple 芯片', short: 'Si', color: '#4d7580' },
  watch: { name: 'Apple Watch', short: 'Aw', color: '#ba5666' },
  audio: { name: '音频与家居', short: 'Au', color: '#587a49' },
  ecosystem: { name: '系统与生态', short: 'OS', color: '#6072a1' },
  history: { name: '产品历史', short: 'Hi', color: '#96634e' },
};
export const LEVELS = {
  easy: { name: '入门', label: '认识产品与功能', weight: 1 },
  medium: { name: '进阶', label: '熟悉型号与代际', weight: 2 },
  hard: { name: '困难', label: '理解规格与兼容', weight: 3 },
  expert: { name: '专家', label: '比较、推理与应用', weight: 4 },
};
export function hash(text) {
  let value = 2166136261;
  for (let i = 0; i < text.length; i++) value = Math.imul(value ^ text.charCodeAt(i), 16777619);
  return value >>> 0;
}
export function seeded(seed) {
  let value = typeof seed === 'number' ? seed : hash(String(seed));
  return () => {
    value += 0x6d2b79f5;
    let n = value;
    n = Math.imul(n ^ n >>> 15, n | 1);
    n ^= n + Math.imul(n ^ n >>> 7, n | 61);
    return ((n ^ n >>> 14) >>> 0) / 4294967296;
  };
}
export function shuffle(items, rng = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function filterBank(bank, { categories = Object.keys(CATEGORIES), difficulty = 'mixed', ids } = {}) {
  const allowed = new Set(categories);
  const allowedIds = ids ? new Set(ids) : null;
  return bank.filter(q => allowed.has(q.category) && (difficulty === 'mixed' || q.difficulty === difficulty) && (!allowedIds || allowedIds.has(q.id)));
}
// Round-robin across shuffled category/level buckets gives small topics a fair place in a paper.
export function drawQuestions(bank, config, seed, seen = []) {
  const rng = seeded(seed);
  const pool = filterBank(bank, config);
  const wanted = Math.min(pool.length, Math.max(1, Math.floor(config.count || 20)));
  const recent = new Set(seen);
  const takeBalanced = (items, limit) => {
    const groups = new Map();
    for (const q of shuffle(items, rng)) {
      const key = `${q.category}:${q.difficulty}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(q);
    }
    const buckets = shuffle([...groups.values()], rng);
    const picked = [];
    while (picked.length < limit && buckets.some(b => b.length)) {
      for (const bucket of buckets) if (bucket.length && picked.length < limit) picked.push(bucket.pop());
    }
    return picked;
  };
  const fresh = takeBalanced(pool.filter(q => !recent.has(q.id)), wanted);
  const old = takeBalanced(pool.filter(q => recent.has(q.id)), wanted - fresh.length);
  return shuffle([...fresh, ...old], rng).map(q => ({ ...q, options: shuffle(q.options, rng) }));
}
export function createSession(questions, config, seed, now = Date.now()) {
  const seconds = config.mode === 'exam' ? Number(config.secondsPerQuestion || 0) : 0;
  return {
    schema: 1, version: VERSION, id: `${now}-${seed}`, seed, config,
    questions: questions.map(q => ({ id: q.id, options: q.options })),
    answers: {}, confirmed: [], flags: [], index: 0, startedAt: now,
    deadline: seconds > 0 ? now + questions.length * seconds * 1000 : null,
  };
}
export function hydrateSession(saved, bank) {
  if (!saved || saved.schema !== 1 || saved.version !== VERSION || !Array.isArray(saved.questions) || !saved.questions.length || !Number.isFinite(saved.startedAt)) return null;
  if (!saved.config || !['exam', 'practice'].includes(saved.config.mode)) return null;
  const lookup = new Map(bank.map(q => [q.id, q]));
  const ids = new Set();
  const questions = [];
  for (const row of saved.questions) {
    const q = lookup.get(row.id);
    if (!q || ids.has(q.id) || !Array.isArray(row.options) || row.options.length !== q.options.length || new Set(row.options).size !== q.options.length || !row.options.every(o => q.options.includes(o))) return null;
    ids.add(q.id);
    questions.push({ ...q, options: row.options });
  }
  const answers = {};
  for (const q of questions) if (q.options.includes(saved.answers?.[q.id])) answers[q.id] = saved.answers[q.id];
  const safeIds = a => Array.isArray(a) ? [...new Set(a)].filter(id => ids.has(id)) : [];
  return {
    ...saved, answers, confirmed: safeIds(saved.confirmed).filter(id => answers[id]),
    flags: safeIds(saved.flags), index: Math.max(0, Math.min(questions.length - 1, Math.floor(saved.index) || 0)),
    deadline: Number.isFinite(saved.deadline) && saved.deadline > saved.startedAt ? saved.deadline : null,
    hydratedQuestions: questions,
  };
}
export function grade(questions, answers, startedAt, endedAt) {
  let correct = 0, unanswered = 0, points = 0, possible = 0, streak = 0, bestStreak = 0;
  const categories = {};
  const levels = {};
  const rows = questions.map(q => {
    const answer = answers[q.id] || null;
    const isCorrect = answer === q.answer;
    const weight = LEVELS[q.difficulty].weight;
    const state = answer === null ? 'unanswered' : isCorrect ? 'correct' : 'wrong';
    possible += weight;
    if (isCorrect) { correct++; points += weight; streak++; } else { streak = 0; }
    if (answer === null) unanswered++;
    bestStreak = Math.max(bestStreak, streak);
    for (const [group, key] of [[categories, q.category], [levels, q.difficulty]]) {
      group[key] ||= { total: 0, correct: 0 };
      group[key].total++;
      group[key].correct += Number(isCorrect);
    }
    return { id: q.id, answer, state };
  });
  return {
    total: questions.length, correct, wrong: questions.length - correct - unanswered, unanswered,
    score: questions.length ? Math.round(correct / questions.length * 100) : 0,
    weightedScore: possible ? Math.round(points / possible * 100) : 0,
    bestStreak, duration: Math.max(0, Math.floor((endedAt - startedAt) / 1000)),
    categories, levels, rows,
  };
}
export function updateWrongBook(existing, report) {
  const wrong = new Set(existing);
  for (const row of report.rows) {
    if (row.state === 'correct') wrong.delete(row.id);
    else wrong.add(row.id);
  }
  return [...wrong];
}
export function validateBank(bank) {
  const ids = new Set(), prompts = new Set();
  for (const q of bank) {
    if (!q.id || ids.has(q.id)) throw new Error(`Duplicate/missing ID: ${q.id}`);
    if (!q.prompt || prompts.has(q.prompt)) throw new Error(`Duplicate/missing prompt: ${q.prompt}`);
    if (!CATEGORIES[q.category] || !LEVELS[q.difficulty]) throw new Error(`Invalid taxonomy: ${q.id}`);
    if (q.options.length !== 4 || new Set(q.options).size !== 4 || !q.options.every(o => typeof o === 'string' && o.trim())) throw new Error(`Invalid options: ${q.id}`);
    if (!q.options.includes(q.answer) || !q.explanation?.trim()) throw new Error(`Missing answer/explanation: ${q.id}`);
    if (!q.sources?.length || !q.sources.every(u => /^https:\/\/(?:[\w-]+\.)?apple\.com(?:\.cn)?\//.test(u))) throw new Error(`Missing official source: ${q.id}`);
    ids.add(q.id); prompts.add(q.prompt);
  }
  return { total: bank.length, categories: Object.fromEntries(Object.keys(CATEGORIES).map(c => [c, bank.filter(q => q.category === c).length])), levels: Object.fromEntries(Object.keys(LEVELS).map(l => [l, bank.filter(q => q.difficulty === l).length])) };
}
