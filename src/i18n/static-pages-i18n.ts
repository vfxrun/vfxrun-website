import type { Locale } from './locales';

type StaticPagesLocale = {
  docsPage: {
    title: string;
    lead: string;
    vfxrunTitle: string;
    vfxrunDesc: string;
    vfxrunBtn: string;
    sheetgenTitle: string;
    sheetgenDesc: string;
    sheetgenBtn: string;
    alsoSee: string;
    privacyLink: string;
    feedbackLink: string;
    changelogLink: string;
  };
  feedbackPage: {
    title: string;
    lead: string;
    emailTitle: string;
    emailLead: string;
    emailBtn: string;
    discordBtn: string;
    bugTitle: string;
    bugIntro: string;
    bugVersion: string;
    bugVersionNote: string;
    bugOs: string;
    bugTrying: string;
    bugHappened: string;
    bugHappenedNote: string;
    bugScreenshot: string;
    bugBtn: string;
    featureTitle: string;
    featureLead: string;
    featurePro: string;
    otherTitle: string;
    otherWishlist: string;
    otherWishlistLabel: string;
    otherDiscord: string;
    mailtoSubject: string;
    mailtoBody: string;
  };
  discordPage: {
    title: string;
    lead: string;
    joinBtn: string;
    feedbackBtn: string;
    usesTitle: string;
    useRelease: string;
    useBug: string;
    useFeature: string;
    usePro: string;
    useWorkflow: string;
    wishlistTitle: string;
    wishlistLead: string;
    emailNote: string;
    emailNoteLink: string;
  };
};

export const staticPagesI18n: Record<Locale, StaticPagesLocale> = {
  en: {
    docsPage: {
      title: 'Documentation',
      lead: 'Guides for VFXRun Browser, SheetGen, and privacy practices.',
      vfxrunTitle: 'VFXRun Browser',
      vfxrunDesc: 'What the desktop app does, local file handling, and Godot-oriented workflows.',
      vfxrunBtn: 'Read guide',
      sheetgenTitle: 'SheetGen',
      sheetgenDesc: 'Sprite sheet export basics and how SheetGen fits into your pipeline.',
      sheetgenBtn: 'Read guide',
      alsoSee: 'Also see',
      privacyLink: 'Privacy policy — what we do and do not collect',
      feedbackLink: 'Feedback — bugs and feature requests',
      changelogLink: 'Changelog — release notes',
    },
    feedbackPage: {
      title: 'Feedback',
      lead: 'Every piece of feedback is a great help to us — thank you very much.',
      emailTitle: 'Email the developer',
      emailLead: 'The fastest way to reach us today is email. We read messages during early launch and follow up when we can.',
      emailBtn: 'Email feedback',
      discordBtn: 'Join Discord',
      bugTitle: 'Bug reports',
      bugIntro: 'Please include as much of the following as you can in your email:',
      bugVersion: 'VFXRun version',
      bugVersionNote: '(if using VFXRun Browser)',
      bugOs: 'Windows / macOS version',
      bugTrying: 'What you were trying to do',
      bugHappened: 'What happened',
      bugHappenedNote: '(expected vs actual)',
      bugScreenshot: 'Screenshot if possible',
      bugBtn: 'Report a bug by email',
      featureTitle: 'Feature suggestions',
      featureLead:
        'Tell us how VFXRun Browser or SheetGen could be more useful in your workflow — missing formats, workflow pain points, UI ideas, or engine-specific needs (Godot, Unity, etc.).',
      featurePro:
        'For planned Pro capabilities, use the wishlist so we can see which features matter most:',
      otherTitle: 'Other ways to reach us',
      otherWishlist: 'Join the Pro wishlist',
      otherWishlistLabel: 'Pro wishlist & feature votes:',
      otherDiscord: 'Discord (updates, bugs, workflow chat):',
      mailtoSubject: 'VFXRun feedback',
      mailtoBody: `VFXRun version:
Windows / macOS version:
What you were trying to do:

What happened:

Screenshot if possible:
`,
    },
    discordPage: {
      title: 'Discord',
      lead: 'A small early community for VFXRun Browser and SheetGen. We are still in launch phase — expect a quiet room that grows as the tools improve.',
      joinBtn: 'Join Discord',
      feedbackBtn: 'Send feedback',
      usesTitle: 'What we use Discord for',
      useRelease: 'Release announcements',
      useBug: 'Bug reports',
      useFeature: 'Feature requests',
      usePro: 'Pro feature discussions',
      useWorkflow: 'Sharing 2D VFX workflow ideas',
      wishlistTitle: 'Pro wishlist',
      wishlistLead: 'To vote on planned Pro features, use the website wishlist:',
      emailNote: 'Prefer email? Visit the',
      emailNoteLink: 'feedback page',
    },
  },
  'zh-CN': {
    docsPage: {
      title: '文档',
      lead: 'VFXRun Browser、SheetGen 使用指南，以及隐私说明。',
      vfxrunTitle: 'VFXRun Browser',
      vfxrunDesc: '桌面软件功能、本地文件处理方式，以及面向 Godot 的工作流说明。',
      vfxrunBtn: '阅读指南',
      sheetgenTitle: 'SheetGen',
      sheetgenDesc: '精灵图导出基础，以及 SheetGen 如何融入您的制作流程。',
      sheetgenBtn: '阅读指南',
      alsoSee: '另见',
      privacyLink: '隐私政策 — 我们收集与不收集的内容',
      feedbackLink: '反馈 — Bug 与功能建议',
      changelogLink: '更新日志 — 发布说明',
    },
    feedbackPage: {
      title: '反馈',
      lead: '您的每一条反馈都是对我们极大的帮助，非常感谢。',
      emailTitle: '邮件联系开发者',
      emailLead: '目前最快的联系方式是邮件。早期发布阶段我们会阅读来信，并在力所能及范围内回复。',
      emailBtn: '发送反馈邮件',
      discordBtn: '加入 Discord',
      bugTitle: 'Bug 反馈',
      bugIntro: '请在邮件中尽量包含以下信息：',
      bugVersion: 'VFXRun 版本',
      bugVersionNote: '（如使用 VFXRun Browser）',
      bugOs: 'Windows / macOS 版本',
      bugTrying: '您当时想做什么',
      bugHappened: '实际发生了什么',
      bugHappenedNote: '（预期 vs 实际）',
      bugScreenshot: '如有可能，请附截图',
      bugBtn: '通过邮件报告 Bug',
      featureTitle: '功能建议',
      featureLead:
        '告诉我们 VFXRun Browser 或 SheetGen 在您的工作流中还可以如何更有用 — 缺少的格式、流程痛点、界面想法，或引擎相关需求（Godot、Unity 等）。',
      featurePro: '对于计划中的 Pro 功能，请使用 wishlist 投票，以便我们了解哪些功能最重要：',
      otherTitle: '其他联系方式',
      otherWishlist: '加入 Pro wishlist',
      otherWishlistLabel: 'Pro wishlist 与功能投票：',
      otherDiscord: 'Discord（更新、Bug、工作流交流）：',
      mailtoSubject: 'VFXRun 反馈',
      mailtoBody: `VFXRun 版本：
Windows / macOS 版本：
您当时想做什么：

实际发生了什么：

如有可能，请附截图：
`,
    },
    discordPage: {
      title: 'Discord',
      lead: '面向 VFXRun Browser、SheetGen 的小型早期社区。我们仍在发布初期 — 频道会随工具完善而逐渐活跃。',
      joinBtn: '加入 Discord',
      feedbackBtn: '发送反馈',
      usesTitle: 'Discord 用途',
      useRelease: '发布公告',
      useBug: 'Bug 反馈',
      useFeature: '功能建议',
      usePro: 'Pro 功能讨论',
      useWorkflow: '分享 2D VFX 工作流想法',
      wishlistTitle: 'Pro wishlist',
      wishlistLead: '如需为计划中的 Pro 功能投票，请使用网站 wishlist：',
      emailNote: '更偏好邮件？请访问',
      emailNoteLink: '反馈页面',
    },
  },
  'zh-TW': {
    docsPage: {
      title: '文件',
      lead: 'VFXRun Browser、SheetGen 使用指南，以及隱私說明。',
      vfxrunTitle: 'VFXRun Browser',
      vfxrunDesc: '桌面軟體功能、本機檔案處理方式，以及面向 Godot 的工作流程說明。',
      vfxrunBtn: '閱讀指南',
      sheetgenTitle: 'SheetGen',
      sheetgenDesc: '精靈圖匯出基礎，以及 SheetGen 如何融入您的製作流程。',
      sheetgenBtn: '閱讀指南',
      alsoSee: '另見',
      privacyLink: '隱私權政策 — 我們收集與不收集的內容',
      feedbackLink: '意見回饋 — Bug 與功能建議',
      changelogLink: '更新日誌 — 發布說明',
    },
    feedbackPage: {
      title: '意見回饋',
      lead: '您的每一條回饋都是對我們極大的幫助，非常感謝。',
      emailTitle: '寄信聯絡開發者',
      emailLead: '目前最快的聯絡方式是電子郵件。早期發布階段我們會閱讀來信，並在能力範圍內回覆。',
      emailBtn: '寄送回饋郵件',
      discordBtn: '加入 Discord',
      bugTitle: 'Bug 回報',
      bugIntro: '請在郵件中盡量包含以下資訊：',
      bugVersion: 'VFXRun 版本',
      bugVersionNote: '（若使用 VFXRun Browser）',
      bugOs: 'Windows / macOS 版本',
      bugTrying: '您當時想做什麼',
      bugHappened: '實際發生了什麼',
      bugHappenedNote: '（預期 vs 實際）',
      bugScreenshot: '若有可能，請附截圖',
      bugBtn: '以郵件回報 Bug',
      featureTitle: '功能建議',
      featureLead:
        '告訴我們 VFXRun Browser 或 SheetGen 在您的工作流程中還可以如何更有幫助 — 缺少的格式、流程痛點、介面想法，或引擎相關需求（Godot、Unity 等）。',
      featurePro: '對於計畫中的 Pro 功能，請使用 wishlist 投票，以便我們了解哪些功能最重要：',
      otherTitle: '其他聯絡方式',
      otherWishlist: '加入 Pro wishlist',
      otherWishlistLabel: 'Pro wishlist 與功能投票：',
      otherDiscord: 'Discord（更新、Bug、工作流程交流）：',
      mailtoSubject: 'VFXRun 回饋',
      mailtoBody: `VFXRun 版本：
Windows / macOS 版本：
您當時想做什麼：

實際發生了什麼：

若有可能，請附截圖：
`,
    },
    discordPage: {
      title: 'Discord',
      lead: '面向 VFXRun Browser、SheetGen 的小型早期社群。我們仍在發布初期 — 頻道會隨工具完善而逐漸活躍。',
      joinBtn: '加入 Discord',
      feedbackBtn: '送出回饋',
      usesTitle: 'Discord 用途',
      useRelease: '發布公告',
      useBug: 'Bug 回報',
      useFeature: '功能建議',
      usePro: 'Pro 功能討論',
      useWorkflow: '分享 2D VFX 工作流程想法',
      wishlistTitle: 'Pro wishlist',
      wishlistLead: '若要為計畫中的 Pro 功能投票，請使用網站 wishlist：',
      emailNote: '偏好郵件？請造訪',
      emailNoteLink: '回饋頁面',
    },
  },
  ja: {
    docsPage: {
      title: 'ドキュメント',
      lead: 'VFXRun Browser、SheetGen の使用ガイドとプライバシーに関する説明。',
      vfxrunTitle: 'VFXRun Browser',
      vfxrunDesc: 'デスクトップアプリの機能、ローカルファイルの扱い、Godot向けワークフロー。',
      vfxrunBtn: 'ガイドを読む',
      sheetgenTitle: 'SheetGen',
      sheetgenDesc: 'スプライトシート書き出しの基本と、パイプラインへの組み込み方。',
      sheetgenBtn: 'ガイドを読む',
      alsoSee: '関連リンク',
      privacyLink: 'プライバシーポリシー — 収集する／しない情報',
      feedbackLink: 'フィードバック — バグ報告と機能要望',
      changelogLink: '変更履歴 — リリースノート',
    },
    feedbackPage: {
      title: 'フィードバック',
      lead: 'いただいたフィードバックは、私たちにとって大きな励みになります。ありがとうございます。',
      emailTitle: '開発者にメール',
      emailLead: '現在いちばん早い連絡方法はメールです。早期ローンチ期間中は内容を確認し、可能な範囲で返信します。',
      emailBtn: 'フィードバックをメール',
      discordBtn: 'Discord に参加',
      bugTitle: 'バグ報告',
      bugIntro: 'メールには可能な限り以下を含めてください：',
      bugVersion: 'VFXRun バージョン',
      bugVersionNote: '（VFXRun Browser 使用時）',
      bugOs: 'Windows / macOS バージョン',
      bugTrying: '実行しようとしていた操作',
      bugHappened: '実際に起きたこと',
      bugHappenedNote: '（期待した結果 vs 実際）',
      bugScreenshot: '可能ならスクリーンショット',
      bugBtn: 'メールでバグ報告',
      featureTitle: '機能提案',
      featureLead:
        '作業フローで VFXRun Browser や SheetGen をより便利にする方法を教えてください — 未対応フォーマット、ワークフローの課題、UI アイデア、エンジン別の要望（Godot、Unity など）。',
      featurePro: '計画中の Pro 機能については、wishlist で投票してください：',
      otherTitle: 'その他の連絡方法',
      otherWishlist: 'Pro wishlist に参加',
      otherWishlistLabel: 'Pro wishlist と機能投票：',
      otherDiscord: 'Discord（更新、バグ、ワークフロー）：',
      mailtoSubject: 'VFXRun フィードバック',
      mailtoBody: `VFXRun バージョン：
Windows / macOS バージョン：
実行しようとしていた操作：

実際に起きたこと：

可能ならスクリーンショット：
`,
    },
    discordPage: {
      title: 'Discord',
      lead: 'VFXRun Browser と SheetGen 向けの小さな早期コミュニティです。ローンチ初期のため、静かな部屋から始まり、ツール改善とともに育っていきます。',
      joinBtn: 'Discord に参加',
      feedbackBtn: 'フィードバックを送る',
      usesTitle: 'Discord の用途',
      useRelease: 'リリース告知',
      useBug: 'バグ報告',
      useFeature: '機能要望',
      usePro: 'Pro 機能の議論',
      useWorkflow: '2D VFX ワークフローの共有',
      wishlistTitle: 'Pro wishlist',
      wishlistLead: '計画中の Pro 機能に投票するには、サイトの wishlist を利用してください：',
      emailNote: 'メールがよければ、',
      emailNoteLink: 'フィードバックページ',
    },
  },
  ko: {
    docsPage: {
      title: '문서',
      lead: 'VFXRun Browser, SheetGen 사용 가이드 및 개인정보 안내.',
      vfxrunTitle: 'VFXRun Browser',
      vfxrunDesc: '데스크톱 앱 기능, 로컬 파일 처리, Godot 중심 워크플로.',
      vfxrunBtn: '가이드 읽기',
      sheetgenTitle: 'SheetGen',
      sheetgenDesc: '스프라이트 시트 내보내기 기본과 파이프라인 연동 방법.',
      sheetgenBtn: '가이드 읽기',
      alsoSee: '함께 보기',
      privacyLink: '개인정보 처리방침 — 수집/비수집 항목',
      feedbackLink: '피드백 — 버그 및 기능 제안',
      changelogLink: '변경 기록 — 릴리스 노트',
    },
    feedbackPage: {
      title: '피드백',
      lead: '보내 주신 모든 피드백은 저희에게 큰 도움이 됩니다. 감사합니다.',
      emailTitle: '개발자에게 이메일',
      emailLead: '현재 가장 빠른 연락 방법은 이메일입니다. 초기 출시 기간 동안 메일을 확인하고 가능한 범위에서 답변합니다.',
      emailBtn: '피드백 이메일 보내기',
      discordBtn: 'Discord 참여',
      bugTitle: '버그 제보',
      bugIntro: '이메일에 가능한 한 아래 내용을 포함해 주세요:',
      bugVersion: 'VFXRun 버전',
      bugVersionNote: '(VFXRun Browser 사용 시)',
      bugOs: 'Windows / macOS 버전',
      bugTrying: '시도하던 작업',
      bugHappened: '실제로 발생한 일',
      bugHappenedNote: '(예상 vs 실제)',
      bugScreenshot: '가능하면 스크린샷',
      bugBtn: '이메일로 버그 제보',
      featureTitle: '기능 제안',
      featureLead:
        '워크플로에서 VFXRun Browser나 SheetGen을 더 유용하게 만드는 방법을 알려주세요 — 누락된 형식, 워크플로 pain point, UI 아이디어, 엔진별 요구(Godot, Unity 등).',
      featurePro: '계획 중인 Pro 기능은 wishlist에서 투표해 주세요:',
      otherTitle: '다른 연락 방법',
      otherWishlist: 'Pro wishlist 참여',
      otherWishlistLabel: 'Pro wishlist 및 기능 투표:',
      otherDiscord: 'Discord(업데이트, 버그, 워크플로):',
      mailtoSubject: 'VFXRun 피드백',
      mailtoBody: `VFXRun 버전:
Windows / macOS 버전:
시도하던 작업:

실제로 발생한 일:

가능하면 스크린샷:
`,
    },
    discordPage: {
      title: 'Discord',
      lead: 'VFXRun Browser와 SheetGen을 위한 작은 초기 커뮤니티입니다. 출시 초기라 조용하지만, 도구가 개선되면 함께 성장합니다.',
      joinBtn: 'Discord 참여',
      feedbackBtn: '피드백 보내기',
      usesTitle: 'Discord 용도',
      useRelease: '릴리스 공지',
      useBug: '버그 제보',
      useFeature: '기능 제안',
      usePro: 'Pro 기능 논의',
      useWorkflow: '2D VFX 워크플로 아이디어 공유',
      wishlistTitle: 'Pro wishlist',
      wishlistLead: '계획 중인 Pro 기능에 투표하려면 사이트 wishlist를 이용하세요:',
      emailNote: '이메일을 선호하시면',
      emailNoteLink: '피드백 페이지',
    },
  },
  es: {
    docsPage: {
      title: 'Documentación',
      lead: 'Guías de VFXRun Browser, SheetGen y prácticas de privacidad.',
      vfxrunTitle: 'VFXRun Browser',
      vfxrunDesc: 'Qué hace la app de escritorio, archivos locales y flujos orientados a Godot.',
      vfxrunBtn: 'Leer guía',
      sheetgenTitle: 'SheetGen',
      sheetgenDesc: 'Conceptos básicos de exportación de sprite sheets e integración en su pipeline.',
      sheetgenBtn: 'Leer guía',
      alsoSee: 'Ver también',
      privacyLink: 'Política de privacidad — qué recopilamos y qué no',
      feedbackLink: 'Comentarios — errores y solicitudes de funciones',
      changelogLink: 'Registro de cambios — notas de versión',
    },
    feedbackPage: {
      title: 'Comentarios',
      lead: 'Cada comentario que nos envía es de gran ayuda. Muchas gracias.',
      emailTitle: 'Enviar correo al desarrollador',
      emailLead: 'Hoy la forma más rápida de contactarnos es por correo. Leemos los mensajes durante el lanzamiento inicial y respondemos cuando podemos.',
      emailBtn: 'Enviar comentarios por correo',
      discordBtn: 'Unirse a Discord',
      bugTitle: 'Informes de errores',
      bugIntro: 'Incluya en su correo toda la información posible de la siguiente lista:',
      bugVersion: 'Versión de VFXRun',
      bugVersionNote: '(si usas VFXRun Browser)',
      bugOs: 'Versión de Windows / macOS',
      bugTrying: 'Qué intentabas hacer',
      bugHappened: 'Qué ocurrió',
      bugHappenedNote: '(esperado vs real)',
      bugScreenshot: 'Captura de pantalla si es posible',
      bugBtn: 'Informar error por correo',
      featureTitle: 'Sugerencias de funciones',
      featureLead:
        'Cuéntenos cómo VFXRun Browser o SheetGen podrían ser más útiles en su flujo de trabajo — formatos faltantes, puntos débiles, ideas de UI o necesidades por motor (Godot, Unity, etc.).',
      featurePro: 'Para funciones Pro planificadas, usa la wishlist para votar:',
      otherTitle: 'Otras formas de contacto',
      otherWishlist: 'Unirse a la wishlist Pro',
      otherWishlistLabel: 'Wishlist Pro y votos de funciones:',
      otherDiscord: 'Discord (actualizaciones, errores, flujos de trabajo):',
      mailtoSubject: 'Comentarios VFXRun',
      mailtoBody: `Versión de VFXRun:
Versión de Windows / macOS:
Qué intentabas hacer:

Qué ocurrió:

Captura de pantalla si es posible:
`,
    },
    discordPage: {
      title: 'Discord',
      lead: 'Una comunidad pequeña y temprana para VFXRun Browser y SheetGen. Aún estamos en fase de lanzamiento — un espacio tranquilo que crecerá con las herramientas.',
      joinBtn: 'Unirse a Discord',
      feedbackBtn: 'Enviar comentarios',
      usesTitle: 'Para qué usamos Discord',
      useRelease: 'Anuncios de versiones',
      useBug: 'Informes de errores',
      useFeature: 'Solicitudes de funciones',
      usePro: 'Discusiones sobre funciones Pro',
      useWorkflow: 'Compartir ideas de flujos VFX 2D',
      wishlistTitle: 'Wishlist Pro',
      wishlistLead: 'Para votar funciones Pro planificadas, usa la wishlist del sitio:',
      emailNote: '¿Prefieres correo? Visita la',
      emailNoteLink: 'página de comentarios',
    },
  },
  fr: {
    docsPage: {
      title: 'Documentation',
      lead: 'Guides pour VFXRun Browser, SheetGen et pratiques de confidentialité.',
      vfxrunTitle: 'VFXRun Browser',
      vfxrunDesc: 'Fonctions de l’app desktop, fichiers locaux et workflows orientés Godot.',
      vfxrunBtn: 'Lire le guide',
      sheetgenTitle: 'SheetGen',
      sheetgenDesc: 'Bases de l’export de sprite sheets et intégration dans votre pipeline.',
      sheetgenBtn: 'Lire le guide',
      alsoSee: 'Voir aussi',
      privacyLink: 'Politique de confidentialité — ce que nous collectons ou non',
      feedbackLink: 'Commentaires — bugs et demandes de fonctionnalités',
      changelogLink: 'Journal des modifications — notes de version',
    },
    feedbackPage: {
      title: 'Commentaires',
      lead: 'Chaque retour que vous nous envoyez nous aide énormément. Merci beaucoup.',
      emailTitle: 'Contacter le développeur par e-mail',
      emailLead: 'Le moyen le plus rapide aujourd’hui est l’e-mail. Nous lisons les messages pendant le lancement et répondons quand c’est possible.',
      emailBtn: 'Envoyer un commentaire par e-mail',
      discordBtn: 'Rejoindre Discord',
      bugTitle: 'Signaler un bug',
      bugIntro: 'Merci d’inclure autant d’éléments que possible dans votre e-mail :',
      bugVersion: 'Version de VFXRun',
      bugVersionNote: '(si vous utilisez VFXRun Browser)',
      bugOs: 'Version Windows / macOS',
      bugTrying: 'Ce que vous essayiez de faire',
      bugHappened: 'Ce qui s’est passé',
      bugHappenedNote: '(attendu vs réel)',
      bugScreenshot: 'Capture d’écran si possible',
      bugBtn: 'Signaler un bug par e-mail',
      featureTitle: 'Suggestions de fonctionnalités',
      featureLead:
        'Dites-nous comment VFXRun Browser ou SheetGen pourraient être plus utiles dans votre workflow — formats manquants, points de friction, idées d’UI ou besoins moteur (Godot, Unity, etc.).',
      featurePro: 'Pour les fonctionnalités Pro prévues, utilisez la wishlist pour voter :',
      otherTitle: 'Autres moyens de contact',
      otherWishlist: 'Rejoindre la wishlist Pro',
      otherWishlistLabel: 'Wishlist Pro et votes de fonctionnalités :',
      otherDiscord: 'Discord (mises à jour, bugs, workflows) :',
      mailtoSubject: 'Commentaires VFXRun',
      mailtoBody: `Version VFXRun :
Version Windows / macOS :
Ce que vous essayiez de faire :

Ce qui s’est passé :

Capture d’écran si possible :
`,
    },
    discordPage: {
      title: 'Discord',
      lead: 'Une petite communauté early stage pour VFXRun Browser et SheetGen. Nous sommes encore en lancement — un espace calme qui grandira avec les outils.',
      joinBtn: 'Rejoindre Discord',
      feedbackBtn: 'Envoyer un commentaire',
      usesTitle: 'À quoi sert Discord',
      useRelease: 'Annonces de versions',
      useBug: 'Signaler des bugs',
      useFeature: 'Demandes de fonctionnalités',
      usePro: 'Discussions sur les fonctions Pro',
      useWorkflow: 'Partager des idées de workflow VFX 2D',
      wishlistTitle: 'Wishlist Pro',
      wishlistLead: 'Pour voter sur les fonctionnalités Pro prévues, utilisez la wishlist du site :',
      emailNote: 'Vous préférez l’e-mail ? Visitez la',
      emailNoteLink: 'page commentaires',
    },
  },
};

export function flattenStaticPagesForLocale(locale: Locale): Record<string, string> {
  const pages = staticPagesI18n[locale] ?? staticPagesI18n.en;
  const out: Record<string, string> = {};

  for (const [section, values] of Object.entries(pages)) {
    for (const [key, value] of Object.entries(values)) {
      out[`${section}.${key}`] = value;
    }
  }

  return out;
}
