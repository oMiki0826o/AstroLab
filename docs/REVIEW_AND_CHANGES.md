# V0.2.0 重構內容與驗收紀錄

對照基準：`oMiki0826o/AstroLab`，2026-10-10 最新 `main` commit `39ae808`。本專案為獨立重構版本，保留原本的主要天文工具與 40 筆去重後的固定座標整理資料、木星與土星的動態天體索引，而非逐檔修改。尚未通過實際 Next.js 完整建置與瀏覽器測試者，不宣稱已驗證。

| 原有問題 | 本版調整 | 驗證方式 |
| --- | --- | --- |
| 英文硬編碼 `/AstroLab` 前綴 | 所有內部連結統一使用框架 `Link` 的 app-relative 路徑 | 靜態輸出後掃描雙重前綴和壞連結 |
| `toISOString()` 當成本地 `datetime-local` | 使用 `getHours()` 等本地日期欄位格式化 | 日期／恆星時計算回歸測試；待補跨時區 E2E |
| 中英天文公式重複 | `lib/astronomy.ts` 單一實作 | 計算單元測試 |
| `m42` / `m42-markdown` 等重複 | canonical ID；已存在的 Messier 直接使用整理值 | canonical-ID 測試 |
| M34 被錯當英仙座雙星團 | 對未整理 M34 顯示索引資料，不捏造名稱與數值 | 目錄索引測試 |
| IC 434 與馬頭暗星雲混為同筆 | 新增獨立 `b33`，保留 `ic434` | 資料驗證 |
| 月相分類將大量日期誤歸上弦／盈凸月 | 八等分月相分類；標示近似 | 朔／望測試 |
| 抖動 40 張／10 張計成 4 次、停用仍顯示多次 | `(frames-1) / dither` 向下取整；0=停用 | 曝光計算測試 |
| Sky Tonight 只看天體高度 | 加入太陽高度、暗夜時段篩選 | 位置／太陽測試 |
| `PAGES=[]` 舊靜態驗證迴圈無作用 | 掃描 `out/**/*.html` 全部資源與連結 | `npm run check:static` |
| 英文星座搜尋 `Orion` 不符合中文字串 | 中英文名稱都參與搜尋 | 搜尋單元測試 |
| `localStorage` JSON 缺少類型檢查 | 收藏 ID 只接受預期型別及格式、讀寫提供例外保護 | 仍需 E2E |
| 中文頁返回文字由 CSS 強制改寫 | 使用語意化 JSX 導覽 | 靜態頁面掃描及人工檢查 |

## 尚未解決或需要後續實測

1. 原版不同天體的多項距離／星等及天體類型仍需逐筆外部核對；本版全部標成 `needs-review`。
2. 沒有高精度歲差、章動、視差、大氣折射、行星星曆、天氣與地形模型。
3. 英文語言的 `<html lang>` 透過客戶端 hydration 設定；靜態 HTML 仍沿用根頁 `zh-Hant`，需後續改用真正的多 root layout 才能徹底完善 SSR 無障礙語言屬性。
4. 本重構環境無法從 npm 下載套件，**無法在此執行 Next.js build、Vitest 或瀏覽器 E2E**。JS 靜態語法檢查與天體資料驗證可在交付前本機執行，CI 定義會在 GitHub Actions 環境負責完整驗證。
5. 共用 UI 已拆分為 `components/shared.tsx`、`components/pages/` 與簡短的 `astro-app.tsx`；部分功能頁的 JSX 排版仍可再整理。
6. 靜態 App Router 無伺服器側時間參照，計算會依使用者裝置時間與時區；裝置時鐘錯誤會影響結果。

## 推薦合併前驗收

```bash
npm install
NEXT_PUBLIC_BASE_PATH=/AstroLab npm run check
npm run dev
```

在瀏覽器檢查 `/astro/tonight/` 和 `/en/astro/tonight/` 的當地時間、正確頁面連結、收藏儲存、輸出檔案及手機布局。首次部署前需確認 Pages 來源設為 GitHub Actions。
