export function initBrowserShare() {
  const button = document.getElementById('browser-share-btn');
  const toast = document.getElementById('browser-share-toast');
  if (!button || !toast) return;

  let timer: number | undefined;

  const showToast = () => {
    window.clearTimeout(timer);
    toast.classList.add('is-visible');
    timer = window.setTimeout(() => toast.classList.remove('is-visible'), 1600);
  };

  const copy = async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        showToast();
        return;
      }
    } catch {
      /* fallback below */
    }

    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast();
    } catch {
      /* ignore */
    }
    document.body.removeChild(ta);
  };

  button.addEventListener('click', () => {
    void import('./analytics').then(({ track }) => {
      track('external_share_clicked', { target_url: window.location.href });
    });
    void copy(window.location.href);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBrowserShare);
} else {
  initBrowserShare();
}
