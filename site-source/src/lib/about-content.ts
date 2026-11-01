/**
 * About page content — bilingual, Traditional Chinese primary.
 * Factual statements only: independence, sources, non-affiliation,
 * deployment status, licensing, and the literature-not-fact disclosure.
 */
export interface AboutBlock {
  title: { zh: string; en: string };
  paragraphs: { zh: string[]; en: string[] };
}

export const ABOUT_BLOCKS: AboutBlock[] = [
  {
    title: { zh: "本站性質", en: "What this project is" },
    paragraphs: {
      zh: [
        "法華感應錄（Lotus Sutra Stories）是一項獨立、非營利、免費開放的佛教文獻閱讀計畫，整理古籍所記載的《法華經》受持、讀誦與感應故事，區分原典文字、白話譯註、英文翻譯與編輯者省思。",
      ],
      en: [
        "Lotus Sutra Stories is an independent, non-commercial, freely accessible Buddhist literature project, presenting historical accounts of upholding and reciting the Lotus Sutra with primary texts, modern explanations, English translations and clearly separated editorial reflections.",
      ],
    },
  },
  {
    title: { zh: "收錄來源", en: "Sources" },
    paragraphs: {
      zh: [
        "目前收錄的故事，均出自《法華經顯應錄》（CBETA X78, No. 1540）與《法華經持驗記》（CBETA X78, No. 1541）二書，並經原典核對。版本資訊與授權標示，詳見「典籍」頁。",
      ],
      en: [
        "All stories currently collected are drawn from the Fahua jing xianying lu (CBETA X78, No. 1540) and the Fahua jing chiyan ji (CBETA X78, No. 1541), verified against the primary sources. See the Sources page for bibliographic details and licensing.",
      ],
    },
  },
  {
    title: { zh: "隸屬與背書聲明", en: "Independence & endorsement" },
    paragraphs: {
      zh: [
        "本站與任何宗教團體、CBETA、deerpark.app 或任何機構，均無官方隸屬、授權或背書關係；所引資料之名稱與出處，僅為標示其來源。",
      ],
      en: [
        "This project is not officially affiliated with, endorsed by, or sponsored by any religious organization, CBETA, deerpark.app or any institution; names and citations appear solely for attribution.",
      ],
    },
  },
  {
    title: { zh: "部署狀態", en: "Deployment status" },
    paragraphs: {
      zh: [
        "本網站尚未正式部署。GitHub Pages（https://lotus-sutra-stories.github.io）為規劃中之部署目標，未經站方確認前不視為已上線；自訂網域（lotus-sutra-stories.com）尚未購置，亦未作任何設定。",
      ],
      en: [
        "This site has not yet been formally deployed. GitHub Pages (https://lotus-sutra-stories.github.io) is the planned hosting target and is not live unless confirmed by the project owner; the custom domain lotus-sutra-stories.com has not been purchased or configured.",
      ],
    },
  },
  {
    title: { zh: "授權", en: "Licensing" },
    paragraphs: {
      zh: [
        "原典文字依 CBETA 適用授權與使用說明使用，並逐條標明出處。完整聲明、版本證據及各類內容的權利範圍，詳見「文獻來源與授權」頁；網站原創程式碼與設計的公開授權由所有者另行決定。",
      ],
      en: [
        "Primary texts are used under the applicable CBETA licence and usage instructions, with citation on every passage. See Sources & Licensing for the complete declaration, edition evidence and rights of each material type. The owner will separately decide any public licence for original website code and design.",
      ],
    },
  },
  {
    title: { zh: "文學呈現聲明", en: "Presented as literature" },
    paragraphs: {
      zh: [
        "本站所有靈驗敘事，均依宗教文獻之性質如實呈現，屬信仰文獻之記載，非既經現代科學或歷史方法獨立證實之事實，亦不保證任何現世或往生結果。",
      ],
      en: [
        "All miraculous narratives on this site are presented as records within religious literature — accounts of faith, not facts established by modern scientific or historical methods, and no worldly or rebirth outcome is promised.",
      ],
    },
  },
];
