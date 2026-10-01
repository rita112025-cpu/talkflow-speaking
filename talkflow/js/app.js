/* Router + shell */
(function () {
  const { $, $$, I } = TF.ui;
  const app = document.getElementById('app');
  const DOCK = [
    ['home', '#/home', '首頁', 'home'], ['scenarios', '#/scenarios', '情境', 'compass'],
    ['train', '#/train', '特訓', 'mic'], ['phrasebook', '#/phrasebook', '金句', 'book'], ['progress', '#/progress', '成長', 'chart'],
  ];
  let trackStart = 0;

  function endTrack() {
    if (trackStart) { TF.store.addSeconds(Math.min(1200, (Date.now() - trackStart) / 1000)); trackStart = 0; }
  }

  function parse() {
    const raw = (location.hash || '#/home').slice(2);
    const [path, qs] = raw.split('?');
    const [name, id] = path.split('/');
    const query = {};
    (qs || '').split('&').filter(Boolean).forEach((kv) => {
      const pos = kv.indexOf('=');
      const k = pos >= 0 ? kv.slice(0, pos) : kv;
      const v = pos >= 0 ? kv.slice(pos + 1) : '1';
      try { query[decodeURIComponent(k)] = decodeURIComponent(v); } catch (e) { query[k] = v; }
    });
    return { name: name || 'home', id, query };
  }

  function render() {
    if (app._cleanup) { app._cleanup(); app._cleanup = null; }
    endTrack();
    TF.speech.stop();
    $$('.overlay').forEach((o) => o.remove());
    const r = parse();
    const fn = TF.views[r.name];
    let v = fn ? fn({ id: r.id, query: r.query }) : null;
    if (!v) { location.hash = '#/home'; return; }
    if (v.redirect) { location.hash = v.redirect; return; }
    app.classList.toggle('noDock', !v.dock);
    app.innerHTML = v.html + (v.dock ? `<nav class="dock" aria-label="主選單">${DOCK.map((d) => `<a href="${d[1]}" class="${d[0] === v.dock ? 'on' : ''}" ${d[0] === v.dock ? 'aria-current="page"' : ''}>${I(d[3])}<span>${d[2]}</span></a>`).join('')}</nav>` : '');
    const root = app.firstElementChild;
    v.mount && v.mount(app);
    if (v.track) trackStart = Date.now();
    window.scrollTo(0, 0);
    document.title = 'TalkFlow 口說潮';
  }

  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); location.hash = g.dataset.go; }
  });
  window.addEventListener('hashchange', render);
  window.addEventListener('pagehide', endTrack);
  document.addEventListener('visibilitychange', () => { if (document.hidden) endTrack(); });
  // Warm the voice list on first user gesture (some browsers load lazily)
  document.addEventListener('pointerdown', () => { try { speechSynthesis.getVoices(); } catch (e) {} }, { once: true });

  if (!location.hash) location.hash = '#/home'; else render();
  if (!location.hash) render();

  if (TF.speech.recognitionAvailable && !TF.speech.secureContext) {
    setTimeout(() => TF.ui.toast('語音辨識需要 HTTPS 或 localhost；目前可先使用打字練習'), 400);
  }

  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) {
    navigator.serviceWorker.register('sw.js').then((reg) => reg.update()).catch(() => {});
  }
})();
