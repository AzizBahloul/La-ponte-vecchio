import { html, $ } from '../lib/html';
import { icon } from '../lib/icons';
import { reviews } from '../data/content';
import { restaurant } from '../data/restaurant';
import { gsap } from '../animations/scroll';
import { EASE, MQ } from '../lib/motion';

/** First letter of the first and last word ("Pierre-Yves Lamour" → "PL"), grapheme-safe. */
const initials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  const first = (w: string): string => [...new Intl.Segmenter('fr', { granularity: 'grapheme' }).segment(w)][0]?.segment ?? '';
  const picked = words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return picked.map(first).join('').toUpperCase();
};

/** Five stars; a fractional score (4,6) fills the last star partially. */
const stars = (n: number, label = true) => html`
  <span class="stars" ${label ? html`role="img" aria-label="${n.toLocaleString('fr-FR')} sur 5"` : html`aria-hidden="true"`}>
    ${[1, 2, 3, 4, 5].map((i) => {
      const fill = Math.max(0, Math.min(1, n - i + 1));
      if (fill === 1) return html`<span class="is-on">${icon('star')}</span>`;
      if (fill === 0) return html`<span>${icon('star')}</span>`;
      return html`<span class="is-part" style="--fill: ${Math.round(fill * 100)}%">${icon('star')}${icon('star')}</span>`;
    })}
  </span>
`;

const score = restaurant.rating.score.toLocaleString('fr-FR', { minimumFractionDigits: 1 });

export function renderReviews() {
  return html`
    <section class="reviews" id="avis" aria-labelledby="avis-title">
      <div class="wrap">
        <header class="reviews__head">
          <h2 id="avis-title" data-reveal="words">Ce qu’en disent nos clients</h2>
          <div class="score" data-reveal="pop">
            <span class="score__value" data-count="${restaurant.rating.score}">${score}</span>
            <div>
              ${stars(restaurant.rating.score, false)}
              <p>sur ${restaurant.rating.count} avis Google</p>
            </div>
          </div>
        </header>
      </div>

      <div class="carousel" role="region" aria-roledescription="carrousel" aria-label="Avis clients">
        <ul class="carousel__track" data-reveal="deal">
          ${reviews.map(
            (r) => html`
              <li class="review">
                <div class="review__top">
                  ${stars(r.rating)}
                  ${r.dough === 'charbon' ? html`<span class="review__dough">Pâte noire</span>` : ''}
                </div>
                <blockquote><p>${r.text}</p></blockquote>
                <footer class="review__foot">
                  <span class="avatar" aria-hidden="true">${initials(r.author)}</span>
                  <span><strong>${r.author}</strong><span class="review__when">${r.when}</span></span>
                </footer>
              </li>
            `,
          )}
        </ul>
        <div class="wrap carousel__controls">
          <button class="round-btn" type="button" data-dir="-1">${icon('caretLeft')}<span class="sr-only">Avis précédents</span></button>
          <button class="round-btn" type="button" data-dir="1">${icon('caretRight')}<span class="sr-only">Avis suivants</span></button>
        </div>
      </div>
    </section>
  `;
}

export function mountReviews(): void {
  const track = $('.carousel__track');
  const prev = $<HTMLButtonElement>('[data-dir="-1"]');
  const next = $<HTMLButtonElement>('[data-dir="1"]');

  const update = (): void => {
    prev.disabled = track.scrollLeft < 8;
    next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
  };
  [prev, next].forEach((b) =>
    b.addEventListener('click', () => {
      const card = track.querySelector<HTMLElement>('.review')!;
      track.scrollBy({ left: Number(b.dataset.dir) * (card.offsetWidth + 20), behavior: 'smooth' });
    }),
  );
  track.addEventListener('scroll', update, { passive: true });
  update();

  // Mouse users can grab and drag the row like on a phone.
  let down = false;
  let startX = 0;
  let startScroll = 0;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    down = true;
    startX = e.clientX;
    startScroll = track.scrollLeft;
    track.classList.add('is-dragging');
  });
  window.addEventListener('pointermove', (e) => {
    if (down) track.scrollLeft = startScroll - (e.clientX - startX);
  });
  window.addEventListener('pointerup', () => {
    down = false;
    track.classList.remove('is-dragging');
  });

  const mm = gsap.matchMedia();
  mm.add(MQ.motion, () => {
    // The score counts up once, so the number lands with some weight.
    const el = $('.score__value');
    const target = Number(el.dataset.count);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: EASE.out,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => (el.textContent = obj.v.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })),
    });
    gsap.from('.score .stars span', {
      scale: 0.6,
      autoAlpha: 0,
      duration: 0.5,
      ease: 'back.out(2)',
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}
