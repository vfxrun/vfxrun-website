/** Legacy hash aliases for /vfxrun/pro links used by the desktop app. */
const HASH_ALIASES: Record<string, string> = {
  vote: 'features',
};

function resolveHashTarget(): string | null {
  const raw = window.location.hash.slice(1);
  if (!raw) return null;

  if (raw === 'wishlist') {
    return document.getElementById('wishlist') ? 'wishlist' : 'features';
  }

  if (raw === 'pricing' && !document.getElementById('pricing')) {
    return document.getElementById('wishlist') ? 'wishlist' : 'features';
  }

  return HASH_ALIASES[raw] ?? raw;
}

function scrollToHashTarget(): void {
  const targetId = resolveHashTarget();
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  const rawHash = window.location.hash.slice(1);
  const resolved = resolveHashTarget();
  if (rawHash !== resolved) {
    history.replaceState(null, '', `#${resolved}`);
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scrollToHashTarget);
} else {
  scrollToHashTarget();
}

window.addEventListener('hashchange', scrollToHashTarget);
