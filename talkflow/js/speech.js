/* Speech: text-to-speech, speech recognition, and word-level scoring */
window.TF = window.TF || {};
(function () {
  const synth = window.speechSynthesis;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let voices = [];
  const loadVoices = () => { if (synth) voices = synth.getVoices() || []; };
  if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }

  function pickVoice(lang) {
    const st = TF.store.get().settings;
    if (st.voiceURI) {
      const v = voices.find((x) => x.voiceURI === st.voiceURI);
      if (v) return v;
    }
    const want = st.accent === 'auto' ? lang : st.accent;
    const en = voices.filter((v) => /^en[-_]/i.test(v.lang));
    const exact = en.filter((v) => v.lang.replace('_', '-').toLowerCase() === want.toLowerCase());
    const pool = exact.length ? exact : en;
    // prefer natural / online voices when available
    return pool.find((v) => /natural|online|google|premium|enhanced/i.test(v.name)) || pool[0] || null;
  }

  const Speech = {
    canSpeak: !!synth,
    canListen: !!SR && (window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1'),
    recognitionAvailable: !!SR,
    secureContext: !!window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1',
    voices: () => voices.filter((v) => /^en[-_]/i.test(v.lang)),
    _cur: null,

    stop() { if (synth) synth.cancel(); Speech._cur = null; },

    /* speak(text, {lang, rate, onboundary, onend}) */
    speak(text, o) {
      o = o || {};
      if (!synth) { TF.ui.toast('此瀏覽器不支援語音朗讀'); o.onend && o.onend(); return; }
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const lang = o.lang || 'en-US';
      u.lang = lang;
      const v = pickVoice(lang);
      if (v) { u.voice = v; u.lang = v.lang; }
      u.rate = (o.rate || 1) * (TF.store.get().settings.rate || 1);
      u.onboundary = (e) => { if (e.name === 'word' || e.charIndex >= 0) o.onboundary && o.onboundary(e.charIndex); };
      u.onend = () => { Speech._cur = null; o.onend && o.onend(); };
      u.onerror = () => { Speech._cur = null; o.onend && o.onend(); };
      Speech._cur = u;
      // Chrome sometimes stalls after cancel(); small defer helps
      setTimeout(() => synth.speak(u), 30);
    },

    /* listen({lang, onInterim, onResult(text, conf, ms), onEnd, onError}) -> {stop} */
    listen(o) {
      if (!SR) { o.onError && o.onError('unsupported'); return { stop() {} }; }
      Speech.stop();
      const r = new SR();
      r.lang = o.lang || 'en-US';
      r.interimResults = true;
      r.maxAlternatives = 1;
      r.continuous = false;
      let finalText = '', conf = 0, got = false, started = Date.now(), spoke = 0;
      r.onspeechstart = () => { spoke = Date.now(); };
      r.onresult = (e) => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) { finalText += res[0].transcript + ' '; conf = res[0].confidence || conf; got = true; }
          else interim += res[0].transcript;
        }
        o.onInterim && o.onInterim((finalText + interim).trim());
      };
      r.onerror = (e) => { o.onError && o.onError(e.error); };
      r.onend = () => {
        if (got) o.onResult && o.onResult(finalText.trim(), conf, spoke ? Date.now() - spoke : Date.now() - started);
        o.onEnd && o.onEnd(got);
      };
      try { r.start(); } catch (e) { o.onError && o.onError('start-failed'); }
      return { stop() { try { r.stop(); } catch (e) {} }, abort() { try { r.abort(); } catch (e) {} } };
    },
  };

  /* ---------- scoring ---------- */
  const NUM = { '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten' };
  const words = (s) =>
    String(s || '').toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9'\s-]/g, ' ').replace(/-/g, ' ')
      .split(/\s+/).filter(Boolean).map((w) => NUM[w] || w);

  function lev(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++)
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  const sim = (a, b) => {
    if (a === b) return 1;
    const s = 1 - lev(a, b) / Math.max(a.length, b.length);
    return s >= 0.6 ? s : 0;
  };

  /* Align target words with recognised words. Returns [{w, sim}] per target word. */
  function align(targetStr, heardStr) {
    const T = words(targetStr), H = words(heardStr);
    const n = T.length, m = H.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = 1; i <= n; i++) dp[i][0] = i;
    for (let j = 1; j <= m; j++) dp[0][j] = j;
    for (let i = 1; i <= n; i++)
      for (let j = 1; j <= m; j++)
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (1 - sim(T[i - 1], H[j - 1])));
    const out = new Array(n).fill(0);
    let i = n, j = m;
    while (i > 0 && j > 0) {
      const s = sim(T[i - 1], H[j - 1]);
      if (Math.abs(dp[i][j] - (dp[i - 1][j - 1] + (1 - s))) < 1e-9) { out[i - 1] = s; i--; j--; }
      else if (Math.abs(dp[i][j] - (dp[i - 1][j] + 1)) < 1e-9) { out[i - 1] = 0; i--; }
      else j--;
    }
    return T.map((w, k) => ({ w, sim: out[k] }));
  }

  /* score(target, heard, conf) -> {score, words:[{w,sim,cls}]} */
  function score(target, heard, conf) {
    const al = align(target, heard);
    const acc = al.length ? al.reduce((a, x) => a + x.sim, 0) / al.length : 0;
    const c = conf > 0 ? conf : 0.9; // some engines don't report confidence
    const sc = Math.round(100 * acc * (0.85 + 0.15 * Math.min(1, c)));
    return {
      score: sc,
      words: al.map((x) => Object.assign(x, { cls: x.sim >= 0.85 ? 'ok' : x.sim >= 0.5 ? 'near' : 'bad' })),
    };
  }

  Speech.words = words;
  Speech.score = score;
  Speech.grade = (s) => (s >= 85 ? 'good' : s >= 65 ? 'mid' : 'low');
  Speech.gradeZh = (s) => (s >= 90 ? '精準' : s >= 80 ? '優良' : s >= 65 ? '尚可，再練一次' : '需加強');
  TF.speech = Speech;
})();
