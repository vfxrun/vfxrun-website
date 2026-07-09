function isSheetgenPath(path: string): boolean {
  return path === '/sheetgen' || path.startsWith('/sheetgen/');
}

export function syncLayoutShell(): void {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const sheetgen = isSheetgenPath(path);

  document.body.classList.toggle('body--sheetgen', sheetgen);

  const shell = document.querySelector('.page-shell');
  shell?.classList.toggle('page-shell--sheetgen', sheetgen);

  document.querySelector('main')?.classList.toggle('main--sheetgen', sheetgen);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', syncLayoutShell);
} else {
  syncLayoutShell();
}

document.addEventListener('astro:page-load', syncLayoutShell);
