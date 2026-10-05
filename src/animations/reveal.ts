import { gsap, ScrollTrigger } from './scroll';
import { $$ } from '../lib/html';
import { EASE, MQ } from '../lib/motion';

/**
 * Entrance animations: each component animates in ONCE, when it arrives on screen, then stays
 * still. Nothing is tied to the scroll position (no parallax, no scrubbing), so scrolling always
 * feels like normal scrolling. Each kind of component arrives in its own way, so the page has
 * a rhythm instead of one repeated fade:
 *
 *   data-reveal="words"    headline words swing up from behind a mask
 *   data-reveal            text blocks rise, un-blur and settle
 *   data-reveal="left" | "right"   blocks slide in from the side
 *   data-reveal="pop"      cards and stickers pop in with a small spring
 *   data-reveal="stagger"  children rise one after another, alternating a slight tilt
 *   data-reveal="deal"     children are dealt in from the right like cards on a table
 *   data-reveal="rows"     list rows slide in from the left, prices land last
 *   data-reveal="clip"     media unwrapped from a different side each time, photo settling inside
 *
 * One trigger line (85% of the viewport) everywhere. Under reduced motion nothing is hidden,
 * so content is never stuck invisible.
 */
const START = 'top 85%';
const once = (trigger: Element) => ({ trigger, start: START, once: true });

export function initReveals(): void {
  const mm = gsap.matchMedia();

  mm.add(MQ.motion, () => {
    $$('[data-reveal="words"]').forEach((el) => {
      splitWords(el);
      gsap.from(el.querySelectorAll('.word > span'), {
        yPercent: 120,
        rotate: 7,
        transformOrigin: '0% 100%',
        duration: 1.2,
        ease: EASE.out,
        stagger: 0.06,
        scrollTrigger: once(el),
      });
    });

    $$('[data-reveal=""], [data-reveal="up"]').forEach((el) => {
      gsap.from(el, { y: 56, autoAlpha: 0, filter: 'blur(8px)', duration: 1.1, ease: EASE.out, clearProps: 'filter', scrollTrigger: once(el) });
    });

    $$('[data-reveal="left"], [data-reveal="right"]').forEach((el) => {
      const dir = el.dataset.reveal === 'left' ? -1 : 1;
      gsap.from(el, { x: dir * 90, autoAlpha: 0, filter: 'blur(8px)', duration: 1.2, ease: EASE.out, clearProps: 'filter', scrollTrigger: once(el) });
    });

    $$('[data-reveal="pop"]').forEach((el) => {
      gsap.from(el, { scale: 0.7, rotate: -6, y: 30, autoAlpha: 0, duration: 0.9, ease: 'back.out(1.7)', scrollTrigger: once(el) });
    });

    $$('[data-reveal="stagger"]').forEach((el) => {
      gsap.from(el.children, {
        y: 80,
        rotate: (i: number) => (i % 2 ? 3 : -3),
        scale: 0.94,
        autoAlpha: 0,
        duration: 1.1,
        ease: EASE.out,
        stagger: 0.1,
        scrollTrigger: once(el),
      });
    });

    $$('[data-reveal="deal"]').forEach((el) => {
      gsap.from(el.children, {
        x: 220,
        y: 40,
        rotate: 8,
        scale: 0.9,
        autoAlpha: 0,
        duration: 1,
        ease: EASE.out,
        stagger: 0.1,
        scrollTrigger: once(el),
      });
    });

    $$('[data-reveal="rows"]').forEach((el) => {
      const rows = Array.from(el.children);
      const tl = gsap.timeline({ scrollTrigger: once(el) });
      tl.from(rows, { x: -60, autoAlpha: 0, duration: 0.9, ease: EASE.out, stagger: 0.055 });
      tl.from(
        el.querySelectorAll('.dish__price'),
        { scale: 0.5, duration: 0.5, ease: 'back.out(2.4)', stagger: 0.055, transformOrigin: '100% 50%' },
        0.25,
      );
    });

    // Media is unwrapped from a different side each time: bottom, left, top, right.
    const SIDES = ['inset(100% 0% 0% 0%)', 'inset(0% 100% 0% 0%)', 'inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 100%)'];
    $$('[data-reveal="clip"]').forEach((el, i) => {
      const media = el.querySelector('img, video');
      const tl = gsap.timeline({ scrollTrigger: once(el) });
      tl.fromTo(el, { clipPath: SIDES[i % SIDES.length] }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: EASE.inOut });
      if (media) tl.from(media, { scale: 1.35, rotate: i % 2 ? 2 : -2, duration: 1.8, ease: EASE.out }, 0);
    });
  });

  // Images load after layout: recompute trigger positions once they're in.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/** Wrap each word in a mask so it can rise into view. Keeps the text readable for screen readers. */
export function splitWords(el: HTMLElement): void {
  if (el.dataset.split) return;
  el.dataset.split = 'true';
  el.setAttribute('aria-label', el.textContent?.trim() ?? '');
  const walk = (node: Node): void => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const part of (child.textContent ?? '').split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.append(' ');
          } else {
            const word = document.createElement('span');
            word.className = 'word';
            word.setAttribute('aria-hidden', 'true');
            const inner = document.createElement('span');
            inner.textContent = part;
            word.append(inner);
            frag.append(word);
          }
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    }
  };
  walk(el);
}
