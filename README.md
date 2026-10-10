# AstroLab

AstroLab 是一個免登入、以繁體中文及英文呈現的靜態觀星工具。它協助初學者搜尋天體、查看近似方位與可觀測時段，以及規劃望遠鏡視野和深空攝影曝光。網站可以部署在 GitHub Pages，不需要伺服器或 API 金鑰。

這是由原專案 `oMiki0826o/AstroLab` 的 2026-10-11 `main` 架構重新整理的 **0.2.0 優化版本**。本版為獨立重構，不是逐檔無差異複製原始版本，使用前請先閱讀資料精度及已知限制。

## 功能

| 頁面 | 功能 |
| --- | --- |
| 天體目錄 | 雙語搜尋、標準化 Messier/NGC/IC ID、收藏、JSON 匯出 |
| 天體詳細頁 | J2000 赤經赤緯、星等、角尺寸、來源狀態、定位提示、相關天體 |
| Sky Tonight | 依地點與當地時間計算近似高度角、方位角、太陽高度，並搜尋夜間觀測時段 |
| Sky Map | 可縮放的赤經赤緯分布示意圖與天體詳細頁連結 |
| Deep Sky Finder | 依已知視星等、星座與類型篩選 |
| Constellations | 以中英文星座名稱瀏覽目標 |
| Moon Phase | 近似月齡、八種月相及照明比例 |
| Equipment | 基於三角函數的真實幾何視野計算、簡易目標大小判斷 |
| Exposure | 積分時間、讀出／穩定開銷、正確抖動次數 |
| Comparison | 兩個天體各項資料對照 |
| Imaging Planner | 本地儲存拍攝計畫並匯出 JSON |

## 本地執行

需求：Node.js 22（或符合 Next.js 16 要求的 Node 版本）、npm、Python 3.9+（僅用於靜態 HTML 驗證）。

```bash
npm install
npm run dev
```

瀏覽 `http://localhost:3000`。英文入口位於 `/en/`，繁體中文入口是 `/`。

完整驗證指令：

```bash
npm run check
```

分開執行：

```bash
npm run check:data  # 檢查天體資料
npm test            # Vitest 單元測試
npm run typecheck   # TypeScript 型別檢查
npm run build       # Next.js 靜態匯出
npm run check:static # 檢查所有輸出頁面的內部連結與資源
```

## 部署 GitHub Pages

專案若位於 `https://<user>.github.io/AstroLab/`，必須在**建置階段**設定：

```bash
NEXT_PUBLIC_BASE_PATH=/AstroLab npm run build
NEXT_PUBLIC_BASE_PATH=/AstroLab npm run check:static
```

推送至 `main`，使用 `.github/workflows/pages.yml` 完成驗證，並部署**與測試相同的靜態產物**；請先到 GitHub 專案 Settings → Pages 將來源設為 **GitHub Actions**。`Link` 的 `href` 必須使用 `/astro/...`、`/en/astro/...` 等應用程式路徑，**不要手動加上 `/AstroLab`**，框架會自動處理。

若要部署到網站根目錄，請清除 `NEXT_PUBLIC_BASE_PATH` 後重建。不要在同一份建置產物上直接搬動路徑。

## 資料來源與更新

- `content/astro/catalog.json`：40 個由舊版本遷移並去重的定點天體，以及木星／土星 2 筆不提供虛假固定座標的移動目標索引（座標採 J2000，統一為數值角度）。
- `lib/catalog.ts`：以標準 Messier ID 自動補齊 M1–M110 的未整理索引，不捏造未知星等與座標。
- 目前共有 **136 個不重複的天體路由**，其中 **40 個有遷移自原專案的近似位置資料**；完整正確性仍需逐筆對照專業資料庫。
- IC 434（發射星雲）與 B33（馬頭暗星雲）是不同天體，已拆開表示。
- 遷移用腳本 `tools/build-curated.py` 與 `tools/enrich-curated.py` 用於保留處理過程，正式維護應直接修改 JSON，並重新執行 `npm run check:data`；**重跑遷移腳本會覆寫手動更新的資料**。

所有測量紀錄在來源重新核對前都標記為 `needs-review`。資料缺漏時顯示「—」，而不是以 `0` 冒充已知資料。

## 精度限制

AstroLab 不是 Stellarium，也不是專業星曆程式。請留意：

- Sky Tonight 使用靜態 J2000 座標、平均恆星時與近似太陽座標，**尚未處理歲差、章動、視差、大氣折射、地形遮蔽與雲量**，也不適合拿來追蹤行星等位置快速變動的天體。
- 觀測時段以 15 分鐘為間隔，判斷條件是太陽高度 ≤ −12° 且目標高度 ≥ 25°；這只是篩選條件，不代表實際看得到或拍得到。
- Moon Phase 使用固定平均朔望月，長時間累積會有誤差；不提供精確月出月落。
- 星圖是簡化的 RA/Dec 展開圖，不是頭頂真實方向，也不是受地平線限制的視圖。
- 視野計算未考慮光學畸變與目標方向角。目標尺寸來自舊版整理資料，待逐筆核對。
- 部分角大小、星等、距離與目錄名稱仍是待核對的整理值，不應作為研究、精密定位或安全決策的唯一依據。
- 收藏與拍攝計畫儲存在 `localStorage`，清除網站資料就會失去內容。請自行匯出 JSON 備份。
- Service Worker 會快取核心頁面與造訪過的資源；其他頁面可能需要先連線造訪才能離線使用。PWA 快取更新可能因瀏覽器策略延遲。

## 專案結構

```text
app/                      # 中英路由，保持簡單的頁面入口
components/shared.tsx     # 共用布局、翻譯與導覽
components/pages/          # 分離各觀測功能的雙語元件
components/astro-app.tsx  # 路由分派
lib/astronomy.ts           # 獨立可測試的天文及曝光公式
lib/catalog.ts             # 天體識別碼、搜尋與查詢
lib/storage.ts             # 本地儲存與 JSON 匯出
content/astro/catalog.json # 天體整理資料
public/                   # PWA manifest、icons 與離線快取
tools/                    # 資料驗證、靜態 HTML 驗證、遷移腳本
tests/                    # 回歸測試
.github/workflows/         # PR 驗證與 Pages 部署
```

## 後續開發

請參考 [ROADMAP.md](ROADMAP.md) 和 [docs/REVIEW_AND_CHANGES.md](docs/REVIEW_AND_CHANGES.md)。本版優先修復天文資料重複、時區解讀、月相分類、曝光抖動次數、英語路由 basePath 等問題，不以增加大量花俏頁面為目標。

## 授權

AstroLab 程式採用 [MIT](LICENSE)。本專案移植自原 AstroLab 的資料文字仍保留待核對標示；第三方資料與來源應遵循其各自授權。詳見 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
