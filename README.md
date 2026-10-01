# 🎙️ TalkFlow 口說潮

> 專為台灣人設計的英語口說練習 App：出國情境對話、台式發音特訓、影子跟讀，打開網頁就能開口練。

零後端、零 API Key、免安裝。純 HTML / CSS / JavaScript，可裝成 PWA，部署在 GitHub Pages 即可使用。

## 為什麼做這個

多數口說 App 把重點放在單字與文法，但台灣學習者真正卡住的是「開不了口」和「幾個固定的發音盲點」。TalkFlow 把這兩件事拆開練：

- **情境對話**：模擬機場、飯店、餐廳、問路、購物退稅、藥局急救、轉機改簽、咖啡廳 8 個出國場景。流程是簡報 → 對話 → 單字 → 覆盤，覆盤會逐句給出「更道地、更有禮貌」的說法。
- **台式發音特訓**：針對 th、r/l、v/b、æ、ŋ、sh/ch 六組常見錯音，逐字標出哪個字沒唸好。
- **影子跟讀**：0.8 / 1.0 / 1.2 倍速、逐字高亮、單句循環。
- **Free Talk**：選話題自由聊，抓 10 種台灣學習者常見語法錯誤（如 `I am agree`）。
- **出國金句庫**：26 句，可搜尋、分類、收藏、慢速與連續播放。
- **成長紀錄**：連續天數、每週開口時長、音標掌握度、成就徽章。

## 誠實的限制

- 發音分數是「語音辨識文字與目標句的相似度估算」，**不是音素級專業評測**。
- 情境對話是規則式劇本，**不是 LLM**。
- 語音辨識需 Chrome / Edge，並在 HTTPS 或 localhost 下使用。
- 練習紀錄只存在你的瀏覽器，可在設定頁匯出備份。

## 起源

介面源自 Google Stitch 產出的 14 張靜態畫面（保留於 `stitch_taiwanese_english_speaking_app/`），統整為單一可操作的行動版 Web App。

---

主程式位於 `talkflow/`。這一版以「零後端、零 API Key、可直接部署 GitHub Pages」為基準，不接 LLM 或雲端發音評測，避免把金鑰暴露在純前端。

## 本機執行

```bash
python -m http.server 5173 --directory talkflow
```

開啟 `http://localhost:5173`。

## 驗證

```bash
python tools/validate.py
```

檢查：必要檔案、manifest、HTML 本機資源、全部 JavaScript 語法。

## GitHub Pages

已附 `.github/workflows/pages.yml`。將 repo 的 Pages Source 設為 **GitHub Actions**，push 到 `main` 後會部署 `talkflow/`。

## 狀態

- 靜態 UI / hash routing：已實作
- 8 個情境、Free Talk、單字、覆盤、發音、Shadowing、金句、成長、設定：已實作
- localStorage 進度：已實作
- 備份匯出／匯入：已加 schema、版本與 1 MB 上限，舊版備份仍可匯入
- PWA：已補 192/512 PNG 圖示、relative scope/start_url、離線 shell
- 語音朗讀：瀏覽器 SpeechSynthesis
- 語音辨識：Web Speech API；需要支援瀏覽器與 HTTPS/localhost
- 發音分數：文字辨識相似度估算，**不是音素級評測**
- AI 對話：目前是規則式，不是 LLM

完整使用與限制請見 `talkflow/README.md`。
