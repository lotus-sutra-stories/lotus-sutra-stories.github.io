/**
 * Sources & Licensing page content — bilingual, Traditional Chinese primary.
 *
 * Every statement below reproduces the deployed v1.2 licensing pages
 * (routes /licensing/ and /en/licensing/) exactly:
 *  - the project's independent, non-commercial status;
 *  - the bibliographic records of X1540 / X1541 and the pinned
 *    CBETA digital-edition date (2025-08-24) recorded in existing
 *    verification records;
 *  - the official CBETA copyright declaration, reproduced verbatim from
 *    the page copy preserved on 2026-10-23 (only line wrapping and web
 *    formatting adjusted), plus a clearly labelled unofficial English
 *    translation;
 *  - the CC BY-NC-SA 3.0 TW default licence framework and the per-layer
 *    rights distinctions;
 *  - editorial integrity principles and the corrections policy.
 *
 * Do not edit the CBETA declaration text: it is a verbatim quotation.
 */

export interface LicensingLinkItem {
  label: string;
  url: string;
}

export interface LicensingWorkRecord {
  code: "X1540" | "X1541";
  title: string;
  compiler: string;
  cbetaId: string;
  collectionLine: string;
  links: LicensingLinkItem[];
}

export interface BaseTextEntry {
  /** Entry label; when `children` is present this is a category heading. */
  label: string;
  children?: string[];
}

export interface LicensingRightsLayer {
  title: string;
  body: string;
}

export interface LicensingContent {
  title: string;
  lead: string;
  tocLabel: string;
  sections: {
    status: string;
    sources: string;
    officialZh: string;
    translationEn: string;
    rights: string;
    editorial: string;
    corrections: string;
  };
  statusParagraph: string;
  works: LicensingWorkRecord[];
  editionNotes: string[];
  libraryLinkLabel: string;
  declarationIntro: string;
  declarationPageLink: { label: string; url: string };
  declaration: {
    intro: string;
    baseTextsLead: string;
    baseTexts: BaseTextEntry[];
    acknowledgments: string;
    provisionsTitle: string;
    provisions: string[];
    closing: string[];
  };
  translationNoteBox: string;
  translationIntro: string;
  translation: {
    intro: string;
    baseTextsLead: string;
    baseTexts: BaseTextEntry[];
    acknowledgments: string;
    provisionsTitle: string;
    provisions: string[];
    closing: string[];
  };
  rightsParagraphs: string[];
  ccLicenceLabel: string;
  ccLicenceUrl: string;
  rightsNote: string;
  rightsLayers: LicensingRightsLayer[];
  editorialPrinciples: string[];
  correctionsParagraph: string;
}

/** Official CBETA copyright declaration page (preserved copy basis). */
export const CBETA_COPYRIGHT_PAGE_URL = "https://archive2.cbeta.org/copyright.php";

/** Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Taiwan. */
export const CC_BY_NC_SA_3_0_TW_URL = "https://creativecommons.org/licenses/by-nc-sa/3.0/tw/";

const WORK_LINKS_X1540: LicensingLinkItem[] = [
  { label: "CBETA Online", url: "https://cbetaonline.dila.edu.tw/zh/X1540_001" },
  { label: "CBETA TEI XML", url: "https://github.com/cbeta-org/xml-p5/blob/master/X/X78/X78n1540.xml" },
];

const WORK_LINKS_X1541: LicensingLinkItem[] = [
  { label: "CBETA Online", url: "https://cbetaonline.dila.edu.tw/zh/X1541_001" },
  { label: "CBETA TEI XML", url: "https://github.com/cbeta-org/xml-p5/blob/master/X/X78/X78n1541.xml" },
];

/** CBETA 官方繁體中文聲明 — verbatim quotation; do not edit. */
const DECLARATION_ZH = {
  intro:
    "「財團法人佛教電子佛典基金會」（Comprehensive Buddhist Electronic Text Archive Foundation，簡稱 CBETA Foundation 或 CBETA 基金會），2023 年 8 月 7 日起接續「中華電子佛典協會」（Chinese Buddhist Electronic Text Association，簡稱 CBETA）。",
  baseTextsLead: "CBETA 電子佛典資料庫（以下簡稱本資料庫）之底本為：",
  baseTexts: [
    { label: "《大正新脩大藏經》（大藏出版株式會社 ©） 第一冊至第八十五冊" },
    { label: "《卍新纂續藏經》（株式會社國書刊行會 ©）第一冊至第九十冊" },
    {
      label: "歷代藏經補輯",
      children: [
        "《嘉興大藏經》（新文豐出版公司）第一冊至第四十冊",
        "《房山石經》、《趙城金藏》、《永樂北藏》等等",
      ],
    },
    { label: "「國家圖書館善本佛典」（國家圖書館 ©）" },
    { label: "《漢譯南傳大藏經》（元亨寺 ©）第一冊至第七十冊" },
    {
      label: "近代新編文獻",
      children: [
        "《藏外佛教文獻》（方廣錩 ©）第一輯至第十二輯",
        "《正史佛教資料類編》（杜斗城 ©）",
        "《北朝佛教石刻拓片百品》（中央研究院歷史語言研究所 ©）",
        "《大藏經補編》（藍吉富 ©）第一冊至第三十六冊",
        "《中國佛寺史志彙刊》（杜潔祥主編，「中國佛教寺廟志數位典藏」專案提供數位版本）",
        "《中國佛寺志叢刊》（張智等編輯，「中國佛教寺廟志數位典藏」專案提供數位版本）",
        "《印順法師佛學著作集》（印順文教基金會 ©）",
        "《呂澂佛學著作集》（呂應中等 ©）",
        "《太虛大師全書》（印順文教基金會 ©）",
      ],
    },
  ] as BaseTextEntry[],
  acknowledgments:
    "本資料庫正式取得底本版權者「大藏出版株式會社」、「株式會社國書刊行會」、國家圖書館、元亨寺、杜斗城先生、方廣錩先生、藍吉富先生、「中央研究院歷史語言研究所」、「印順文教基金會」、呂應中先生等的輸入與公開之授權，以及法鼓文理學院、中華佛學研究所之「中國佛教寺廟志數位典藏」專案提供中國佛寺志數位版本，特此致謝。",
  provisionsTitle: "CBETA 電子佛典資料庫使用說明：",
  provisions: [
    "本資料庫之使用限定於個人或團體非營利性用途。若運用於營利性目的時，必須事先取得本會與該底本版權者之同意。",
    "將本資料庫以網路、光碟或其它媒體再傳播、節錄引用及再加工發行時，以不改變實質內容為原則，並需於成品附上本說明及版本資訊，以利使用者查詢相關修訂資訊。",
    "若發現本資料庫中任何錯誤之處，請與本會聯絡。",
    "若因使用本資料庫所產生之任何損害，本會一概不負任何責任。",
    "《印順法師佛學著作集》、《太虛大師全書》版權屬於印順文教基金會，不在 Creative Commons 授權範圍內。",
    "本資料庫之《呂澂佛學著作集》底本校勘時，對照大千出版社《吕澂佛學彙整》、齊魯書社《吕澂佛学论著选集》、文殊出版社《呂澂文集--當代佛學的泰斗》。CBETA 並感謝大千出版社與大陸中華書局的支持。各該紙本著作集之著作權仍屬各出版社所有，不在 Creative Commons 授權範圍內。",
    "本資料庫未特別說明處則採用「Creative Commons 姓名標示-非商業性-相同方式分享 3.0 台灣 (中華民國) 授權條款」授權，受相關著作權法保護。",
  ],
  closing: [
    "財團法人佛教電子佛典基金會",
    "Comprehensive Buddhist Electronic Text Archive Foundation",
    "非賣品‧非營利性使用",
    "Priceless, not to be sold ‧ No Commercial Used Allowed",
  ],
};

/** Unofficial English translation of the CBETA declaration — provided by
 *  this website for accessibility; not reviewed or approved by CBETA. */
const TRANSLATION_EN = {
  intro:
    "The Comprehensive Buddhist Electronic Text Archive Foundation (abbreviated as CBETA Foundation) succeeded the Chinese Buddhist Electronic Text Association (abbreviated as CBETA) on 7 August 2023.",
  baseTextsLead: "The source editions of the CBETA Electronic Buddhist Text Database (hereafter “the Database”) are:",
  baseTexts: [
    { label: "Taishō shinshū daizōkyō (大正新脩大藏經; © Daizō Shuppan Co., Ltd.), volumes 1–85" },
    { label: "Manji shinsan zokuzōkyō (卍新纂續藏經; © Kokusho Kankōkai Co., Ltd.), volumes 1–90" },
    {
      label: "Supplements to Buddhist canons compiled through the ages",
      children: [
        "Jiaxing Buddhist Canon (嘉興大藏經; Xinwenfeng Publishing Company), volumes 1–40",
        "Fangshan Stone Scriptures (房山石經), Zhaocheng Jin Canon (趙城金藏), Yongle Northern Canon (永樂北藏), and others",
      ],
    },
    { label: "Rare Buddhist texts of the National Central Library (© National Central Library)" },
    { label: "Chinese translation of the Southern Buddhist Canon (漢譯南傳大藏經; © Yuan Heng Temple), volumes 1–70" },
    {
      label: "Modern compilations",
      children: [
        "Buddhist Texts Outside the Canon (藏外佛教文獻; © Fang Guangchang), collections 1–12",
        "Classified Buddhist Materials from the Official Histories (正史佛教資料類編; © Du Doucheng)",
        "One Hundred Selected Rubbings of Northern Dynasties Buddhist Stone Inscriptions (北朝佛教石刻拓片百品; © Institute of History and Philology, Academia Sinica)",
        "Supplement to the Buddhist Canon (大藏經補編; © Lan Jifu), volumes 1–36",
        "Collected Chinese Buddhist Temple Histories and Gazetteers (中國佛寺史志彙刊), edited by Du Jiexiang; digital versions supplied by the Digital Archive of Chinese Buddhist Temple Gazetteers project",
        "Series of Chinese Buddhist Temple Gazetteers (中國佛寺志叢刊), edited by Zhang Zhi and others; digital versions supplied by the same project",
        "Collected Buddhist Works of Master Yinshun (印順法師佛學著作集; © Yin Shun Foundation)",
        "Collected Buddhist Works of Lü Cheng (呂澂佛學著作集; © Lü Yingzhong and others)",
        "Complete Works of Master Taixu (太虛大師全書; © Yin Shun Foundation)",
      ],
    },
  ] as BaseTextEntry[],
  acknowledgments:
    "The Database has formally obtained permission for input and public availability from the rights holders of the source editions, including Daizō Shuppan Co., Ltd., Kokusho Kankōkai Co., Ltd., the National Central Library, Yuan Heng Temple, Mr Du Doucheng, Mr Fang Guangchang, Mr Lan Jifu, the Institute of History and Philology at Academia Sinica, the Yin Shun Foundation, and Mr Lü Yingzhong. We also acknowledge the digital versions of Chinese Buddhist temple gazetteers supplied by the Digital Archive of Chinese Buddhist Temple Gazetteers project of Dharma Drum Institute of Liberal Arts and the Chung-Hwa Institute of Buddhist Studies.",
  provisionsTitle: "Instructions for using the CBETA Electronic Buddhist Text Database:",
  provisions: [
    "Use of the Database is limited to non-profit purposes by individuals or groups. Any use for profit requires prior consent from both the Foundation and the copyright holder of the relevant source edition.",
    "When the Database is redistributed over the Internet, on optical discs or other media, quoted in excerpts, or reworked and issued, the principle is that its substantive content must not be changed. The resulting product must include these instructions and version information so that users can consult information about relevant revisions.",
    "If you discover any errors in the Database, please contact the Foundation.",
    "The Foundation accepts no responsibility whatsoever for any damage arising from use of the Database.",
    "The copyright in the Collected Buddhist Works of Master Yinshun (印順法師佛學著作集) and the Complete Works of Master Taixu (太虛大師全書) belongs to the Yin Shun Foundation. These works are outside the scope of the Creative Commons licence.",
    "In collating the source edition of the Collected Buddhist Works of Lü Cheng (呂澂佛學著作集), the Database consulted Daqian Publishing’s Compilation of Lü Cheng’s Buddhist Studies (吕澂佛學彙整), Qilu Press’s Selected Writings on Buddhist Studies by Lü Cheng (吕澂佛学论著选集), and Wenshu Publishing’s Collected Works of Lü Cheng—A Leading Figure in Contemporary Buddhist Studies (呂澂文集--當代佛學的泰斗). CBETA also thanks Daqian Publishing and Zhonghua Book Company in mainland China for their support. Copyright in each of these printed collections remains with its respective publisher and is outside the scope of the Creative Commons licence.",
    "Unless otherwise specified, the Database is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Taiwan licence and is protected by applicable copyright law.",
  ],
  closing: [
    "Comprehensive Buddhist Electronic Text Archive Foundation",
    "Not for sale; for non-profit use only.",
  ],
};

export const LICENSING: Record<"zh" | "en", LicensingContent> = {
  zh: {
    title: "文獻來源與授權",
    lead: "原典版本、CBETA 使用聲明與本站編輯及授權範圍。",
    tocLabel: "本頁目錄",
    sections: {
      status: "本站性質與獨立性",
      sources: "主要文獻與數位版本",
      officialZh: "CBETA 官方繁體中文聲明",
      translationEn: "聲明的非官方英文翻譯",
      rights: "授權條款與各類內容",
      editorial: "編輯與原典完整性",
      corrections: "勘誤與修訂",
    },
    statusParagraph:
      "法華感應錄（Lotus Sutra Stories）是獨立、免費、非營利的佛教文獻與教育網站。本站與 CBETA 基金會及相關底本出版者，並無隸屬、贊助或官方背書關係。使用其公開授權資料不代表取得其對本站的認可。",
    works: [
      {
        code: "X1540",
        title: "《法華經顯應錄》",
        compiler: "宋・宗曉編",
        cbetaId: "CBETA X78, No. 1540",
        collectionLine: "《卍新纂續藏經》第 78 冊；全書二卷。",
        links: WORK_LINKS_X1540,
      },
      {
        code: "X1541",
        title: "《法華經持驗記》",
        compiler: "清・周克復纂",
        cbetaId: "CBETA X78, No. 1541",
        collectionLine: "《卍新纂續藏經》第 78 冊；全書二卷。",
        links: WORK_LINKS_X1541,
      },
    ],
    editionNotes: [
      "版本依據：本站既有核對紀錄所載，兩書所用 CBETA TEI P5 XML 的數位版本日期為 2025-08-24。上列 XML 來源連結指向會更新的上游檔案，並非該歷史版本的固定連結。",
      "完整版本時間「2025-08-24 10:59:10 +0800」尚無足夠原始版本證據可供獨立確認，故不列為已驗證時間。2025-08-24 為既有紀錄所載的數位版本日期，不是兩部古籍的出版日期。",
      "各故事另保留原典見證、卷頁行碼、來源網址與核對資訊；標點與罕用字形依所引 CBETA 數位版保留。",
    ],
    libraryLinkLabel: "查看完整典籍資料",
    declarationIntro:
      "以下依 CBETA 官方版權宣告的保存頁面（2026-10-23）重現聲明原文，僅調整網頁換行及排版。此處官方引文與本站說明分開呈現。",
    declarationPageLink: { label: "CBETA 官方版權宣告原頁", url: CBETA_COPYRIGHT_PAGE_URL },
    declaration: DECLARATION_ZH,
    translationNoteBox:
      "Unofficial English translation for informational purposes. The original Traditional Chinese declaration governs in case of discrepancy.",
    translationIntro:
      "本譯文由本站提供，未聲稱經 CBETA 審閱或認可；文獻英譯名稱為辨識用途，中文題名一併保留。",
    translation: TRANSLATION_EN,
    rightsParagraphs: [
      "CBETA 聲明對未特別說明的資料庫內容採用 Creative Commons 姓名標示－非商業性－相同方式分享 3.0 台灣授權條款（CC BY-NC-SA 3.0 TW）。上列第 5、6 項所述著作及其他特別說明仍須分別處理。",
    ],
    ccLicenceLabel: "Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Taiwan (CC BY-NC-SA 3.0 TW)",
    ccLicenceUrl: CC_BY_NC_SA_3_0_TW_URL,
    rightsNote:
      "使用者須遵守姓名標示、非商業性及相同方式分享等適用條件，以及上列 CBETA 使用說明；散布時附上說明與版本資訊。非營利身分本身不等於履行全部義務。既有 XML 標頭授權記錄另載：「Available for non-commercial use when distributed with this header intact.」本頁並不宣稱已解決引文使用與標頭保留要求的所有解釋問題。",
    rightsLayers: [
      {
        title: "CBETA 來源原典文字",
        body: "依 CBETA 適用條款使用，保留來源、卷頁行定位、版本資訊、標點與罕用字形；不以本站原創內容的名義重新授權。",
      },
      {
        title: "繁體中文故事白話譯註",
        body: "為本站編輯譯註，與原典分開。其原創部分的公開授權由權利人另行決定；凡構成受授權來源之改作，仍須遵守適用的非商業性、相同方式分享及其他義務。",
      },
      {
        title: "英文翻譯",
        body: "為本站提供的編輯譯文，不是 CBETA 官方譯文；不另行假定全面授權。受授權來源之翻譯或改作仍受其適用條件約束。",
      },
      {
        title: "編輯解讀與省思",
        body: "屬編輯者說明，與原書記載及翻譯分開。原創部分尚未由所有者決定公開授權；引文部分仍按各來源條款處理。",
      },
      {
        title: "網站原創程式碼與設計",
        body: "網站原創程式碼與設計尚未指定公開授權；使用時須依所有者另行公布的條款或取得許可。第三方套件、字型與其他素材仍保留各自授權。",
      },
    ],
    editorialPrinciples: [
      "保留原典的實質意義，不將編輯補述混入原典引文。",
      "明確區分文言原典、繁體中文白話譯註、英文翻譯與編輯解讀；翻譯依既有狀態標示為編輯初稿或已審校。",
      "保留有意義的異文、罕用字及平行見證；原典缺損與疑點另作說明，不靜默補寫。",
      "區分發願往生西方極樂、臨終來迎接引敘述與一般瑞相；面西、異香或光明等，不自動等同原典明言往生。",
      "對有文獻依據的錯誤，透明記錄修訂與依據，維持來源可追溯。",
    ],
    correctionsParagraph:
      "原典轉錄、定位或翻譯如有可核實的錯誤，可依原典見證及相關資料審查與修正。確認修訂時，應記錄受影響的段落、理由與依據；仍有爭議之處保留說明。",
  },
  en: {
    title: "Sources & Licensing",
    lead: "Source editions, CBETA usage declaration, and the scope of editorial work and licensing.",
    tocLabel: "On this page",
    sections: {
      status: "Project status & independence",
      sources: "Primary sources & digital edition",
      officialZh: "Official Traditional Chinese declaration",
      translationEn: "Unofficial English translation",
      rights: "Licence & material types",
      editorial: "Editorial principles & source integrity",
      corrections: "Corrections & revisions",
    },
    statusParagraph:
      "Lotus Sutra Stories is an independent, free, non-commercial Buddhist literature and educational website. It is not affiliated with, sponsored by, or officially endorsed by the CBETA Foundation or the publishers of the underlying editions. Use of publicly licensed material does not imply their approval of this project.",
    works: [
      {
        code: "X1540",
        title: "Fahua jing xianying lu (Records of Evident Responses to the Lotus Sutra)",
        compiler: "Compiled by Zongxiao (Song dynasty)",
        cbetaId: "CBETA X78, No. 1540",
        collectionLine: "Manji Shinsan Zokuzōkyō (卍新纂續藏經), volume 78; two fascicles.",
        links: WORK_LINKS_X1540,
      },
      {
        code: "X1541",
        title: "Fahua jing chiyan ji (Records of Verified Experiences of Upholding the Lotus Sutra)",
        compiler: "Compiled by Zhou Kefu (Qing dynasty)",
        cbetaId: "CBETA X78, No. 1541",
        collectionLine: "Manji Shinsan Zokuzōkyō (卍新纂續藏經), volume 78; two fascicles.",
        links: WORK_LINKS_X1541,
      },
    ],
    editionNotes: [
      "Edition evidence: existing verification records identify the CBETA TEI P5 XML digital-edition date for both works as 2025-08-24. The XML links above point to upstream files that can change; they are not fixed links to that historical edition.",
      "The full timestamp “2025-08-24 10:59:10 +0800” cannot be independently confirmed from the available original-edition evidence and is not asserted as verified. The recorded date is a digital-edition date, not the publication date of either classical work.",
      "Each story also retains its primary witnesses, fascicle/page/line locators, source URLs and verification information. Punctuation and rare glyphs follow the cited CBETA digital edition.",
    ],
    libraryLinkLabel: "View full bibliographic records",
    declarationIntro:
      "The following reproduces the official CBETA declaration from a page copy preserved on 23 October 2026, with only line wrapping and web formatting adjusted. This quotation is separate from the website’s commentary.",
    declarationPageLink: { label: "Original CBETA copyright declaration", url: CBETA_COPYRIGHT_PAGE_URL },
    declaration: DECLARATION_ZH,
    translationNoteBox:
      "Unofficial English translation for informational purposes. The original Traditional Chinese declaration governs in case of discrepancy.",
    translationIntro:
      "This translation is provided by the website; no review or approval by CBETA is claimed. Translated work titles are descriptive, with Chinese titles retained for identification.",
    translation: TRANSLATION_EN,
    rightsParagraphs: [
      "For Database material not otherwise specified, CBETA’s declaration applies Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Taiwan (CC BY-NC-SA 3.0 TW). The works excluded in provisions 5 and 6, and any other specific qualifications, must be treated separately.",
    ],
    ccLicenceLabel: "Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Taiwan (CC BY-NC-SA 3.0 TW)",
    ccLicenceUrl: CC_BY_NC_SA_3_0_TW_URL,
    rightsNote:
      "Users must meet the applicable attribution, non-commercial and share-alike conditions, as well as the CBETA instructions above, including instructions and version information with redistribution. Non-commercial status alone does not fulfil every obligation. Existing XML-header records also state: “Available for non-commercial use when distributed with this header intact.” This page does not claim to resolve every interpretive issue about quotations and header preservation.",
    rightsLayers: [
      {
        title: "CBETA-derived source text",
        body: "Subject to the applicable CBETA terms, with source, page/line locators, edition information, punctuation and rare glyphs preserved. It is not relicensed as original website content.",
      },
      {
        title: "Traditional Chinese story retellings",
        body: "Editorial retellings are separate from the primary text. The rights holder will separately decide any public licence for original contributions; to the extent they adapt licensed source material, applicable non-commercial, share-alike and other obligations still apply.",
      },
      {
        title: "English translations",
        body: "These are website editorial translations, not official CBETA translations. No blanket licence is assumed. Translation or adaptation of licensed source material remains subject to its applicable conditions.",
      },
      {
        title: "Editorial interpretations & reflections",
        body: "These are identified as editorial commentary, separate from source accounts and translations. The owner has not selected a public licence for original contributions; quoted material retains its source conditions.",
      },
      {
        title: "Original website code & design",
        body: "No public licence has been selected for original website code and design. Use requires the owner’s separately published terms or permission. Third-party packages, fonts and other assets retain their respective licences.",
      },
    ],
    editorialPrinciples: [
      "Preserve the substantive meaning of the source; do not insert editorial additions into quotations as if they were original text.",
      "Clearly separate Classical Chinese, modern Traditional Chinese retellings, English translations and editorial interpretation. Retain existing editorial-draft or reviewed status labels.",
      "Preserve meaningful variant readings, rare glyphs and parallel witnesses. Explain source gaps and uncertainties separately without silent completion.",
      "Distinguish aspirations for rebirth in the Western Pure Land, accounts of welcoming or reception at death, and auspicious signs. Facing west, fragrance or light alone does not establish an explicit source claim of rebirth.",
      "Correct documented errors transparently, recording the change and its evidence so that sources remain traceable.",
    ],
    correctionsParagraph:
      "Verifiable errors in transcription, locators or translation may be reviewed and corrected against primary witnesses and relevant evidence. Confirmed revisions should record the affected passage, reason and supporting evidence; disputed readings retain an explanatory note.",
  },
};
