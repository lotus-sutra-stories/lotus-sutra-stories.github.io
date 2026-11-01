# 法華感應錄：29篇來源與靜態發布候選

此site-source/維持既有Next.js架構。繁中位於/，英文位於/en/；29篇為待所有者另行批准公開的候選，分支推到公開GitHub即披露內容，未合併亦同。

## 可重現命令

Bun 1.4.4，Node >=20.9.0；不混用其他鎖檔。

```bash
bun install --frozen-lockfile
bun run lint
bun run typecheck
bun run validate:content
bun run validate:safety
bun run build:static
bun audit --production --json
bun audit --json
```

validate:content使用29篇17項release檢查，validate:safety驗證原95檔、41見證與雙語搜尋／身分／主題交集。原19篇validator另保留，不能將它當作29篇檢查。scripts/check-release-static.py供根目錄現有CI呼叫，推導實際路由，不把HTML總數寫死。

out/必須同次完整匯出；不要混合不同平台或建置輪次的Flight／JS／CSS。正式Pages來源、workflow與保護設定不因此改變。依賴快取、.next、out、credential、機密檔、私人驗收資料不納入來源版本控制。

原19篇與官方透明logo保持原字節。十篇維持宗教敘事歸屬、異文、不確定性及可見editorial-draft資格；published只控制候選路由，不是獨立歷史認證或所有者授權。docs/cbeta-headers及RIGHTS-NOTICE／THIRD-PARTY-NOTICES與雙語licensing頁保留。

正式依賴稽核與完整稽核分開判讀；minimatch仍可能有中度開發傳遞依賴公告，不宣稱零漏洞。手機模擬／200%由所有者回報；實機觸控與完整螢幕閱讀器仍需另驗，不宣稱WCAG認證。所有者須分別決定來源公開與正式部署。
