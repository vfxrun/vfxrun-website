# VFXRun Website Launch Plan

Updated: 2026-06-27

## Goal

Build VFXRun.com as the central product site for VFXRun Desktop and SheetGen.

The website should:

- Explain the products clearly.
- Provide free downloads and free tools.
- Collect Pro wishlist emails and feature votes.
- Make VFXRun discoverable by search engines and AI tools.
- Support launch analytics and feedback collection.

## Site Structure

Recommended pages:

- `/`
  - Product overview.
  - Entry points to VFXRun Desktop and SheetGen.
  - Free download CTA.
  - SheetGen CTA.

- `/sheetgen`
  - Free Sprite Sheet Generator by VFXRun.

- `/download`
  - VFXRun Desktop download.
  - Version number.
  - Windows installer.
  - Release notes.
  - Privacy note.

- `/pro`
  - Planned Pro features.
  - Wishlist form.
  - Feature voting.
  - Free version promise.

- `/docs`
  - What is VFXRun.
  - What is SheetGen.
  - Privacy and local processing.
  - Godot workflow.
  - Sprite sheet export guide.

- `/tutorials`
  - SEO tutorial hub.

- `/feedback`
  - Feedback and bug report form.

- `/discord`
  - Discord invite redirect or landing page.

- `/about`
  - Product mission.
  - Contact email.

## Home Page Message

Suggested headline:

> Free tools for 2D game VFX workflows.

Suggested subheadline:

> Browse local PNG sequence effects with VFXRun Desktop, and pack sprite sheets online with SheetGen. Built for Godot, Unity, and 2D game developers.

Primary CTAs:

- Download VFXRun Desktop
- Open SheetGen

Secondary CTAs:

- Vote for Pro Features
- Join Discord

## Pro Page

Do not sell Pro at launch.

The Pro page should explain:

- Free version stays free.
- Pro is planned for production editing workflows.
- Users can vote for the features they need.
- Users can leave email to get updates.

Current Pro candidates:

- Add multiple effects and edit them on a timeline.
- Adjust effect colors.
- Replace effect color palettes.
- Export composed timeline effects.

Form fields:

- Email.
- Primary engine: Godot / Unity / Cocos / Other.
- Role: indie developer / student / artist / technical artist / studio.
- Feature votes.

## SEO Pages

Minimum pages before public launch:

1. Free Sprite Sheet Generator.
2. Godot VFX Workflow.
3. TexturePacker Alternative for Simple PNG Sequences.

## AI Discoverability

Add:

- `llms.txt`.
- `sitemap.xml`.
- Clear text docs.
- FAQ.
- Schema.org software metadata.
- GitHub-style README page.

Canonical description:

> VFXRun is a free local 2D VFX browser for previewing PNG sequences, GIFs, and sprite sheets before importing them into Godot, Unity, or other engines. SheetGen is a free browser-based sprite sheet generator by VFXRun.

## Data and Backend

Website events:

- `page_view`
- `download_clicked`
- `sheetgen_opened`
- `sheetgen_export_completed`
- `pro_page_opened`
- `pro_feature_voted`
- `wishlist_email_submitted`
- `share_clicked`
- `feedback_submitted`

Backend needs:

- Feature vote storage.
- Wishlist email storage.
- Feedback form storage.
- Remote config endpoint.
- Download analytics.

Dashboard needs:

- Visits by source.
- Download clicks.
- SheetGen export completions.
- Pro page visits.
- Vote count by feature.
- Wishlist emails.
- Feedback count.

## Email and Accounts

Recommended emails:

- `support@vfxrun.com`
- `hello@vfxrun.com` or `contact@vfxrun.com`
- Optional: `updates@vfxrun.com`

Email options:

- Cloudflare Email Routing: good for forwarding incoming mail; not a full mailbox.
- Zoho Mail: possible low-cost or free custom domain mailbox option depending on plan/data center.
- Google Workspace: polished full mailbox; current Business Starter list price is $7/user/month before regional promotions.

Recommended early choice:

- Use Cloudflare Email Routing if forwarding is enough.
- Use Zoho or Google Workspace if full mailbox send/receive is needed.

## Launch Checklist

- [ ] Homepage.
- [ ] SheetGen page.
- [ ] Download page.
- [ ] Pro wishlist / voting page.
- [ ] Docs page.
- [ ] Feedback page.
- [ ] Privacy page.
- [ ] `llms.txt`.
- [ ] `sitemap.xml`.
- [ ] Analytics.
- [ ] Remote config endpoint.
- [ ] Email capture.
- [ ] Share buttons.
- [ ] Discord link.

## Acceptance Criteria

- A visitor understands VFXRun and SheetGen within the first viewport.
- A visitor can download VFXRun Desktop without registering.
- A visitor can open SheetGen without registering.
- A user can vote for Pro features with email.
- The site provides enough text for SEO and AI discovery.
- The site records the core launch funnel.

## Cursor Task List

1. Build website routes.
2. Build landing page.
3. Build download page.
4. Build Pro wishlist/voting page.
5. Build feedback page.
6. Add analytics events.
7. Add remote config endpoint.
8. Add `llms.txt` and sitemap.
9. Add SEO metadata.
10. Connect email capture.
## Pro 远程配置与软件跳转支持

官网需要为 VFXRun Browser 的未来 Pro 计划提前提供稳定页面、锚点和远程配置文件。当前阶段不接支付，不做账号，不做 license，只做可测试的入口和配置。

### 网站端要实现

- 在 `public/config/app-config.json` 提供静态远程配置文件。
- 保证生产环境可访问：`https://vfxrun.com/config/app-config.json`。
- 保证本地开发可访问：`http://localhost:4321/config/app-config.json`。
- Pro 页面或 Pro 区域需要提供稳定锚点：`#features`、`#trial`、`#pricing`、`#faq`、`#wishlist`。
- 现阶段页面可以写“Pro 计划中 / 暂未开放购买 / 加入 wishlist 或投票”，不要假装已经可以购买。
- 以后接入 Lemon Squeezy、Paddle、Stripe 或其它支付系统时，优先只替换页面中的购买按钮，不改变软件已使用的 URL。

### 推荐配置文件初始内容

```json
{
  "proEnabled": false,
  "showProBanner": false,
  "trialEnabled": false,
  "pricingUrl": "https://vfxrun.com/vfxrun/pro#pricing",
  "trialUrl": "https://vfxrun.com/vfxrun/pro#trial",
  "featuresUrl": "https://vfxrun.com/vfxrun/pro#features",
  "feedbackUrl": "https://vfxrun.com/feedback",
  "configVersion": 1
}
```

### 网站端测试

- 本地访问 `/config/app-config.json` 能返回 JSON。
- `/vfxrun/pro#features`、`/vfxrun/pro#trial`、`/vfxrun/pro#pricing`、`/vfxrun/pro#wishlist` 都能滚动到正确位置。
- 修改 JSON 为测试打开状态后，本地软件能显示 Pro 提示。
- 改回关闭状态后，本地软件能隐藏 Pro 提示。
