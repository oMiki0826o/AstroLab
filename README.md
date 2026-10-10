# AstroLab

AstroLab 是一個不需要登入、以靜態資料為主的觀星工具：搜尋 Messier、NGC、IC 與常用亮星，查看赤經赤緯、視星等、附近參考星與尋找提示，再用今晚觀測、視野規劃與曝光計算工具整理拍攝草稿。

AstroLab is a static, no-login astronomy toolkit for searching Messier, NGC, IC objects and bright stars, then planning observations with altitude, field-of-view and exposure helpers. The `/en/` entry provides an English interface; object data may retain traditional Chinese names where they are the common local label.

## 功能

- Astro Catalog：搜尋、分類、收藏與匯出觀測清單。
- 天體詳細頁：每個完整資料目標都有獨立網址與定位說明。
- Sky Tonight：用觀測時間與位置估算高度角、方位角。
- Deep Sky Finder、Constellation Explorer、Moon Phase Explorer。
- Equipment Planner、Exposure Calculator、Target Comparison。
- 相對星圖 `/astro/map/`：依赤經／赤緯繪製可點選的目標分布示意，點擊星點可開啟詳細資料。
- 英文入口 `/en/`：提供工具導覽與天體詳細頁；目錄資料共用同一份靜態來源，工具內文仍以繁中內容為主，逐步補齊。
- 天體詳細頁會標示資料狀態與來源；`index` 項目只代表可搜尋索引，不等同完整星曆資料。

## 開發

```bash
npm ci
npm run dev
```

檢查天體資料欄位與重複 ID：

```bash
npm run check:data
```

建置後可檢查主要路由是否真的輸出：

```bash
python3 tools/check_static.py
```

建置靜態網站：

```bash
NEXT_PUBLIC_BASE_PATH=/AstroLab npm run build
```

完整本機驗證可直接執行：

```bash
npm run check
```

天體內容位於 `content/astro/common.md`，欄位格式與精度規則見同目錄的 README。資料是觀測規劃用的整理值，不取代專業星圖、即時星曆或天文台資料。每次建置會先執行 `npm run check:data`，檢查欄位、重複 ID 與資料狀態。

## 授權

程式碼採 MIT License。部分資料來源與第三方聲明請見 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。

The code is released under the MIT License. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for data and attribution notes.
