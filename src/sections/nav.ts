import { html, $, $$ } from '../lib/html';
import { icon } from '../lib/icons';
import { navLinks, restaurant } from '../data/restaurant';
import { openStatus } from '../lib/time';
import { gsap, ScrollTrigger, lockScroll } from '../animations/scroll';
import { EASE, reducedMotion } from '../lib/motion';

/** Reading progress as a pizza: one slice disappears for every eighth of the page. */
const SLICES = 8;
const slice = (i: number): string => {
  const a0 = (i / SLICES) * Math.PI * 2 - Math.PI / 2;
  const a1 = ((i + 1) / SLICES) * Math.PI * 2 - Math.PI / 2;
  const pt = (a: number, r: number): string => `${(12 + Math.cos(a) * r).toFixed(2)},${(12 + Math.sin(a) * r).toFixed(2)}`;
  return `M12,12 L${pt(a0, 11)} A11,11 0 0 1 ${pt(a1, 11)} Z`;
};
const progressPizza = html`
  <svg class="brand__pizza" viewBox="0 0 24 24" aria-hidden="true">
    ${Array.from({ length: SLICES }, (_, i) => html`<path class="brand__slice" d="${slice(i)}" />`)}
  </svg>
`;

export function renderNav() {
  return html`
    <header class="nav">
      <div class="wrap nav__inner">
        <a class="brand" href="#top" aria-label="La Ponte Vecchio, retour en haut">${progressPizza}La Ponte Vecchio</a>
        <nav class="nav__links" aria-label="Navigation principale">
          <span class="nav__pill" aria-hidden="true"></span>
          <ul>
            ${navLinks.map((l) => html`<li><a href="${l.href}" data-nav-link>${l.label}</a></li>`)}
          </ul>
        </nav>
        <span class="status" id="status" aria-live="polite"><span class="status__dot"></span><span class="status__label">Horaires</span></span>
        <a class="btn btn--primary btn--sm nav__cta" href="#reserver">Réserver</a>
        <button class="nav__burger" type="button" aria-expanded="false" aria-controls="sheet">
          ${icon('list')}<span class="sr-only">Ouvrir le menu</span>
        </button>
      </div>
    </header>

    <div class="sheet" id="sheet" hidden>
      <div class="sheet__top wrap">
        <span class="brand">La Ponte Vecchio</span>
        <button class="sheet__close" type="button" data-close-sheet>${icon('x')}<span class="sr-only">Fermer le menu</span></button>
      </div>
      <nav class="sheet__links wrap" aria-label="Menu mobile">
        <ul>
          ${navLinks.map((l) => html`<li><a href="${l.href}" data-close-sheet>${l.label}</a></li>`)}
          <li><a href="#reserver" data-close-sheet>Réserver une table</a></li>
        </ul>
      </nav>
      <div class="sheet__foot wrap">
        <a class="btn btn--primary" href="${restaurant.phone.href}">${icon('phone')}${restaurant.phone.display}</a>
        <p>${restaurant.address.street}, ${restaurant.address.city}</p>
      </div>
    </div>
  `;
}

export function mountNav(): void {
  const nav = $('.nav');
  const status = $('#status');

  const updateStatus = (): void => {
    const s = openStatus();
    status.classList.toggle('is-open', s.open);
    $('.status__label', status).textContent = s.label;
  };
  updateStatus();
  setInterval(updateStatus, 60_000);

  // The bar never hides. Once the page has moved it firms up a little and gains a soft shadow.
  ScrollTrigger.create({
    start: 'top -24',
    end: 'max',
    onToggle: ({ isActive }) => nav.classList.toggle('is-scrolled', isActive),
  });

  // Sliding highlight: follows the pointer or keyboard focus, and rests on the current section.
  const links = $$<HTMLAnchorElement>('[data-nav-link]');
  const pill = $('.nav__pill', nav);
  const linksBox = $('.nav__links', nav);
  let hovered: HTMLAnchorElement | null = null;
  let placed = false;
  const activeLink = (): HTMLAnchorElement | null => links.find((l) => l.hasAttribute('aria-current')) ?? null;

  const place = (): void => {
    const target = hovered ?? activeLink();
    pill.classList.toggle('is-hover', !!hovered);
    if (!target || target.offsetWidth === 0) {
      pill.classList.remove('is-on');
      return;
    }
    // First placement jumps into position; after that it glides.
    const first = !placed;
    pill.classList.toggle('is-instant', first);
    pill.style.width = `${target.offsetWidth}px`;
    pill.style.transform = `translateX(${target.offsetLeft}px)`;
    pill.classList.add('is-on');
    placed = true;
    if (first) requestAnimationFrame(() => requestAnimationFrame(() => pill.classList.remove('is-instant')));
  };
  links.forEach((link) => {
    link.addEventListener('pointerenter', () => ((hovered = link), place()));
    link.addEventListener('focus', () => ((hovered = link), place()));
  });
  linksBox.addEventListener('pointerleave', () => ((hovered = null), place()));
  linksBox.addEventListener('focusout', () => ((hovered = null), place()));
  new ResizeObserver(place).observe(linksBox);
  document.fonts?.ready.then(place);

  // Current section indicator.
  links.forEach((link) => {
    const section = document.querySelector(link.getAttribute('href')!);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: ({ isActive }) => {
        if (!isActive) link.removeAttribute('aria-current');
        else {
          links.forEach((l) => l.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'location');
        }
        place();
      },
    });
  });

  // The call to action leans a few pixels toward the cursor, like a button that wants to be pressed.
  const cta = $('.nav__cta', nav);
  if (!reducedMotion() && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const qx = gsap.quickTo(cta, 'x', { duration: 0.4, ease: 'power3.out' });
    const qy = gsap.quickTo(cta, 'y', { duration: 0.4, ease: 'power3.out' });
    cta.addEventListener('pointermove', (e) => {
      const r = cta.getBoundingClientRect();
      qx(((e.clientX - (r.left + r.width / 2)) / r.width) * 10);
      qy(((e.clientY - (r.top + r.height / 2)) / r.height) * 8);
    });
    cta.addEventListener('pointerleave', () => (qx(0), qy(0)));
  }

  mountSheet();
}

function mountSheet(): void {
  const sheet = $('#sheet');
  const burger = $<HTMLButtonElement>('.nav__burger');
  const items = $$('.sheet__links li, .sheet__foot > *', sheet);

  const open = (): void => {
    sheet.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    lockScroll(true);
    if (!reducedMotion()) {
      gsap.fromTo(sheet, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.5, ease: EASE.inOut });
      gsap.fromTo(items, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: EASE.out, stagger: 0.04, delay: 0.15 });
    }
    $<HTMLAnchorElement>('a', sheet).focus();
  };

  const close = (): void => {
    burger.setAttribute('aria-expanded', 'false');
    lockScroll(false);
    const done = (): void => {
      sheet.hidden = true;
    };
    if (reducedMotion()) return done();
    // Exit faster than the entrance: the system is responding, not presenting.
    gsap.to(sheet, { clipPath: 'inset(0 0 100% 0)', duration: 0.3, ease: 'power2.in', onComplete: done });
  };

  burger.addEventListener('click', open);
  sheet.addEventListener('click', (e) => {
    if ((e.target as Element).closest('[data-close-sheet]')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !sheet.hidden) {
      close();
      burger.focus();
    }
  });

  // The pizza in the brand gets eaten as you read down the page.
  const slices = $$('.brand__slice');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: ({ progress }) => {
      const eaten = Math.min(SLICES - 1, Math.floor(progress * SLICES));
      slices.forEach((el, i) => el.classList.toggle('is-eaten', i >= SLICES - eaten));
    },
  });
}
