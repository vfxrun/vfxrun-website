import { getFlatBundleForLocale } from '../i18n/i18n-bundles';
import { resolveLocale } from '../i18n/locales';

const AUTOPLAY_MS = 7000;
const YOUTUBE_ORIGINS = new Set(['https://www.youtube-nocookie.com', 'https://www.youtube.com']);
const initializedCarousels = new WeakSet<HTMLElement>();

type ImageSlide = { kind: 'image'; src: string; captionKey: string };
type YoutubeSlide = { kind: 'youtube'; videoId: string; thumbSrc: string; captionKey: string };
type CarouselSlide = ImageSlide | YoutubeSlide;

function getCaptionText(captionKey: string): string {
  const locale = resolveLocale(document.documentElement.dataset.locale) ?? 'en';
  const bundle = getFlatBundleForLocale(locale);
  return bundle[captionKey] ?? '';
}

function youtubeEmbed(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    playsinline: '1',
    enablejsapi: '1',
    controls: '1',
    fs: '1',
    origin: window.location.origin,
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

function readYoutubePlayerState(data: unknown): number | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const payload = data as { event?: string; info?: number | { playerState?: number } };
  if (payload.event === 'onStateChange' && typeof payload.info === 'number') return payload.info;
  if (payload.event === 'infoDelivery' && payload.info && typeof payload.info === 'object') {
    return payload.info.playerState;
  }
  return undefined;
}

export function initBrowserCarousels() {
  document.querySelectorAll<HTMLElement>('[data-browser-carousel]').forEach((root) => {
    if (initializedCarousels.has(root)) return;

    let slides: CarouselSlide[] = [];
    try {
      slides = JSON.parse(root.dataset.slides ?? '[]') as CarouselSlide[];
    } catch {
      return;
    }
    if (!slides.length) return;

    const frame = root.querySelector<HTMLElement>('.browser-carousel__frame');
    const image = root.querySelector<HTMLImageElement>('[data-carousel-image]');
    const videoPanel = root.querySelector<HTMLElement>('[data-carousel-video]');
    const videoThumb = root.querySelector<HTMLImageElement>('[data-carousel-video-thumb]');
    const playButton = root.querySelector<HTMLButtonElement>('[data-carousel-play]');
    const caption = root.querySelector<HTMLElement>('[data-carousel-caption]');
    const segments = Array.from(root.querySelectorAll<HTMLElement>('[data-carousel-segment]'));
    const prev = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-carousel-next]');
    const modal = root.querySelector<HTMLElement>('[data-carousel-modal]');
    const modalPlayer = root.querySelector<HTMLElement>('[data-carousel-modal-player]');
    const modalCloseButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-carousel-modal-close]'));

    if (!image || !caption || !videoPanel || !videoThumb || !playButton || !modal || !modalPlayer) return;

    let index = 0;
    let timer: number | undefined;
    let paused = false;
    let onYoutubeMessage: ((event: MessageEvent) => void) | undefined;
    let activeYoutubeFrame: HTMLIFrameElement | undefined;
    let videoEndedHandled = false;

    const isModalOpen = () => !modal.hidden;

    const detachYoutubeListener = () => {
      if (!onYoutubeMessage) return;
      window.removeEventListener('message', onYoutubeMessage);
      onYoutubeMessage = undefined;
      activeYoutubeFrame = undefined;
      videoEndedHandled = false;
    };

    const closeModal = () => {
      detachYoutubeListener();
      modalPlayer.innerHTML = '';
      modal.hidden = true;
      document.body.style.overflow = '';
    };

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

    const renderSlide = (slide: CarouselSlide) => {
      closeModal();

      if (slide.kind === 'youtube') {
        image.hidden = true;
        videoPanel.hidden = false;
        videoThumb.src = slide.thumbSrc;
        videoThumb.alt = getCaptionText(slide.captionKey);
        return;
      }

      videoPanel.hidden = true;
      image.hidden = false;
      image.src = slide.src;
      image.alt = getCaptionText(slide.captionKey);
    };

    const show = (nextIndex: number) => {
      index = (nextIndex + slides.length) % slides.length;
      const slide = slides[index];
      if (!slide) return;

      frame?.classList.add('is-fading');
      window.setTimeout(() => {
        renderSlide(slide);
        updateCaption();
        updateSegments();
        frame?.classList.remove('is-fading');
      }, 80);

      root.dataset.activeSlide = String(index);
    };

    const schedule = () => {
      window.clearInterval(timer);
      if (paused || slides.length < 2 || isModalOpen()) return;
      timer = window.setInterval(() => show(index + 1), AUTOPLAY_MS);
    };

    const pause = () => {
      paused = true;
      window.clearInterval(timer);
    };

    const resume = () => {
      if (isModalOpen()) return;
      paused = false;
      schedule();
    };

    const advanceAfterVideoEnd = () => {
      if (videoEndedHandled) return;
      videoEndedHandled = true;
      closeModal();
      show(index + 1);
      paused = false;
      schedule();
    };

    const openVideoModal = () => {
      const slide = slides[index];
      if (!slide || slide.kind !== 'youtube') return;

      pause();
      closeModal();
      videoEndedHandled = false;

      const iframe = document.createElement('iframe');
      iframe.src = youtubeEmbed(slide.videoId);
      iframe.title = getCaptionText(slide.captionKey);
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
      iframe.allowFullscreen = true;
      modalPlayer.appendChild(iframe);
      activeYoutubeFrame = iframe;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';

      onYoutubeMessage = (event: MessageEvent) => {
        if (!YOUTUBE_ORIGINS.has(event.origin)) return;
        if (event.source !== activeYoutubeFrame?.contentWindow) return;

        let payload: unknown = event.data;
        if (typeof payload === 'string') {
          try {
            payload = JSON.parse(payload);
          } catch {
            return;
          }
        }

        if (readYoutubePlayerState(payload) === 0) advanceAfterVideoEnd();
      };

      window.addEventListener('message', onYoutubeMessage);
    };

    const onArrowClick = (event: Event, direction: -1 | 1) => {
      event.preventDefault();
      event.stopPropagation();
      show(index + direction);
      schedule();
    };

    playButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openVideoModal();
    });

    prev?.addEventListener('click', (event) => onArrowClick(event, -1));
    next?.addEventListener('click', (event) => onArrowClick(event, 1));

    modalCloseButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        closeModal();
        resume();
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isModalOpen()) {
        closeModal();
        resume();
      }
    });

    root.addEventListener('mouseenter', pause);
    root.addEventListener('mouseleave', resume);
    root.addEventListener('focusin', pause);
    root.addEventListener('focusout', (event) => {
      if (!root.contains(event.relatedTarget as Node)) resume();
    });

    document.addEventListener('vfxrun:locale-change', updateCaption);

    initializedCarousels.add(root);
    updateSegments();
    schedule();
  });
}
