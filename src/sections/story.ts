import { html, $, $$ } from '../lib/html';
import { story, type StoryStep } from '../data/content';
import { gsap } from '../animations/scroll';
import { EASE, MQ } from '../lib/motion';

const media = (m: StoryStep['media']) =>
  m.type === 'video'
    ? html`<video muted loop playsinline preload="none" data-autoplay data-src="${m.src}" poster="${m.poster}" aria-label="${m.alt}"></video>`
    : html`<img src="${m.src}" alt="${m.alt}" loading="lazy" decoding="async" />`;

export function renderStory() {
  return html`
    <section class="story" id="savoir-faire" aria-labelledby="story-title">
      <div class="story__pin">
        <header class="wrap story__head">
          <h2 id="story-title" data-reveal="words">De la pâte au four</h2>
          <p data-reveal>Les mêmes gestes, chaque jour, avant le service.</p>
        </header>
        <div class="story__viewport">
          <ol class="story__track" data-reveal="stagger">
            ${story.map(
              (s) => html`
                <li class="step">
                  <div class="step__media">${media(s.media)}</div>
                  <div class="step__body">
                    <h3>${s.title}</h3>
                    <p>${s.text}</p>
                    <span class="step__figure">${s.figure}</span>
                  </div>
                </li>
              `,
            )}
          </ol>
        </div>
      </div>
    </section>
  `;
}

export function mountStory(): void {
  // Cards arrive through data-reveal="stagger"; inside each, the photo settles from a slight zoom.
  const mm = gsap.matchMedia();
  mm.add(MQ.motion, () => {
    $$('.step').forEach((step, i) => {
      gsap.from($('.step__media > :is(video, img)', step), {
        scale: 1.18,
        duration: 1.6,
        delay: i * 0.08,
        ease: EASE.out,
        scrollTrigger: { trigger: '.story__track', start: 'top 85%', once: true },
      });
    });
  });
}
