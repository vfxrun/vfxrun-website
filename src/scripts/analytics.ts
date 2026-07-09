export type AnalyticsEvent =
  | 'website_visit'
  | 'download_clicked'
  | 'sheetgen_opened'
  | 'pro_plan_viewed'
  | 'pro_vote_submitted'
  | 'feedback_clicked'
  | 'discord_clicked'
  | 'external_share_clicked';

export type AnalyticsProperty = 'source_page' | 'target_url' | 'language' | 'platform' | 'feature_name';

const ALLOWED_PROPERTIES = new Set<AnalyticsProperty>([
  'source_page',
  'target_url',
  'language',
  'platform',
  'feature_name',
]);

type AnalyticsPayload = Partial<Record<AnalyticsProperty, string>>;

const ANONYMOUS_ID_KEY = 'vfxrun:anonymous_id';

let posthogHost: string | undefined;
let posthogKey: string | undefined;
let analyticsReady = false;

function readEnv(name: string): string | undefined {
  const value = import.meta.env[name];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function detectPlatform(): string {
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return 'windows';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'macos';
  if (/Linux/i.test(ua)) return 'linux';
  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  return 'unknown';
}

function currentLanguage(): string {
  return document.documentElement.dataset.locale || document.documentElement.lang || 'en';
}

function createAnonymousId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getAnonymousId(): string {
  try {
    const existing = localStorage.getItem(ANONYMOUS_ID_KEY);
    if (existing) return existing;

    const id = createAnonymousId();
    localStorage.setItem(ANONYMOUS_ID_KEY, id);
    return id;
  } catch {
    return createAnonymousId();
  }
}

function sanitizeProperties(properties?: AnalyticsPayload): Record<string, string> {
  const safe: Record<string, string> = {
    source_page: window.location.pathname,
    language: currentLanguage(),
    platform: detectPlatform(),
  };

  if (!properties) return safe;

  for (const [key, value] of Object.entries(properties)) {
    if (!ALLOWED_PROPERTIES.has(key as AnalyticsProperty)) continue;
    if (typeof value !== 'string' || value.length === 0) continue;
    safe[key] = value;
  }

  return safe;
}

function initPostHog(): void {
  posthogKey = readEnv('PUBLIC_POSTHOG_KEY');
  if (!posthogKey) return;
  posthogHost = (readEnv('PUBLIC_POSTHOG_HOST') ?? 'https://us.i.posthog.com').replace(/\/$/, '');
}

function sendToPostHog(event: AnalyticsEvent, payload: Record<string, string>): void {
  if (!posthogKey || !posthogHost) return;

  try {
    void fetch(`${posthogHost}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: posthogKey,
        event,
        properties: {
          distinct_id: getAnonymousId(),
          ...payload,
          $lib: 'vfxrun-web',
        },
      }),
      keepalive: true,
    }).then((response) => {
      if (!response.ok && import.meta.env.DEV) {
        console.warn('[analytics] PostHog rejected event', response.status);
      }
    });
  } catch {
    /* optional analytics — ignore network failures */
  }
}

export function initAnalytics(): void {
  if (analyticsReady) return;
  analyticsReady = true;
  initPostHog();
}

export function track(event: AnalyticsEvent, properties?: AnalyticsPayload): void {
  initAnalytics();
  const payload = sanitizeProperties(properties);

  sendToPostHog(event, payload);

  if (import.meta.env.DEV) {
    console.debug('[analytics]', event, payload);
  }
}

export function bindDownloadClicks(): void {
  document.querySelectorAll<HTMLElement>('[data-analytics-download]').forEach((platform) => {
    platform.addEventListener('click', () => {
      track('download_clicked', {
        platform: platform.dataset.analyticsDownload ?? detectPlatform(),
      });
    });
  });
}

export function bindAnalyticsClicks(): void {
  document.addEventListener('click', (event) => {
    const target = (event.target as Element | null)?.closest<HTMLElement>('[data-analytics-event]');
    if (!target) return;

    const analyticsEvent = target.dataset.analyticsEvent as AnalyticsEvent | undefined;
    if (!analyticsEvent) return;

    const properties: AnalyticsPayload = {};
    if (target.dataset.analyticsTargetUrl) {
      properties.target_url = target.dataset.analyticsTargetUrl;
    }
    if (target.dataset.analyticsFeatureName) {
      properties.feature_name = target.dataset.analyticsFeatureName;
    }
    if (target.dataset.analyticsPlatform) {
      properties.platform = target.dataset.analyticsPlatform;
    }

    track(analyticsEvent, properties);
  });
}

export function trackPageEvents(): void {
  const path = window.location.pathname.replace(/\/$/, '') || '/';

  if (path === '/sheetgen') {
    track('sheetgen_opened');
  }

  if (path === '/vfxrun/pro') {
    track('pro_plan_viewed');
  }
}
