import { html, $, $$ } from '../lib/html';
import { icon } from '../lib/icons';
import { restaurant } from '../data/restaurant';
import { gsap, ScrollTrigger } from '../animations/scroll';
import { splitWords } from '../animations/reveal';
import { EASE, MQ } from '../lib/motion';

/** The bridge wordmark: the restaurant's own mark, kept from the original site. */
const wordmark = html`
  <svg class="wordmark" viewBox="0 0 400 200" role="img" aria-label="La Ponte Vecchio, pizzeria">
    <defs><path id="arc" d="M30,128 A420,420 0 0 1 370,128" /></defs>
    <text font-size="44">
      <textPath href="#arc" startOffset="50%" text-anchor="middle" textLength="320" lengthAdjust="spacingAndGlyphs">LA PONTE VECCHIO</textPath>
    </text>
    <path class="wordmark__line" d="M30,142 A420,420 0 0 1 370,142" />
    <path class="wordmark__line" d="M44,186 V150 M44,186 Q95,138 146,186 M146,186 Q200,132 254,186 M254,186 Q305,138 356,186 M356,186 V146" />
    <path class="wordmark__water" d="M20,196 q15,-6 30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0" />
  </svg>
`;

/** A round stamp on the arch, like the ones on a pizza box. Turns slowly while the hero is on screen. */
const stamp = html`
  <svg class="stamp" viewBox="0 0 200 200" aria-hidden="true">
    <defs><path id="stamp-ring" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" /></defs>
    <circle cx="100" cy="100" r="96" class="stamp__disc" />
    <g class="stamp__spin">
      <text><textPath href="#stamp-ring" textLength="462" lengthAdjust="spacing">FAIT MAISON · DEPUIS ${restaurant.since} · PÂTE MATURÉE 48 H ·</textPath></text>
    </g>
    <g class="stamp__pizza">
      <circle cx="100" cy="100" r="34" fill="#E9BE78" />
      <circle cx="100" cy="100" r="27" fill="#C8371F" />
      <circle cx="90" cy="91" r="6" fill="#FBF7EE" /><circle cx="111" cy="96" r="5" fill="#FBF7EE" />
      <circle cx="98" cy="112" r="5.5" fill="#FBF7EE" />
      <path d="M108 84c5 1 8 5 7 9-4 0-8-4-7-9z" fill="#2F6B3A" />
      <path d="M86 106c-1 5-5 8-9 7 0-4 4-8 9-7z" fill="#2F6B3A" />
    </g>
  </svg>
`;

/** Heat rising off the pizza: three wisps that draw upward and fade, on a loop. */
const heat = html`
  <svg class="heat" viewBox="0 0 200 160" preserveAspectRatio="none" aria-hidden="true">
    <path d="M60 160 C50 130 74 112 62 84 S70 40 58 10" />
    <path d="M100 160 C110 128 88 110 102 80 S92 36 104 4" />
    <path d="M140 160 C130 132 152 116 140 88 S148 46 136 14" />
  </svg>
`;

export function renderHero() {
  return html`
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="wrap hero__grid">
        <div class="hero__copy">
          ${wordmark}
          <h1 class="hero__title" id="hero-title">
            Pizzas fines, <mark class="hl hl--gold">pâte dorée</mark> ou <mark class="hl hl--coal">pâte noire</mark>.
          </h1>
          <p class="hero__lede">Une pizzeria familiale au bord de la Vilaine, à <span class="nowrap">Cesson-Sévigné</span>. Sur place ou à emporter.</p>
          <div class="hero__ctas">
            <a class="btn btn--primary btn--lg" href="#reserver">${icon('calendar')}Réserver une table</a>
            <a class="btn btn--ghost btn--lg" href="#carte">Voir la carte${icon('arrowRight')}</a>
          </div>
        </div>

        <div class="hero__media">
          ${stamp}
          <div class="arch">
            ${heat}
            <img
              src="/media/hero.webp"
              alt="Une pizza sort du four sur la pelle, devant les flammes"
              width="1067"
              height="1600"
              fetchpriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  `;
}

export function mountHero(): void {
  const hero = $('.hero');
  const title = $('.hero__title', hero);
  const arch = $('.arch', hero);
  const img = $('img', arch);

  const mm = gsap.matchMedia();
  mm.add(MQ.motion, () => {
    splitWords(title);

    // Entrance: the logo draws itself, then the promise, then the photo opens like an arch.
    const lines = $$<SVGPathElement>('.wordmark__line, .wordmark__water', hero);
    lines.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });

    const flow = gsap.timeline();
    const tl = gsap.timeline({ defaults: { ease: EASE.out } });
    tl.from('.wordmark text', { autoAlpha: 0, y: 12, duration: 0.8 })
      .to(lines, { strokeDashoffset: 0, duration: 1.4, stagger: 0.15, ease: EASE.inOut }, 0.1)
      .from(title.querySelectorAll('.word > span'), { yPercent: 115, duration: 1.1, stagger: 0.05 }, 0.25)
      .from('.hl', { '--hl': 0, duration: 0.9, stagger: 0.2, ease: EASE.inOut }, 0.9)
      // Until the gold arrives, "pâte dorée" wears the headline colour so it's never ink-on-dark.
      .from('.hl--gold', { color: getComputedStyle(title).color, duration: 0.5, ease: 'power1.out' }, 1.15)
      .from(['.hero__lede', '.hero__ctas'], { y: 20, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 0.7)
      .fromTo(arch, { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 0 0)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)', duration: 1.4, ease: EASE.inOut }, 0.2)
      .from(img, { scale: 1.3, duration: 2, ease: EASE.out }, 0.2)
      .from('.stamp', { scale: 0.6, rotate: -90, autoAlpha: 0, duration: 1.1, ease: 'back.out(1.6)' }, 1.1)
      // Once drawn, the river under the bridge keeps flowing.
      .add(() => {
        const water = $<SVGPathElement>('.wordmark__water', hero);
        gsap.set(water, { strokeDasharray: '14 10', strokeDashoffset: 0 });
        flow.add(gsap.to(water, { strokeDashoffset: -48, duration: 1.6, ease: 'none', repeat: -1 }));
      }, 1.6);

    // Loops only run while the hero is on screen.
    const spin = gsap.to('.stamp__spin', { rotate: 360, svgOrigin: '100 100', duration: 24, ease: 'none', repeat: -1 });
    const wisps = $$<SVGPathElement>('.heat path', hero);
    const steam = gsap.timeline({ repeat: -1, delay: 1.8 });
    wisps.forEach((p, i) => {
      const len = p.getTotalLength();
      steam.fromTo(
        p,
        { strokeDasharray: `${len * 0.35} ${len}`, strokeDashoffset: len * 0.35, autoAlpha: 0 },
        {
          keyframes: [
            { autoAlpha: 0.75, duration: 0.8, ease: 'power1.out' },
            { autoAlpha: 0, duration: 1.4, ease: 'power1.in' },
          ],
          strokeDashoffset: -len,
          duration: 2.2,
          ease: 'none',
        },
        i * 0.75,
      );
    });
    const loops = [spin, steam, flow];
    ScrollTrigger.create({
      trigger: hero,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: ({ isActive }) => loops.forEach((l) => (isActive ? l.resume() : l.pause())),
    });

    return () => {
      tl.kill();
      loops.forEach((l) => l.kill());
    };
  });
}
