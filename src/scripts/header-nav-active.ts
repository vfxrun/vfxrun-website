export function syncHeaderNavActive(): void {
  const path = window.location.pathname.replace(/\/$/, '') || '/';

  document.querySelectorAll<HTMLAnchorElement>('.site-nav__link').forEach((link) => {
    const linkPath = link.getAttribute('href')?.replace(/\/$/, '') || '/';
    const active = path === linkPath || path.startsWith(`${linkPath}/`);
    link.classList.toggle('site-nav__link--active', active);
  });

  document.querySelectorAll<HTMLAnchorElement>('.site-nav__tab').forEach((tab) => {
    const href = tab.getAttribute('href')?.replace(/\/$/, '') || '/';
    const isSheetgen = href === '/sheetgen';
    const active = isSheetgen
      ? path === '/sheetgen' || path.startsWith('/sheetgen/')
      : path === '/' || path === '/vfxrun' || path.startsWith('/vfxrun/');
    tab.classList.toggle('site-nav__tab--active', active);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', syncHeaderNavActive);
} else {
  syncHeaderNavActive();
}

document.addEventListener('astro:page-load', syncHeaderNavActive);
