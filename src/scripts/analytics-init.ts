import { bindAnalyticsClicks, bindDownloadClicks, initAnalytics, track, trackPageEvents } from './analytics';

export function initSiteAnalytics(): void {
  initAnalytics();
  track('website_visit');
  trackPageEvents();
  bindAnalyticsClicks();
  bindDownloadClicks();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSiteAnalytics);
} else {
  initSiteAnalytics();
}
