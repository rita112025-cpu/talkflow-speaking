/* Views part 1: home, scenarios, brief, chat, vocab, result */
window.TF = window.TF || {};
TF.views = TF.views || {};
(function () {
  const { esc, $, $$, I, toast, ring } = TF.ui;
  const S = TF.store, SP = TF.speech;
  const go = (h) => { location.hash = h; };
  const dayIndex = () => Math.floor(Date.now() / 86400000);

  const header = (title, back, right, sub) => `
    <div class="top">
      <button class="iconbtn" data-go="${back}" aria-label="返回">${I('back')}</button>
      <h1>${esc(title)}${sub ? `<span class="sub">${esc(sub)}</span>` : ''}</h1>${right || ''}
    </div>`;

  const steps = (n) => `
    <div class="steps">${[1, 2, 3, 4].map((i) => `<i class="${i < n ? 'done' : i === n ? 'on' : ''}"></i>`).join('')}</div>
    <div class="steplabel">${['', '1 任務簡報', '2 實戰對話', '3 單字特訓', '4 評估覆盤'][n]}　<span class="dim">/ 共 4 步</span></div>`;

  const speakBtn = (text, lang, rate) =>
    `<button class="speakbtn" data-say="${esc(text)}" data-lang="${lang || 'en-US'}" data-rate="${rate || 1}" aria-label="聽發音">${I('vol')}</button>`;

  function wireSay(root) {
    $$('[data-say]', root).forEach((b) => (b.onclick = () => SP.speak(b.dataset.say, { lang: b.dataset.lang, rate: +b.dataset.rate })));
    $$('[data-practice]', root).forEach((b) => (b.onclick = () => TF.ui.practiceSheet(b.dataset.practice, b.dataset.zh || '', b.dataset.lang, () => { S.addSentence(1); })));
  }
  TF.wireSay = wireSay;

  /* ================= HOME ================= */
  TF.views.home = () => {
    const st = S.get(), lv = S.level(), today = S.today();
    const goalSec = st.goalMin * 60, pct = Math.min(1, today.sec / goalSec);
    const mins = Math.floor(today.sec / 60);
    const daily = TF.SCENARIOS[dayIndex() % TF.SCENARIOS.length];
    const isDone = (s) => (S.get().scen[s.id] || {}).done;
    const rec = TF.SCENARIOS.find((s) => !isDone(s) && s.id !== daily.id) || TF.SCENARIOS.find((s) => s.id !== daily.id);
    // weakest drill group (untouched first)
    const drill = TF.DRILLS.slice().sort((a, b) => (S.phonPct(a.key) ?? -1) - (S.phonPct(b.key) ?? -1))[0];
    const left = Math.max(0, st.goalMin - mins);

    return {
      dock: 'home',
      html: `<div class="view">
      <div class="top">
        <div class="brand"><div class="avatar">T</div><div><b>TalkFlow 口說潮</b><small>今天也要開口說</small></div></div>
        <span class="pill flame">${I('flame')} ${S.streak()} 天</span>
        <button class="iconbtn sm" data-go="#/settings" aria-label="設定">${I('gear')}</button>
      </div>

      <div class="pad stack">
        <div class="card hero">
          <div class="row between"><span class="pill tag">依經驗值估算</span><span class="pill gem">${I('gem')} ${st.xp} XP</span></div>
          <div class="row" style="gap:18px;margin-top:14px">
            <div class="ring">${ring(lv.pct, { size: 128 })}<div class="c"><div><b>${lv.cur.id}</b><br><small>${lv.cur.zh}</small></div></div></div>
            <div class="grow">
              <h2 style="font-size:20px">CEFR 英語流暢度</h2>
              <p class="muted small" style="margin-top:6px">${lv.next ? `再累積 <b style="color:var(--warn)">${lv.toNext} XP</b> 升到 ${lv.next.id}` : '已達最高等級，繼續保持！'}</p>
              <p class="dim tiny" style="margin-top:6px">完成情境、發音與跟讀練習皆可獲得 XP</p>
            </div>
          </div>
          <div class="hr"></div>
          <div class="row between small"><b>${I('target')} 今日口說進度</b><span><b style="color:var(--ok)">${mins}</b> / ${st.goalMin} 分鐘</span></div>
          <div class="bar" style="margin-top:10px"><i style="width:${pct * 100}%"></i></div>
          <div class="row between tiny" style="margin-top:10px"><span class="muted">${left ? `再練習 ${left} 分鐘達成今日目標` : '🎉 今日目標達成！'}</span><button data-go="#/settings" style="color:var(--pri3);font-weight:700">設定目標</button></div>
        </div>
      </div>

      <div class="sec-h"><h2>${I('star')} 今日口說挑戰</h2><span class="dim tiny">每日更新</span></div>
      <div class="pad">
        <div class="card glow tap" data-go="#/brief/${daily.id}">
          <div class="row wrap"><span class="pill tag">${daily.level}</span><span class="pill mute">預計 ${daily.minutes} 分鐘</span><span class="pill ok">+50 XP</span></div>
          <h2 style="font-size:22px;margin-top:12px">${daily.em} ${esc(daily.title)}</h2>
          <p class="dim small">${esc(daily.en)}</p>
          <div class="note blue" style="margin-top:14px">${I('target')}<span>${esc(daily.goal)}</span></div>
          <div class="btn" style="margin-top:16px">立即開口挑戰 ${I('arrow')}</div>
        </div>
      </div>

      <div class="pad" style="margin-top:16px">
        <div class="card tap row between" data-go="#/free">
          <div class="grow"><div class="tiny" style="color:var(--ok);font-weight:800">AI 口說教練</div>
            <h2 style="font-size:21px;margin:4px 0">隨時開口說 Free Talk</h2>
            <p class="dim small">挑一個話題自由對話，即時抓常見語法錯誤</p></div>
          <div class="mic sm">${I('mic')}</div>
        </div>
      </div>

      <div class="sec-h"><h2>${I('target')} 專屬客製特訓</h2><button data-go="#/train">查看全部</button></div>
      <div class="pad stack">
        <div class="item" data-go="#/brief/${rec.id}"><div class="thumb">${rec.em}</div><div class="grow"><span class="pill tag">情境對話 ${rec.level}</span><h3 style="margin-top:4px">${esc(rec.title)}</h3><p class="dim small">${esc(rec.goal.slice(0, 26))}…</p></div><div class="go">${I('play')}</div></div>
        <div class="item" data-go="#/drill/${drill.id}"><div class="thumb" style="background:var(--ok-soft)">🎯</div><div class="grow"><span class="pill ok">發音特訓</span><h3 style="margin-top:4px">${esc(drill.title)} ${esc(drill.sym)}</h3><p class="dim small">${esc(drill.sub)} · ${S.phonPct(drill.key) == null ? '尚未練習' : '目前 ' + S.phonPct(drill.key) + '%'}</p></div><div class="go">${I('play')}</div></div>
        <div class="item" data-go="#/shadow"><div class="thumb" style="background:var(--warn-soft)">🎧</div><div class="grow"><span class="pill warn">跟讀練習</span><h3 style="margin-top:4px">Shadowing 影子跟讀</h3><p class="dim small">跟著原速朗讀，練語調與節奏</p></div><div class="go">${I('play')}</div></div>
      </div></div>`,
    };
  };

  /* ================= SCENARIOS ================= */
  TF.views.scenarios = () => {
    const done = TF.SCENARIOS.filter((s) => S.get().scen[s.id] && S.get().scen[s.id].done).length;
    const recId = (TF.SCENARIOS.find((s) => !(S.get().scen[s.id] || {}).done) || {}).id;
    return {
      dock: 'scenarios',
      html: `<div class="view">
        <div class="top"><div class="brand"><div class="avatar">${I('plane')}</div><div><b>出國開口說</b><small>${TF.SCENARIOS.length} 個真實情境 · 已通關 ${done}</small></div></div></div>
        <div class="pad" style="margin-bottom:14px"><div class="card" style="padding:16px"><div class="row between small"><b>總體通關度</b><span>${Math.round((done / TF.SCENARIOS.length) * 100)}%</span></div><div class="bar" style="margin-top:10px"><i style="width:${(done / TF.SCENARIOS.length) * 100}%"></i></div></div></div>
        <label class="search">${I('search')}<input id="q" type="search" placeholder="搜尋情境，例如：機場、點餐" aria-label="搜尋情境"></label>
        <div class="chips" id="cats">${TF.CATS.map((c, i) => `<button class="chip${i ? '' : ' on'}" data-cat="${c.id}">${c.zh}</button>`).join('')}</div>
        <div id="list" style="margin-top:8px"></div>
      </div>`,
      mount(el) {
        let cat = 'all', q = '';
        const draw = () => {
          const rows = TF.SCENARIOS.filter((s) => (cat === 'all' || s.cat === cat) && (!q || (s.title + s.en + s.place + s.goal).toLowerCase().includes(q)));
          $('#list', el).innerHTML = rows.length ? rows.map((s) => {
            const sc = S.get().scen[s.id] || {};
            const status = sc.done ? `<span class="pill ok">已通關 · ${sc.best} 分</span>` : sc.attempts ? `<span class="pill warn">進行中</span>` : s.id === recId ? `<span class="pill tag">推薦</span>` : '';
            return `<div class="scard${s.id === recId ? ' cur' : ''}" data-go="#/brief/${s.id}">
              <div class="t"><div class="em">${s.em}</div><div class="grow"><div class="row wrap" style="gap:6px"><span class="pill mute">${s.level}</span>${status}</div>
              <h3 style="margin-top:6px">${esc(s.title)}</h3><div class="en">${esc(s.en)}</div></div></div>
              <p class="muted small" style="margin:12px 0">${esc(s.goal)}</p>
              <div class="row between"><span class="dim tiny">${s.objectives.length} 個任務 · 約 ${s.minutes} 分鐘 · ${s.accent === 'en-GB' ? '🇬🇧 英式' : '🇺🇸 美式'}</span><span style="color:var(--pri3);font-weight:800" class="small">${sc.done ? '再次練習' : sc.attempts ? '繼續' : '開始'} →</span></div></div>`;
          }).join('') : '<div class="empty">找不到符合的情境</div>';
        };
        $('#q', el).oninput = (e) => { q = e.target.value.trim().toLowerCase(); draw(); };
        $$('[data-cat]', el).forEach((b) => (b.onclick = () => { cat = b.dataset.cat; $$('[data-cat]', el).forEach((x) => x.classList.toggle('on', x === b)); draw(); }));
        draw();
      },
    };
  };

  /* ================= BRIEF ================= */
  TF.views.brief = (p) => {
    const s = TF.getScenario(p.id); if (!s) return null;
    const sc = S.get().scen[s.id] || {};
    return {
      html: `<div class="view">
        ${header('情境簡報', '#/scenarios', `<span class="pill mute">${s.level}</span>`, s.en)}
        ${steps(1)}
        <div class="pad stack">
          <div class="card hero">
            <div class="row"><span class="pill tag">${s.accent === 'en-GB' ? '🇬🇧 英式口音' : '🇺🇸 美式口音'}</span><span class="pill mute">約 ${s.minutes} 分鐘</span></div>
            <h2 style="font-size:24px;margin:12px 0 4px">${s.em} ${esc(s.title)}</h2>
            <p class="dim small">📍 ${esc(s.place)}</p>
            <div class="note blue" style="margin-top:14px">${I('target')}<span><b>任務目標：</b>${esc(s.goal)}</span></div>
          </div>

          <div class="card"><h3>${I('check')} 本次溝通檢核目標</h3><div style="margin-top:6px">${s.objectives.map((o) => `<div class="check"><span class="dot">${I('check')}</span><span>${esc(o.zh)}</span></div>`).join('')}</div></div>

          <div class="card row"><div class="avatar" style="width:52px;height:52px;font-size:26px;background:var(--card3)">${s.npc.em}</div><div class="grow"><div class="tiny dim">AI 角色</div><b>${esc(s.npc.name)}</b> <span class="muted small">· ${esc(s.npc.role)}</span></div><button class="speakbtn" data-say="${esc(s.turns[0].npc)}" data-lang="${s.accent}" aria-label="聽開場白">${I('vol')}</button></div>

          <div><div class="row between" style="margin:8px 4px 10px"><h2 style="font-size:18px">必備關鍵句 <span class="dim small">${s.phrases.length} 句</span></h2></div>
            <div class="stack">${s.phrases.map((ph) => `<div class="phrase"><q>“${esc(ph.en)}”</q><div class="zh">${esc(ph.zh)}</div>
              <div class="acts">${speakBtn(ph.en, s.accent)}<button class="chip" data-say="${esc(ph.en)}" data-lang="${s.accent}" data-rate="0.7">慢速</button><button class="chip" data-practice="${esc(ph.en)}" data-zh="${esc(ph.zh)}" data-lang="${s.accent}">${I('mic')} 跟著唸</button></div></div>`).join('')}</div></div>

          <div class="note">${I('bulb')}<span><b>避坑小貼士：</b>${esc(s.tip)}</span></div>
          <button class="btn ghost" data-go="#/vocab/${s.id}?pre=1">${I('book')} 先預習 ${s.vocab.length} 個單字</button>
          <button class="btn" data-go="#/chat/${s.id}">${I('mic')} 開始 AI 對話 ${I('arrow')}</button>
          ${sc.attempts ? `<p class="dim tiny" style="text-align:center">已練習 ${sc.attempts} 次 · 最佳 ${sc.best || 0} 分</p>` : ''}
          <div style="height:30px"></div>
        </div></div>`,
      mount: wireSay,
    };
  };

  /* ================= CHAT (role-play) ================= */
  TF.views.chat = (p) => {
    const s = TF.getScenario(p.id); if (!s) return null;
    return {
      track: true,
      html: `<div class="chatwrap view">
        ${header(s.npc.name + ' · ' + s.npc.role, '#/brief/' + s.id, `<button class="iconbtn sm" id="zhall" title="顯示/隱藏中文" aria-label="切換中文翻譯">${I('trans')}</button>`, s.title)}
        <div class="steps" style="padding-top:0"><i class="done"></i><i class="on"></i><i></i><i></i></div>
        <div class="objstrip" id="objs">${s.objectives.map((o) => `<span data-o="${o.id}">${esc(o.zh)}</span>`).join('')}</div>
        <div class="chatlog" id="log" aria-live="polite"></div>
        <details class="hintbox" id="hints"><summary>${I('bulb')} 靈感小抄：不知道怎麼回？點我看建議</summary><div class="opts" id="hopts"></div></details>
        <div class="dockbar">
          <div class="wave" id="wave">${Array.from({ length: 26 }, (_, i) => `<i style="animation-delay:${(i % 9) * 0.07}s"></i>`).join('')}</div>
          <div class="live" id="live">${SP.canListen ? '點麥克風說英文，或直接打字' : '此瀏覽器不支援語音辨識，請使用文字輸入'}</div>
          <div class="inputrow"><input class="txt" id="txt" placeholder="輸入英文回覆…" autocomplete="off" aria-label="輸入英文回覆"><button class="iconbtn" id="send" aria-label="送出">${I('send')}</button>
            ${SP.canListen ? `<button class="mic" id="mic" aria-label="按一下說話">${I('mic')}</button>` : ''}</div>
          <button class="btn ok" id="finish" style="margin-top:12px" disabled>${I('flag')} 結束並看評分</button>
        </div></div>`,
      mount(el) {
        const log = $('#log', el), txt = $('#txt', el), live = $('#live', el), wave = $('#wave', el), mic = $('#mic', el), fin = $('#finish', el);
        let i = 0, retries = 0, retryTotal = 0, done = false, busy = false, showZh = false, listener = null, alive = true;
        const results = []; const got = new Set();
        const scroll = () => { log.scrollTop = log.scrollHeight; };
        const add = (html, cls) => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; log.appendChild(d); scroll(); return d; };

        const npcMsg = (text, zh, auto) => {
          const d = add(`<div class="who">${esc(s.npc.name)}</div><div>${esc(text)}</div><div class="zh">${esc(zh || '')}</div>
            <div class="tools"><button data-say>${I('vol')} 聽原音</button><button data-slow>慢速</button><button data-zh>${I('trans')} 中翻</button></div>`, 'msg npc' + (showZh ? ' showzh' : ''));
          $('[data-say]', d).onclick = () => SP.speak(text, { lang: s.accent });
          $('[data-slow]', d).onclick = () => SP.speak(text, { lang: s.accent, rate: 0.7 });
          $('[data-zh]', d).onclick = () => d.classList.toggle('showzh');
          if (auto !== false) SP.speak(text, { lang: s.accent });
        };
        const sys = (t) => add(esc(t), 'sysmsg');
        const typing = () => add('<span class="typing"><i></i><i></i><i></i></span>', 'msg npc');

        const setHints = () => {
          const t = s.turns[i];
          $('#hopts', el).innerHTML = t ? t.hints.map((h) => `<button class="opt" data-h="${esc(h)}">${esc(h)}</button>`).join('') : '';
          $$('[data-h]', el).forEach((b) => (b.onclick = () => { txt.value = b.dataset.h; txt.focus(); SP.speak(b.dataset.h, { lang: s.accent }); }));
        };
        const markObjs = () => $$('#objs [data-o]', el).forEach((x) => x.classList.toggle('done', got.has(x.dataset.o)));

        function nextNpc() {
          const t = typing();
          setTimeout(() => {
            if (!alive) return;
            t.remove();
            if (i < s.turns.length) { npcMsg(s.turns[i].npc, s.turns[i].zh); setHints(); }
            else {
              npcMsg(s.closing, '', true);
              done = true; fin.disabled = false; $('#hints', el).style.display = 'none';
              sys('🎉 對話結束！按下方「結束並看評分」查看成績');
            }
          }, 650);
        }

        function reply(text, conf, ms) {
          if (done || !text.trim()) return;
          text = text.trim();
          const t = s.turns[i];
          const spoken = conf != null;
          const me = add(`<div class="who">YOU</div><div>${esc(text)}</div>`, 'msg me');
          if (spoken) add(`${I('check')} 辨識度 ${Math.round((conf || 0.9) * 100)}%`, 'badge ok');
          const ok = t.re.some((r) => r.test(text));
          if (ok) {
            got.add(t.obj); markObjs();
            results.push({ turn: i, user: text, conf: spoken ? conf || 0.9 : null, ms: spoken ? ms : null, ok: true, retries });
            i++; retries = 0; nextNpc(); setHints();
          } else if (retries < 1) {
            retries++; retryTotal++;
            sys('Sorry, could you say that in another way?（對方沒聽懂，換個說法試試）');
            $('#hints', el).open = true;
          } else {
            results.push({ turn: i, user: text, conf: spoken ? conf || 0.9 : null, ms: spoken ? ms : null, ok: false, retries });
            sys('💡 參考說法：' + t.hints[0]);
            i++; retries = 0; nextNpc();
          }
        }

        $('#send', el).onclick = () => { const v = txt.value; txt.value = ''; reply(v, null, 0); };
        txt.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); $('#send', el).click(); } };
        $('#zhall', el).onclick = () => { showZh = !showZh; $$('.msg.npc', el).forEach((m) => m.classList.toggle('showzh', showZh)); toast(showZh ? '已顯示中文翻譯' : '已隱藏中文翻譯'); };

        if (mic) mic.onclick = () => {
          if (busy) { listener && listener.stop(); return; }
          busy = true; mic.classList.add('on'); wave.classList.add('on'); live.textContent = '正在聆聽…說完會自動送出';
          let sent = false;
          listener = SP.listen({
            lang: s.accent === 'en-GB' ? 'en-GB' : 'en-US',
            onInterim: (t) => { live.textContent = t || '正在聆聽…'; },
            onResult: (t, c, ms) => { sent = true; reply(t, c || 0.9, ms); },
            onError: (e) => { live.textContent = e === 'not-allowed' ? '麥克風被封鎖，請在網址列允許麥克風，或改用打字' : e === 'no-speech' ? '沒聽到聲音，再按一次麥克風' : e === 'network' ? '語音辨識需要網路，或改用打字' : '辨識失敗 (' + e + ')，可改用打字'; },
            onEnd: () => { busy = false; mic.classList.remove('on'); wave.classList.remove('on'); if (sent) live.textContent = '點麥克風說英文，或直接打字'; },
          });
        };

        fin.onclick = () => {
          SP.stop(); listener && listener.abort && listener.abort();
          const sum = summarize(s, results, got, retryTotal);
          const sc = S.scen(s.id); sc.attempts++;
          const firstDone = !sc.done && sum.task >= 60;
          if (sum.task >= 60) sc.done = true;
          sc.best = Math.max(sc.best || 0, sum.overall); sc.objs = Array.from(got);
          S.get().last[s.id] = sum;
          S.addSentence(results.length);
          S.addXP(firstDone ? 50 : sum.task >= 60 ? 20 : 8);
          if (sum.overall >= 90) S.get().perfect++;
          S.save();
          go('#/vocab/' + s.id);
        };

        // cleanup hook
        el._cleanup = () => { alive = false; SP.stop(); listener && listener.abort && listener.abort(); };
        npcMsg(s.turns[0].npc, s.turns[0].zh); setHints();
      },
    };
  };

  function summarize(s, results, got, retryTotal) {
    const total = s.objectives.length;
    const task = Math.round((got.size / total) * 100);
    const spoken = results.filter((r) => r.conf != null);
    const pron = spoken.length ? Math.round((spoken.reduce((a, r) => a + r.conf, 0) / spoken.length) * 100) : null;
    const wc = results.map((r) => SP.words(r.user).length);
    const avgWords = wc.length ? wc.reduce((a, b) => a + b, 0) / wc.length : 0;
    const wpms = spoken.filter((r) => r.ms > 500).map((r) => (SP.words(r.user).length / r.ms) * 60000);
    const lenScore = Math.min(1, avgWords / 8);
    const wpmScore = wpms.length ? Math.max(0.3, Math.min(1, (wpms.reduce((a, b) => a + b, 0) / wpms.length - 60) / 70)) : lenScore;
    const flu = Math.round(100 * Math.max(0.3, 0.5 * lenScore + 0.5 * wpmScore - retryTotal * 0.05));
    const overall = Math.round(pron != null ? 0.4 * task + 0.35 * pron + 0.25 * flu : 0.6 * task + 0.4 * flu);
    return {
      at: Date.now(), task, pron, flu, overall,
      objs: s.objectives.map((o) => ({ id: o.id, zh: o.zh, ok: got.has(o.id) })),
      turns: results.map((r) => Object.assign({}, r, { better: s.turns[r.turn].better, note: s.turns[r.turn].note })),
      avgWords: Math.round(avgWords * 10) / 10, retries: retryTotal,
    };
  }

  /* ================= VOCAB ================= */
  TF.views.vocab = (p) => {
    const s = TF.getScenario(p.id); if (!s) return null;
    const pre = p.query && p.query.pre;
    const key = (w) => s.id + '|' + w;
    const mastered = () => s.vocab.filter((v) => S.get().vocab[key(v.w)]).length;
    return {
      html: `<div class="view">
        ${header('單字特訓', pre ? '#/brief/' + s.id : '#/chat/' + s.id, '', s.title)}
        ${pre ? '' : steps(3)}
        <div class="pad stack" id="vbody"></div></div>`,
      mount(el) {
        const body = $('#vbody', el);
        const finish = () => go(pre ? '#/chat/' + s.id : S.get().last[s.id] ? '#/result/' + s.id : '#/scenarios');
        const drawList = () => {
          body.innerHTML = `
            <div class="card"><div class="row between small"><b>單字掌握度</b><span>${mastered()} / ${s.vocab.length}</span></div><div class="bar" style="margin-top:10px"><i style="width:${(mastered() / s.vocab.length) * 100}%"></i></div></div>
            ${s.vocab.map((v, k) => `<div class="card" style="padding:18px"><div class="row between"><div><h3 style="font-size:21px">${esc(v.w)}</h3><span class="ipa">${esc(v.ipa)}</span></div>${speakBtn(v.w, s.accent)}</div>
              <p style="margin-top:8px;font-weight:700;color:var(--pri3)">${esc(v.zh)}</p>
              <div class="phrase" style="margin-top:12px;background:var(--card2)"><q style="font-size:15px;font-weight:600">“${esc(v.ex)}”</q><div class="zh">${esc(v.exzh)}</div>
                <div class="acts">${speakBtn(v.ex, s.accent)}<button class="chip" data-practice="${esc(v.ex)}" data-zh="${esc(v.exzh)}" data-lang="${s.accent}">${I('mic')} 跟著唸</button></div></div>
              <button class="chip${S.get().vocab[key(v.w)] ? ' on' : ''}" data-m="${k}" style="margin-top:12px">${I('check')} ${S.get().vocab[key(v.w)] ? '已掌握' : '標記為已掌握'}</button></div>`).join('')}
            <button class="btn ghost" id="quiz">${I('target')} 快速測驗（${Math.min(5, s.vocab.length)} 題）</button>
            <button class="btn" id="next">${pre ? '開始 AI 對話' : '完成，查看評分'} ${I('arrow')}</button><div style="height:30px"></div>`;
          wireSay(body);
          $$('[data-m]', body).forEach((b) => (b.onclick = () => {
            const v = s.vocab[+b.dataset.m], k = key(v.w), st = S.get();
            if (st.vocab[k]) delete st.vocab[k]; else { st.vocab[k] = true; S.addXP(2); }
            S.save(); drawList();
          }));
          $('#quiz', body).onclick = quiz; $('#next', body).onclick = finish;
        };
        function quiz() {
          const qs = s.vocab.slice().sort(() => Math.random() - 0.5).slice(0, 5);
          let n = 0, right = 0;
          const ask = () => {
            if (n >= qs.length) {
              const pct = Math.round((right / qs.length) * 100);
              if (pct >= 80) S.addXP(10);
              qs.forEach((v) => { /* correct words auto-mastered handled below */ });
              body.innerHTML = `<div class="card ${pct >= 80 ? 'ok' : ''}" style="text-align:center"><div style="font-size:48px">${pct >= 80 ? '🎉' : '💪'}</div><h2 style="margin:8px 0">${right} / ${qs.length} 題答對</h2><p class="muted">${pct >= 80 ? '太棒了！+10 XP' : '再複習一下單字，下次一定更好'}</p></div>
                <button class="btn ghost" id="again">重新測驗</button><button class="btn" id="back">回單字列表</button>`;
              $('#again', body).onclick = quiz; $('#back', body).onclick = drawList; return;
            }
            const v = qs[n], opts = s.vocab.filter((x) => x.w !== v.w).sort(() => Math.random() - 0.5).slice(0, 2).concat(v).sort(() => Math.random() - 0.5);
            body.innerHTML = `<div class="steplabel" style="padding:0">第 ${n + 1} / ${qs.length} 題</div>
              <div class="card" style="text-align:center"><p class="muted small">「${esc(v.zh)}」的英文是？</p><h2 style="font-size:26px;margin:14px 0">${I('vol')}</h2><button class="chip" data-listen>${I('vol')} 聽發音提示</button></div>
              ${opts.map((o) => `<button class="opt" data-w="${esc(o.w)}">${esc(o.w)}</button>`).join('')}`;
            $('[data-listen]', body).onclick = () => SP.speak(v.w, { lang: s.accent });
            $$('.opt', body).forEach((b) => (b.onclick = () => {
              const okk = b.dataset.w === v.w; b.classList.add(okk ? 'ok' : 'bad'); if (okk) right++;
              if (!okk) $$('.opt', body).find((x) => x.dataset.w === v.w).classList.add('ok');
              $$('.opt', body).forEach((x) => (x.style.pointerEvents = 'none'));
              setTimeout(() => { n++; ask(); }, 900);
            }));
          };
          ask();
        }
        drawList();
      },
    };
  };

  /* ================= RESULT / DEBRIEF ================= */
  TF.views.result = (p) => {
    const s = TF.getScenario(p.id); const r = S.get().last[p.id];
    if (!s || !r) return { redirect: '#/scenarios' };
    const lvl = r.overall >= 90 ? ['流暢應對', 'Fluent Negotiator'] : r.overall >= 75 ? ['自如應對', 'Travel Ready'] : r.overall >= 60 ? ['基本溝通', 'Getting There'] : ['再接再厲', 'Keep Practising'];
    const bar = (label, v, hint) => v == null ? '' : `<div style="margin-top:14px"><div class="row between small"><b>${label}</b><span>${v}%</span></div><div class="bar" style="margin-top:6px"><i style="width:${v}%"></i></div><div class="dim tiny" style="margin-top:4px">${hint}</div></div>`;
    return {
      html: `<div class="view">
        ${header('評估覆盤', '#/scenarios', '', s.title)}
        ${steps(4)}
        <div class="pad stack">
          <div class="card hero" style="text-align:center">
            <span class="pill ${r.task >= 60 ? 'ok' : 'warn'}">${r.task >= 60 ? '✔ 任務達成' : '任務未完全達成'}</span>
            <div class="ring" style="margin:16px auto 0;width:150px;height:150px">${ring(r.overall / 100, { size: 150, stroke: 12, color: r.overall >= 75 ? '#22c55e' : '#fbbf24' })}<div class="c"><div><b style="font-size:42px">${r.overall}</b><br><small>/ 100</small></div></div></div>
            <h2 style="margin-top:12px">${lvl[0]}</h2><p class="dim small">${lvl[1]}</p>
          </div>

          <div class="card"><h3>多維度評測</h3>
            ${bar('任務完成度', r.task, `${r.objs.filter((o) => o.ok).length} / ${r.objs.length} 項檢核目標完成`)}
            ${r.pron != null ? bar('發音辨識度', r.pron, '依語音辨識信心值估算，不等同專業發音評分') : '<p class="dim tiny" style="margin-top:12px">本次使用鍵盤輸入，未計算發音分數。</p>'}
            ${bar('語流表現', r.flu, `依平均句長（${r.avgWords} 字）與語速估算${r.retries ? '，含 ' + r.retries + ' 次重說' : ''}`)}
          </div>

          <div class="card"><h3>檢核目標</h3>${r.objs.map((o) => `<div class="check ${o.ok ? 'done' : 'miss'}"><span class="dot">${o.ok ? I('check') : I('x')}</span><span>${esc(o.zh)}</span></div>`).join('')}</div>

          <h2 style="font-size:19px;margin-top:8px">${I('book')} 逐句檢視與更道地說法</h2>
          ${r.turns.map((t, k) => `<div class="card">
            <div class="row between"><span class="pill ${t.ok ? 'ok' : 'warn'}">第 ${k + 1} 句 · ${t.ok ? '達標' : '未達標'}</span>${t.conf != null ? `<span class="small muted">辨識 ${Math.round(t.conf * 100)}%</span>` : '<span class="small dim">鍵盤輸入</span>'}</div>
            <p class="tiny dim" style="margin-top:12px">你的說法</p><p>“${esc(t.user)}”</p>
            <div class="note green" style="margin-top:12px;display:block"><div class="tiny" style="font-weight:800;margin-bottom:4px">AI 建議（更道地、更有禮貌）</div><div style="color:var(--text);font-weight:700">“${esc(t.better)}”</div></div>
            <p class="muted small" style="margin-top:10px">${I('bulb')} ${esc(t.note)}</p>
            <div class="acts row" style="margin-top:12px;gap:8px">${speakBtn(t.better, s.accent)}<button class="chip" data-practice="${esc(t.better)}" data-lang="${s.accent}">${I('mic')} 跟著唸建議說法</button></div></div>`).join('')}

          <button class="btn" data-go="#/chat/${s.id}">${I('refresh')} 再練一次</button>
          <button class="btn ghost" data-go="#/scenarios">回情境列表</button>
          <div style="height:30px"></div>
        </div></div>`,
      mount: wireSay,
    };
  };
})();
