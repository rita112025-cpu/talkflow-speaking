/* Persistent state (localStorage) */
window.TF = window.TF || {};
(function () {
  const KEY = 'talkflow.v1';
  const BACKUP_SCHEMA = 'talkflow-backup';
  const BACKUP_VERSION = 1;
  const MAX_IMPORT_BYTES = 1024 * 1024; // 1 MB is far above normal app data
  const defaults = () => ({
    xp: 0,
    goalMin: 10,
    days: {},            // 'YYYY-MM-DD' -> { sec, sents }
    scen: {},            // id -> { done, best, attempts, objs:[ids] }
    last: {},            // id -> last session summary (for debrief)
    vocab: {},           // 'scenId|word' -> true
    phon: {},            // drill key -> { n, sum }
    fav: {},             // phrase id -> true
    shadowBest: {},      // index -> best score
    sentences: 0,
    perfect: 0,
    settings: { accent: 'auto', voiceURI: '', rate: 1 },
  });

  const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
  const num = (v, fallback, min, max) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  };
  const cleanMap = (v) => isObj(v) ? v : {};

  function normalize(input) {
    if (!isObj(input)) throw new Error('invalid-state');
    const d = defaults();
    const s = Object.assign(d, input);
    s.xp = Math.round(num(s.xp, 0, 0, 1e9));
    s.goalMin = Math.round(num(s.goalMin, 10, 1, 180));
    s.sentences = Math.round(num(s.sentences, 0, 0, 1e9));
    s.perfect = Math.round(num(s.perfect, 0, 0, 1e9));
    s.days = cleanMap(s.days);
    s.scen = cleanMap(s.scen);
    s.last = cleanMap(s.last);
    s.vocab = cleanMap(s.vocab);
    s.phon = cleanMap(s.phon);
    s.fav = cleanMap(s.fav);
    s.shadowBest = cleanMap(s.shadowBest);
    s.settings = Object.assign(d.settings, isObj(input.settings) ? input.settings : {});
    if (!['auto', 'en-US', 'en-GB', 'en-AU'].includes(s.settings.accent)) s.settings.accent = 'auto';
    s.settings.voiceURI = typeof s.settings.voiceURI === 'string' ? s.settings.voiceURI.slice(0, 500) : '';
    s.settings.rate = num(s.settings.rate, 1, 0.5, 1.5);
    return s;
  }

  let state = defaults();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = normalize(JSON.parse(raw));
  } catch (e) { state = defaults(); /* private mode / corrupt data: start fresh */ }

  const dayKey = (d) => {
    d = d || new Date();
    const p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  const S = {
    get: () => state,
    save,
    dayKey,
    today() { return state.days[dayKey()] || { sec: 0, sents: 0 }; },
    _day() { const k = dayKey(); return (state.days[k] = state.days[k] || { sec: 0, sents: 0 }); },
    addSeconds(sec) { if (sec > 0) { S._day().sec += Math.round(sec); save(); } },
    addSentence(n) { S._day().sents += n || 1; state.sentences += n || 1; save(); },
    addXP(n) { state.xp += n; save(); },
    streak() {
      let n = 0;
      const d = new Date();
      const t = state.days[dayKey(d)];
      if (!t || (t.sec < 30 && !t.sents)) d.setDate(d.getDate() - 1);
      for (;;) {
        const e = state.days[dayKey(d)];
        if (e && (e.sec >= 30 || e.sents)) { n++; d.setDate(d.getDate() - 1); } else break;
      }
      return n;
    },
    level() {
      const L = TF.LEVELS;
      let i = 0;
      for (let k = 0; k < L.length; k++) if (state.xp >= L[k].xp) i = k;
      const next = L[i + 1];
      return { cur: L[i], next, toNext: next ? next.xp - state.xp : 0,
        pct: next ? (state.xp - L[i].xp) / (next.xp - L[i].xp) : 1 };
    },
    scen(id) { return (state.scen[id] = state.scen[id] || { done: false, best: 0, attempts: 0, objs: [] }); },
    phonStat(key, sim) {
      const p = (state.phon[key] = state.phon[key] || { n: 0, sum: 0 });
      p.n++; p.sum += sim;
      if (p.n > 40) { p.sum = (p.sum / p.n) * 30; p.n = 30; }
      save();
    },
    phonPct(key) { const p = state.phon[key]; return p && p.n ? Math.round((p.sum / p.n) * 100) : null; },
    reset() { state = defaults(); save(); },
    exportJSON() {
      return JSON.stringify({ schema: BACKUP_SCHEMA, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), data: state }, null, 2);
    },
    importJSON(txt) {
      if (typeof txt !== 'string' || new Blob([txt]).size > MAX_IMPORT_BYTES) throw new Error('file-too-large');
      const o = JSON.parse(txt);
      let payload = o;
      if (isObj(o) && o.schema === BACKUP_SCHEMA) {
        if (o.version !== BACKUP_VERSION || !isObj(o.data)) throw new Error('unsupported-backup');
        payload = o.data;
      }
      state = normalize(payload); // also accepts legacy pre-schema exports
      save();
    },
  };
  TF.store = S;
})();
