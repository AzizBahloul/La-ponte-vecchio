import { $$ } from '../lib/html';
import { icon } from '../lib/icons';
import { reducedMotion } from '../lib/motion';

const label = (playing: boolean): string => (playing ? 'Mettre la vidéo en pause' : 'Lire la vidéo');

/**
 * Looping clips only play while visible (saves battery and CPU) and never
 * autoplay under reduced motion: the poster image stays instead.
 * Every clip gets a pause/play button (WCAG 2.2.2), and a clip the visitor
 * paused stays paused when it scrolls back into view.
 */
export function initLazyVideos(): void {
  const videos = $$<HTMLVideoElement>('video[data-autoplay]');
  const paused = new WeakSet<HTMLVideoElement>();
  if (reducedMotion()) videos.forEach((v) => paused.add(v));

  const load = (v: HTMLVideoElement): void => {
    if (!v.src && v.dataset.src) v.src = v.dataset.src;
  };
  const play = (v: HTMLVideoElement): void => {
    load(v);
    v.play().catch(() => {
      /* autoplay refused: the poster stays, that's fine */
    });
  };

  for (const v of videos) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vid-toggle';
    const sync = (): void => {
      const playing = !v.paused;
      btn.innerHTML = (playing ? icon('pause') : icon('play')).value;
      btn.setAttribute('aria-label', label(playing));
    };
    btn.addEventListener('click', () => {
      if (v.paused) {
        paused.delete(v);
        play(v);
      } else {
        paused.add(v);
        v.pause();
      }
    });
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    sync();
    v.after(btn);
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        const v = target as HTMLVideoElement;
        if (!isIntersecting) v.pause();
        else if (!paused.has(v)) play(v);
      }
    },
    { rootMargin: '200px 0px' },
  );
  videos.forEach((v) => io.observe(v));
}
