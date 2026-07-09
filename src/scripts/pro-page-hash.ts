/** Legacy hash aliases for /vfxrun/pro links used by the desktop app. */
const HASH_ALIASES: Record<string, string> = {
  vote: 'wishlist',
};

function resolveHashTarget(): string | null {
  const raw = window.location.hash.slice(1);
  if (!raw) return null;
  return HASH_ALIASES[raw] ?? raw;
}

function scrollToHashTarget(): void {
  const targetId = resolveHashTarget();
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  if (HASH_ALIASES[window.location.hash.slice(1)]) {
    history.replaceState(null, '', `#${targetId}`);
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scrollToHashTarget);
} else {
  scrollToHashTarget();
}

window.addEventListener('hashchange', scrollToHashTarget);
