import { html, $ } from '../lib/html';
import { icon } from '../lib/icons';
import { navLinks, restaurant } from '../data/restaurant';
import { gsap, ScrollTrigger } from '../animations/scroll';
import { MQ } from '../lib/motion';

export function renderFooter() {
  const year = new Date().getFullYear();
  return html`
    <footer class="footer">
      <div class="wrap">
        <div class="footer__cta">
          <p class="footer__big" aria-hidden="true">La Ponte Vecchio</p>
          <a class="btn btn--sun btn--lg" href="#reserver">${icon('calendar')}Réserver une table</a>
        </div>
        <div class="footer__cols">
          <div>
            <h3>Adresse</h3>
            <p>${restaurant.address.street}<br /><span class="nowrap">${restaurant.address.postalCode} ${restaurant.address.city}</span></p>
          </div>
          <div>
            <h3>Téléphone</h3>
            <p><a href="${restaurant.phone.href}">${restaurant.phone.display}</a></p>
          </div>
          <div>
            <h3>Le site</h3>
            <ul>${navLinks.map((l) => html`<li><a href="${l.href}">${l.label}</a></li>`)}</ul>
          </div>
        </div>
        <div class="footer__legal">
          <p>© ${year} ${restaurant.name}. Mentions légales et confidentialité à venir.</p>
          <p>
            Site de démonstration : carte, prix, avis et photos sont indicatifs. Photos
            <a href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</a>,
            <a href="https://www.pexels.com" target="_blank" rel="noopener">Pexels</a>, vidéos
            <a href="https://mixkit.co" target="_blank" rel="noopener">Mixkit</a>.
          </p>
        </div>
      </div>
    </footer>

    <div class="callbar">
      <a class="btn btn--primary" href="#reserver">${icon('calendar')}Réserver</a>
      <a class="btn btn--ghost" href="${restaurant.phone.href}">${icon('phone')}Appeler</a>
    </div>
  `;
}

export function mountFooter(): void {
  const callbar = $('.callbar');
  // The mobile call bar steps aside while the hero (which has the same two buttons) or the
  // booking form is on screen, so it never doubles the CTAs or covers the submit button.
  const away = { hero: false, booking: false };
  const sync = (): void => {
    callbar.classList.toggle('is-away', away.hero || away.booking);
  };
  ScrollTrigger.create({
    trigger: '.hero__ctas',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: ({ isActive }) => ((away.hero = isActive), sync()),
    onRefresh: ({ isActive }) => ((away.hero = isActive), sync()),
  });
  ScrollTrigger.create({
    trigger: '#reserver',
    start: 'top 80%',
    end: 'bottom 20%',
    onToggle: ({ isActive }) => ((away.booking = isActive), sync()),
    onRefresh: ({ isActive }) => ((away.booking = isActive), sync()),
  });

  const mm = gsap.matchMedia();
  mm.add(MQ.motion, () => {
    // The big name arrives letter by letter, each swinging up from below the footer line.
    const big = $('.footer__big');
    const text = big.textContent ?? '';
    big.replaceChildren(
      ...[...text].map((ch) => {
        const span = document.createElement('span');
        span.textContent = ch === ' ' ? '\u00a0' : ch;
        span.style.display = 'inline-block';
        return span;
      }),
    );
    gsap.from(big.children, {
      yPercent: 110,
      rotate: (i: number) => (i % 2 ? 8 : -8),
      autoAlpha: 0,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.045,
      scrollTrigger: { trigger: '.footer', start: 'top 80%', once: true },
    });
  });
}
