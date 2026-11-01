/**
 * Methodology page content — bilingual, Traditional Chinese primary.
 *
 * Every statement below reflects the editorial practice actually used to
 * build this site (see worklog Tasks 0–3): CBETA X78 No. 1540/1541 as
 * textual basis, deerpark.app cross-checking, per-paragraph line anchors,
 * gaiji preservation, 〔注：…〕 interlinear notes, and conservative
 * Pure-Land classification. No invented facts.
 */
export interface MethodologySection {
  id: string;
  title: { zh: string; en: string };
  paragraphs: { zh: string[]; en: string[] };
}

export const METHODOLOGY_SECTIONS: MethodologySection[] = [
  {
    id: "verification",
    title: { zh: "原典核對", en: "Source Verification" },
    paragraphs: {
      zh: [
        "本站所有故事的原典文字，均轉錄自 CBETA「卍新纂大日本續藏經」數位版《法華經顯應錄》（X78, No. 1540）與《法華經持驗記》（X78, No. 1541），並以 deerpark.app 閱讀版逐字對照；兩本互異之處，各自保留，不相校改。",
        "每則故事均標明精確出處：冊、頁、欄、行（如「冊78, 頁0034a09–b05」）。原典文字模式下，每一段之首附行碼（如 0034a09），讀者可據以在 CBETA 數位版中覆核任何一句引文。",
        "核對與存取日期逐則記錄於各故事「資料來源」面板（accessed 欄位），供日後覆核之用。",
      ],
      en: [
        "Every primary text on this site is transcribed from the CBETA digital edition of the Manji Shinsan Dainihon Zokuzōkyō — the Fahua jing xianying lu (X78, No. 1540) and the Fahua jing chiyan ji (X78, No. 1541) — and cross-checked word by word against the deerpark.app reading edition. Where the two works differ, both readings are preserved without harmonisation.",
        "Each story carries a precise locator — volume, page, column and line (e.g. \"X78, p. 0034a09–b05\"). In the Original Text reading mode every paragraph opens with its line anchor (e.g. 0034a09), so any quoted sentence can be verified against the digital edition.",
        "The date on which each source was accessed and verified is recorded in the story's Source panel, enabling later re-verification.",
      ],
    },
  },
  {
    id: "transcription",
    title: { zh: "轉錄體例", en: "Transcription Conventions" },
    paragraphs: {
      zh: [
        "CBETA 數位版之現代標點，屬該版編輯成果；本站轉錄時一併保留，不作增刪，並視為數位版文本之一部分。",
        "罕見字形（gaiji）依底本字形如實保留，其 CB 代碼與通行字之對應，於各故事「考證與異文」中說明，不在正文替換。",
        "古籍行間夾注（常為資料出處）以〔注：…〕形式隨文保留。編者考證文字從不混入原典正文，一律另立於「考證與異文」。",
        "兩書文字互異之處，於各故事考證中記錄，從不擅改統一；底本文字縱有明顯刊刻異體，亦如實照錄並加註。",
      ],
      en: [
        "The modern punctuation of the CBETA digital edition is part of that edition's editorial work; this site preserves it unchanged, considering it part of the digitised text.",
        "Rare glyphs (gaiji) are preserved exactly as printed; their CB codes and normalised equivalents are noted in each story's Textual Notes, never substituted in the body text.",
        "Interlinear notes in the classical editions (usually source citations) are preserved inline as 〔note: …〕. Editorial commentary is never mixed into the primary text; it always lives in the separate Textual Notes & Variants panel.",
        "Divergent readings between the two works are documented in the per-story textual notes and are never silently normalised — even obvious typographic variants in the underlying print are recorded as printed.",
      ],
    },
  },
  {
    id: "translation",
    title: { zh: "翻譯政策", en: "Translation Policy" },
    paragraphs: {
      zh: [
        "白話譯註與英文翻譯均為編輯初稿，於各故事「編輯狀態」面板如實標示（translationStatus），尚待獨立審校；未經審校之譯文，不應被引為學術依據。",
        "譯文以文字較完整之原典見證為底本；另一見證所載之異文與增補細節，於考證中註明，不混入譯文。",
        "譯文不增補原典所無之情節與因果；編者省思另立欄目（「編者省思」），與譯文明確分離，讀者可據版面判別何者為譯、何者為按。",
      ],
      en: [
        "The modern Traditional Chinese explanation and the English translation are editorial drafts, labelled as such in each story's Editorial status panel; they await independent review and should not be cited as scholarly authority until reviewed.",
        "Translations follow the fuller primary witness; wording and details unique to the other witness are documented in the textual notes rather than merged into the translation.",
        "Nothing is added beyond the sources — no episodes, causes or outcomes. The editor's reflections appear as a clearly separated section, so readers can always tell translation from commentary.",
      ],
    },
  },
  {
    id: "classification",
    title: { zh: "分類方法", en: "Classification Method" },
    paragraphs: {
      zh: [
        "每則故事以三個欄位記錄其淨土敘事性質：rebirthClaim（往生記載）、reportedDestination（所記去處）、aspirationForSukhavati（西方之願）。欄位取值見下表。",
        "分類總則：臨終瑞相——面西、異香、天樂、光明等——絕不自動視為原書明言往生阿彌陀佛極樂世界。凡屬編者由瑞相推斷者，一律標為「經解讀推斷」，與「明言往生」嚴格區分。",
        "實例：灌頂大師（S009）原書明載兜率天往生之記述（智睎禪師預記「灌頂禪師升此說法」），故 reportedDestination 標為兜率天、aspirationForSukhavati 標為「無西方之願」，並列入「相關記載」而非「往生極樂」主錄。此例正說明：天眾來迎、異香滿室等記載，必須依原書所指去處如實分類，西方淨土之願與兜率往生之記不可混為一談。",
      ],
      en: [
        "Every story records the character of its Pure Land narrative in three fields: rebirthClaim, reportedDestination, and aspirationForSukhavati. Values are tabulated below.",
        "Governing rule: auspicious deathbed signs — facing west, unusual fragrance, celestial music, light — are never automatically read as the source attaining rebirth in Amitābha's Pure Land. Cases inferred from such signs are always labelled \"interpreted\" and kept strictly apart from \"explicitly stated\".",
        "Worked example: Master Guanjing (S009). The source explicitly records a Tuṣita destination (the chan master Zhixi's prophecy that \"Master Guanjing ascends to teach here\"), so reportedDestination is Tuṣita, aspirationForSukhavati is false, and the story is filed under \"related records\" rather than the main Pure Land gallery. The case shows why: welcomings by celestial hosts and fragrant rooms must be classified by the destination the source actually names — a vow for the Western Pure Land and a recorded Tuṣita rebirth are not interchangeable.",
      ],
    },
  },
  {
    id: "corrections",
    title: { zh: "修訂政策", en: "Corrections Policy" },
    paragraphs: {
      zh: [
        "本站一切修訂均記錄於工作日誌（worklog）與各故事「考證與異文」註記；無靜默改動。譯文修訂後，原稿狀態與審校狀態仍於「編輯狀態」面板如實標示。",
        "讀者可依每則故事所引之冊頁行出處，逐句覆核本站引文；發現引文與所引數位版有出入者，即為本站之誤，理應修訂。",
      ],
      en: [
        "All corrections are logged in the project worklog and in the per-story textual notes; nothing is changed silently. After revision, the draft and review status of each translation remains visible in the Editorial status panel.",
        "Readers may verify every quotation against the cited volume/page/line locators; any divergence between this site's transcriptions and the cited digital edition is an error on our side and merits correction.",
      ],
    },
  },
  {
    id: "cross-references",
    title: { zh: "平行見證與交叉引用", en: "Parallel Witnesses & Cross-references" },
    paragraphs: {
      zh: [
        "同一敘事若《顯應錄》與《持驗記》皆載，本站保留兩個原典見證（witness），於「原典文字」模式中可切換對照，不合併、不校改；「資料來源」面板分列兩者之卷頁行出處。",
        "故事之間的情節關聯（如聽經之雉後身為曇翼、道昂之西方願與灌頂之兜率記互為對照），於各故事考證中註明，供讀者延伸閱讀。",
      ],
      en: [
        "When the same narrative appears in both the Xianying lu and the Chiyan ji, this site preserves two primary witnesses, switchable in the Original Text reading mode — never merged or collated into one. The Source panel lists each witness's locators separately.",
        "Narrative links between stories (the listening pheasant reborn as Tanyi; Daoping's Western vow mirrored by Guanjing's Tuṣita record) are noted in the textual notes for further reading.",
      ],
    },
  },
];

/** Field-value table for the classification section. */
export interface ClassificationField {
  field: { zh: string; en: string };
  values: { value: string; zh: string; en: string }[];
}

export const CLASSIFICATION_FIELDS: ClassificationField[] = [
  {
    field: { zh: "往生記載（rebirthClaim）", en: "Rebirth claim (rebirthClaim)" },
    values: [
      { value: "explicit", zh: "明言往生——原書明文記載往生", en: "Explicitly stated in the source" },
      { value: "interpreted", zh: "經解讀推斷——由瑞相等記載推斷", en: "Inferred by editorial reading (e.g. from auspicious signs)" },
      { value: "not-stated", zh: "未明言——原書無往生語", en: "Not stated in the source" },
      { value: "disputed", zh: "有異說——文獻間說法不一", en: "Accounts differ between sources" },
    ],
  },
  {
    field: { zh: "所記去處（reportedDestination）", en: "Reported destination (reportedDestination)" },
    values: [
      { value: "sukhavati", zh: "西方極樂世界", en: "Sukhāvatī, the Western Pure Land" },
      { value: "tusita", zh: "兜率天", en: "Tuṣita Heaven" },
      { value: "other", zh: "其他去處", en: "Another destination" },
      { value: "unspecified", zh: "未載明", en: "Unspecified" },
    ],
  },
  {
    field: { zh: "西方之願（aspirationForSukhavati）", en: "Aspiration for Sukhāvatī (aspirationForSukhavati)" },
    values: [
      { value: "true", zh: "有——原書明載西方之願", en: "Attested in the source" },
      { value: "false", zh: "無——原書明載別願或別趣", en: "Absent; another vow or destination recorded" },
      { value: "uncertain", zh: "不明——原書未及", en: "Uncertain; not addressed" },
    ],
  },
];
