import { html, $, $$ } from '../lib/html';
import { dailySpecial } from '../data/content';
import { formatPrice } from '../data/menu';
import { openDays, weekDays } from '../data/restaurant';
import { parisNow } from '../lib/time';
import { gsap } from '../animations/scroll';
import { EASE, MQ } from '../lib/motion';

/** Hand-drawn chalk loop that circles today's dish. */
const chalkCircle = html`
  <svg class="chalk-circle" viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true">
    <path d="M18 40 C 20 12, 140 4, 250 10 C 300 14, 296 52, 240 60 C 160 70, 40 66, 14 48 C 6 40, 30 24, 70 18" />
  </svg>
`;

export function renderDaily() {
  const today = parisNow().day;
  return html`
    <section class="daily" id="plat-du-jour" aria-labelledby="daily-title">
      <div class="wrap">
        <div class="ardoise">
          <div class="ardoise__main">
            <h2 class="chalk chalk--title" id="daily-title"><span data-chalk>Le plat du jour</span></h2>
            <p class="chalk chalk--lede"><span data-chalk>Chaque midi, une assiette maison qui change tous les jours.</span></p>
            <ol class="ardoise__week">
              ${openDays.map((d) => {
                const s = dailySpecial.week[d];
                const isToday = d === today;
                return html`<li class="chalk ${isToday ? 'is-today' : ''}">
                  <span data-chalk class="ardoise__day">${weekDays[d]}${isToday ? html` <em>(aujourd’hui)</em>` : ''}</span>
                  <span data-chalk class="ardoise__dish">${s.dish}, ${s.side}</span>
                  ${isToday ? chalkCircle : ''}
                </li>`;
              })}
            </ol>
          </div>
          <div class="ardoise__price chalk">
            <span data-chalk class="chalk-price">${formatPrice(dailySpecial.price)}</span>
            <span data-chalk class="chalk-small">le plat, le midi en semaine</span>
            <span data-chalk class="chalk-formula">${dailySpecial.formula.label} : ${formatPrice(dailySpecial.formula.price)}</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function mountDaily(): void {
  const sec = $('.daily');
  const mm = gsap.matchMedia();
  mm.add(MQ.motion, () => {
    // Each chalk line is "written" left to right, the way the board is filled every morning.
    const lines = $$('[data-chalk]', sec);
    const circle = sec.querySelector<SVGPathElement>('.chalk-circle path');
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.ardoise', start: 'top 70%', once: true } });
    tl.from('.ardoise', { y: 40, autoAlpha: 0, rotate: -1.5, duration: 1, ease: EASE.out });
    tl.fromTo(
      lines,
      { clipPath: 'inset(-10% 100% -10% 0)' },
      { clipPath: 'inset(-10% 0% -10% 0)', duration: 0.7, ease: 'power1.inOut', stagger: 0.12 },
      0.35,
    );
    if (circle) {
      const len = circle.getTotalLength();
      gsap.set(circle, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(circle, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, '-=0.2');
    }
  });
}
