# 《法華感應錄》／Lotus Sutra Stories — 自訂網域、雙語 SEO 與 Google Search Console 里程碑

- **里程碑日期：** 2026-11-01
- **狀態：** 網域切換、HTTPS、SEO 部署及 Search Console 初始設定完成；搜尋引擎實際收錄仍待觀察
- **正式網域：** https://lotus-sutra-stories.com/
- **繁中故事總覽：** https://lotus-sutra-stories.com/stories/
- **英文故事總覽：** https://lotus-sutra-stories.com/en/stories/
- **Sitemap：** https://lotus-sutra-stories.com/sitemap.xml
- **robots.txt：** https://lotus-sutra-stories.com/robots.txt
- **Repository：** https://github.com/lotus-sutra-stories/lotus-sutra-stories.github.io
- **SEO PR：** [#11 — Migrate SEO to custom domain](https://github.com/lotus-sutra-stories/lotus-sutra-stories.github.io/pull/11)
- **SEO 功能分支 Commit：** `3711766`
- **SEO Merge Commit：** `35bf751`（GitHub PR #11 記錄）

## 1. 里程碑摘要

完成 `lotus-sutra-stories.com` 的網域註冊及 GitHub Pages 設定，將原本使用 `lotus-sutra-stories.github.io` 的雙語網站 SEO 網址移至正式 `.com` 網域。保留原有 29 篇故事、中英文版本、史料出處及蓮花 LOGO，並完成 Google Search Console 的網域所有權驗證、Sitemap 提交以及四個重要入口頁面的即時網址測試。

這是既有 **Phase 3：29 篇雙語故事發布** 之後的網域與搜尋引擎整合里程碑，**不代表 74 個頁面已全部被 Google 收錄**。

## 2. 網域、DNS 與 HTTPS

- 於 Porkbun 購買 `lotus-sutra-stories.com`；購買管理頁曾顯示到期日 `2027-11-01`。
- GitHub Organization 已透過 `_github-pages-challenge-lotus-sutra-stories` TXT 記錄驗證網域所有權。
- 透過獨立 PR [#10 — Configure custom domain](https://github.com/lotus-sutra-stories/lotus-sutra-stories.github.io/pull/10) 將根目錄 `CNAME` 設為 `lotus-sutra-stories.com`，維持受保護的 `main` 與原有 GitHub Pages `main/(root)` 發布方式。
- Porkbun 主網域設定四筆 GitHub Pages A 記錄：`185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`。
- `www` 設定 CNAME 指向 `lotus-sutra-stories.github.io`；移除原有的 Porkbun 停放 ALIAS 與萬用字元 CNAME；保留所需 MX、SPF、ACME 和網域所有權 TXT 記錄。
- GitHub Pages 設定截圖顯示 **DNS check successful** 且 **Enforce HTTPS 已勾選**。
- Google Search Console 的 Domain Property 已透過 DNS TXT 驗證成功；Google 驗證 TXT 應持續保留。

## 3. SEO 原始碼與靜態網站遷移

在分支 `feat/lotus-com-seo-sitemap-20261101` 更新：

1. `site-source/src/config/site.ts`：將正式站點 origin 改為 `https://lotus-sutra-stories.com`，並更正已過期的網域狀態註解。
2. `site-source/public/robots.txt`：將 Sitemap 宣告改為 `.com`。
3. `site-source/scripts/check-release-static.py`：將嚴格 SEO 驗證的預期網域改為 `.com`。
4. 依原始碼重新建置並同步靜態輸出，包括 HTML、Next.js Flight payload、必要資產與過期檔案移除。
5. 重新產生 `.github/static-export-manifest.json`，核對檔案集合與 SHA-256。

**發布邊界：** 未修改 29 篇故事原始內容、官方蓮花 LOGO／favicon、`CNAME`、GitHub Actions workflow、分支保護或既有里程碑。

## 4. 技術驗證與整合紀錄

依據所有者提供的 Git Bash 與 GitHub Actions 紀錄：

| 項目 | 驗收結果 |
|---|---|
| Bun 鎖定依賴安裝 | PASS |
| ESLint／TypeScript | PASS |
| 故事內容驗證 | **17/17 PASS** |
| 發布安全／篩選功能驗證 | **19/19 PASS** |
| 中英文故事數量 | **各 29 篇** |
| 匯出 HTML | **77 頁**（含非內容錯誤頁） |
| Sitemap 正式內容 URL | **74 個** |
| 靜態匯出 SHA-256 Manifest | **484 筆** |
| 靜態資產完整性、Flight payload、來源與授權 | PASS |
| Canonical／雙向 `zh-Hant`、`en` hreflang | PASS（本機嚴格驗證） |
| Sitemap／robots.txt 新網域一致性 | PASS（本機嚴格驗證） |
| 原有故事來源與官方 LOGO | 未修改；驗證通過 |
| 本機基本與嚴格靜態檢查 | PASS |
| PR #11 必要 Static Site CI | PASS（GitHub 截圖） |
| PR #11 合併 | Merged，Merge Commit `35bf751` |
| GitHub Pages build and deployment #11 | PASS（GitHub Actions 截圖） |

### 驗證過程中的修正

最初在 Windows 本機檢查時，建置產物 `site-source/out/`、`.next/` 及其他開發 HTML 位於檢查器的掃描範圍，使 HTML 總數被誤判為 239 頁，並產生資產缺失訊息。將未追蹤建置快取移出 Repository 後，正式根目錄恢復 **77 個 HTML**；**基本與嚴格檢查均重新通過**。這是檢查範圍／本機工作目錄問題，不是正式網站多產生內容頁。

## 5. Google Search Console 與 Sitemap 驗收

2026-11-01，所有者提供 Google Search Console 截圖，確認：

- Domain Property `lotus-sutra-stories.com` 已完成 DNS TXT 所有權驗證。
- `https://lotus-sutra-stories.com/sitemap.xml` 已提交，**狀態為「成功」**。
- Search Console 的「系統探索到的網頁」顯示 **74**，影片 **0**；這是發現 URL 數量，**不是已收錄數量**。
- Sitemap 內容使用 `.com` 網域，包含 **58 個中英文故事 URL**（29 篇 × 2）及 **16 個其他雙語內容 URL**，共 74 個；錯誤頁不列入 Sitemap。
- 以下四個 URL 的即時網址測試均顯示綠色 **「Google 可為網址建立索引」**，且畫面顯示 **「已要求建立索引」**：
  - `https://lotus-sutra-stories.com/`
  - `https://lotus-sutra-stories.com/en/`
  - `https://lotus-sutra-stories.com/stories/`
  - `https://lotus-sutra-stories.com/en/stories/`

**證據界線：**「可建立索引」表示即時測試認為目前可供 Google 索引；「已要求建立索引」表示已送出請求。上述截圖**不能證明這些 URL 已進入 Google 正式索引，也不能證明 74 頁已全部索引**。實際索引狀況應以日後 Search Console「網頁索引」及個別 URL 的正式索引資訊為準。

## 6. 保留事項與後續工作

- 觀察 Search Console 的 Sitemap 擷取、網頁索引、主要排除原因及搜尋成效；不要把「發現 74 頁」誤記成「索引 74 頁」。
- 必要時抽查首頁、故事總覽及個別故事的 Google 選定 canonical 與語言對應。
- 維持 GitHub Organization 與 Google Search Console 兩筆所有權 TXT 驗證記錄。
- 保留 Phase 3 已揭露的限制：實體手機觸控與完整螢幕閱讀器測試尚未完成；先前一項中度開發依賴 `minimatch` 告警另案追蹤。本次 SEO 遷移未重新聲稱解決這些限制。
- 後續任何程式碼更新仍須以新分支、PR、必要 CI 及所有者最終確認後合併；不直接推送受保護的 `main`。

## 7. 保存與版本邊界

**建議 Repository 路徑：** `docs/milestones/2026-11-01-custom-domain-seo-search-console-milestone.md`

此文件為公開專案里程碑，不含私人審查 ZIP、內部截圖原件、登入憑證或 DNS 驗證 Token 值。文件本身尚須經文件專用 PR 與必要 CI 合併後，才算正式儲存至 GitHub `main`。
