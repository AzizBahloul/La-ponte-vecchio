import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

/**
 * Smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger scenes and
 * the scroll position never drift apart. Skipped entirely under reduced motion:
 * the page then uses plain native scrolling.
 */
export function initSmoothScroll(): void {
  if (reducedMotion()) return;

  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add('has-smooth-scroll');
}

const navOffset = (): number => {
  const nav = document.querySelector<HTMLElement>('.nav');
  return (nav?.offsetHeight ?? 0) + 12;
};

/** Scroll to an element or a pixel position, smoothly when allowed. */
export function scrollToTarget(target: HTMLElement | number, opts: { offset?: number } = {}): void {
  const offset = opts.offset ?? (typeof target === 'number' ? 0 : -navOffset());
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
}

/** Every in-page link goes through the same scroll so pinned scenes stay in sync. */
export function bindAnchorLinks(): void {
  document.addEventListener('click', (e) => {
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href')!.slice(1);
    const target = id ? document.getElementById(id) : document.body;
    if (!target) return;
    e.preventDefault();
    scrollToTarget(target === document.body ? 0 : target);
    history.replaceState(null, '', id ? `#${id}` : location.pathname);
    // Move keyboard focus along with the scroll.
    if (target !== document.body) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
}

/** Lock page scroll while a dialog / mobile menu is open. */
export function lockScroll(locked: boolean): void {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.classList.toggle('is-locked', locked);
}

export { gsap, ScrollTrigger };
