# 法華感應錄：可重現的 Next.js 開發原始碼

本目錄是開發原始碼，須以個別檔案納入版本控制。GitHub Pages 現行 `main/(root)` 的靜態網站不可被本目錄取代。請將這棵目錄保存於部署 repository 的 `site-source/`；本次未推送、未建立 PR、未部署。

## 環境與命令

已實際驗證 Bun 1.4.4、Node.js v24.22.1、Next.js 16.4.2；使用原有 `bun.lock`，不混用 npm/pnpm 的鎖檔。請先依官方方法安裝 Bun 1.4.4，並確認 `bun --version`。Windows 使用 Git Bash 執行以下命令（工作目錄必須是本目錄）：

```bash
bun --version
bun install --frozen-lockfile
bun run typecheck
bun run lint
bun run validate:content
bun run validate:safety
bun run build:static
```

`build:static` 產生 `out/`，需要完整目錄一起檢查；Next 的 Flight 檔不可跨平台混合拷貝。以上命令不會發布網站。重新全新測試可先在一個新的空目錄解壓本原始碼；不需要刪除目前工作的目錄。開發時：

```bash
bun run dev --hostname 127.0.0.1
```

瀏覽 `http://127.0.0.1:3000/` 及 `/en/`。不需 API 金鑰、帳號、資料庫或 `.env`。沒有自動發布、postinstall 或 preinstall 根專案腳本。安裝第三方依賴仍屬供應鏈信任邊界。

## 結構與版本控制

- `src/`：雙語路由、元件、內容、來源資料及驗證器。
- `public/`：原有公開素材。`lotus-approved.png` 為官方 1254×1254 透明圖，SHA-256 `fc297d59b5d3eda675e2e5232fa46ad382866382fe6198e5b3f380b4884273b6`，不得重製或重新壓縮。
- `scripts/validate-content.ts`：原有 17 項公開內容檢查，仍要求 19 篇、6 篇淨土、19 日輪替覆蓋。
- `scripts/verify-*.ts`：本版額外的完整性、原故事快照與公開邊界檢查。
- `docs/`、`RIGHTS-NOTICE.md`、`THIRD-PARTY-NOTICES.md`：維護與來源授權記錄。
- `package.json`、`bun.lock` 與建置設定：依鎖檔安裝，不默默更新依賴。

不要提交 `node_modules/`、`.next/`、`out/`、`.env*`、`.npmrc`、金鑰、日誌或本機暫存檔。`next-env.d.ts` 與 TypeScript 快取由工具產生，無須納入版本控制。

## 內容與出版邊界

本版只含既有 19 篇；不含新選篇草稿、研究紀錄、身分旁表或新增篩選器。適合作為單純保存原始碼的 PR 候選，公開建置維持目前 57 個 HTML 頁面。

`status=published` 才能進入清單、搜尋、路由、相關故事、每日故事及 sitemap。選篇核准不等於翻譯完成獨立審校，也不等於出版授權。古籍宗教敘事依原書呈現，不當成現代醫學或獨立歷史證據。

## 授權與安全狀態

保留既有中英文文獻來源與授權頁、CBETA 聲明、引文定位及權利分層；原創程式碼尚未指定公開授權，不因提交 GitHub 而自動改成 MIT 或其他條款。

本次模式掃描沒有在這棵整理後的原始碼找到符合定義的機密或本機私有路徑。依賴稽核有已知弱點，不能稱為零漏洞，詳 `docs/DEPENDENCY-REVIEW.md`。原鎖檔維持不變，需另案修補、測試及審查。手機觸控與引文剪貼簿讀回尚待人工驗收。

## Phase 1 依賴修正結果

2026-11-01：已相容修補 source-map-js 及其他原 audit 傳遞套件；full audit 由 14 套件／36 公告範圍列降至 minimatch 一筆 moderate，production audit 為零。並非零漏洞，請先閱讀 docs/DEPENDENCY-REVIEW.md 再審查來源保存 PR。本次 root package.json、故事、設計、分類、標誌及所有既有驗證器均未修改。
