# 《法華感應錄》／Lotus Sutra Stories — 可擴充故事驗證里程碑（正式驗收紀錄）

> **狀態：已完成正式整合與部署（2026-11-01）。** 既有 29 篇回歸驗證、GitHub Static Site CI、隔離 S030 擴充驗收工作流程及 Pages 部署均顯示成功；S030 僅為測試資料，未發布為真實故事。

- 紀錄日期：2026-11-01
- 正式網站：https://lotus-sutra-stories.com/
- 儲存庫：https://github.com/lotus-sutra-stories/lotus-sutra-stories.github.io
- 分支：`refactor/scalable-story-validation-20261101`
- 合併 PR：[#14 — refactor: make bilingual story validation scalable](https://github.com/lotus-sutra-stories/lotus-sutra-stories.github.io/pull/14)
- PR 原功能提交：`05a696c`
- 合併日期：2026-11-01

## 一、問題與動機

正式版本共有 29 篇故事，繁體中文與英文各 29 頁、靜態 HTML 77 頁、Sitemap 74 個網址、SHA-256 Manifest 484 筆。舊驗證器在數個發布檢查中固定假設 29 篇；未來加入 S030 時，即使新資料完整仍可能遭到錯誤拒絕。另一方面，直接取消所有數量要求也會掩蓋舊故事被意外取消發布的問題。

## 二、設計決策與安全界線

1. 以 `meta.json` 中 `status=published` 的資料決定動態總數；草稿不計入公開路由。
2. 保留歷史最低發布基準 S001–S029、原 19 篇故事的 95 個檔案 SHA-256，以及原有見證與分類回歸案例。
3. 中英文實際靜態頁面的 slug 集合必須**各自精確等於**已發布集合，且兩種語言彼此相同。
4. 搜尋總數、完整列表、每日故事輪替與相關測試隨已發布篇數調整；原有具體篩選案例不刪除。
5. `--expected-stories` 保留作為可選的**精確釘選**，而日常發布驗證預設自動推導篇數。
6. 不修改故事正文、原典、授權、LOGO、CNAME、SEO、Sitemap 或正式輸出；這次不把 S030 測試故事提交到生產分支。

## 三、此次修正範圍

- `.github/scripts/check_static.py`：從已發布 metadata 比對中英文靜態故事 slug，保留歷史底線。
- `site-source/scripts/check-release-static.py`：公開路由與來源清單動態比對，可選精確總數驗證。
- `site-source/scripts/validate-release-content.ts`：動態故事數、唯一／連續 ID、五份必要檔案、中英文完整性與輪替。
- `site-source/scripts/verify-release.ts`：動態搜尋、重設、輪替，同時保留歷史功能案例。
- `site-source/scripts/test-s030-scalability-ci.py`：**僅供暫時 GitHub Actions runner** 的模擬第 30 篇與負向案例測試；不是真實新故事。
- `.github/workflows/story-scalability-acceptance.yml`：在 PR 上透過隔離 Ubuntu runner 執行 S030 擴充測試。
- 本文件：`docs/milestones/2026-11-01-scalable-story-validation-milestone.md`。

## 四、實際執行過的測試與證據

| 測試 | 結果 | 備註 |
|---|---|---|
| ESLint | **PASS** | 在正式 29 篇工作分支執行 |
| TypeScript `tsc --noEmit` | **PASS** | 同上 |
| `validate:content` | **17/17 PASS** | 已發布 29 篇、原有 41 個見證 |
| `validate:safety` | **19/19 PASS** | 原 95 個來源檔案逐位元不變 |
| `.github/scripts/check_static.py` | **PASS** | 29 篇／77 HTML／484 Manifest／SEO 與資源檢查 |
| `check-release-static.py --expected-stories 29` | **PASS** | 精確釘選檢查 |
| S030 隔離資料存在及完整性（Python 資料檢查） | **PASS** | 30 份 metadata、30 個唯一 ID／slug，五份必要檔案 |
| 四種 Python 資料模型情境 | **PASS** | 接受完整 30 篇；拒絕缺英文、重複 ID、原 S001 轉草稿 |
| **S030 雲端擴充驗收工作流程** | **PASS（GitHub Actions，27 秒）** | `Story Scalability Acceptance #1` 已成功；個別測試案例依執行日誌判讀，與獨立 Python 模型區分 |
| **S030 預期靜態匯出 79 HTML／Sitemap 76 URLs** | **隸屬雲端驗收工作流程** | 以工作流程及其逐步日誌為細項證據；S030 僅存在於暫時 runner，正式網站仍為 77 HTML／74 URLs |
| **Required Static Site CI #9** | **PASS（8 秒）** | PR #14 必要靜態網站驗證成功 |
| **PR #14 合併** | **完成（2026-11-01）** | 已合併至受保護的 `main`；見 PR 紀錄 |
| **GitHub Pages deployment #14** | **PASS（1 分鐘）** | `pages build and deployment` 在 `main` 成功；不表示 S030 已發布 |

## 五、Windows 測試中斷與恢復經驗

本機完整 S030 隔離腳本執行時曾兩次出現 Git Bash 視窗非預期關閉；未找到足以確認原因的系統錯誤紀錄。原始工作分支的四份程式修改均完整保留。隔離副本及 S030 資料已建立，完整 TypeScript／Next.js 驗收改為在 GitHub Actions 的暫時 runner 執行。Git Bash `/c/Users/...` 與 Windows Python 的 `Path.home()/Downloads/...` 路徑表示方法不同，跨執行環境須分別處理。

## 六、其他雙語靜態網站可沿用的原則

1. 把**來源資料集合**作為數量真相，而不是在多個腳本手動同步固定值。
2. 使用**歷史發布基準**避免靜默縮減內容；不要把最低數量誤作永遠精確等於該數量。
3. 以**集合相等**驗證兩種語言的靜態路由，而非只比對篇數。
4. 將負向測試與正常資料成長測試分開，並在隔離環境執行，不把虛構測試內容加入正式站。
5. 維護 Route、Sitemap、Canonical／hreflang、資源、Manifest、安全檔案、版權聲明及原始素材保護。
6. 在受保護的 `main` 使用獨立 PR、Required CI、`Create a merge commit`，保留測試日誌和部署記錄。

## 七、正式 PR／CI／部署驗收紀錄（2026-11-01）

- **PR #14：** https://github.com/lotus-sutra-stories/lotus-sutra-stories.github.io/pull/14 — 已合併至 `main`。
- **功能提交：** `05a696c`；合併方式按照專案既定流程採用 `Create a merge commit`。本里程碑不臆測未核對的合併提交完整 SHA。
- **Static Site CI #9：** `Validate Static Site`，PASS（8 秒），證據為 GitHub Actions 成功紀錄。
- **Story Scalability Acceptance #1：** `Isolated S030 Growth and Rejection Tests`，PASS（27 秒），證據為 GitHub Actions 成功紀錄。
- **Pages build and deployment #14：** `main` 分支 PASS（1 分鐘）；正式站仍保留 29 篇雙語故事。
- **Actions 查驗入口：** https://github.com/lotus-sutra-stories/lotus-sutra-stories.github.io/actions
- **證據解讀界線：** 上述綠色結果確認整個工作流程成功；單一 S030 情境、79 HTML／76 Sitemap URL 等細項應以該次工作流程的步驟日誌為準，不以摘要截圖替代逐項證據。
- **正式狀態：** **完成驗收、合併與部署；里程碑紀錄已補登。**

## 八、文件後補原則

本次補登僅修訂既有里程碑 Markdown；不變更驗證器、正式故事、GitHub Actions、靜態產物、授權、網域或 SEO。文件須另走獨立分支、Pull Request、必要 CI 與 `Create a merge commit`，避免直接修改受保護的 `main`。

> 補充：本文件保留本專案特有的 29 篇、41 見證、95 個來源檔案等歷史基準；其他網站必須建立自己的歷史發布基準，不能直接複製數值。
