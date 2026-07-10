import { deepMergeMessages } from './deep-merge';
import type { Locale } from './locales';

export type ExtendedPagesLocale = {
  docsVfxrunPage: {
    title: string;
    lead: string;
    whatIsTitle: string;
    whatIsBody: string;
    whatIsNotTitle: string;
    notMarketplace: string;
    notCloud: string;
    notPro: string;
    localTitle: string;
    installSecurityTitle: string;
    installWindowsTitle: string;
    installWindowsBody: string;
    installMacTitle: string;
    installMacBody: string;
    godotTitle: string;
    godotStep1: string;
    godotStep2: string;
    godotStep3: string;
    godotStep4: string;
    footerDownload: string;
    footerAllDocs: string;
  };
  docsSheetgenPage: {
    title: string;
    lead: string;
    overviewTitle: string;
    overviewBody: string;
    workflowTitle: string;
    workflowStep1Before: string;
    workflowStep1After: string;
    workflowStep2: string;
    workflowStep3: string;
    workflowStep4: string;
    workflowStep5: string;
    pairTitle: string;
    pairBody: string;
    privacyTitle: string;
    privacyBodyBefore: string;
    privacyBodyAfter: string;
    footerTool: string;
    footerAllDocs: string;
  };
  privacyPage: {
    title: string;
    updated: string;
    localTitle: string;
    localBody: string;
    notCollectTitle: string;
    notCollect1: string;
    notCollect2: string;
    notCollect3: string;
    notCollect4: string;
    notCollect5: string;
    notCollect6: string;
    analyticsTitle: string;
    analyticsBody1: string;
    analyticsBody2: string;
    analyticsBody3: string;
    emailTitle: string;
    emailBody: string;
    wishlistTitle: string;
    wishlistBody1: string;
    wishlistBody2: string;
    wishlistBody3: string;
    wishlistBody4: string;
    cookiesTitle: string;
    cookiesBody: string;
    contactTitle: string;
    contactBodyBefore: string;
    contactBodyAfter: string;
    footerTerms: string;
  };
  termsPage: {
    title: string;
    updated: string;
    overviewTitle: string;
    overviewBody: string;
    freeTitle: string;
    freeBody: string;
    contentTitle: string;
    contentBody: string;
    marketplaceTitle: string;
    marketplaceBody: string;
    disclaimerTitle: string;
    disclaimerBody: string;
    changesTitle: string;
    changesBody: string;
    footerPrivacy: string;
    footerFeedback: string;
  };
  changelogPage: {
    title: string;
    lead: string;
    entryTitle: string;
    item1: string;
    item2: string;
    item3: string;
    moreNote: string;
  };
  redirectPage: {
    downloadTitle: string;
    downloadLead: string;
    downloadManualBefore: string;
    downloadManualLink: string;
    downloadBtn: string;
    homeTitle: string;
    homeLead: string;
    homeManualBefore: string;
    homeManualLink: string;
    homeBtn: string;
  };
};

const extendedPagesEn: ExtendedPagesLocale = {
  docsVfxrunPage: {
    title: 'VFXRun Browser',
    lead:
      'Free desktop app for browsing and previewing local VFX sequences before importing into your game engine.',
    whatIsTitle: 'What it is',
    whatIsBody:
      'VFXRun Browser scans folders you select and builds a library of PNG sequences, GIFs, and related assets. You can preview animations, filter entries, mark favorites, and jump to the source folder on disk.',
    whatIsNotTitle: 'What it is not',
    notMarketplace: 'Not a marketplace — we do not sell or bundle third-party VFX assets.',
    notCloud: 'Not a cloud uploader — your files stay on your machine.',
    notPro: 'Not a Pro editor at launch — timeline and export tools are planned separately.',
    localTitle: 'Local processing & privacy',
    installSecurityTitle: 'Install security notices',
    installWindowsTitle: 'Why does Windows show a security warning during install?',
    installWindowsBody:
      'VFXRun Browser is an early free release. The Windows installer is not code-signed yet, so Windows SmartScreen may show messages such as “Windows protected your PC” or “Unknown publisher,” and the install button may be hidden at first. Only download from the official site vfxrun.com. If you have confirmed the installer came from our website, you can choose “More info” and then “Run anyway” to continue. We plan to add code signing as the product matures to reduce these prompts.',
    installMacTitle: 'Will macOS show a similar warning?',
    installMacBody:
      'It can. Without Apple Developer ID signing and notarization, macOS may say the app cannot be opened because the developer cannot be verified. Only download from vfxrun.com. If you have confirmed the file is from our official site, you can right-click the app in Finder, choose Open, and confirm once more. We aim to add signing and notarization before the Mac release is fully launched.',
    godotTitle: 'Godot workflow (overview)',
    godotStep1: 'Organize PNG sequences in folders on disk.',
    godotStep2: 'Point VFXRun Browser at your VFX library root.',
    godotStep3: 'Preview and compare effects before importing into Godot.',
    godotStep4:
      'Use favorites and filters to narrow down candidates for AnimatedSprite2D or particle textures.',
    footerDownload: 'Download',
    footerAllDocs: 'All docs',
  },
  docsSheetgenPage: {
    title: 'SheetGen export guide',
    lead: 'How to use SheetGen to pack PNG sequences into sprite sheets for 2D game engines.',
    overviewTitle: 'Overview',
    overviewBody:
      'SheetGen is a free web tool for turning frame folders into a single sprite sheet. It targets simple sequence packing — quick exports for prototypes and small projects.',
    workflowTitle: 'Typical workflow',
    workflowStep1Before: 'Open ',
    workflowStep1After: ' in your browser.',
    workflowStep2: 'Add PNG sequence folders or frames.',
    workflowStep3: 'Adjust layout and padding if needed.',
    workflowStep4: 'Export the sprite sheet and companion data for your engine.',
    workflowStep5: 'Import the sheet into Godot, Unity, or your preferred 2D pipeline.',
    pairTitle: 'Pair with VFXRun Browser',
    pairBody:
      'Use VFXRun Browser to browse larger local libraries, preview effects, and pick sequences before packing them in SheetGen.',
    privacyTitle: 'Privacy',
    privacyBodyBefore:
      'Processing is designed to run locally in the browser. We do not collect file names, paths, image content, or project assets. See the ',
    privacyBodyAfter: ' for details.',
    footerTool: 'SheetGen tool',
    footerAllDocs: 'All docs',
  },
  privacyPage: {
    title: 'Privacy Policy',
    updated: 'Last updated: June 27, 2026',
    localTitle: 'Local files stay on your device',
    localBody:
      'VFXRun Browser and SheetGen are designed around local workflows. When you browse folders or export sprite sheets, your source files remain on your computer or in your browser session. We do not upload your VFX assets to VFXRun servers.',
    notCollectTitle: 'What we do not collect',
    notCollect1: 'Local file names',
    notCollect2: 'Local folder paths',
    notCollect3: 'Image or texture content',
    notCollect4: 'Original asset or project names',
    notCollect5: 'Source project files',
    notCollect6: 'Any data that could expose private game project details',
    analyticsTitle: 'Anonymous usage statistics',
    analyticsBody1:
      'When enabled, the website may load lightweight analytics providers such as Cloudflare Web Analytics and PostHog. These tools help us understand aggregate usage — for example page visits, download button clicks, SheetGen tool entry clicks, Pro page views, Pro wishlist votes, feedback and Discord link clicks, and share actions.',
    analyticsBody2:
      'Analytics events may include only high-level properties such as page path, link target, language, platform, and selected Pro feature names from the wishlist form. We do not collect email addresses, local file names, local folder paths, image content, project asset details, or user game project names through PostHog or similar analytics tools.',
    analyticsBody3:
      'If analytics environment variables are not configured, the site runs without injecting third-party analytics scripts. VFXRun Browser will include a clear explanation and an option to disable anonymous statistics in a future release.',
    emailTitle: 'Email you choose to send',
    emailBody:
      'If you submit feedback or contact us by email, we use only the information you voluntarily provide to respond.',
    wishlistTitle: 'Pro wishlist email',
    wishlistBody1:
      'If you vote on the Pro wishlist, we store your email address and feature selections in our database so we can notify you about Pro trials, feature launches, and related product updates you asked for.',
    wishlistBody2: 'We do not sell wishlist email addresses.',
    wishlistBody3: 'Wishlist email addresses are not sent to PostHog or other analytics tools.',
    wishlistBody4:
      'You may request deletion of your wishlist email by contacting ningzw1005@gmail.com.',
    cookiesTitle: 'Cookies & third-party services',
    cookiesBody:
      'The website may use basic cookies or similar technologies required by analytics providers. We aim to keep third-party services limited to infrastructure and product analytics needed for launch.',
    contactTitle: 'Contact',
    contactBodyBefore: 'Privacy questions can be sent through the ',
    contactBodyAfter: '.',
    footerTerms: 'Terms of use',
  },
  termsPage: {
    title: 'Terms of Use',
    updated: 'Last updated: June 27, 2026',
    overviewTitle: 'Overview',
    overviewBody:
      'VFXRun.com provides free tools for 2D game VFX workflows, including VFXRun Browser (desktop) and SheetGen (web). By using this website or our software, you agree to these terms.',
    freeTitle: 'Free tools',
    freeBody:
      'Core features of VFXRun Browser and SheetGen are offered free of charge at launch. Planned Pro features are not sold yet. We may update offerings as the products evolve.',
    contentTitle: 'Your content',
    contentBody:
      'You retain ownership of your local files and projects. VFXRun does not claim rights over assets you browse, preview, or export with our tools. You are responsible for ensuring you have rights to use the content you process.',
    marketplaceTitle: 'No asset marketplace',
    marketplaceBody:
      'VFXRun does not sell, license, or distribute third-party VFX assets through this website or its apps. Tools are provided to work with files you already have.',
    disclaimerTitle: 'Disclaimer',
    disclaimerBody:
      'Software and web tools are provided “as is” during early launch. We work to keep them reliable but do not guarantee uninterrupted or error-free operation. Use at your own discretion in production pipelines.',
    changesTitle: 'Changes',
    changesBody:
      'We may update these terms or product behavior as we ship new versions. Material changes will be reflected on this page with an updated date.',
    footerPrivacy: 'Privacy policy',
    footerFeedback: 'Feedback',
  },
  changelogPage: {
    title: 'Changelog',
    lead: 'Product updates and release notes.',
    entryTitle: '2026-06-27 — Website MVP',
    item1: 'Initial VFXRun.com site with product pages, docs, and policy pages.',
    item2: 'Homepage, VFXRun Browser, SheetGen, and Pro plan placeholders.',
    item3: 'Download and tool integrations marked coming soon until releases are ready.',
    moreNote: 'More entries will appear as VFXRun Browser and SheetGen ship public builds.',
  },
  redirectPage: {
    downloadTitle: 'Download moved',
    downloadLead: 'Download information for VFXRun Browser is on the homepage.',
    downloadManualBefore: 'If you are not redirected automatically, ',
    downloadManualLink: 'go to the Download section',
    downloadBtn: 'Go to Download',
    homeTitle: 'Page moved',
    homeLead: 'VFXRun Browser is now at the site homepage.',
    homeManualBefore: 'If you are not redirected automatically, ',
    homeManualLink: 'go to the homepage',
    homeBtn: 'Go to VFXRun Browser',
  },
};

export const extendedPagesI18n: Record<Locale, ExtendedPagesLocale> = {
  en: extendedPagesEn,
  'zh-CN': deepMergeMessages(extendedPagesEn, {
    docsVfxrunPage: {
      title: 'VFXRun Browser',
      lead: '免费桌面应用，用于在导入游戏引擎之前浏览和预览本地 VFX 序列。',
      whatIsTitle: '它是什么',
      whatIsBody:
        'VFXRun Browser 会扫描您选择的文件夹，并建立 PNG 序列、GIF 及相关素材库。您可以预览动画、筛选条目、标记收藏，并跳转到磁盘上的源文件夹。',
      whatIsNotTitle: '它不是什么',
      notMarketplace: '不是素材市场 — 我们不销售或捆绑第三方 VFX 素材。',
      notCloud: '不是云上传工具 — 您的文件保留在本机。',
      notPro: '发布初期不是 Pro 编辑器 — 时间轴与导出工具将单独规划。',
      localTitle: '本地处理与隐私',
      installSecurityTitle: '安装安全说明',
      installWindowsTitle: '为什么 Windows 安装时会出现安全提示？',
      installWindowsBody:
        'VFXRun Browser 目前是早期免费版本，Windows 安装包暂时还没有正式代码签名。因此 Windows SmartScreen 可能会提示“Windows 已保护你的电脑”或“未知发布者”，有时安装按钮会被隐藏。请只从官网 vfxrun.com 下载安装包。若您已确认安装包来自我们的官网，可以点击“更多信息”，再点击“仍要运行”继续安装。后续产品稳定后我们会申请代码签名，以减少这类提示。',
      installMacTitle: 'macOS 会出现类似提示吗？',
      installMacBody:
        '会。早期版本如果没有 Apple Developer ID 签名和 notarization，macOS 可能会提示“无法打开，因为无法验证开发者”。请只从官网 vfxrun.com 下载。若您已确认安装包来自我们的官网，可以在 Finder 中右键点击应用，选择“打开”，然后再次确认打开。正式 Mac 版本发布前，我们会尽量完成签名和 notarization。',
      godotTitle: 'Godot 工作流（概览）',
      godotStep1: '在磁盘上将 PNG 序列整理到文件夹中。',
      godotStep2: '将 VFXRun Browser 指向您的 VFX 库根目录。',
      godotStep3: '在导入 Godot 之前预览并比较效果。',
      godotStep4: '使用收藏与筛选，为 AnimatedSprite2D 或粒子纹理缩小候选范围。',
      footerDownload: '下载',
      footerAllDocs: '全部文档',
    },
    docsSheetgenPage: {
      title: 'SheetGen 导出指南',
      lead: '如何使用 SheetGen 将 PNG 序列打包为适用于 2D 游戏引擎的精灵图。',
      overviewTitle: '概览',
      overviewBody:
        'SheetGen 是一款免费的网页工具，可将帧文件夹合并为单张精灵图，面向简单的序列打包 — 适合原型与小项目快速导出。',
      workflowTitle: '典型工作流',
      workflowStep1Before: '在浏览器中打开',
      workflowStep1After: '。',
      workflowStep2: '添加 PNG 序列文件夹或帧。',
      workflowStep3: '按需调整布局与边距。',
      workflowStep4: '导出精灵图及引擎所需的配套数据。',
      workflowStep5: '将精灵图导入 Godot、Unity 或您常用的 2D 流程。',
      pairTitle: '与 VFXRun Browser 配合',
      pairBody:
        '使用 VFXRun Browser 浏览更大的本地库、预览效果，并在 SheetGen 中打包前挑选序列。',
      privacyTitle: '隐私',
      privacyBodyBefore:
        '处理过程设计为在浏览器本地运行。我们不收集文件名、路径、图像内容或项目素材。详见',
      privacyBodyAfter: '。',
      footerTool: 'SheetGen 工具',
      footerAllDocs: '全部文档',
    },
    privacyPage: {
      title: '隐私政策',
      updated: '最后更新：2026 年 6 月 27 日',
      localTitle: '本地文件保留在您的设备上',
      localBody:
        'VFXRun Browser 与 SheetGen 围绕本地工作流设计。当您浏览文件夹或导出精灵图时，源文件保留在您的电脑或浏览器会话中。我们不会将您的 VFX 素材上传到 VFXRun 服务器。',
      notCollectTitle: '我们不收集的内容',
      notCollect1: '本地文件名',
      notCollect2: '本地文件夹路径',
      notCollect3: '图像或纹理内容',
      notCollect4: '原始素材或项目名称',
      notCollect5: '源项目文件',
      notCollect6: '任何可能暴露私人游戏项目细节的数据',
      analyticsTitle: '匿名使用统计',
      analyticsBody1:
        '启用后，网站可能加载 Cloudflare Web Analytics、PostHog 等轻量分析服务，帮助我们了解汇总使用情况 — 例如页面访问、下载按钮点击、SheetGen 工具入口点击、Pro 页面浏览、Pro wishlist 投票、反馈与 Discord 链接点击，以及分享操作。',
      analyticsBody2:
        '分析事件可能仅包含页面路径、链接目标、语言、平台，以及 wishlist 表单中选中的 Pro 功能名称等高层属性。我们不会通过 PostHog 等分析工具收集邮箱地址、本地文件名、本地文件夹路径、图像内容、项目素材细节或用户游戏项目名称。',
      analyticsBody3:
        '若未配置分析环境变量，网站不会注入第三方分析脚本。VFXRun Browser 将在未来版本中提供清晰说明及关闭匿名统计的选项。',
      emailTitle: '您主动发送的邮件',
      emailBody: '若您通过邮件提交反馈或联系我们，我们仅使用您自愿提供的信息进行回复。',
      wishlistTitle: 'Pro Wishlist 邮箱',
      wishlistBody1:
        '若您参与 Pro Wishlist 投票，我们会将您的邮箱与功能选择保存在数据库中，以便在 Pro 试用开放、相关功能上线或您请求的产品更新时通知您。',
      wishlistBody2: '我们不会出售 Wishlist 邮箱地址。',
      wishlistBody3: 'Wishlist 邮箱不会发送到 PostHog 或其他分析工具。',
      wishlistBody4: '您可通过 ningzw1005@gmail.com 请求删除 Wishlist 邮箱记录。',
      cookiesTitle: 'Cookie 与第三方服务',
      cookiesBody:
        '网站可能使用分析服务所需的基本 Cookie 或类似技术。我们力求将第三方服务限制在发布所需的基础设施与产品分析范围内。',
      contactTitle: '联系',
      contactBodyBefore: '隐私相关问题可通过',
      contactBodyAfter: '发送。',
      footerTerms: '使用条款',
    },
    termsPage: {
      title: '使用条款',
      updated: '最后更新：2026 年 6 月 27 日',
      overviewTitle: '概览',
      overviewBody:
        'VFXRun.com 提供面向 2D 游戏 VFX 工作流的免费工具，包括 VFXRun Browser（桌面）与 SheetGen（网页）。使用本网站或我们的软件即表示您同意这些条款。',
      freeTitle: '免费工具',
      freeBody:
        'VFXRun Browser 与 SheetGen 的核心功能在发布时免费提供。计划中的 Pro 功能尚未开售。随着产品演进，我们可能会更新服务内容。',
      contentTitle: '您的内容',
      contentBody:
        '您保留对本地文件与项目的所有权。VFXRun 不主张对您通过我们的工具浏览、预览或导出的素材的权利。您需自行确保有权处理所使用的内容。',
      marketplaceTitle: '非素材市场',
      marketplaceBody:
        'VFXRun 不通过本网站或其应用销售、授权或分发第三方 VFX 素材。工具仅供处理您已有的文件。',
      disclaimerTitle: '免责声明',
      disclaimerBody:
        '软件与网页工具在早期发布阶段按“现状”提供。我们努力保持可靠，但不保证不间断或无错误运行。请自行判断用于生产流程。',
      changesTitle: '变更',
      changesBody: '随着新版本发布，我们可能会更新这些条款或产品行为。重大变更将在此页面反映并更新日期。',
      footerPrivacy: '隐私政策',
      footerFeedback: '反馈',
    },
    changelogPage: {
      title: '更新日志',
      lead: '产品更新与发布说明。',
      entryTitle: '2026-06-27 — 网站 MVP',
      item1: 'VFXRun.com 初版网站，含产品页、文档与政策页面。',
      item2: '首页、VFXRun Browser、SheetGen 与 Pro 计划占位内容。',
      item3: '下载与工具集成标记为即将推出，直至公开发布就绪。',
      moreNote: '随着 VFXRun Browser 与 SheetGen 发布公开版本，将添加更多条目。',
    },
    redirectPage: {
      downloadTitle: '下载页面已迁移',
      downloadLead: 'VFXRun Browser 的下载信息已移至首页。',
      downloadManualBefore: '若未自动跳转，请',
      downloadManualLink: '前往下载区域',
      downloadBtn: '前往下载',
      homeTitle: '页面已迁移',
      homeLead: 'VFXRun Browser 现位于网站首页。',
      homeManualBefore: '若未自动跳转，请',
      homeManualLink: '前往首页',
      homeBtn: '前往 VFXRun Browser',
    },
  }),
  'zh-TW': deepMergeMessages(extendedPagesEn, {
    docsVfxrunPage: {
      lead: '免費桌面應用程式，用於在匯入遊戲引擎之前瀏覽與預覽本機 VFX 序列。',
      whatIsTitle: '它是什麼',
      whatIsBody:
        'VFXRun Browser 會掃描您選擇的資料夾，並建立 PNG 序列、GIF 及相關素材庫。您可以預覽動畫、篩選項目、標記收藏，並跳轉到磁碟上的來源資料夾。',
      whatIsNotTitle: '它不是什麼',
      notMarketplace: '不是素材市集 — 我們不銷售或捆綁第三方 VFX 素材。',
      notCloud: '不是雲端上傳工具 — 您的檔案保留在本機。',
      notPro: '發布初期不是 Pro 編輯器 — 時間軸與匯出工具將另行規劃。',
      localTitle: '本機處理與隱私',
      installSecurityTitle: '安裝安全說明',
      installWindowsTitle: '為什麼 Windows 安裝時會出現安全提示？',
      installWindowsBody:
        'VFXRun Browser 目前是早期免費版本，Windows 安裝套件暫時還沒有正式程式碼簽章。因此 Windows SmartScreen 可能會提示「Windows 已保護你的電腦」或「未知發行者」，有時安裝按鈕會被隱藏。請只從官網 vfxrun.com 下載安裝套件。若您已確認安裝套件來自我們的官網，可以點擊「更多資訊」，再點擊「仍要執行」繼續安裝。後續產品穩定後我們會申請程式碼簽章，以減少這類提示。',
      installMacTitle: 'macOS 會出現類似提示嗎？',
      installMacBody:
        '會。早期版本如果沒有 Apple Developer ID 簽章和 notarization，macOS 可能會提示「無法打開，因為無法驗證開發者」。請只從官網 vfxrun.com 下載。若您已確認安裝套件來自我們的官網，可以在 Finder 中右鍵點擊應用程式，選擇「打開」，然後再次確認打開。正式 Mac 版本發布前，我們會盡量完成簽章和 notarization。',
      godotTitle: 'Godot 工作流程（概覽）',
      godotStep1: '在磁碟上將 PNG 序列整理到資料夾中。',
      godotStep2: '將 VFXRun Browser 指向您的 VFX 庫根目錄。',
      godotStep3: '在匯入 Godot 之前預覽並比較效果。',
      godotStep4: '使用收藏與篩選，為 AnimatedSprite2D 或粒子紋理縮小候選範圍。',
      footerDownload: '下載',
      footerAllDocs: '全部文件',
    },
    docsSheetgenPage: {
      title: 'SheetGen 匯出指南',
      lead: '如何使用 SheetGen 將 PNG 序列打包為適用於 2D 遊戲引擎的精靈圖。',
      overviewTitle: '概覽',
      overviewBody:
        'SheetGen 是一款免費的網頁工具，可將影格資料夾合併為單張精靈圖，面向簡單的序列打包 — 適合原型與小專案快速匯出。',
      workflowTitle: '典型工作流程',
      workflowStep1Before: '在瀏覽器中開啟',
      workflowStep1After: '。',
      workflowStep2: '新增 PNG 序列資料夾或影格。',
      workflowStep3: '視需要調整版面與邊距。',
      workflowStep4: '匯出精靈圖及引擎所需的配套資料。',
      workflowStep5: '將精靈圖匯入 Godot、Unity 或您常用的 2D 流程。',
      pairTitle: '與 VFXRun Browser 搭配',
      pairBody:
        '使用 VFXRun Browser 瀏覽更大的本機庫、預覽效果，並在 SheetGen 中打包前挑選序列。',
      privacyTitle: '隱私',
      privacyBodyBefore:
        '處理過程設計為在瀏覽器本機執行。我們不收集檔名、路徑、影像內容或專案素材。詳見',
      privacyBodyAfter: '。',
      footerTool: 'SheetGen 工具',
      footerAllDocs: '全部文件',
    },
    privacyPage: {
      title: '隱私權政策',
      updated: '最後更新：2026 年 6 月 27 日',
      localTitle: '本機檔案保留在您的裝置上',
      localBody:
        'VFXRun Browser 與 SheetGen 圍繞本機工作流程設計。當您瀏覽資料夾或匯出精靈圖時，來源檔案保留在您的電腦或瀏覽器工作階段中。我們不會將您的 VFX 素材上傳到 VFXRun 伺服器。',
      notCollectTitle: '我們不收集的內容',
      notCollect1: '本機檔名',
      notCollect2: '本機資料夾路徑',
      notCollect3: '影像或紋理內容',
      notCollect4: '原始素材或專案名稱',
      notCollect5: '來源專案檔案',
      notCollect6: '任何可能暴露私人遊戲專案細節的資料',
      analyticsTitle: '匿名使用統計',
      analyticsBody1:
        '啟用後，網站可能載入 Cloudflare Web Analytics、PostHog 等輕量分析服務，協助我們了解彙總使用情況 — 例如頁面造訪、下載按鈕點擊、SheetGen 工具入口點擊、Pro 頁面瀏覽、Pro wishlist 投票、回饋與 Discord 連結點擊，以及分享操作。',
      analyticsBody2:
        '分析事件可能僅包含頁面路徑、連結目標、語言、平台，以及 wishlist 表單中選中的 Pro 功能名稱等高層屬性。我們不會透過這些工具收集本機檔名、本機資料夾路徑、影像內容、專案素材細節或使用者遊戲專案名稱。',
      analyticsBody3:
        '若未設定分析環境變數，網站不會注入第三方分析腳本。VFXRun Browser 將在未來版本中提供清楚說明及關閉匿名統計的選項。',
      emailTitle: '您主動寄送的郵件',
      emailBody:
        '若您提交回饋、加入 wishlist 或為 Pro 功能投票，我們僅保存您自願提供的資訊（如電子郵件地址與表單選項），用於回覆或寄送您要求的產品更新。',
      cookiesTitle: 'Cookie 與第三方服務',
      cookiesBody:
        '網站可能使用分析服務所需的基本 Cookie 或類似技術。我們力求將第三方服務限制在發布所需的基礎設施與產品分析範圍內。',
      contactTitle: '聯絡',
      contactBodyBefore: '隱私相關問題可透過',
      contactBodyAfter: '寄送。',
      footerTerms: '使用條款',
    },
    termsPage: {
      title: '使用條款',
      updated: '最後更新：2026 年 6 月 27 日',
      overviewTitle: '概覽',
      overviewBody:
        'VFXRun.com 提供面向 2D 遊戲 VFX 工作流程的免費工具，包括 VFXRun Browser（桌面）與 SheetGen（網頁）。使用本網站或我們的軟體即表示您同意這些條款。',
      freeTitle: '免費工具',
      freeBody:
        'VFXRun Browser 與 SheetGen 的核心功能在發布時免費提供。計畫中的 Pro 功能尚未開賣。隨著產品演進，我們可能會更新服務內容。',
      contentTitle: '您的內容',
      contentBody:
        '您保留對本機檔案與專案的所有權。VFXRun 不主張對您透過我們的工具瀏覽、預覽或匯出的素材的權利。您需自行確保有權處理所使用的內容。',
      marketplaceTitle: '非素材市集',
      marketplaceBody:
        'VFXRun 不透過本網站或其應用程式銷售、授權或分發第三方 VFX 素材。工具僅供處理您已有的檔案。',
      disclaimerTitle: '免責聲明',
      disclaimerBody:
        '軟體與網頁工具在早期發布階段按「現狀」提供。我們努力保持可靠，但不保證不間斷或無錯誤運作。請自行判斷用於製作流程。',
      changesTitle: '變更',
      changesBody: '隨著新版本發布，我們可能會更新這些條款或產品行為。重大變更將在此頁面反映並更新日期。',
      footerPrivacy: '隱私權政策',
      footerFeedback: '意見回饋',
    },
    changelogPage: {
      title: '更新日誌',
      lead: '產品更新與發布說明。',
      entryTitle: '2026-06-27 — 網站 MVP',
      item1: 'VFXRun.com 初版網站，含產品頁、文件與政策頁面。',
      item2: '首頁、VFXRun Browser、SheetGen 與 Pro 計畫占位內容。',
      item3: '下載與工具整合標記為即將推出，直至公開發布就緒。',
      moreNote: '隨著 VFXRun Browser 與 SheetGen 發布公開版本，將新增更多條目。',
    },
    redirectPage: {
      downloadTitle: '下載頁面已遷移',
      downloadLead: 'VFXRun Browser 的下載資訊已移至首頁。',
      downloadManualBefore: '若未自動跳轉，請',
      downloadManualLink: '前往下載區域',
      downloadBtn: '前往下載',
      homeTitle: '頁面已遷移',
      homeLead: 'VFXRun Browser 現位於網站首頁。',
      homeManualBefore: '若未自動跳轉，請',
      homeManualLink: '前往首頁',
      homeBtn: '前往 VFXRun Browser',
    },
  }),
  ja: deepMergeMessages(extendedPagesEn, {
    docsVfxrunPage: {
      lead: 'ゲームエンジンへ取り込む前に、ローカルの VFX シーケンスを閲覧・プレビューする無料デスクトップアプリです。',
      whatIsTitle: '概要',
      whatIsBody:
        'VFXRun Browser は選択したフォルダをスキャンし、PNG シーケンス、GIF などのライブラリを構築します。アニメーションのプレビュー、フィルター、お気に入り、ディスク上のソースフォルダへのジャンプができます。',
      whatIsNotTitle: '対象外のこと',
      notMarketplace: 'マーケットプレイスではありません — 第三者 VFX アセットの販売やバンドルは行いません。',
      notCloud: 'クラウドアップローダーではありません — ファイルはお使いのマシンに残ります。',
      notPro: 'ローンチ時点では Pro エディターではありません — タイムラインとエクスポートツールは別途予定です。',
      localTitle: 'ローカル処理とプライバシー',
      installSecurityTitle: 'インストール時のセキュリティについて',
      installWindowsTitle: 'Windows のインストール時にセキュリティ警告が出るのはなぜですか？',
      installWindowsBody:
        'VFXRun Browser は早期の無料版です。Windows インストーラーはまだコード署名されていないため、SmartScreen が「Windows によって PC が保護されました」や「不明な発行元」などを表示し、インストールボタンが最初は隠れることがあります。公式サイト vfxrun.com からのみダウンロードしてください。当社の公式サイトからのファイルであることを確認したうえで、「詳細情報」を選び、「実行」をクリックして続行できます。製品が成熟するにつれコード署名を追加し、このような表示を減らす予定です。',
      installMacTitle: 'macOS でも同様の警告が出ますか？',
      installMacBody:
        '出る場合があります。Apple Developer ID の署名と公証（notarization）がない早期版では、開発元を確認できないため開けないと表示されることがあります。vfxrun.com からのみダウンロードしてください。公式サイトからのファイルであることを確認したうえで、Finder でアプリを右クリックし「開く」を選び、もう一度確認して開けます。Mac 版の正式リリース前に、署名と公証への対応を進める予定です。',
      godotTitle: 'Godot ワークフロー（概要）',
      godotStep1: 'ディスク上のフォルダに PNG シーケンスを整理します。',
      godotStep2: 'VFX ライブラリのルートを VFXRun Browser に指定します。',
      godotStep3: 'Godot に取り込む前にエフェクトをプレビュー・比較します。',
      godotStep4: 'お気に入りとフィルターで AnimatedSprite2D やパーティクル用テクスチャの候補を絞り込みます。',
      footerDownload: 'ダウンロード',
      footerAllDocs: 'すべてのドキュメント',
    },
    docsSheetgenPage: {
      title: 'SheetGen エクスポートガイド',
      lead: 'SheetGen で PNG シーケンスを 2D ゲームエンジン向けスプライトシートにパックする方法。',
      overviewTitle: '概要',
      overviewBody:
        'SheetGen はフレームフォルダを単一のスプライトシートにまとめる無料 Web ツールです。シンプルなシーケンスパック向け — プロトタイプや小規模プロジェクトの迅速なエクスポートに適しています。',
      workflowTitle: '典型的なワークフロー',
      workflowStep1Before: 'ブラウザで',
      workflowStep1After: 'を開きます。',
      workflowStep2: 'PNG シーケンスフォルダまたはフレームを追加します。',
      workflowStep3: '必要に応じてレイアウトとパディングを調整します。',
      workflowStep4: 'スプライトシートとエンジン用の付属データをエクスポートします。',
      workflowStep5: 'シートを Godot、Unity、またはお好みの 2D パイプラインに取り込みます。',
      pairTitle: 'VFXRun Browser と組み合わせる',
      pairBody:
        'VFXRun Browser で大きなローカルライブラリを閲覧し、エフェクトをプレビューしてから SheetGen でパックするシーケンスを選びます。',
      privacyTitle: 'プライバシー',
      privacyBodyBefore:
        '処理はブラウザ内でローカルに実行されるよう設計されています。ファイル名、パス、画像内容、プロジェクトアセットは収集しません。詳細は',
      privacyBodyAfter: 'をご覧ください。',
      footerTool: 'SheetGen ツール',
      footerAllDocs: 'すべてのドキュメント',
    },
    privacyPage: {
      title: 'プライバシーポリシー',
      updated: '最終更新：2026年6月27日',
      localTitle: 'ローカルファイルはお使いのデバイスに残ります',
      localBody:
        'VFXRun Browser と SheetGen はローカルワークフローを前提に設計されています。フォルダの閲覧やスプライトシートのエクスポート時、ソースファイルはお使いのコンピューターまたはブラウザセッションに残ります。VFX アセットを VFXRun サーバーにアップロードすることはありません。',
      notCollectTitle: '収集しないもの',
      notCollect1: 'ローカルファイル名',
      notCollect2: 'ローカルフォルダパス',
      notCollect3: '画像またはテクスチャの内容',
      notCollect4: '元のアセット名またはプロジェクト名',
      notCollect5: 'ソースプロジェクトファイル',
      notCollect6: '非公開のゲームプロジェクトの詳細を露出しうるデータ',
      analyticsTitle: '匿名の利用統計',
      analyticsBody1:
        '有効な場合、Cloudflare Web Analytics や PostHog などの軽量分析を読み込むことがあります。ページ訪問、ダウンロードボタンのクリック、SheetGen ツール入口のクリック、Pro ページの閲覧、Pro wishlist の投票、フィードバックと Discord リンクのクリック、共有操作など、集計された利用状況の把握に役立ちます。',
      analyticsBody2:
        '分析イベントに含まれるのは、ページパス、リンク先、言語、プラットフォーム、wishlist フォームで選択した Pro 機能名などの高レベルな属性に限られます。これらのツールを通じてローカルファイル名、パス、画像内容、プロジェクトアセットの詳細、ユーザーのゲームプロジェクト名は収集しません。',
      analyticsBody3:
        '分析用の環境変数が未設定の場合、第三者分析スクリプトは注入されません。VFXRun Browser では将来、匿名統計の説明と無効化オプションを提供する予定です。',
      emailTitle: 'お客様が送信するメール',
      emailBody:
        'フィードバックの送信、wishlist への参加、Pro 機能への投票では、ご提供いただいた情報（メールアドレスやフォームの選択など）のみを保存し、返信またはご要望の製品更新の送信に使用します。',
      cookiesTitle: 'Cookie と第三者サービス',
      cookiesBody:
        '分析プロバイダーに必要な基本的な Cookie または類似技術を使用する場合があります。第三者サービスはローンチに必要なインフラと製品分析に限定することを目指しています。',
      contactTitle: 'お問い合わせ',
      contactBodyBefore: 'プライバシーに関する質問は',
      contactBodyAfter: 'からお送りください。',
      footerTerms: '利用規約',
    },
    termsPage: {
      title: '利用規約',
      updated: '最終更新：2026年6月27日',
      overviewTitle: '概要',
      overviewBody:
        'VFXRun.com は VFXRun Browser（デスクトップ）と SheetGen（Web）を含む 2D ゲーム VFX 向けの無料ツールを提供します。本サイトまたはソフトウェアの利用により、本規約に同意したものとみなされます。',
      freeTitle: '無料ツール',
      freeBody:
        'VFXRun Browser と SheetGen のコア機能はローンチ時に無料で提供されます。予定の Pro 機能はまだ販売していません。製品の進化に伴い提供内容を更新する場合があります。',
      contentTitle: 'お客様のコンテンツ',
      contentBody:
        'ローカルファイルとプロジェクトの所有権はお客様に帰属します。VFXRun は当社ツールで閲覧・プレビュー・エクスポートしたアセットに対する権利を主張しません。処理するコンテンツの利用権はお客様の責任で確保してください。',
      marketplaceTitle: 'アセットマーケットプレイスではありません',
      marketplaceBody:
        'VFXRun は本サイトまたはアプリを通じて第三者 VFX アセットを販売・ライセンス・配布しません。ツールは既にお持ちのファイルで作業するためのものです。',
      disclaimerTitle: '免責事項',
      disclaimerBody:
        'ソフトウェアと Web ツールは早期ローンチ段階で「現状有姿」で提供されます。信頼性の維持に努めますが、中断のないまたはエラーのない動作を保証するものではありません。本番パイプラインでの利用はご自身の判断でお願いします。',
      changesTitle: '変更',
      changesBody:
        '新バージョンのリリースに伴い、本規約または製品の動作を更新する場合があります。重要な変更は本ページに反映し、日付を更新します。',
      footerPrivacy: 'プライバシーポリシー',
      footerFeedback: 'フィードバック',
    },
    changelogPage: {
      title: '変更履歴',
      lead: '製品の更新とリリースノート。',
      entryTitle: '2026-06-27 — ウェブサイト MVP',
      item1: '製品ページ、ドキュメント、ポリシーページを含む VFXRun.com 初版サイト。',
      item2: 'ホームページ、VFXRun Browser、SheetGen、Pro プランのプレースホルダー。',
      item3: '公開ビルドの準備ができるまで、ダウンロードとツール連携は近日公開として表示。',
      moreNote: 'VFXRun Browser と SheetGen の公開ビルドに合わせて、さらにエントリが追加されます。',
    },
    redirectPage: {
      downloadTitle: 'ダウンロードページが移動しました',
      downloadLead: 'VFXRun Browser のダウンロード情報はホームページにあります。',
      downloadManualBefore: '自動的にリダイレクトされない場合は、',
      downloadManualLink: 'ダウンロードセクションへ',
      downloadBtn: 'ダウンロードへ',
      homeTitle: 'ページが移動しました',
      homeLead: 'VFXRun Browser はサイトのホームページにあります。',
      homeManualBefore: '自動的にリダイレクトされない場合は、',
      homeManualLink: 'ホームページへ',
      homeBtn: 'VFXRun Browser へ',
    },
  }),
  ko: deepMergeMessages(extendedPagesEn, {
    docsVfxrunPage: {
      lead: '게임 엔진으로 가져오기 전에 로컬 VFX 시퀀스를 탐색하고 미리보는 무료 데스크톱 앱입니다.',
      whatIsTitle: '개요',
      whatIsBody:
        'VFXRun Browser는 선택한 폴더를 스캔하여 PNG 시퀀스, GIF 및 관련 에셋 라이브러리를 구축합니다. 애니메이션 미리보기, 필터, 즐겨찾기, 디스크의 소스 폴더로 이동할 수 있습니다.',
      whatIsNotTitle: '해당하지 않는 것',
      notMarketplace: '마켓플레이스가 아닙니다 — 타사 VFX 에셋을 판매하거나 묶어 제공하지 않습니다.',
      notCloud: '클라우드 업로더가 아닙니다 — 파일은 사용자의 기기에 남습니다.',
      notPro: '출시 초기에는 Pro 편집기가 아닙니다 — 타임라인 및보내기 도구는 별도로 계획됩니다.',
      localTitle: '로컬 처리 및 개인정보',
      installSecurityTitle: '설치 보안 안내',
      installWindowsTitle: 'Windows 설치 시 보안 경고가 나타나는 이유는 무엇인가요?',
      installWindowsBody:
        'VFXRun Browser는 초기 무료 버전입니다. Windows 설치 프로그램은 아직 코드 서명이 되어 있지 않아 SmartScreen이 "Windows에서 PC를 보호했습니다" 또는 "알 수 없는 게시자" 등을 표시하고, 설치 버튼이 처음에 숨겨질 수 있습니다. 공식 사이트 vfxrun.com에서만 다운로드하세요. 당사 공식 사이트에서 받은 파일임을 확인한 경우 "추가 정보"를 선택한 뒤 "실행"을 눌러 계속할 수 있습니다. 제품이 안정되면 코드 서명을 추가해 이러한 안내를 줄일 예정입니다.',
      installMacTitle: 'macOS에서도 비슷한 경고가 나타나나요?',
      installMacBody:
        '나타날 수 있습니다. Apple Developer ID 서명과 공증(notarization)이 없는 초기 버전에서는 개발자를 확인할 수 없어 앱을 열 수 없다는 메시지가 표시될 수 있습니다. vfxrun.com에서만 다운로드하세요. 공식 사이트에서 받은 파일임을 확인한 경우 Finder에서 앱을 우클릭하고 "열기"를 선택한 뒤 한 번 더 확인하여 열 수 있습니다. Mac 정식 출시 전에 서명과 공증을 진행할 예정입니다.',
      godotTitle: 'Godot 워크플로(개요)',
      godotStep1: '디스크의 폴더에 PNG 시퀀스를 정리합니다.',
      godotStep2: 'VFX 라이브러리 루트를 VFXRun Browser에 지정합니다.',
      godotStep3: 'Godot으로 가져오기 전에 이펙트를 미리보고 비교합니다.',
      godotStep4: '즐겨찾기와 필터로 AnimatedSprite2D 또는 파티클 텍스처 후보를 좁힙니다.',
      footerDownload: '다운로드',
      footerAllDocs: '모든 문서',
    },
    docsSheetgenPage: {
      title: 'SheetGen보내기 가이드',
      lead: 'SheetGen으로 PNG 시퀀스를 2D 게임 엔진용 스프라이트 시트로 패킹하는 방법.',
      overviewTitle: '개요',
      overviewBody:
        'SheetGen은 프레임 폴더를 단일 스프라이트 시트로 만드는 무료 웹 도구입니다. 간단한 시퀀스 패킹 — 프로토타입과 소규모 프로젝트의 빠른보내기에 적합합니다.',
      workflowTitle: '일반적인 워크플로',
      workflowStep1Before: '브라우저에서 ',
      workflowStep1After: '을(를) 엽니다.',
      workflowStep2: 'PNG 시퀀스 폴더 또는 프레임을 추가합니다.',
      workflowStep3: '필요 시 레이아웃과 패딩을 조정합니다.',
      workflowStep4: '스프라이트 시트와 엔진용 동반 데이터를보냅니다.',
      workflowStep5: '시트를 Godot, Unity 또는 선호하는 2D 파이프라인으로 가져옵니다.',
      pairTitle: 'VFXRun Browser와 함께 사용',
      pairBody:
        'VFXRun Browser로 더 큰 로컬 라이브러리를 탐색하고 이펙트를 미리본 뒤 SheetGen에서 패킹할 시퀀스를 선택합니다.',
      privacyTitle: '개인정보',
      privacyBodyBefore:
        '처리는 브라우저에서 로컬로 실행되도록 설계되었습니다. 파일 이름, 경로, 이미지 내용, 프로젝트 에셋은 수집하지 않습니다. 자세한 내용은',
      privacyBodyAfter: '을 참고하세요.',
      footerTool: 'SheetGen 도구',
      footerAllDocs: '모든 문서',
    },
    privacyPage: {
      title: '개인정보 처리방침',
      updated: '최종 업데이트: 2026년 6월 27일',
      localTitle: '로컬 파일은 사용자 기기에 유지됩니다',
      localBody:
        'VFXRun Browser와 SheetGen은 로컬 워크플로를 중심으로 설계되었습니다. 폴더를 탐색하거나 스프라이트 시트를보낼 때 소스 파일은 컴퓨터 또는 브라우저 세션에 남습니다. VFX 에셋을 VFXRun 서버에 업로드하지 않습니다.',
      notCollectTitle: '수집하지 않는 항목',
      notCollect1: '로컬 파일 이름',
      notCollect2: '로컬 폴더 경로',
      notCollect3: '이미지 또는 텍스처 내용',
      notCollect4: '원본 에셋 또는 프로젝트 이름',
      notCollect5: '소스 프로젝트 파일',
      notCollect6: '비공개 게임 프로젝트 세부 정보를 노출할 수 있는 데이터',
      analyticsTitle: '익명 사용 통계',
      analyticsBody1:
        '활성화 시 Cloudflare Web Analytics, PostHog 등 경량 분석을 로드할 수 있습니다. 페이지 방문, 다운로드 버튼 클릭, SheetGen 도구 진입 클릭, Pro 페이지 조회, Pro wishlist 투표, 피드백 및 Discord 링크 클릭, 공유 동작 등 집계된 사용 현황 파악에 도움이 됩니다.',
      analyticsBody2:
        '분석 이벤트에는 페이지 경로, 링크 대상, 언어, 플랫폼, wishlist 양식에서 선택한 Pro 기능 이름 등 고수준 속성만 포함될 수 있습니다. 이러한 도구를 통해 로컬 파일 이름, 경로, 이미지 내용, 프로젝트 에셋 세부 정보, 사용자 게임 프로젝트 이름은 수집하지 않습니다.',
      analyticsBody3:
        '분석 환경 변수가 구성되지 않으면 타사 분석 스크립트를 주입하지 않습니다. VFXRun Browser는 향후 익명 통계에 대한 설명과 비활성화 옵션을 제공할 예정입니다.',
      emailTitle: '사용자가 보내는 이메일',
      emailBody:
        '피드백 제출, wishlist 가입 또는 Pro 기능 투표 시 자발적으로 제공한 정보(이메일 주소 및 양식 선택 등)만 저장하여 응답하거나 요청한 제품 업데이트를 보냅니다.',
      cookiesTitle: '쿠키 및 타사 서비스',
      cookiesBody:
        '분석 제공업체에 필요한 기본 쿠키 또는 유사 기술을 사용할 수 있습니다. 타사 서비스는 출시에 필요한 인프라와 제품 분석으로 제한하는 것을 목표로 합니다.',
      contactTitle: '문의',
      contactBodyBefore: '개인정보 관련 질문은',
      contactBodyAfter: '를 통해 보낼 수 있습니다.',
      footerTerms: '이용 약관',
    },
    termsPage: {
      title: '이용 약관',
      updated: '최종 업데이트: 2026년 6월 27일',
      overviewTitle: '개요',
      overviewBody:
        'VFXRun.com은 VFXRun Browser(데스크톱)와 SheetGen(웹)을 포함한 2D 게임 VFX용 무료 도구를 제공합니다. 본 웹사이트 또는 소프트웨어를 사용하면 본 약관에 동의한 것으로 간주됩니다.',
      freeTitle: '무료 도구',
      freeBody:
        'VFXRun Browser와 SheetGen의 핵심 기능은 출시 시 무료로 제공됩니다. 계획된 Pro 기능은 아직 판매하지 않습니다. 제품 발전에 따라 제공 내용을 업데이트할 수 있습니다.',
      contentTitle: '사용자 콘텐츠',
      contentBody:
        '로컬 파일과 프로젝트의 소유권은 사용자에게 있습니다. VFXRun은 당사 도구로 탐색·미리보기·보내기한 에셋에 대한 권리를 주장하지 않습니다. 처리하는 콘텐츠에 대한 사용 권한은 사용자가 보장해야 합니다.',
      marketplaceTitle: '에셋 마켓플레이스 아님',
      marketplaceBody:
        'VFXRun은 본 웹사이트나 앱을 통해 타사 VFX 에셋을 판매·라이선스·배포하지 않습니다. 도구는 이미 보유한 파일로 작업하기 위한 것입니다.',
      disclaimerTitle: '면책 조항',
      disclaimerBody:
        '소프트웨어와 웹 도구는 초기 출시 단계에서 “있는 그대로” 제공됩니다. 안정성 유지에 노력하지만 중단 없거나 오류 없는 운영을 보장하지 않습니다. 프로덕션 파이프라인에서의 사용은 사용자 재량에 따릅니다.',
      changesTitle: '변경',
      changesBody:
        '새 버전 출시에 따라 본 약관 또는 제품 동작을 업데이트할 수 있습니다. 중요한 변경은 본 페이지에 반영하고 날짜를 갱신합니다.',
      footerPrivacy: '개인정보 처리방침',
      footerFeedback: '피드백',
    },
    changelogPage: {
      title: '변경 로그',
      lead: '제품 업데이트 및 릴리스 노트.',
      entryTitle: '2026-06-27 — 웹사이트 MVP',
      item1: '제품 페이지, 문서, 정책 페이지를 포함한 VFXRun.com 초기 사이트.',
      item2: '홈페이지, VFXRun Browser, SheetGen, Pro 플랜 플레이스홀더.',
      item3: '공개 빌드 준비 전까지 다운로드 및 도구 통합은 곧 제공 예정으로 표시.',
      moreNote: 'VFXRun Browser와 SheetGen 공개 빌드에 따라 더 많은 항목이 추가됩니다.',
    },
    redirectPage: {
      downloadTitle: '다운로드 페이지가 이동했습니다',
      downloadLead: 'VFXRun Browser 다운로드 정보는 홈페이지에 있습니다.',
      downloadManualBefore: '자동으로 리디렉션되지 않으면 ',
      downloadManualLink: '다운로드 섹션으로 이동',
      downloadBtn: '다운로드로 이동',
      homeTitle: '페이지가 이동했습니다',
      homeLead: 'VFXRun Browser는 이제 사이트 홈페이지에 있습니다.',
      homeManualBefore: '자동으로 리디렉션되지 않으면 ',
      homeManualLink: '홈페이지로 이동',
      homeBtn: 'VFXRun Browser로 이동',
    },
  }),
  es: deepMergeMessages(extendedPagesEn, {
    docsVfxrunPage: {
      lead: 'Aplicación de escritorio gratuita para explorar y previsualizar secuencias VFX locales antes de importarlas a su motor de juego.',
      whatIsTitle: 'Qué es',
      whatIsBody:
        'VFXRun Browser escanea las carpetas que seleccionas y crea una biblioteca de secuencias PNG, GIF y activos relacionados. Puedes previsualizar animaciones, filtrar entradas, marcar favoritos y abrir la carpeta de origen en el disco.',
      whatIsNotTitle: 'Qué no es',
      notMarketplace: 'No es un marketplace — no vendemos ni agrupamos activos VFX de terceros.',
      notCloud: 'No es un cargador en la nube — sus archivos permanecen en su máquina.',
      notPro: 'No es un editor Pro al lanzamiento — las herramientas de línea de tiempo y exportación están planificadas por separado.',
      localTitle: 'Procesamiento local y privacidad',
      installSecurityTitle: 'Avisos de seguridad en la instalación',
      installWindowsTitle: '¿Por qué Windows muestra una advertencia de seguridad al instalar?',
      installWindowsBody:
        'VFXRun Browser es una versión gratuita en fase inicial. El instalador de Windows aún no tiene firma de código, por lo que SmartScreen puede mostrar mensajes como «Windows protegió su PC» o «Editor desconocido», y el botón de instalación puede estar oculto al principio. Descargue solo desde el sitio oficial vfxrun.com. Si ha confirmado que el instalador proviene de nuestro sitio web, puede elegir «Más información» y luego «Ejecutar de todos modos» para continuar. Planeamos añadir firma de código a medida que el producto madure para reducir estas advertencias.',
      installMacTitle: '¿macOS mostrará una advertencia similar?',
      installMacBody:
        'Puede ocurrir. Sin la firma de Apple Developer ID y la notarización, macOS puede indicar que no se puede abrir la app porque no se puede verificar el desarrollador. Descargue solo desde vfxrun.com. Si ha confirmado que el archivo proviene de nuestro sitio oficial, puede hacer clic derecho en la app en Finder, elegir Abrir y confirmar una vez más. Nuestro objetivo es añadir firma y notarización antes del lanzamiento completo en Mac.',
      godotTitle: 'Flujo de trabajo en Godot (resumen)',
      godotStep1: 'Organiza secuencias PNG en carpetas en el disco.',
      godotStep2: 'Apunta VFXRun Browser a la raíz de su biblioteca VFX.',
      godotStep3: 'Previsualiza y compara efectos antes de importar a Godot.',
      godotStep4: 'Usa favoritos y filtros para reducir candidatos para AnimatedSprite2D o texturas de partículas.',
      footerDownload: 'Descargar',
      footerAllDocs: 'Toda la documentación',
    },
    docsSheetgenPage: {
      title: 'Guía de exportación de SheetGen',
      lead: 'Cómo usar SheetGen para empaquetar secuencias PNG en hojas de sprites para motores 2D.',
      overviewTitle: 'Resumen',
      overviewBody:
        'SheetGen es una herramienta web gratuita que convierte carpetas de fotogramas en una sola hoja de sprites. Está orientada al empaquetado simple de secuencias — exportaciones rápidas para prototipos y proyectos pequeños.',
      workflowTitle: 'Flujo de trabajo típico',
      workflowStep1Before: 'Abre ',
      workflowStep1After: ' en su navegador.',
      workflowStep2: 'Añade carpetas de secuencias PNG o fotogramas.',
      workflowStep3: 'Ajusta el diseño y el relleno si es necesario.',
      workflowStep4: 'Exporta la hoja de sprites y los datos complementarios para su motor.',
      workflowStep5: 'Importa la hoja en Godot, Unity o su pipeline 2D preferido.',
      pairTitle: 'Combínalo con VFXRun Browser',
      pairBody:
        'Usa VFXRun Browser para explorar bibliotecas locales más grandes, previsualizar efectos y elegir secuencias antes de empaquetarlas en SheetGen.',
      privacyTitle: 'Privacidad',
      privacyBodyBefore:
        'El procesamiento está diseñado para ejecutarse localmente en el navegador. No recopilamos nombres de archivos, rutas, contenido de imágenes ni activos del proyecto. Consulta la ',
      privacyBodyAfter: ' para más detalles.',
      footerTool: 'Herramienta SheetGen',
      footerAllDocs: 'Toda la documentación',
    },
    privacyPage: {
      title: 'Política de privacidad',
      updated: 'Última actualización: 27 de junio de 2026',
      localTitle: 'Los archivos locales permanecen en su dispositivo',
      localBody:
        'VFXRun Browser y SheetGen están diseñados para flujos de trabajo locales. Al explorar carpetas o exportar hojas de sprites, sus archivos de origen permanecen en su ordenador o en la sesión del navegador. No subimos sus activos VFX a los servidores de VFXRun.',
      notCollectTitle: 'Lo que no recopilamos',
      notCollect1: 'Nombres de archivos locales',
      notCollect2: 'Rutas de carpetas locales',
      notCollect3: 'Contenido de imágenes o texturas',
      notCollect4: 'Nombres originales de activos o proyectos',
      notCollect5: 'Archivos de proyecto de origen',
      notCollect6: 'Cualquier dato que pueda exponer detalles privados de proyectos de juego',
      analyticsTitle: 'Estadísticas de uso anónimas',
      analyticsBody1:
        'Si está habilitado, el sitio puede cargar analíticas ligeras como Cloudflare Web Analytics y PostHog. Nos ayudan a entender el uso agregado — visitas a páginas, clics en descarga, entrada a SheetGen, vistas de Pro, votos en wishlist Pro, clics en feedback y Discord, y acciones de compartir.',
      analyticsBody2:
        'Los eventos de analítica pueden incluir solo propiedades de alto nivel como ruta de página, destino del enlace, idioma, plataforma y nombres de funciones Pro seleccionadas en el formulario wishlist. No recopilamos nombres de archivos locales, rutas, contenido de imágenes, detalles de activos del proyecto ni nombres de proyectos de juego mediante estas herramientas.',
      analyticsBody3:
        'Si las variables de entorno de analítica no están configuradas, el sitio funciona sin inyectar scripts de terceros. VFXRun Browser incluirá en el futuro una explicación clara y una opción para desactivar las estadísticas anónimas.',
      emailTitle: 'Correo que decides enviar',
      emailBody:
        'Si envía comentarios, se une a una wishlist o vota por funciones Pro, solo almacenamos la información que proporciona voluntariamente (como su correo y selecciones del formulario) para responder o enviar actualizaciones solicitadas.',
      cookiesTitle: 'Cookies y servicios de terceros',
      cookiesBody:
        'El sitio puede usar cookies básicas o tecnologías similares requeridas por los proveedores de analítica. Intentamos limitar los servicios de terceros a la infraestructura y analítica de producto necesarias para el lanzamiento.',
      contactTitle: 'Contacto',
      contactBodyBefore: 'Las preguntas de privacidad pueden enviarse a través de la ',
      contactBodyAfter: '.',
      footerTerms: 'Términos de uso',
    },
    termsPage: {
      title: 'Términos de uso',
      updated: 'Última actualización: 27 de junio de 2026',
      overviewTitle: 'Resumen',
      overviewBody:
        'VFXRun.com ofrece herramientas gratuitas para flujos VFX 2D, incluidos VFXRun Browser (escritorio) y SheetGen (web). Al usar este sitio o nuestro software, aceptas estos términos.',
      freeTitle: 'Herramientas gratuitas',
      freeBody:
        'Las funciones principales de VFXRun Browser y SheetGen se ofrecen gratis al lanzamiento. Las funciones Pro planificadas aún no están a la venta. Podemos actualizar las ofertas a medida que evolucionen los productos.',
      contentTitle: 'Su contenido',
      contentBody:
        'Conserva la propiedad de sus archivos y proyectos locales. VFXRun no reclama derechos sobre los activos que explora, previsualiza o exporta con nuestras herramientas. Es responsable de tener derechos sobre el contenido que procesa.',
      marketplaceTitle: 'Sin marketplace de activos',
      marketplaceBody:
        'VFXRun no vende, licencia ni distribuye activos VFX de terceros a través de este sitio o sus aplicaciones. Las herramientas sirven para trabajar con archivos que ya tienes.',
      disclaimerTitle: 'Descargo de responsabilidad',
      disclaimerBody:
        'El software y las herramientas web se proporcionan “tal cual” durante el lanzamiento inicial. Trabajamos para mantenerlos fiables pero no garantizamos un funcionamiento ininterrumpido o sin errores. Úselos bajo su propio criterio en pipelines de producción.',
      changesTitle: 'Cambios',
      changesBody:
        'Podemos actualizar estos términos o el comportamiento del producto al publicar nuevas versiones. Los cambios importantes se reflejarán en esta página con una fecha actualizada.',
      footerPrivacy: 'Política de privacidad',
      footerFeedback: 'Comentarios',
    },
    changelogPage: {
      title: 'Registro de cambios',
      lead: 'Actualizaciones del producto y notas de versión.',
      entryTitle: '2026-06-27 — MVP del sitio web',
      item1: 'Sitio inicial de VFXRun.com con páginas de producto, documentación y políticas.',
      item2: 'Inicio, VFXRun Browser, SheetGen y marcadores del plan Pro.',
      item3: 'Descarga e integraciones de herramientas marcadas como próximamente hasta que las versiones públicas estén listas.',
      moreNote: 'Aparecerán más entradas cuando VFXRun Browser y SheetGen publiquen builds públicos.',
    },
    redirectPage: {
      downloadTitle: 'La descarga se ha movido',
      downloadLead: 'La información de descarga de VFXRun Browser está en la página de inicio.',
      downloadManualBefore: 'Si no se redirige automáticamente, ',
      downloadManualLink: 've a la sección de descarga',
      downloadBtn: 'Ir a descarga',
      homeTitle: 'Página movida',
      homeLead: 'VFXRun Browser está ahora en la página de inicio del sitio.',
      homeManualBefore: 'Si no se redirige automáticamente, ',
      homeManualLink: 've a la página de inicio',
      homeBtn: 'Ir a VFXRun Browser',
    },
  }),
  fr: deepMergeMessages(extendedPagesEn, {
    docsVfxrunPage: {
      lead: 'Application de bureau gratuite pour parcourir et prévisualiser des séquences VFX locales avant import dans votre moteur de jeu.',
      whatIsTitle: 'Ce que c’est',
      whatIsBody:
        'VFXRun Browser analyse les dossiers que vous sélectionnez et construit une bibliothèque de séquences PNG, GIF et assets associés. Vous pouvez prévisualiser les animations, filtrer, marquer des favoris et ouvrir le dossier source sur le disque.',
      whatIsNotTitle: 'Ce que ce n’est pas',
      notMarketplace: 'Pas une marketplace — nous ne vendons ni ne regroupons d’assets VFX tiers.',
      notCloud: 'Pas un uploader cloud — vos fichiers restent sur votre machine.',
      notPro: 'Pas un éditeur Pro au lancement — timeline et outils d’export sont prévus séparément.',
      localTitle: 'Traitement local et confidentialité',
      installSecurityTitle: 'Avertissements de sécurité à l’installation',
      installWindowsTitle: 'Pourquoi Windows affiche-t-il un avertissement de sécurité à l’installation ?',
      installWindowsBody:
        'VFXRun Browser est une version gratuite en phase initiale. L’installateur Windows n’est pas encore signé, donc SmartScreen peut afficher des messages comme « Windows a protégé votre PC » ou « Éditeur inconnu », et le bouton d’installation peut être masqué au départ. Téléchargez uniquement depuis le site officiel vfxrun.com. Si vous avez confirmé que l’installateur provient de notre site, vous pouvez choisir « Plus d’infos », puis « Exécuter quand même » pour continuer. Nous prévoyons d’ajouter une signature de code à mesure que le produit mûrit afin de réduire ces avertissements.',
      installMacTitle: 'macOS affichera-t-il un avertissement similaire ?',
      installMacBody:
        'C’est possible. Sans signature Apple Developer ID ni notarisation, macOS peut indiquer que l’app ne peut pas s’ouvrir car le développeur ne peut pas être vérifié. Téléchargez uniquement depuis vfxrun.com. Si vous avez confirmé que le fichier provient de notre site officiel, faites un clic droit sur l’app dans le Finder, choisissez Ouvrir, puis confirmez une nouvelle fois. Nous visons à ajouter signature et notarisation avant le lancement complet sur Mac.',
      godotTitle: 'Workflow Godot (aperçu)',
      godotStep1: 'Organisez les séquences PNG dans des dossiers sur le disque.',
      godotStep2: 'Pointez VFXRun Browser vers la racine de votre bibliothèque VFX.',
      godotStep3: 'Prévisualisez et comparez les effets avant import dans Godot.',
      godotStep4: 'Utilisez favoris et filtres pour réduire les candidats pour AnimatedSprite2D ou textures de particules.',
      footerDownload: 'Télécharger',
      footerAllDocs: 'Toute la documentation',
    },
    docsSheetgenPage: {
      title: 'Guide d’export SheetGen',
      lead: 'Comment utiliser SheetGen pour packer des séquences PNG en feuilles de sprites pour moteurs 2D.',
      overviewTitle: 'Aperçu',
      overviewBody:
        'SheetGen est un outil web gratuit qui transforme des dossiers de frames en une feuille de sprites. Il vise le packing simple de séquences — exports rapides pour prototypes et petits projets.',
      workflowTitle: 'Workflow typique',
      workflowStep1Before: 'Ouvrez ',
      workflowStep1After: ' dans votre navigateur.',
      workflowStep2: 'Ajoutez des dossiers de séquences PNG ou des frames.',
      workflowStep3: 'Ajustez la mise en page et le padding si nécessaire.',
      workflowStep4: 'Exportez la feuille de sprites et les données associées pour votre moteur.',
      workflowStep5: 'Importez la feuille dans Godot, Unity ou votre pipeline 2D préféré.',
      pairTitle: 'Associer avec VFXRun Browser',
      pairBody:
        'Utilisez VFXRun Browser pour parcourir de plus grandes bibliothèques locales, prévisualiser les effets et choisir les séquences avant de les packer dans SheetGen.',
      privacyTitle: 'Confidentialité',
      privacyBodyBefore:
        'Le traitement est conçu pour s’exécuter localement dans le navigateur. Nous ne collectons pas les noms de fichiers, chemins, contenu d’images ni assets de projet. Voir la ',
      privacyBodyAfter: ' pour les détails.',
      footerTool: 'Outil SheetGen',
      footerAllDocs: 'Toute la documentation',
    },
    privacyPage: {
      title: 'Politique de confidentialité',
      updated: 'Dernière mise à jour : 27 juin 2026',
      localTitle: 'Les fichiers locaux restent sur votre appareil',
      localBody:
        'VFXRun Browser et SheetGen sont conçus pour des workflows locaux. Lorsque vous parcourez des dossiers ou exportez des feuilles de sprites, vos fichiers source restent sur votre ordinateur ou dans la session du navigateur. Nous ne téléversons pas vos assets VFX sur les serveurs VFXRun.',
      notCollectTitle: 'Ce que nous ne collectons pas',
      notCollect1: 'Noms de fichiers locaux',
      notCollect2: 'Chemins de dossiers locaux',
      notCollect3: 'Contenu d’images ou de textures',
      notCollect4: 'Noms d’assets ou de projets d’origine',
      notCollect5: 'Fichiers de projet source',
      notCollect6: 'Toute donnée pouvant exposer des détails privés de projets de jeu',
      analyticsTitle: 'Statistiques d’usage anonymes',
      analyticsBody1:
        'Si activé, le site peut charger des analytics légers comme Cloudflare Web Analytics et PostHog. Ils nous aident à comprendre l’usage agrégé — visites de pages, clics sur téléchargement, entrée SheetGen, vues Pro, votes wishlist Pro, clics feedback et Discord, et partages.',
      analyticsBody2:
        'Les événements analytics peuvent inclure uniquement des propriétés de haut niveau comme chemin de page, cible de lien, langue, plateforme et noms de fonctions Pro sélectionnées dans le formulaire wishlist. Nous ne collectons pas via ces outils les noms de fichiers locaux, chemins, contenu d’images, détails d’assets de projet ni noms de projets de jeu.',
      analyticsBody3:
        'Si les variables d’environnement analytics ne sont pas configurées, le site fonctionne sans scripts tiers. VFXRun Browser inclura à l’avenir une explication claire et une option pour désactiver les statistiques anonymes.',
      emailTitle: 'E-mails que vous choisissez d’envoyer',
      emailBody:
        'Si vous envoyez un commentaire, rejoignez une wishlist ou votez pour des fonctions Pro, nous ne stockons que les informations que vous fournissez volontairement (comme votre e-mail et les choix du formulaire) pour répondre ou envoyer les mises à jour demandées.',
      cookiesTitle: 'Cookies et services tiers',
      cookiesBody:
        'Le site peut utiliser des cookies de base ou technologies similaires requis par les fournisseurs d’analytics. Nous visons à limiter les services tiers à l’infrastructure et l’analytics produit nécessaires au lancement.',
      contactTitle: 'Contact',
      contactBodyBefore: 'Les questions de confidentialité peuvent être envoyées via la ',
      contactBodyAfter: '.',
      footerTerms: 'Conditions d’utilisation',
    },
    termsPage: {
      title: 'Conditions d’utilisation',
      updated: 'Dernière mise à jour : 27 juin 2026',
      overviewTitle: 'Aperçu',
      overviewBody:
        'VFXRun.com fournit des outils gratuits pour les workflows VFX 2D, dont VFXRun Browser (bureau) et SheetGen (web). En utilisant ce site ou nos logiciels, vous acceptez ces conditions.',
      freeTitle: 'Outils gratuits',
      freeBody:
        'Les fonctions principales de VFXRun Browser et SheetGen sont gratuites au lancement. Les fonctions Pro prévues ne sont pas encore vendues. Nous pouvons mettre à jour l’offre à mesure que les produits évoluent.',
      contentTitle: 'Votre contenu',
      contentBody:
        'Vous conservez la propriété de vos fichiers et projets locaux. VFXRun ne revendique aucun droit sur les assets que vous parcourez, prévisualisez ou exportez avec nos outils. Vous êtes responsable de disposer des droits sur le contenu que vous traitez.',
      marketplaceTitle: 'Pas de marketplace d’assets',
      marketplaceBody:
        'VFXRun ne vend, ne licence ni ne distribue d’assets VFX tiers via ce site ou ses applications. Les outils servent à travailler avec des fichiers que vous possédez déjà.',
      disclaimerTitle: 'Avertissement',
      disclaimerBody:
        'Les logiciels et outils web sont fournis « en l’état » pendant le lancement initial. Nous travaillons à les garder fiables mais ne garantissons pas un fonctionnement ininterrompu ou sans erreur. Utilisez-les à votre discrétion dans les pipelines de production.',
      changesTitle: 'Modifications',
      changesBody:
        'Nous pouvons mettre à jour ces conditions ou le comportement du produit lors de nouvelles versions. Les changements importants seront reflétés sur cette page avec une date mise à jour.',
      footerPrivacy: 'Politique de confidentialité',
      footerFeedback: 'Commentaires',
    },
    changelogPage: {
      title: 'Journal des modifications',
      lead: 'Mises à jour produit et notes de version.',
      entryTitle: '2026-06-27 — MVP du site web',
      item1: 'Site initial VFXRun.com avec pages produit, documentation et politiques.',
      item2: 'Accueil, VFXRun Browser, SheetGen et placeholders du plan Pro.',
      item3: 'Téléchargement et intégrations d’outils marqués bientôt disponible jusqu’aux builds publics.',
      moreNote: 'D’autres entrées apparaîtront lorsque VFXRun Browser et SheetGen publieront des builds publics.',
    },
    redirectPage: {
      downloadTitle: 'Téléchargement déplacé',
      downloadLead: 'Les informations de téléchargement de VFXRun Browser sont sur la page d’accueil.',
      downloadManualBefore: 'Si vous n’êtes pas redirigé automatiquement, ',
      downloadManualLink: 'allez à la section téléchargement',
      downloadBtn: 'Aller au téléchargement',
      homeTitle: 'Page déplacée',
      homeLead: 'VFXRun Browser est maintenant sur la page d’accueil du site.',
      homeManualBefore: 'Si vous n’êtes pas redirigé automatiquement, ',
      homeManualLink: 'allez à la page d’accueil',
      homeBtn: 'Aller à VFXRun Browser',
    },
  }),
};

export function flattenExtendedPagesForLocale(locale: Locale): Record<string, string> {
  const pages = extendedPagesI18n[locale] ?? extendedPagesI18n.en;
  const out: Record<string, string> = {};

  for (const [section, values] of Object.entries(pages)) {
    for (const [key, value] of Object.entries(values)) {
      out[`${section}.${key}`] = value;
    }
  }

  return out;
}
