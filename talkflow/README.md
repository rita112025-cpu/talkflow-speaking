# TalkFlow 口說潮 · 可用版本

把 Stitch 產出的 14 張靜態畫面整合為單一行動版 Web App。純 HTML / CSS / JavaScript，無建置流程、無後端、無 API Key。

## 1. 執行

```bash
python -m http.server 5173 --directory talkflow
```

開啟 `http://localhost:5173`。語音辨識需要安全來源，因此不要直接雙擊 `index.html`；正式環境請用 HTTPS。

## 2. 已完成

- 首頁：等級、今日目標、每日挑戰、練習進度。
- 8 個情境：機場、飯店、餐廳、問路、購物退稅、藥局急救、轉機改簽、咖啡廳。
- 學習流程：簡報 → 對話 → 單字 → 覆盤。
- Free Talk：文字／語音輸入＋10 條常見文法提醒。
- 發音特訓：6 組常錯音；逐字對齊與估算分數。
- Shadowing：逐字高亮、0.8／1.0／1.2 倍速、循環。
- 金句庫：26 句、搜尋、分類、收藏、慢速、連續播放。
- 成長頁：本週時長、音標掌握度、成就、麥克風測試。
- 設定：每日目標、口音／聲音、語速、資料備份、清除資料。
- PWA：可安裝、App icon、Service Worker 離線 shell。
- GitHub Pages：repo 根目錄已附 Actions workflow。

## 3. 備份格式

新版匯出檔包含：

```json
{
  "schema": "talkflow-backup",
  "version": 1,
  "exportedAt": "ISO-8601",
  "data": {}
}
```

匯入時會檢查 schema/version、基本欄位型別與 1 MB 大小上限。舊版直接匯出的 state JSON 仍相容。

## 4. 技術限制

### 語音朗讀
使用瀏覽器 `speechSynthesis`。可否離線與聲音品質取決於裝置已安裝的 voice。

### 語音辨識
使用 `SpeechRecognition / webkitSpeechRecognition`。功能會同時檢查：
1. 瀏覽器是否提供 API；
2. 是否為 HTTPS、localhost 或 127.0.0.1。

不符合時 App 仍可用文字輸入。

### 發音評分
目前只把「辨識結果」與目標句做字詞相似度對齊，再參考辨識 confidence。它能找出漏字或誤辨識，但**不能判定音素、重音、共振峰、舌位等細節**，所以畫面上的分數只能視為學習回饋估算。

### Free Talk / 情境對話
目前是規則式對話，不是 LLM。這是刻意保留的可部署基準：純前端直接串付費 LLM 會暴露 API Key。若未來要接 LLM，應加自己的後端／serverless proxy，金鑰只放伺服器端。

### 資料
進度存於 `localStorage`。清除瀏覽器資料會消失；換裝置前先匯出備份。

## 5. 驗證

repo 根目錄執行：

```bash
python tools/validate.py
```

會檢查：
- 15 個必要資源是否存在；
- `manifest.webmanifest` 是否可解析；
- `index.html` 本機資源是否都存在；
- 有 Node.js 時，逐一執行 `node --check` 檢查 JavaScript 語法。

## 6. GitHub Pages

1. 把整個 repo push 到 GitHub。
2. Repo → Settings → Pages。
3. Source 選 **GitHub Actions**。
4. push 到 `main` 後 `.github/workflows/pages.yml` 會部署 `talkflow/`。

PWA 的 `start_url`、`scope` 都使用相對路徑，因此可放在 `username.github.io/repo-name/` 子路徑。

## 7. 內容擴充

主要內容集中在 `js/data.js`：
- 情境：`TF.SCENARIOS`
- 發音：`TF.DRILLS`
- Shadowing：`TF.SHADOW`
- 金句：`TF.PHRASEBOOK`

修改靜態檔後，若需要強制既有 PWA 客戶端更新快取，請同步提高 `sw.js` 的 `VERSION`。

## 8. 檔案結構

```text
index.html
manifest.webmanifest
sw.js
icon.svg
icon-192.png
icon-512.png
css/app.css
js/icons.js
js/data.js
js/store.js
js/speech.js
js/ui.js
js/views1.js
js/views2.js
js/app.js
```
