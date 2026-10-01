/* Views part 2: free talk, training hub, drill, shadowing, phrasebook, progress, settings */
(function () {
  const { esc, $, $$, I, toast, ring } = TF.ui;
  const S = TF.store, SP = TF.speech;
  const go = (h) => { location.hash = h; };
  const header = (title, back, right, sub) => `
    <div class="top">
      <button class="iconbtn" data-go="${back}" aria-label="返回">${I('back')}</button>
      <h1>${esc(title)}${sub ? `<span class="sub">${esc(sub)}</span>` : ''}</h1>${right || ''}
    </div>`;
  const speakBtn = (text, lang, rate) =>
    `<button class="speakbtn" data-say="${esc(text)}" data-lang="${lang || 'en-US'}" data-rate="${rate || 1}" aria-label="聽發音">${I('vol')}</button>`;

  /* ================= TRAIN HUB ================= */
  TF.views.train = () => ({
    dock: 'train',
    html: `<div class="view">
      <div class="top"><div class="brand"><div class="avatar">${I('mic')}</div><div><b>口說特訓</b><small>針對台灣學習者的弱點練習</small></div></div></div>
      <div class="bento">
        <div class="t w2 tap" data-go="#/free"><span class="pill ok" style="align-self:flex-start">Free Talk</span><p class="tt" style="margin-top:16px">自由對話教練　<em>選話題開口聊，即時提醒常見語法錯誤。</em></p></div>
        <div class="t w2 tap" data-go="#/shadow"><span class="pill warn" style="align-self:flex-start">Shadowing</span><p class="tt" style="margin-top:16px">影子跟讀　<em>聽原速朗讀、逐字高亮，練語調與節奏。</em></p></div>
        <p class="tt sm" style="grid-column:span 2;padding:14px 10px 4px">發音特訓　<em>6 組台灣人常錯音</em></p>
        ${TF.DRILLS.map((d) => { const pc = S.phonPct(d.key); return `<div class="t tap" data-go="#/drill/${d.id}"><b style="font-family:var(--mono);font-size:20px;color:var(--pri3)">${esc(d.sym)}</b><p class="tt sm" style="margin-top:12px;font-size:20px">${esc(d.title)}　<em>${esc(d.sub)}</em></p><div class="gap"></div><div class="bar" style="margin-top:14px;height:6px"><i style="width:${pc || 0}%"></i></div><div class="mini" style="margin-top:8px">${pc == null ? '尚未練習' : '掌握 ' + pc + '%'}</div></div>`; }).join('')}
      </div>
      <div style="height:20px"></div></div>`,
  });

  /* ================= FREE TALK ================= */
  TF.views.free = () => ({
    track: true,
    html: `<div class="chatwrap view">
      ${header('Free Talk', '#/home', '', 'AI 口說教練')}
      <div class="chips" id="topics">${TF.TOPICS.map((t, i) => `<button class="chip${i ? '' : ' on'}" data-t="${i}">${t.zh}</button>`).join('')}</div>
      <div class="chatlog" id="log" aria-live="polite"></div>
      <div class="dockbar">
        <div class="wave" id="wave">${Array.from({ length: 26 }, (_, i) => `<i style="animation-delay:${(i % 9) * 0.07}s"></i>`).join('')}</div>
        <div class="live" id="live">${SP.canListen ? '點麥克風說英文，或直接打字' : '此瀏覽器不支援語音辨識，請使用文字輸入'}</div>
        <div class="inputrow"><input class="txt" id="txt" placeholder="Type or speak in English…" autocomplete="off" aria-label="輸入英文">
          <button class="iconbtn" id="send" aria-label="送出">${I('send')}</button>${SP.canListen ? `<button class="mic" id="mic" aria-label="說話">${I('mic')}</button>` : ''}</div>
      </div></div>`,
    mount(el) {
      const log = $('#log', el), txt = $('#txt', el), live = $('#live', el), wave = $('#wave', el), mic = $('#mic', el);
      let topic = 0, turn = 0, busy = false, listener = null, alive = true;
      const add = (html, cls) => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; };
      const coach = (text) => {
        const d = add(`<div class="who">Coach</div><div>${esc(text)}</div><div class="tools"><button data-s>${I('vol')} 聽原音</button></div>`, 'msg npc');
        $('[data-s]', d).onclick = () => SP.speak(text);
        SP.speak(text);
      };
      const start = () => { log.innerHTML = ''; turn = 0; coach(TF.TOPICS[topic].q); };
      const ACK = ['That sounds great!', 'Interesting!', 'I see, thanks for sharing.', 'Nice one!', 'Good point.'];

      function reply(text, conf) {
        text = (text || '').trim(); if (!text) return;
        add(`<div class="who">YOU</div><div>${esc(text)}</div>`, 'msg me');
        if (conf != null) add(`${I('check')} 辨識度 ${Math.round((conf || 0.9) * 100)}%`, 'badge ok');
        S.addSentence(1); S.addXP(2);
        const tips = TF.GRAMMAR.filter((g) => g.re.test(text));
        tips.slice(0, 2).forEach((g) => {
          const m = text.match(g.re);
          add(`<b>${I('bulb')} 文法小提醒</b><br>你說：<i>“${esc(m[0])}”</i><br>建議：<b>${esc(m[0].replace(g.re, g.say))}</b><br><span class="muted">${esc(g.why)}</span>`, 'note green msg');
        });
        const nw = SP.words(text).length;
        setTimeout(() => {
          if (!alive) return;
          const T = TF.TOPICS[topic];
          if (nw < 4) coach('Could you tell me a bit more? Try answering in a full sentence.');
          else { coach(ACK[turn % ACK.length] + ' ' + T.follow[turn % T.follow.length]); turn++; }
        }, 500);
      }
      $('#send', el).onclick = () => { const v = txt.value; txt.value = ''; reply(v, null); };
      txt.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); $('#send', el).click(); } };
      $$('[data-t]', el).forEach((b) => (b.onclick = () => { topic = +b.dataset.t; $$('[data-t]', el).forEach((x) => x.classList.toggle('on', x === b)); start(); }));
      if (mic) mic.onclick = () => {
        if (busy) { listener && listener.stop(); return; }
        busy = true; mic.classList.add('on'); wave.classList.add('on'); live.textContent = '正在聆聽…';
        let sent = false;
        listener = SP.listen({
          onInterim: (t) => { live.textContent = t || '正在聆聽…'; },
          onResult: (t, c) => { sent = true; reply(t, c || 0.9); },
          onError: (e) => { live.textContent = e === 'not-allowed' ? '麥克風被封鎖，請允許權限或改用打字' : e === 'no-speech' ? '沒聽到聲音，再試一次' : '辨識失敗 (' + e + ')'; },
          onEnd: () => { busy = false; mic.classList.remove('on'); wave.classList.remove('on'); if (sent) live.textContent = '點麥克風說英文，或直接打字'; },
        });
      };
      el._cleanup = () => { alive = false; SP.stop(); listener && listener.abort && listener.abort(); };
      start();
    },
  });

  /* ================= DRILL ================= */
  TF.views.drill = (p) => {
    const d = TF.DRILLS.find((x) => x.id === p.id); if (!d) return { redirect: '#/train' };
    return {
      track: true,
      html: `<div class="view">${header(d.title, '#/train', `<span class="pill tag">${esc(d.sym)}</span>`, d.sub)}
        <div class="bento">
          <div class="card"><div class="row between"><span class="small muted" id="cnt"></span><span class="pill ${S.phonPct(d.key) >= 80 ? 'ok' : 'mute'}" id="pc"></span></div>
            <div class="bar" style="margin-top:10px"><i id="pbar" style="width:0"></i></div></div>
          <div class="note blue">${I('bulb')}<span><b>發音秘訣：</b>${esc(d.tip)}</span></div>
          <div class="card" id="box"></div>
          <div class="row"><button class="btn ghost" id="prev">上一題</button><button class="btn" id="next">下一題 ${I('arrow')}</button></div>
          <div style="height:20px"></div>
        </div></div>`,
      mount(el) {
        let k = 0;
        const draw = () => {
          const it = d.items[k];
          $('#cnt', el).textContent = `第 ${k + 1} / ${d.items.length} 題`;
          const pc = S.phonPct(d.key);
          $('#pc', el).textContent = pc == null ? '尚未練習' : '掌握度 ' + pc + '%';
          $('#pbar', el).style.width = (pc || 0) + '%';
          TF.ui.practice($('#box', el), {
            text: it.text, zh: it.zh, focus: it.focus,
            onScore: (r) => {
              r.words.forEach((w) => { if (it.focus[w.w]) S.phonStat(d.key, w.sim); });
              S.addSentence(1); S.addXP(r.score >= 75 ? 3 : 1);
              const pc2 = S.phonPct(d.key); $('#pc', el).textContent = '掌握度 ' + pc2 + '%'; $('#pbar', el).style.width = pc2 + '%';
            },
          });
        };
        $('#prev', el).onclick = () => { k = (k - 1 + d.items.length) % d.items.length; draw(); };
        $('#next', el).onclick = () => { k = (k + 1) % d.items.length; draw(); };
        el._cleanup = () => { SP.stop(); const b = $('#box', el); b && b._cleanup && b._cleanup(); };
        draw();
      },
    };
  };

  /* ================= SHADOWING ================= */
  TF.views.shadow = () => ({
    track: true,
    html: `<div class="view">${header('影子跟讀', '#/train', `<span class="pill gem">${I('gem')} ${S.get().xp}</span>`, 'Shadowing')}
      <div class="bento">
        <div class="row between"><span class="small muted" id="cnt"></span>
          <div class="row" style="gap:6px" id="speeds"><button class="chip sm" data-sp="0.8">0.8x</button><button class="chip sm on" data-sp="1">1.0x</button><button class="chip sm" data-sp="1.2">1.2x</button></div></div>
        <div class="card" id="box"></div>
        <div class="note blue">${I('bulb')}<span id="note"></span></div>
        <button class="chip" id="loop" style="align-self:flex-start">${I('loop')} 單句循環：關</button>
        <div id="extra"></div>
        <div class="row"><button class="btn ghost" id="prev">上一句</button><button class="btn" id="next">下一句 ${I('arrow')}</button></div>
        <div style="height:20px"></div>
      </div></div>`,
    mount(el) {
      let k = 0, speed = 1, loop = false;
      const draw = () => {
        const it = TF.SHADOW[k];
        $('#cnt', el).textContent = `第 ${k + 1} / ${TF.SHADOW.length} 句　最佳 ${S.get().shadowBest[k] || '—'}`;
        $('#note', el).innerHTML = `<b>跟讀重點：</b>${esc(it.note)}`;
        $('#extra', el).innerHTML = '';
        TF.ui.practice($('#box', el), {
          text: it.text, zh: it.zh, getRate: () => speed, loop: () => loop,
          onScore: (r) => {
            const target = Math.round(130 * speed), mine = r.wpm;
            const pace = mine ? (mine > target * 1.25 ? '稍快，放慢一點' : mine < target * 0.7 ? '稍慢，試著更連貫' : '節奏接近原速') : '';
            $('#extra', el).innerHTML = `<div class="card"><b>節奏診斷</b><p class="small muted" style="margin-top:6px">${mine ? `你的語速約 <b>${mine}</b> WPM，目標約 ${target} WPM：${pace}。` : '語速資料不足。'}</p></div>`;
            const st = S.get(); if (r.score > (st.shadowBest[k] || 0)) { st.shadowBest[k] = r.score; S.save(); }
            S.addSentence(1); S.addXP(r.score >= 75 ? 4 : 1);
            $('#cnt', el).textContent = `第 ${k + 1} / ${TF.SHADOW.length} 句　最佳 ${st.shadowBest[k]}`;
          },
        });
      };
      $$('[data-sp]', el).forEach((b) => (b.onclick = () => { speed = +b.dataset.sp; $$('[data-sp]', el).forEach((x) => x.classList.toggle('on', x === b)); }));
      $('#loop', el).onclick = (e) => { loop = !loop; e.currentTarget.classList.toggle('on', loop); e.currentTarget.innerHTML = `${I('loop')} 單句循環：${loop ? '開' : '關'}`; if (!loop) SP.stop(); };
      $('#prev', el).onclick = () => { k = (k - 1 + TF.SHADOW.length) % TF.SHADOW.length; draw(); };
      $('#next', el).onclick = () => { k = (k + 1) % TF.SHADOW.length; draw(); };
      el._cleanup = () => { loop = false; SP.stop(); const b = $('#box', el); b && b._cleanup && b._cleanup(); };
      draw();
    },
  });

  /* ================= PHRASEBOOK ================= */
  TF.views.phrasebook = () => ({
    dock: 'phrasebook',
    html: `<div class="view">
      <div class="top"><div class="brand"><div class="avatar">${I('book')}</div><div><b>出國隨身金句庫</b><small>${TF.PHRASEBOOK.length} 句 · 可離線複習</small></div></div></div>
      <label class="search">${I('search')}<input id="q" type="search" placeholder="搜尋英文或中文" aria-label="搜尋金句"></label>
      <div class="chips" id="cats">${TF.PB_CATS.map((c, i) => `<button class="chip${i ? '' : ' on'}" data-c="${c.id}">${c.zh}</button>`).join('')}<button class="chip" id="favf">${I('star')} 收藏</button></div>
      <div class="pad row" style="margin:10px 0;gap:8px"><button class="chip" id="slow">${I('vol')} 全部慢速</button><button class="chip" id="auto">${I('loop')} 自動連續播放</button></div>
      <div class="bento" id="list"></div><div style="height:20px"></div></div>`,
    mount(el) {
      let cat = 'all', q = '', favOnly = false, slow = false, autoOn = false, autoT = null;
      const rate = () => (slow ? 0.75 : 1);
      const rows = () => TF.PHRASEBOOK.filter((p) => (cat === 'all' || p.c === cat) && (!favOnly || S.get().fav[p.id]) && (!q || (p.en + p.zh).toLowerCase().includes(q)));
      const draw = () => {
        const r = rows();
        $('#list', el).innerHTML = r.length ? r.map((p) => `<div class="phrase" data-id="${p.id}">
          ${p.pri ? '<span class="pill warn" style="margin-bottom:8px">精選必備</span>' : ''}
          <q>“${esc(p.en)}”</q><div class="zh">${esc(p.zh)}</div>${p.note ? `<div class="dim tiny" style="margin-top:6px">💡 ${esc(p.note)}</div>` : ''}
          <div class="acts"><button class="speakbtn" data-p="${p.id}" aria-label="播放">${I('vol')}</button>
            <button class="chip" data-pr="${p.id}">${I('mic')} 跟著唸</button>
            <button class="speakbtn starbtn${S.get().fav[p.id] ? ' on' : ''}" data-f="${p.id}" style="margin-left:auto;background:none" aria-label="收藏">${I('star')}</button></div></div>`).join('') : '<div class="empty">沒有符合的金句</div>';
        $$('[data-p]', el).forEach((b) => (b.onclick = () => SP.speak(TF.PHRASEBOOK.find((x) => x.id === b.dataset.p).en, { rate: rate() })));
        $$('[data-pr]', el).forEach((b) => (b.onclick = () => { const p = TF.PHRASEBOOK.find((x) => x.id === b.dataset.pr); TF.ui.practiceSheet(p.en, p.zh, 'en-US', () => S.addSentence(1)); }));
        $$('[data-f]', el).forEach((b) => (b.onclick = () => { const st = S.get(); if (st.fav[b.dataset.f]) delete st.fav[b.dataset.f]; else st.fav[b.dataset.f] = true; S.save(); draw(); }));
      };
      $('#q', el).oninput = (e) => { q = e.target.value.trim().toLowerCase(); draw(); };
      $$('[data-c]', el).forEach((b) => (b.onclick = () => { cat = b.dataset.c; $$('[data-c]', el).forEach((x) => x.classList.toggle('on', x === b)); draw(); }));
      $('#favf', el).onclick = (e) => { favOnly = !favOnly; e.currentTarget.classList.toggle('on', favOnly); draw(); };
      $('#slow', el).onclick = (e) => { slow = !slow; e.currentTarget.classList.toggle('on', slow); toast(slow ? '慢速播放 0.75x' : '正常速度'); };
      $('#auto', el).onclick = (e) => {
        autoOn = !autoOn; e.currentTarget.classList.toggle('on', autoOn);
        if (!autoOn) { SP.stop(); return; }
        const list = rows(); let i = 0;
        const next = () => {
          if (!autoOn || i >= list.length) { autoOn = false; $('#auto', el).classList.remove('on'); return; }
          const card = $(`[data-id="${list[i].id}"]`, el); card && card.scrollIntoView({ block: 'center', behavior: 'smooth' });
          SP.speak(list[i].en, { rate: rate(), onend: () => { i++; autoT = setTimeout(next, 900); } });
        };
        next();
      };
      el._cleanup = () => { autoOn = false; clearTimeout(autoT); SP.stop(); };
      draw();
    },
  });

  /* ================= PROGRESS ================= */
  TF.views.progress = () => {
    const st = S.get(), days = [];
    const names = ['日', '一', '二', '三', '四', '五', '六'];
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const e = st.days[S.dayKey(d)] || { sec: 0 }; days.push({ n: names[d.getDay()], m: Math.round(e.sec / 60), today: i === 0 }); }
    const total = days.reduce((a, b) => a + b.m, 0), max = Math.max(10, ...days.map((d) => d.m));
    const goalW = st.goalMin * 7, pctW = Math.min(100, Math.round((total / goalW) * 100));
    const done = TF.SCENARIOS.filter((s) => (st.scen[s.id] || {}).done).length;
    const badges = [
      { e: '🔥', t: '連續練習 3 天', d: '養成每日開口習慣', ok: S.streak() >= 3 },
      { e: '🏆', t: '連續練習 7 天', d: '一週不間斷', ok: S.streak() >= 7 },
      { e: '🎙️', t: '開口 50 句', d: `目前 ${st.sentences} 句`, ok: st.sentences >= 50 },
      { e: '🗣️', t: '開口 200 句', d: `目前 ${st.sentences} 句`, ok: st.sentences >= 200 },
      { e: '🛫', t: '情境通關 3 個', d: `目前 ${done} 個`, ok: done >= 3 },
      { e: '🌟', t: '單次評分 90+', d: '流暢應對', ok: st.perfect >= 1 },
    ];
    return {
      dock: 'progress',
      html: `<div class="view">
        <div class="top"><div class="brand"><div class="avatar">${I('chart')}</div><div><b>學習成長數據</b><small>${S.level().cur.id} · ${st.xp} XP</small></div></div><span class="pill flame">${I('flame')} ${S.streak()} 天</span></div>
        <div class="bento">
          <div class="t"><p class="tt">${st.sentences}<em class="blk">累計開口句數</em></p></div>
          <div class="t"><p class="tt">${done}／${TF.SCENARIOS.length}<em class="blk">情境通關</em></p></div>
          <div class="card"><div class="row between"><h3>本週開口時長</h3><span class="pill ${pctW >= 100 ? 'ok' : 'tag'}">${pctW}%</span></div>
            <p class="muted small" style="margin:4px 0 8px">本週 ${total} / ${goalW} 分鐘（每日目標 ${st.goalMin} 分鐘）</p>
            <div class="chart">${days.map((d) => `<div class="col${d.today ? ' today' : ''}"><b>${d.m || ''}</b><i style="height:${Math.max(4, (d.m / max) * 100)}%"></i><span>${d.n}</span></div>`).join('')}</div></div>
          <p class="tt sm" style="grid-column:span 2;padding:14px 10px 4px">音標掌握度　<em>依發音特訓成績累計</em></p>
          ${TF.DRILLS.map((d) => { const p = S.phonPct(d.key); return `<div class="t tap" data-go="#/drill/${d.id}"><b style="font-family:var(--mono);font-size:20px;color:var(--pri3)">${esc(d.sym)}</b><div class="gap"></div><div class="bar" style="margin-top:14px;height:6px"><i style="width:${p || 0}%"></i></div><div class="mini" style="margin-top:8px">${p == null ? '尚未練習' : p >= 85 ? '已精通 ' + p + '%' : (p >= 70 ? '優良 ' : '練習中 ') + p + '%'}</div></div>`; }).join('')}
          <p class="tt sm" style="grid-column:span 2;padding:14px 10px 4px">里程碑成就　<em>${badges.filter((b) => b.ok).length} / ${badges.length}</em></p>
          ${badges.map((b) => `<div class="t" style="${b.ok ? '' : 'opacity:.4'}"><div style="font-size:30px">${b.e}</div><p class="tt sm" style="margin-top:12px;font-size:18px">${b.t}　<em>${b.d}</em></p></div>`).join('')}
          <div class="card"><div class="row">${I('shield')}<h3>麥克風與隱私</h3></div>
            <p class="muted small" style="margin:8px 0 12px">語音辨識由瀏覽器提供（Chrome / Edge 會將語音送至雲端辨識）。本 App 只在你的裝置儲存練習紀錄，不上傳任何資料。</p>
            <div class="row between"><span class="small" id="micstat">狀態：檢查中…</span><button class="btn sm" id="mictest">${I('mic')} 測試麥克風</button></div></div>
          <div style="height:20px"></div>
        </div></div>`,
      mount(el) {
        const stat = $('#micstat', el);
        const names = { granted: '已允許 ✅', denied: '已封鎖 ❌（請到網址列開啟權限）', prompt: '尚未詢問' };
        if (navigator.permissions && navigator.permissions.query) navigator.permissions.query({ name: 'microphone' }).then((r) => { stat.textContent = '狀態：' + (names[r.state] || r.state); r.onchange = () => (stat.textContent = '狀態：' + (names[r.state] || r.state)); }).catch(() => (stat.textContent = '狀態：未知'));
        else stat.textContent = '狀態：此瀏覽器未提供權限查詢';
        $('#mictest', el).onclick = async () => {
          try { const s = await navigator.mediaDevices.getUserMedia({ audio: true }); s.getTracks().forEach((t) => t.stop()); stat.textContent = '狀態：麥克風可用 ✅'; toast('麥克風正常'); }
          catch (e) { stat.textContent = '狀態：無法使用麥克風（' + (e.name || 'error') + '）'; toast('無法使用麥克風'); }
        };
      },
    };
  };

  /* ================= SETTINGS ================= */
  TF.views.settings = () => {
    const st = S.get().settings, goal = S.get().goalMin;
    return {
      html: `<div class="view">${header('設定', '#/home')}
        <div class="bento">
          <div class="card"><h3>每日目標</h3><div class="row wrap" style="margin-top:12px">${[5, 10, 15, 20, 30].map((m) => `<button class="chip${m === goal ? ' on' : ''}" data-g="${m}">${m} 分鐘</button>`).join('')}</div></div>
          <div class="card stack"><h3>語音朗讀</h3>
            <div><div class="small muted" style="margin-bottom:6px">口音偏好</div><select class="sel" id="acc" style="width:100%"><option value="auto">依情境自動（英式／美式）</option><option value="en-US">一律美式</option><option value="en-GB">一律英式</option></select></div>
            <div><div class="small muted" style="margin-bottom:6px">指定聲音</div><select class="sel" id="voice" style="width:100%"></select></div>
            <div><div class="small muted" style="margin-bottom:6px">朗讀速度：<b id="rv">${st.rate}x</b></div><input type="range" id="rate" min="0.6" max="1.2" step="0.05" value="${st.rate}" style="width:100%"></div>
            <button class="btn ghost sm" id="vtest" style="align-self:flex-start">${I('vol')} 試聽</button></div>
          <div class="card stack"><h3>資料備份</h3><p class="dim small">練習紀錄只存在這台裝置的瀏覽器中，換裝置請先匯出。</p>
            <div class="row"><button class="btn ghost sm" id="exp">${I('download')} 匯出</button><button class="btn ghost sm" id="imp">${I('upload')} 匯入</button><input type="file" id="file" accept="application/json" hidden></div></div>
          <div class="card stack"><h3>危險區</h3><button class="btn ghost sm" id="reset" style="color:#ff9a9a;align-self:flex-start">${I('trash')} 清除所有練習紀錄</button></div>
          <p class="dim tiny" style="text-align:center">TalkFlow 口說潮 v1.0<br>語音辨識需 Chrome / Edge 並連網；朗讀可離線使用。</p>
          <div style="height:20px"></div>
        </div></div>`,
      mount(el) {
        $('#acc', el).value = st.accent;
        $$('[data-g]', el).forEach((b) => (b.onclick = () => { S.get().goalMin = +b.dataset.g; S.save(); $$('[data-g]', el).forEach((x) => x.classList.toggle('on', x === b)); }));
        const fillVoices = () => { if (!$('#voice', el)) return; $('#voice', el).innerHTML = '<option value="">自動選擇</option>' + SP.voices().map((v) => `<option value="${esc(v.voiceURI)}">${esc(v.name)} (${esc(v.lang)})</option>`).join(''); $('#voice', el).value = st.voiceURI; };
        fillVoices(); setTimeout(fillVoices, 600);
        $('#acc', el).onchange = (e) => { st.accent = e.target.value; S.save(); };
        $('#voice', el).onchange = (e) => { st.voiceURI = e.target.value; S.save(); };
        $('#rate', el).oninput = (e) => { st.rate = +e.target.value; $('#rv', el).textContent = st.rate + 'x'; S.save(); };
        $('#vtest', el).onclick = () => SP.speak('Hello! Welcome to TalkFlow. Let us practise speaking English together.');
        $('#exp', el).onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([S.exportJSON()], { type: 'application/json' })); a.download = 'talkflow-backup-' + S.dayKey() + '.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };
        $('#imp', el).onclick = () => $('#file', el).click();
        $('#file', el).onchange = (e) => { const f = e.target.files[0]; if (!f) return; f.text().then((t) => { try { S.importJSON(t); toast('匯入完成'); go('#/home'); } catch (x) { toast('檔案格式不正確'); } }); };
        $('#reset', el).onclick = () => { if (confirm('確定要清除所有練習紀錄嗎？此動作無法復原。')) { S.reset(); toast('已清除'); go('#/home'); } };
      },
    };
  };
})();
