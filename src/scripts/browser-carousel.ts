import { getFlatBundleForLocale } from '../i18n/i18n-bundles';
import { resolveLocale } from '../i18n/locales';

const AUTOPLAY_MS = 7000;

interface CarouselSlide {
  src: string;
  captionKey: string;
}

function getCaptionText(captionKey: string): string {
  const locale = resolveLocale(document.documentElement.dataset.locale) ?? 'en';
  const bundle = getFlatBundleForLocale(locale);
  return bundle[captionKey] ?? '';
}

export function initBrowserCarousels() {
  document.querySelectorAll<HTMLElement>('[data-browser-carousel]').forEach((root) => {
    if (root.dataset.carouselReady === '1') return;
    root.dataset.carouselReady = '1';

    let slides: CarouselSlide[] = [];
    try {
      slides = JSON.parse(root.dataset.slides ?? '[]') as CarouselSlide[];
    } catch {
      return;
    }
    if (!slides.length) return;

    const frame = root.querySelector<HTMLElement>('.browser-carousel__frame');
    const image = root.querySelector<HTMLImageElement>('[data-carousel-image]');
    const caption = root.querySelector<HTMLElement>('[data-carousel-caption]');
    const segments = Array.from(root.querySelectorAll<HTMLElement>('[data-carousel-segment]'));
    const prev = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-carousel-next]');

    if (!image || !caption) return;

    let index = 0;
    let timer: number | undefined;
    let paused = false;

    const updateCaption = () => {
      const slide = slides[index];
      if (!slide) return;
      caption.dataset.i18n = slide.captionKey;
      caption.textContent = getCaptionText(slide.captionKey);
    };

    const updateSegments = () => {
      segments.forEach((segment, segmentIndex) => {
        segment.classList.toggle('is-active', segmentIndex === index);
      });
    };

    const show = (nextIndex: number) => {
      index = (nextIndex + slides.length) % slides.length;
      const slide = slides[index];
      if (!slide) return;

      frame?.classList.add('is-fading');
      window.setTimeout(() => {
        image.src = slide.src;
        updateCaption();
        updateSegments();
        frame?.classList.remove('is-fading');
      }, 80);

      root.dataset.activeSlide = String(index);
    };

    const schedule = () => {
      window.clearInterval(timer);
      if (paused || slides.length < 2) return;
      timer = window.setInterval(() => show(index + 1), AUTOPLAY_MS);
    };

    const pause = () => {
      paused = true;
      window.clearInterval(timer);
    };

    const resume = () => {
      paused = false;
      schedule();
    };

    const onArrowClick = (event: Event, direction: -1 | 1) => {
      event.preventDefault();
      event.stopPropagation();
      show(index + direction);
      schedule();
    };

    prev?.addEventListener('click', (event) => onArrowClick(event, -1));
    next?.addEventListener('click', (event) => onArrowClick(event, 1));

    root.addEventListener('mouseenter', pause);
    root.addEventListener('mouseleave', resume);
    root.addEventListener('focusin', pause);
    root.addEventListener('focusout', (event) => {
      if (!root.contains(event.relatedTarget as Node)) resume();
    });

    document.addEventListener('vfxrun:locale-change', updateCaption);

    updateSegments();
    schedule();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBrowserCarousels);
} else {
  initBrowserCarousels();
}
