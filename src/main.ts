import './styles/main.css';

import { html } from './lib/html';
import { bindAnchorLinks, initSmoothScroll, ScrollTrigger } from './animations/scroll';
import { initReveals } from './animations/reveal';
import { initLazyVideos } from './animations/videos';

import { mountNav, renderNav } from './sections/nav';
import { mountHero, renderHero } from './sections/hero';
import { mountMarquee, renderMarquee } from './sections/marquee';
import { mountMenu, renderMenu } from './sections/menu';
import { mountDaily, renderDaily } from './sections/daily';
import { mountCharbon, renderCharbon } from './sections/charbon';
import { mountStory, renderStory } from './sections/story';
import { mountGallery, renderGallery } from './sections/gallery';
import { mountReviews, renderReviews } from './sections/reviews';
import { mountBooking, renderBooking } from './sections/booking';
import { mountInfos, renderInfos } from './sections/infos';
import { mountFooter, renderFooter } from './sections/footer';

/**
 * Page order lives here. Each section exports `renderX()` (markup) and
 * `mountX()` (behaviour + animation), so adding, removing or moving a section
 * is a one-line change in both lists.
 */
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = html`
  ${renderNav()}
  <main>
    ${renderHero()} ${renderMarquee()} ${renderMenu()} ${renderDaily()} ${renderCharbon()} ${renderStory()}
    ${renderGallery()} ${renderReviews()} ${renderBooking()} ${renderInfos()}
  </main>
  ${renderFooter()}
`.value;

initSmoothScroll();
bindAnchorLinks();

// Pinned scenes first (top to bottom) so later triggers measure the added pin spacing.
mountNav();
mountHero();
mountMarquee();
mountMenu();
mountDaily();
mountCharbon();
mountStory();
mountGallery();
mountReviews();
mountBooking();
mountInfos();
mountFooter();

initReveals();
initLazyVideos();

ScrollTrigger.sort();
ScrollTrigger.refresh();

// Honour a deep link like /#reserver once layout and pin spacers exist.
if (location.hash) {
  const target = document.querySelector(location.hash);
  if (target) requestAnimationFrame(() => target.scrollIntoView());
}
