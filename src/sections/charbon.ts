import { html, $, $$ } from '../lib/html';
import { icon } from '../lib/icons';
import { charcoalSupplement, formatPrice } from '../data/menu';
import { gsap } from '../animations/scroll';
import { EASE, MQ, reducedMotion } from '../lib/motion';

type Dough = 'classique' | 'charbon';

const CRUST = { classique: '#E9BE78', charbon: '#2B2724' };
const CHAR = { classique: '#B77B3A', charbon: '#0E0C0B' };

/** The illustrated pizza from the original site, now the star of a scroll scene. */
const pizza = html`
  <svg class="pizza" viewBox="0 0 300 300" aria-hidden="true">
    <ellipse cx="156" cy="162" rx="140" ry="138" fill="rgba(0,0,0,.35)" />
    <g class="pizza__turn">
      <circle class="pizza__crust" cx="150" cy="150" r="140" fill="${CRUST.classique}" />
      <g class="pizza__char" fill="${CHAR.classique}" opacity=".55">
        <circle cx="40" cy="120" r="5" /><circle cx="62" cy="62" r="4" /><circle cx="130" cy="17" r="5" />
        <circle cx="215" cy="35" r="4" /><circle cx="270" cy="115" r="6" /><circle cx="262" cy="200" r="4" />
        <circle cx="205" cy="268" r="5" /><circle cx="110" cy="279" r="4" /><circle cx="42" cy="215" r="5" />
      </g>
      <g class="pizza__sauce">
        <circle cx="150" cy="150" r="117" fill="#C8371F" />
        <circle cx="150" cy="150" r="117" fill="none" stroke="#A82A15" stroke-width="3" opacity=".5" />
      </g>
      <g class="pizza__cheese" fill="#FBF7EE">
        <path d="M95 92c12-8 30-4 32 9s-10 22-23 20-21-21-9-29z" />
        <path d="M178 78c13-4 27 4 26 16s-15 18-27 14-12-26 1-30z" />
        <path d="M140 140c14-6 32 2 32 16s-16 22-30 18-16-28-2-34z" />
        <path d="M206 158c11-3 22 6 20 17s-15 15-24 10-7-24 4-27z" />
        <path d="M80 165c11-5 25 2 24 14s-14 18-25 13-10-22 1-27z" />
        <path d="M128 208c12-4 26 4 25 15s-15 17-26 13-11-24 1-28z" />
        <path d="M190 212c10-2 19 5 17 14s-12 12-20 8-7-20 3-22z" />
      </g>
      <g class="pizza__basil" fill="#2F6B3A">
        <path d="M150 60c10 2 18 10 16 18-9 0-17-8-16-18z" />
        <path d="M232 128c-2 10-10 17-18 15 0-9 8-16 18-15z" />
        <path d="M110 128c-10 0-17-7-17-15 9-1 17 6 17 15z" />
        <path d="M168 192c8 6 10 16 4 21-7-4-9-14-4-21z" />
        <path d="M70 128c6-8 15-10 20-5-4 7-13 10-20 5z" />
        <path d="M92 222c10-2 18 4 18 11-9 2-17-4-18-11z" />
      </g>
      <g class="pizza__pepper" fill="#3A1F14" opacity=".8">
        <circle cx="120" cy="80" r="3" /><circle cx="215" cy="105" r="3" /><circle cx="175" cy="135" r="2.5" />
        <circle cx="105" cy="195" r="3" /><circle cx="230" cy="195" r="2.5" /><circle cx="160" cy="250" r="3" />
      </g>
    </g>
  </svg>
`;

export function renderCharbon() {
  return html`
    <section class="charbon" id="charbon" data-dough="classique" aria-labelledby="charbon-title">
      <div class="charbon__pin">
        <div class="wrap charbon__grid">
          <div class="charbon__stage">
            <img class="charbon__photo" src="/media/pate-noire.webp" alt="" loading="lazy" decoding="async" />
            ${pizza}
          </div>

          <div class="charbon__copy">
            <h2 id="charbon-title" data-reveal="words">Pourquoi une pâte noire ?</h2>

            <div class="dough-switch" role="radiogroup" aria-label="Choisir la pâte">
              <span class="dough-switch__pill" aria-hidden="true"></span>
              <button type="button" role="radio" aria-checked="true" data-dough-choice="classique">Pâte classique</button>
              <button type="button" role="radio" aria-checked="false" data-dough-choice="charbon">Pâte au charbon</button>
            </div>

            <div class="charbon__texts" aria-live="polite">
              <p data-dough-text="classique">
                Notre pâte maison, fine et dorée, maturée 48 h. Croustillante au bord, souple au centre.
              </p>
              <p data-dough-text="charbon" hidden>
                C’est la spécialité de la maison : du charbon végétal actif dans la pâte, pour une couleur noire profonde sans
                changer le goût. Beaucoup la trouvent plus légère.
              </p>
            </div>

            <ul class="charbon__facts" data-reveal="stagger">
              <li>${icon('leaf')}<span><strong>Charbon végétal</strong> issu de coques de noix de coco</span></li>
              <li>${icon('fire')}<span><strong>Même cuisson</strong>, même croûte qui gonfle</span></li>
              <li>${icon('sparkle')}<span><strong>Toute la carte</strong> existe en noir, +${formatPrice(charcoalSupplement)}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function mountCharbon(): void {
  const sec = $('#charbon');
  const choices = $$<HTMLButtonElement>('[data-dough-choice]', sec);
  const texts = $$('[data-dough-text]', sec);

  const setDough = (d: Dough): void => {
    if (sec.dataset.dough === d) return;
    sec.dataset.dough = d;
    choices.forEach((c) => c.setAttribute('aria-checked', String(c.dataset.doughChoice === d)));
    texts.forEach((t) => (t.hidden = t.dataset.doughText !== d));
    gsap.fromTo(`[data-dough-text="${d}"]`, { autoAlpha: 0, y: 8, filter: 'blur(4px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.45, ease: EASE.out });
  };

  // The switch turns the pizza a little and bakes the crust to the chosen dough.
  const tweenTo = (d: Dough): void => {
    const t = reducedMotion() ? 0 : 1;
    gsap.to('.pizza__crust', { attr: { fill: CRUST[d] }, duration: 0.7 * t, ease: EASE.inOut });
    gsap.to('.pizza__char', { attr: { fill: CHAR[d] }, duration: 0.7 * t });
    gsap.to('.charbon__photo', { autoAlpha: d === 'charbon' ? 0.55 : 0.35, duration: 0.7 * t });
    gsap.to('.pizza__turn', { rotate: d === 'charbon' ? 60 : 0, svgOrigin: '150 150', duration: 0.9 * t, ease: EASE.out });
  };

  choices.forEach((btn) =>
    btn.addEventListener('click', () => {
      const d = btn.dataset.doughChoice as Dough;
      setDough(d);
      tweenTo(d);
    }),
  );

  // Arrow keys move inside the radiogroup, as expected.
  sec.querySelector('.dough-switch')!.addEventListener('keydown', (e) => {
    const k = (e as KeyboardEvent).key;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(k)) return;
    e.preventDefault();
    const next = choices.find((c) => c.getAttribute('aria-checked') === 'false')!;
    next.focus();
    next.click();
  });

  const mm = gsap.matchMedia();
  mm.add(MQ.motion, () => {
    // The pizza builds itself as you arrive: sauce spreads, mozzarella drops, basil lands, pepper last.
    const assemble = gsap.timeline({
      defaults: { ease: EASE.out },
      scrollTrigger: { trigger: '.charbon__stage', start: 'top 80%', once: true },
    });
    assemble
      .from('.charbon__stage', { clipPath: 'inset(100% 0% 0% 0% round 20px)', duration: 1.1, ease: EASE.inOut }, 0)
      .from('.pizza', { rotate: -35, scale: 0.8, autoAlpha: 0, duration: 1.2 }, 0.35)
      .from('.pizza__sauce', { scale: 0.25, svgOrigin: '150 150', autoAlpha: 0, duration: 0.9 }, 0.7)
      .from('.pizza__cheese path', { y: -46, scale: 1.4, autoAlpha: 0, transformOrigin: '50% 50%', duration: 0.6, stagger: 0.06, ease: 'back.out(1.8)' }, 1.0)
      .from('.pizza__basil path', { scale: 0, rotate: -120, transformOrigin: '50% 50%', duration: 0.55, stagger: 0.07, ease: 'back.out(2.2)' }, 1.4)
      .from('.pizza__pepper circle', { scale: 0, transformOrigin: '50% 50%', duration: 0.3, stagger: 0.04 }, 1.7);
    return () => assemble.kill();
  });
}
