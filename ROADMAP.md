# AstroLab Roadmap

AstroLab 是獨立的觀星工具，不是主站 STLab 的子頁。這份文件區分已部署功能與仍需天文資料或計算引擎的工作。

## 已完成

- Astro Catalog：Messier、NGC、IC、亮星搜尋、收藏、JSON 匯出與獨立詳細頁。
- 目錄頁：144 個中文與 144 個英文天體詳細路由；索引項目會明確標示資料狀態。
- 工具：Sky Tonight、相對星圖、Deep Sky Finder、Constellation Explorer、Moon Phase、Equipment、Exposure、Target Comparison。
- 英文入口：英文首頁、工具索引、Sky Tonight、Deep Sky Finder、Constellation Explorer、相對星圖與天體詳細頁。
- 三種主題、404、資料來源說明、Static Export、資料檢查與路由內容檢查。

## 資料與計算限制

- 相對星圖不是即時星圖，不處理地平線、歲差、地形遮蔽或即時星曆。
- Sky Tonight 是觀測規劃近似模型，未取代專業星曆、大氣折射與地形資料。
- M／NGC／IC 索引項目若尚未有可靠欄位，會保留「索引資料」狀態，不用近似值冒充精確資料。
- Moon Phase、Equipment、Exposure、Target Comparison 等計算頁的欄位仍以繁中顯示；英文入口、觀測頁、深空搜尋與星座探索已分開完成。

## 下一階段

1. 將計算工具欄位與錯誤狀態逐頁英文化。
2. 增加瀏覽器 E2E，驗證搜尋、詳細頁、收藏、主題與手機寬度。
3. 若需要專業觀測用途，再評估 Astronomy Engine 或授權星圖資料，不在靜態頁面中假裝即時精度。

## 驗證

```bash
npm run check
```
