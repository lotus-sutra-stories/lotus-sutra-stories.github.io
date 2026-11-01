# Phase 1 依賴安全記錄（2026-11-01）

原 full audit 14 套件／36 範圍列（34 去重 GHSA）經當日官方公告及 registry 核對，採 Bun 1.4.4 具名相容更新。root package.json、全部應用 src/scripts/public 與直接依賴版本不變，只有 bun.lock 與本安全說明／README 更新。無 --latest、overrides、resolutions 或新增直接依賴。

`source-map-js` 1.2.1→1.2.2，production-only audit 現為 `{}`、退出 0；full audit 仍有 minimatch 一筆 moderate、退出 1，不能稱零漏洞。

剩餘 [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) 官方修補版 11.0.1；現有 3.x／10.x 上游範圍無法正常相容解析到 11。3.1.5／10.2.6 均為 dev 傳遞套件。公告需可控 glob pattern 和 optimizationLevel>=2；已見 parser 呼叫只給 dot:true，預設 level=1，現專案未啟用該 projectService 設定。這是可達性分析，不撤銷官方範圍，不代表已修補。

請另行審查殘餘風險，追蹤回補或上游相容更新；本次沒有把「審查候選就緒」當成已接受風險或批准部署。現行 Pages 是靜態匯出，沒有 Node sourcemap/glob 後端。現行 GitHub CI、Pages 與保護設定均未修改。

可重現：bun install --frozen-lockfile → typecheck → lint → validate:content → validate:safety → build:static；audit 命令另跑 full 與 --production，保留原退出碼。完整公告／前後版本／相依父節點與驗證見 Phase 1 交付包 reports/、evidence/。

source-map-js 官方公告：[GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q)。Bun 具名更新文件：[bun update](https://bun.sh/docs/pm/cli/update)。
