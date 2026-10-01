/* Shared UI helpers */
window.TF = window.TF || {};
(function () {
  const I = (n, c) => TF.icon(n, c);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  let toastT;
  function toast(msg) {
    $('.toast') && $('.toast').remove();
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg; t.setAttribute('role', 'status');
    document.body.appendChild(t);
    clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 2600);
  }

  function ring(pct, o) {
    o = o || {};
    const size = o.size || 128, sw = o.stroke || 11, r = (size - sw) / 2, c = 2 * Math.PI * r;
    const col = o.color || '#22c55e';
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#2a3547" stroke-width="${sw}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"
        stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.max(0, Math.min(1, pct)))}" style="filter:drop-shadow(0 0 6px ${col}88);transition:stroke-dashoffset .8s"/></svg>`;
  }

  /* bottom sheet */
  function sheet(html, mount) {
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
    const close = () => { TF.speech.stop(); ov.remove(); };
    ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
    document.body.appendChild(ov);
    ov.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
    mount && mount($('.sheet', ov), close);
    return close;
  }

  /* ---------- practice component: listen -> record -> word-level feedback ---------- */
  function practice(box, o) {
    if (box._cleanup) box._cleanup();
    const text = o.text, lang = o.lang || 'en-US', focus = o.focus || {};
    const tokens = text.split(/\s+/);
    // map display tokens -> indices in scored word list
    const map = []; let idx = 0, off = 0;
    const offsets = tokens.map((t) => { const p = text.indexOf(t, off); off = p + t.length; return p; });
    tokens.forEach((t) => { const n = TF.speech.words(t).length; map.push({ from: idx, n }); idx += n; });
    const can = TF.speech.canListen;

    box.innerHTML = `
      <div class="words" data-words>${tokens.map((t, i) => {
        const key = t.toLowerCase().replace(/[^a-z']/g, '');
        const f = focus[key];
        return `<span class="w${f ? ' focus' : ''}" data-i="${i}" data-w="${esc(t)}">${esc(t)}${f ? `<small>${esc(f)}</small>` : ''}</span>`;
      }).join('')}</div>
      ${o.zh ? `<p class="muted small" style="margin-top:10px">${esc(o.zh)}</p>` : ''}
      <div class="row" style="margin-top:16px;justify-content:center;gap:14px">
        <button class="chip" data-a="hear">${I('vol')} 聽示範</button>
        <button class="chip" data-a="slow">${I('vol')} 慢速 0.7x</button>
      </div>
      <div class="wave" data-wave style="margin-top:12px">${Array.from({ length: 26 }, (_, i) => `<i style="animation-delay:${(i % 9) * 0.07}s"></i>`).join('')}</div>
      <div class="live" data-live>${can ? '點下方麥克風，開始唸這句' : '此瀏覽器不支援語音辨識（建議使用 Chrome / Edge）'}</div>
      <div class="row" style="justify-content:center;margin:6px 0 10px">
        ${can ? `<button class="mic" data-a="mic" aria-label="錄音">${I('mic')}</button>` : ''}
      </div>
      ${can ? '' : `<div class="row" style="gap:8px"><input class="txt num" style="flex:1" data-manual placeholder="貼上或輸入你唸的內容…" /><button class="btn sm" data-a="manual">評分</button></div>`}
      <div data-result></div>`;

    const wordsEl = $('[data-words]', box), live = $('[data-live]', box), wave = $('[data-wave]', box), mic = $('[data-a=mic]', box), res = $('[data-result]', box);
    const spans = $$('.w', wordsEl);
    let listener = null, busy = false;

    const hl = (ci) => {
      let cur = 0;
      offsets.forEach((p, i) => { if (ci >= p) cur = i; });
      spans.forEach((s, i) => s.classList.toggle('cur', i === cur));
    };
    let stopped = false;
    const play = (rate) => {
      TF.speech.stop(); stopped = false;
      TF.speech.speak(text, { lang, rate, onboundary: hl, onend: () => {
        spans.forEach((s) => s.classList.remove('cur'));
        if (!stopped && o.loop && o.loop()) setTimeout(() => !stopped && o.loop() && play(rate), 500);
      } });
    };
    const base = () => (o.getRate ? o.getRate() : 1);
    $('[data-a=hear]', box).onclick = () => play(base());
    $('[data-a=slow]', box).onclick = () => play(base() * 0.7);
    spans.forEach((s) => s.addEventListener('click', () => TF.speech.speak(s.dataset.w.replace(/[^\w'-]/g, ''), { lang, rate: 0.8 })));

    function show(heard, conf, ms) {
      const r = TF.speech.score(text, heard, conf);
      spans.forEach((s, i) => {
        const m = map[i]; const ws = r.words.slice(m.from, m.from + m.n);
        const worst = ws.length ? ws.reduce((a, b) => (b.sim < a.sim ? b : a)) : { cls: '' };
        s.classList.remove('ok', 'near', 'bad', 'cur'); worst.cls && s.classList.add(worst.cls);
      });
      const weak = r.words.filter((w) => w.cls !== 'ok').map((w) => w.w);
      const wpm = ms && ms > 500 ? Math.round((r.words.length / ms) * 60000) : null;
      res.innerHTML = `
        <div class="score ${TF.speech.grade(r.score)}"><b>${r.score}</b>
          <div class="grow"><div style="font-weight:800">${TF.speech.gradeZh(r.score)}</div>
          <div class="heard">聽到：<em>${esc(heard || '（沒有聽到內容）')}</em></div>
          ${wpm ? `<div class="heard">語速約 ${wpm} WPM</div>` : ''}</div></div>
        ${weak.length ? `<p class="small muted" style="margin-top:10px">需再注意：<b style="color:var(--warn)">${esc(weak.slice(0, 6).join('、'))}</b>（點單字可聽發音）</p>` : '<p class="small" style="margin-top:10px;color:var(--ok)">每個單字都辨識到了，很棒！</p>'}`;
      o.onScore && o.onScore({ score: r.score, words: r.words, heard, wpm, ms });
    }

    function setBusy(b) {
      busy = b; mic && mic.classList.toggle('on', b); wave.classList.toggle('on', b);
    }
    if (mic) mic.onclick = () => {
      if (busy) { listener && listener.stop(); return; }
      stopped = true; TF.speech.stop();
      setBusy(true); live.textContent = '正在聆聽…唸完會自動停止'; res.innerHTML = '';
      listener = TF.speech.listen({
        lang,
        onInterim: (t) => { live.textContent = t || '正在聆聽…'; },
        onResult: (t, c, ms) => show(t, c, ms),
        onError: (e) => {
          setBusy(false);
          live.textContent = e === 'not-allowed' || e === 'service-not-allowed' ? '麥克風被封鎖：請在網址列允許麥克風權限' : e === 'no-speech' ? '沒有聽到聲音，再試一次' : e === 'network' ? '語音辨識需要網路連線' : '辨識失敗：' + e;
        },
        onEnd: (got) => { setBusy(false); live.textContent = got ? '再按一次麥克風可重新錄音' : (/麥克風被封鎖|網路|失敗/.test(live.textContent) ? live.textContent : '沒有聽到聲音，再試一次'); },
      });
    };
    const mb = $('[data-a=manual]', box);
    if (mb) mb.onclick = () => { const v = $('[data-manual]', box).value.trim(); if (v) show(v, 0.9, 0); };

    box._cleanup = () => { stopped = true; listener && listener.abort && listener.abort(); TF.speech.stop(); };
    return { play, cleanup: box._cleanup };
  }

  /* Generic mic hook for free-form replies (chat) */
  function recordOnce(o) { return TF.speech.listen(o); }

  /* open a practice sheet for a single phrase */
  function practiceSheet(text, zh, lang, onScore) {
    const body = `<div class="between row" style="margin-bottom:10px"><h3>跟著唸</h3><button class="iconbtn sm" data-close aria-label="關閉">${I('x')}</button></div><div data-p></div>`;
    sheet(body, (el) => practice($('[data-p]', el), { text, zh, lang, onScore }));
  }

  TF.ui = { esc, $, $$, toast, ring, sheet, practice, practiceSheet, recordOnce, I };
})();
