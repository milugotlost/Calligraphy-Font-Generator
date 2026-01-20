<div align="center">
<img width="1200" height="475" alt="書法字體生成器橫幅" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 書法字體生成器 | Calligraphy Font Generator

**使用教育部標準隸書字體，生成精美書法 SVG 向量圖**

[![Deploy](https://github.com/USER/lishu-calligraphy-generator/actions/workflows/deploy.yml/badge.svg)](https://github.com/USER/lishu-calligraphy-generator/actions/workflows/deploy.yml)

</div>

---

## ✨ 功能特色

- 📝 **即時預覽** - 輸入文字即時顯示隸書效果
- 🎨 **多種字體** - 支援隸書、行楷、明體三種風格
- ↕️ **直橫排版** - 自由切換直書與橫書模式
- 🔴 **落款印章** - 可拖曳的紅色方印，增添書法韻味
- 📐 **可調參數** - 字體大小、間距、行距、顏色皆可調整
- 📥 **SVG 匯出** - 高品質向量圖輸出，無限放大不失真
- 🤖 **AI 助手** - 整合 Gemini API，自動生成詩詞與印章建議

---

## 🚀 快速開始

### 環境需求

- Node.js 18+ 
- npm 或 pnpm

### 本地開發

```bash
# 1. 安裝依賴
npm install

# 2. 設定環境變數 (複製 .env.local 並填入 API Key)
cp .env.local.example .env.local
# 編輯 .env.local，設定 GEMINI_API_KEY=你的API金鑰

# 3. 啟動開發伺服器
npm run dev

# 4. 開啟瀏覽器訪問
# http://localhost:3000
```

### 建置生產版本

```bash
npm run build
npm run preview  # 預覽生產版本
```

---

## 📦 部署至 GitHub Pages

1. **設定 Secrets**：前往 GitHub Repo → Settings → Secrets → Actions，新增 `GEMINI_API_KEY`

2. **啟用 GitHub Pages**：Settings → Pages → Source 選擇 `GitHub Actions`

3. **推送程式碼**：
```bash
git push origin main
```

4. GitHub Actions 會自動建置並部署

---

## 🎨 字體說明

本專案優先使用「**教育部標準隸書**」字體，字體會依以下順序自動回退：

1. 教育部標準隸書 (MOEStandardLishu)
2. 文鼎隸書 (AR LiShuB5 BD)
3. 系統內建隸書 (LiSu)
4. ZCOOL XiaoWei (Web 字體備用)

> 📁 專案內含 `MoeLI-3.0.zip`，可自行解壓安裝至系統。字體檔案採用創用CC「姓名標示-禁止改作」3.0 臺灣版授權。

---

## 🛠️ 技術棧

| 項目 | 技術 |
|------|-----|
| 前端框架 | React 19 |
| 建置工具 | Vite 6 |
| 語言 | TypeScript |
| 樣式 | Tailwind CSS + 自訂 CSS |
| 圖示 | Lucide React |
| AI | Google Gemini API |
| 部署 | GitHub Pages |

---

## 📄 授權

- 程式碼：MIT License
- 教育部標準隸書字體：創用CC「姓名標示-禁止改作」3.0 臺灣版

---

<div align="center">

**Made with ❤️ for Chinese Calligraphy**

</div>
