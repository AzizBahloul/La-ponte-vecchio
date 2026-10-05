import { html, $, $$ } from '../lib/html';
import { asset } from '../lib/asset';
import { icon } from '../lib/icons';
import { gallery } from '../data/content';
import { gsap, lockScroll } from '../animations/scroll';
import { EASE, reducedMotion } from '../lib/motion';

export function renderGallery() {
  return html`
    <section class="gallery-sec" id="photos" aria-labelledby="photos-title">
      <div class="wrap">
        <header class="sec-head">
          <h2 id="photos-title" data-reveal="words">La maison en images</h2>
          <p class="sec-head__lede" data-reveal>Le four, la pâte, la salle : un aperçu avant de passer la porte.</p>
        </header>
        <ul class="gallery">
          ${gallery.map(
            (g, i) => html`
              <li class="tile tile--${g.size}">
                <button class="tile__btn" type="button" data-index="${i}" aria-label="Agrandir : ${g.caption}">
                  <span class="tile__frame" data-reveal="clip">
                    <img src="${asset(g.src)}" alt="${g.alt}" loading="lazy" decoding="async" />
                  </span>
                  <span class="tile__caption">${g.caption}${icon('arrowsOut')}</span>
                </button>
              </li>
            `,
          )}
        </ul>
      </div>

      <dialog class="lightbox" aria-label="Photo agrandie">
        <figure class="lightbox__figure">
          <img class="lightbox__img" src="${asset(gallery[0].src)}" alt="${gallery[0].alt}" loading="lazy" decoding="async" />
          <figcaption class="lightbox__bar">
            <span class="lightbox__caption"></span>
            <span class="lightbox__count" aria-live="polite"></span>
          </figcaption>
        </figure>
        <button class="lightbox__nav lightbox__nav--prev" type="button" data-step="-1">${icon('caretLeft')}<span class="sr-only">Photo précédente</span></button>
        <button class="lightbox__nav lightbox__nav--next" type="button" data-step="1">${icon('caretRight')}<span class="sr-only">Photo suivante</span></button>
        <button class="lightbox__close" type="button">${icon('x')}<span class="sr-only">Fermer</span></button>
      </dialog>
    </section>
  `;
}

export function mountGallery(): void {
  const dlg = $<HTMLDialogElement>('.lightbox');
  const img = $<HTMLImageElement>('.lightbox__img', dlg);
  const caption = $('.lightbox__caption', dlg);
  const counter = $('.lightbox__count', dlg);
  let index = 0;
  let opener: HTMLElement | null = null;

  const show = (i: number, dir = 0): void => {
    index = (i + gallery.length) % gallery.length;
    const g = gallery[index];
    const swap = (): void => {
      img.src = asset(g.src);
      img.alt = g.alt;
      caption.textContent = g.caption;
      counter.textContent = `${index + 1} sur ${gallery.length}`;
    };
    if (!dir || reducedMotion()) return swap();
    // Slide in from the side the visitor is heading to: spatial consistency.
    gsap.to(img, {
      x: -dir * 40,
      autoAlpha: 0,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        swap();
        gsap.fromTo(img, { x: dir * 40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.35, ease: EASE.out });
      },
    });
  };

  const open = (i: number, from: HTMLElement): void => {
    opener = from;
    show(i);
    dlg.showModal();
    lockScroll(true);
    if (!reducedMotion()) {
      gsap.fromTo(dlg, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' });
      gsap.fromTo('.lightbox__figure', { scale: 0.96, y: 12 }, { scale: 1, y: 0, duration: 0.4, ease: EASE.out });
    }
  };

  const close = (): void => {
    const done = (): void => {
      dlg.close();
      lockScroll(false);
      opener?.focus();
    };
    if (reducedMotion()) return done();
    gsap.to(dlg, { autoAlpha: 0, duration: 0.15, ease: 'power1.in', onComplete: done });
  };

  $$<HTMLButtonElement>('.tile__btn').forEach((btn) => btn.addEventListener('click', () => open(Number(btn.dataset.index), btn)));
  $$<HTMLButtonElement>('[data-step]', dlg).forEach((b) => b.addEventListener('click', () => show(index + Number(b.dataset.step), Number(b.dataset.step))));
  $('.lightbox__close', dlg).addEventListener('click', close);

  dlg.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) close();
  });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(index + 1, 1);
    if (e.key === 'ArrowLeft') show(index - 1, -1);
  });

  // Swipe on touch screens: a quick flick is enough, no need to drag far.
  let startX = 0;
  let startT = 0;
  img.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    startT = performance.now();
  });
  img.addEventListener('pointerup', (e) => {
    const dx = e.clientX - startX;
    const velocity = Math.abs(dx) / (performance.now() - startT);
    if (Math.abs(dx) > 60 || (Math.abs(dx) > 15 && velocity > 0.11)) {
      const dir = dx < 0 ? 1 : -1;
      show(index + dir, dir);
    }
  });
}
