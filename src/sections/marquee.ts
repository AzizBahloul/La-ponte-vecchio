import { html, $ } from '../lib/html';
import { icon } from '../lib/icons';
import { ingredients } from '../data/content';
import { gsap } from '../animations/scroll';
import { MQ } from '../lib/motion';

/** The page's single marquee: the ingredients, sliding at a calm constant pace. */
export function renderMarquee() {
  const row = html`${ingredients.map((i) => html`<li>${i}${icon('sparkle', 'marquee__sep')}</li>`)}`;
  return html`
    <div class="awning" aria-hidden="true"></div>
    <div class="marquee">
      <div class="marquee__track">
        <ul aria-label="Nos ingrédients">${row}</ul>
        <ul aria-hidden="true">${row}</ul>
      </div>
    </div>
  `;
}

export function mountMarquee(): void {
  const track = $('.marquee__track');
  const mm = gsap.matchMedia();

  mm.add(MQ.motion, () => {
    // The awning unrolls downward from the hero as the page settles.
    gsap.from('.awning', { '--drop': 0, duration: 1.1, delay: 1.4, ease: 'back.out(1.4)' });

    // The track holds the list twice; sliding by half loops seamlessly.
    const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 38, repeat: -1 });

    return () => loop.kill();
  });
}
