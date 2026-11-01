# 《法華感應錄》／Lotus Sutra Stories — Phase 3：29 篇雙語故事正式發布里程碑

- **日期：** 2026-11-01
- **狀態：** 已合併至 `main`，GitHub Pages 部署工作流程成功；中英文故事總覽已確認各顯示 29 篇
- **正式網站：** https://lotus-sutra-stories.github.io/
- **中文故事總覽：** https://lotus-sutra-stories.github.io/stories/
- **英文故事總覽：** https://lotus-sutra-stories.github.io/en/stories/
- **Repository：** https://github.com/lotus-sutra-stories/lotus-sutra-stories.github.io
- **Pull Request：** [#8 — feat: publish 29 bilingual Lotus Sutra stories and strengthen release validation](https://github.com/lotus-sutra-stories/lotus-sutra-stories.github.io/pull/8)
- **原始發布 Commit：** `46c7719`
- **合併 Commit：** `4dce4c9`（由 GitHub PR #8 確認）
- **原基準 Commit：** `b660f93968018eabe2c54ca0a0255c989b432a2f`
- **發布分支：** `release/lotus-29-lay-stories-20261101`

## 1. 里程碑摘要

本階段將網站故事總數由 **19 篇擴充至 29 篇**，新增 **10 篇在家眾故事（信男 5 篇、信女 5 篇）**，提供繁體中文與英文內容、原典對照及編輯註記。原有 19 篇故事的 95 個來源檔案維持不變。

新增身分門類分類與篩選功能，並保留原有主題、分類、修行方式、朝代及往生記載等探索方式。正式站點中英文總覽各顯示 29 篇故事。

## 2. 內容與編輯邊界

- 10 篇新增故事的編輯結論為 **PASS WITH NOTES**，不是無條件的史實認證。
- 故事所載宗教感應、往生及異相等依來源文本歸屬呈現；歷史不確定性及翻譯註記保留。
- 早期審查已完成原典見證與引文核對；本階段沒有重新改寫原典引文。
- 原有 19 篇故事的 95 個來源檔案在發布驗證中保持不變。
- 官方透明蓮花 LOGO 保持不變；確認其 SHA-256 為 `fc297d59b5d3eda675e2e5232fa46ad382866382fe6198e5b3f380b4884273b6`。

## 3. 功能與技術變更

1. 新增信男／信女的身分資料與故事篩選，並讓多種篩選條件可共同運作。
2. 更新中英文故事列表、故事路由及相應的靜態匯出內容。
3. 修正英文頁面的自我指向 canonical 與中英文互惠 `hreflang`，核對 HTML 語言屬性。
4. 更新中英文頁尾的部署狀態文字、`sitemap.xml` 及 `robots.txt`。
5. 更新 29 篇故事的 CI 檢查，納入 77 個 HTML 頁面、Flight payload、精確路由集合、Next.js 資產集合與完整匯出雜湊清單。
6. 修正 Python 驗證器在 Windows 使用反斜線路徑時造成的誤判，改以跨平台 POSIX 路徑格式比對；保留原有驗證強度。
7. 刪除已被新建置替換的舊版靜態資產，避免殘留無效檔案。

此階段的 PR 涉及 **559 個檔案變更**（+11,688／−3,065 行），其中包含重新產生的靜態網站檔案，不代表 559 個獨立功能變更。

## 4. 驗收與證據

| 檢查項目 | 結果 | 證據及限制 |
|---|---|---|
| 29 篇中文及 29 篇英文故事 | PASS | 本機嚴格靜態驗證；線上中英文總覽各顯示 29 篇 |
| 匯出 HTML 頁面 | PASS | 77 頁；完整路由集合比對通過 |
| 原有 19 篇來源保留 | PASS | 95 個來源檔案維持不變的驗證 |
| 官方 LOGO | PASS | PNG、透明度與 SHA-256 驗證 |
| 原典來源連結、見證範圍與授權頁 | PASS | 本機嚴格靜態檢查 |
| canonical、hreflang、語言標記、Sitemap | PASS | 本機嚴格靜態檢查 |
| Next.js 資產、Flight payload、SHA-256 manifest | PASS | 本機嚴格靜態檢查 |
| 基本與增強靜態驗證 | PASS | `ALL STATIC SITE CHECKS PASSED` 及 `ALL RELEASE STATIC CHECKS PASSED` |
| 14 種故障注入 | PASS（交付紀錄） | 私人最終交付報告；未將內部測試證據發布至此文件 |
| 信男／信女篩選、清除篩選 | OWNER-TESTED PASS | 本機私人預覽：信男 6 篇、信女 5 篇、清除後 29 篇 |
| 桌面、手機及平板預設尺寸 | OWNER-TESTED PASS | Chrome 開發者工具模擬與使用者截圖 |
| 模擬雙指放大及 Chrome 200% 頁面縮放 | OWNER-TESTED PASS | 使用者確認相關控制項可操作；非全面 WCAG 認證 |
| 實體手機觸控 | NOT RUN | 仍需實體裝置驗收 |
| 完整 NVDA／VoiceOver 測試 | NOT RUN | 尚無完整輔助科技測試證據 |
| PR #8 Required CI | PASS | `Static Site CI / Validate Static Site` 成功 |
| PR #8 合併 | PASS | GitHub 顯示 Merged，合併 Commit `4dce4c9` |
| GitHub Pages 建置與部署 | PASS | 擁有者提供的 Actions 成功截圖 |
| 正式站點中英文列表 | PASS | 發布後線上頁面均顯示 29 篇 |

## 5. 風險接受與發布授權

專案擁有者在推送公開功能分支之前，明確接受 10 篇故事的 **PASS WITH NOTES**、實體手機觸控與完整螢幕閱讀器測試尚未執行，以及完整依賴稽核仍有一項 `minimatch` 開發依賴 **Moderate** 告警的情況，並授權公開原始碼與準備正式部署。

此前交付紀錄中的 production-only audit 為零項告警；此結果不表示完整依賴樹完全沒有安全警示。公開 GitHub 分支與正式部署屬不同決策，均在擁有者逐步確認下執行。

## 6. GitHub 整合與部署紀錄

1. 以 `b660f939...` 為基準，在隔離 Clone 中驗證並套用發布 Patch。
2. 本機完成嚴格靜態驗證；修正驗證器 Windows 路徑相容性後，所有檢查通過。
3. 建立發布 Commit `46c7719`，推送至 `release/lotus-29-lay-stories-20261101`。
4. 建立 PR #8，Required CI 成功且 GitHub 顯示沒有合併衝突。
5. 以 **Create a merge commit** 完成合併，合併 Commit `4dce4c9`。
6. GitHub Actions 的 Pages build and deployment #8 顯示成功；正式中英文故事總覽顯示 29 篇。

## 7. 安全與整合邊界

- 沒有直接將發布修改推送至 `main`；透過 PR #8 與既有必要檢查整合。
- GitHub Pages 既有發布架構與 branch-protection 規則未列為此次修改範圍。
- 未變更官方蓮花 LOGO，也未修改原有 19 篇故事來源檔案。
- 不將包含私人審讀、測試截圖或工作檔案的完整 ZIP 歸檔到公開 Repository。
- 原先的安全及依賴風險說明繼續有效；未完成的人工驗收不得寫成 PASS。

## 8. 後續工作

- 在實體手機與平板上補驗觸控選單、複合篩選、書籤及語言切換。
- 補做 NVDA／VoiceOver 螢幕閱讀器測試並記錄可重現問題。
- 追蹤 `minimatch` Moderate 告警，評估不影響其他依賴的修復方式。
- 持續進行故事來源、英文譯稿及編輯註記的增量審核，不把 PASS WITH NOTES 轉寫為完全無保留的史實認證。
- 往後更新繼續採取功能分支、PR、必要 CI、擁有者審查後合併的流程。
- 如需遷移至 GitHub Actions 自動產生 Next.js 靜態網站，應另立獨立 PR，不混入本次內容發布紀錄。

## 9. 公開參考連結

- [PR #8 與合併紀錄](https://github.com/lotus-sutra-stories/lotus-sutra-stories.github.io/pull/8)
- [Merge commit `4dce4c9`](https://github.com/lotus-sutra-stories/lotus-sutra-stories.github.io/commit/4dce4c9)
- [GitHub Actions](https://github.com/lotus-sutra-stories/lotus-sutra-stories.github.io/actions)
- [中文故事總覽](https://lotus-sutra-stories.github.io/stories/)
- [English stories](https://lotus-sutra-stories.github.io/en/stories/)

---

**里程碑結論：** 2026-11-01，《法華感應錄》完成由 19 篇至 29 篇的雙語故事公開發布，PR #8 已合併、GitHub Pages 部署工作流程成功，線上雙語列表顯示 29 篇。保留編輯註記、剩餘依賴告警與尚未完成的實機／螢幕閱讀器驗收紀錄。
