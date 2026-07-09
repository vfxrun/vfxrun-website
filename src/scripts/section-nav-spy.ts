export function initSectionNavSpy(navRootSelector: string) {
  const navRoot = document.querySelector(navRootSelector);
  if (!navRoot) return;

  const links = Array.from(navRoot.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
  if (!links.length) return;

  const targets = links
    .map((link) => {
      const id = link.getAttribute('href')?.slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter((el): el is HTMLElement => Boolean(el));

  if (!targets.length) return;

  const setActive = (id: string) => {
    links.forEach((link) => {
      const target = link.getAttribute('href')?.slice(1);
      link.classList.toggle('sidebar-nav__link--active', target === id);
    });
  };

  const getScrollOffset = () => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim();
    const headerHeight = Number.parseFloat(raw) || 56;
    return headerHeight + 24;
  };

  const updateActive = () => {
    const scrollPosition = window.scrollY + getScrollOffset();
    let activeId = targets[0].id;

    for (const target of targets) {
      if (target.offsetTop <= scrollPosition) {
        activeId = target.id;
      }
    }

    setActive(activeId);
  };

  links.forEach((link) => {
    link.addEventListener('click', () => {
      const id = link.getAttribute('href')?.slice(1);
      if (!id) return;
      setActive(id);
      window.requestAnimationFrame(updateActive);
      window.setTimeout(updateActive, 120);
      window.setTimeout(updateActive, 360);
    });
  });

  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);

  if (location.hash) {
    const id = location.hash.slice(1);
    if (targets.some((target) => target.id === id)) setActive(id);
  }

  updateActive();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initSectionNavSpy('[data-section-nav="browser"]');
    initSectionNavSpy('[data-section-nav="pro"]');
  });
} else {
  initSectionNavSpy('[data-section-nav="browser"]');
  initSectionNavSpy('[data-section-nav="pro"]');
}

document.addEventListener('astro:page-load', () => {
  initSectionNavSpy('[data-section-nav="browser"]');
  initSectionNavSpy('[data-section-nav="pro"]');
});
