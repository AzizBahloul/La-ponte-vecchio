import { html, $, $$ } from '../lib/html';
import { asset } from '../lib/asset';
import { icon, type IconName } from '../lib/icons';
import { charcoalSupplement, formatPrice, menu, menuFilters, tagLabels, type Dish, type DishTag, type MenuCategory } from '../data/menu';
import { gsap, ScrollTrigger } from '../animations/scroll';
import { splitWords } from '../animations/reveal';
import { EASE, MQ } from '../lib/motion';

const tagIcons: Record<DishTag, IconName> = { veg: 'leaf', spicy: 'pepper', new: 'sparkle', signature: 'star' };
const legendTags: DishTag[] = ['veg', 'spicy', 'new', 'signature'];

/** A printed menu does not spell out "végétarienne" on every line: a small mark, and a legend at the foot. */
const dishItem = (d: Dish) => html`
  <li class="dish" data-tags="${(d.tags ?? []).join(' ')}">
    <div class="dish__head">
      <h4 class="dish__name">${d.name}</h4>
      ${d.tags?.map((t) => html`<span class="mark mark--${t}" title="${tagLabels[t]}">${icon(tagIcons[t])}<span class="sr-only">${tagLabels[t]}</span></span>`)}
      <span class="dish__leader" aria-hidden="true"></span>
      <span class="dish__price">${formatPrice(d.price)}</span>
    </div>
    <p class="dish__desc">${d.description}</p>
  </li>
`;

/** Rule, small pizza, rule: the divider of a trattoria menu. The pizza turns when the category changes. */
const ornament = html`
  <svg class="orn" viewBox="0 0 160 24" aria-hidden="true">
    <path class="orn__line orn__line--l" d="M2 12 H64" />
    <g class="orn__pizza">
      <circle cx="80" cy="12" r="9.5" fill="#E9BE78" />
      <circle cx="80" cy="12" r="7.4" fill="#C62F1D" />
      <circle cx="77" cy="9.5" r="1.7" fill="#FBF7EE" />
      <circle cx="83.2" cy="11" r="1.5" fill="#FBF7EE" />
      <circle cx="79" cy="15.2" r="1.6" fill="#FBF7EE" />
      <path d="M82 6.6c1.5.3 2.4 1.5 2.1 2.7-1.2 0-2.3-1.2-2.1-2.7z" fill="#2E7D3A" />
    </g>
    <path class="orn__line orn__line--r" d="M96 12 H158" />
  </svg>
`;

const panel = (c: MenuCategory, i: number) => html`
  <div class="menu-panel" role="tabpanel" id="panel-${c.id}" aria-labelledby="tab-${c.id}" ${i === 0 ? '' : html`hidden`}>
    <div class="carte__cover">
      <div class="carte__head">
        <h3 class="carte__title">${c.label}</h3>
        ${ornament}
        <p class="menu-panel__intro">${c.intro}</p>
      </div>
      <figure class="carte__photo"><img src="${asset(c.image.src)}" alt="" loading="lazy" decoding="async" /></figure>
    </div>
    <div class="carte__list">
      <ul class="dishes">${c.dishes.map(dishItem)}</ul>
      <div class="menu-empty" hidden>
        <p>Aucun plat de cette catégorie ne correspond à ces filtres.</p>
        <button class="btn btn--ghost btn--sm" type="button" data-clear-filters>Retirer les filtres</button>
      </div>
    </div>
  </div>
`;

export function renderMenu() {
  return html`
    <section class="menu-sec" id="carte" aria-labelledby="carte-title">
      <div class="wrap">
        <header class="sec-head">
          <h2 id="carte-title" data-reveal="words">La carte</h2>
          <p class="sec-head__lede" data-reveal>
            Toutes nos pizzas existent en pâte classique ou en pâte au charbon végétal (+${formatPrice(charcoalSupplement)}).
          </p>
        </header>

        <div class="carte">
          <div class="carte__edge" aria-hidden="true"></div>
          <div class="carte__frame" aria-hidden="true"><i class="rule rule--t"></i><i class="rule rule--r"></i><i class="rule rule--b"></i><i class="rule rule--l"></i></div>

          <div class="carte__tools">
            <div class="tabs" role="tablist" aria-label="Catégories de la carte">
              <span class="tabs__pill" aria-hidden="true"></span>
              ${menu.map(
                (c, i) => html`<button
                  class="tabs__tab"
                  role="tab"
                  id="tab-${c.id}"
                  aria-controls="panel-${c.id}"
                  aria-selected="${i === 0 ? 'true' : 'false'}"
                  tabindex="${i === 0 ? '0' : '-1'}"
                  type="button"
                >${c.label}</button>`,
              )}
            </div>
            <div class="filters" role="group" aria-label="Filtrer la carte">
              <span class="filters__label" aria-hidden="true">Filtrer</span>
              ${menuFilters.map(
                (t) => html`<button class="filter" type="button" aria-pressed="false" data-filter="${t}">${icon(tagIcons[t])}${tagLabels[t]}</button>`,
              )}
            </div>
          </div>

          <div class="carte__body">
            ${menu.map(panel)}
            <p class="sr-only" aria-live="polite" id="menu-count"></p>
          </div>

          <footer class="carte__foot">
            <ul class="legend" aria-hidden="true">
              ${legendTags.map((t) => html`<li class="mark mark--${t}">${icon(tagIcons[t])}<span>${tagLabels[t]}</span></li>`)}
            </ul>
            <p class="carte__wine">${icon('wine')} Une petite carte de vins italiens accompagne les pizzas. Demandez conseil, on aime en parler.</p>
          </footer>
        </div>
      </div>
    </section>
  `;
}

export function mountMenu(): void {
  const sec = $('#carte');
  const card = $('.carte', sec);
  const tabs = $$<HTMLButtonElement>('[role="tab"]', sec);
  const pill = $('.tabs__pill', sec);
  const chips = $$<HTMLButtonElement>('[data-filter]', sec);
  const count = $('#menu-count', sec);
  const active = new Set<DishTag>();
  let current = tabs[0];

  const movePill = (tab: HTMLElement): void => {
    // 2D so it also works when the tabs wrap into a 2×2 grid on phones.
    pill.style.width = `${tab.offsetWidth}px`;
    pill.style.height = `${tab.offsetHeight}px`;
    pill.style.transform = `translate(${tab.offsetLeft}px, ${tab.offsetTop}px)`;
  };

  const panelOf = (tab: HTMLElement): HTMLElement => $(`#${tab.getAttribute('aria-controls')}`, sec);

  /** Filtering is a plain show/hide: the list answers at once and nothing replays. */
  const applyFilters = (): void => {
    const panel = panelOf(current);
    const items = $$('.dish', panel);
    for (const item of items) {
      const tags = (item.dataset.tags ?? '').split(' ');
      item.hidden = ![...active].every((t) => tags.includes(t));
    }
    const n = items.filter((i) => !i.hidden).length;
    $('.menu-empty', panel).hidden = n > 0;
    count.textContent = `${n} plat${n > 1 ? 's' : ''} affiché${n > 1 ? 's' : ''}`;
  };

  // ——— Motion: the menu writes itself. Rules are drawn, then each row: name, leader out to the price, price. ———
  const mm = gsap.matchMedia();
  // Assigned inside the motion context below; the cast stops TypeScript narrowing it to `null`.
  let write = null as ((panel: HTMLElement, fast?: boolean) => void) | null;

  mm.add(MQ.motion, () => {
    const titles = $$('.carte__title', sec);
    titles.forEach(splitWords);

    /** The cover of a page: title rises, the rules run out from the little pizza, the photo is unwrapped. */
    const cover = (tl: gsap.core.Timeline, panel: HTMLElement, k: number): void => {
      tl.from($$('.carte__title .word > span', panel), { yPercent: 115, duration: 0.85 * k, stagger: 0.05 * k }, 0)
        .from($$('.orn__line', panel), { scaleX: 0, duration: 0.75 * k, transformOrigin: (i: number) => (i ? '0% 50%' : '100% 50%') }, 0.1 * k)
        .from($('.orn__pizza', panel), { rotate: -200, scale: 0.4, transformOrigin: '50% 50%', autoAlpha: 0, duration: 0.95 * k, ease: 'back.out(1.5)' }, 0.1 * k)
        .from($('.menu-panel__intro', panel), { y: 12, autoAlpha: 0, duration: 0.75 * k }, 0.25 * k)
        .fromTo($('.carte__photo', panel), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.05 * k, ease: EASE.inOut, clearProps: 'clipPath' }, 0.2 * k)
        .from($('.carte__photo img', panel), { scale: 1.25, duration: 1.4 * k }, 0.2 * k);
    };

    /** Changing category: the new page writes itself, a little faster than the first one. */
    write = (panel, fast = true) => {
      const k = fast ? 0.6 : 1;
      const tl = gsap.timeline({ defaults: { ease: EASE.out } });
      cover(tl, panel, k);
      rows($$('.dish:not([hidden])', panel).slice(0, 9), tl, 0.3 * k, fast);
    };

    /** Name appears, the dotted leader runs to the right, the price lands at the end of it. */
    const rows = (items: Element[], tl: gsap.core.Timeline, at: number, fast: boolean): void => {
      const k = fast ? 0.6 : 1;
      items.forEach((row, i) => {
        const t = at + i * 0.055 * k;
        tl.from($$('.dish__name, .mark', row), { y: 8, autoAlpha: 0, duration: 0.5 * k }, t)
          .from($('.dish__leader', row), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.6 * k, ease: 'power2.out' }, t + 0.08 * k)
          .from($('.dish__price', row), { scale: 0.6, autoAlpha: 0, transformOrigin: '100% 50%', duration: 0.45 * k, ease: 'back.out(2)' }, t + 0.4 * k)
          .from($('.dish__desc', row), { y: 6, autoAlpha: 0, duration: 0.5 * k }, t + 0.12 * k);
      });
    };

    // Entrance: once, as the card comes into view. The paper unrolls, then its frame is ruled around it.
    const first = $<HTMLElement>('.menu-panel:not([hidden])', sec);
    const intro = gsap.timeline({
      paused: true,
      defaults: { ease: EASE.out },
      onComplete: () => void gsap.set(card, { clearProps: 'clipPath' }),
    });
    intro
      .fromTo(card, { clipPath: 'inset(0% 0% 100% 0% round 20px)' }, { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.1, ease: EASE.inOut })
      .from($('.carte__edge', card), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.9 }, 0.15)
      .from($$('.rule--t, .rule--b', card), { scaleX: 0, duration: 1, ease: EASE.inOut, transformOrigin: (i: number) => (i ? '100% 50%' : '0% 50%') }, 0.35)
      .from($$('.rule--r, .rule--l', card), { scaleY: 0, duration: 1, ease: EASE.inOut, transformOrigin: (i: number) => (i ? '50% 100%' : '50% 0%') }, 0.35)
      .from($('.carte__tools', card), { y: 14, autoAlpha: 0, duration: 0.7 }, 0.55)
      .from($('.carte__foot', card), { y: 14, autoAlpha: 0, duration: 0.7 }, 0.9);
    // Only the cover and the first rows are written on entrance; rows further down write themselves as they arrive.
    const entry = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });
    cover(entry, first, 1);

    const dishes = $$('.dish', first);
    dishes.forEach((row) => gsap.set($$('.dish__name, .mark, .dish__desc, .dish__price', row), { autoAlpha: 0 }));
    dishes.forEach((row) => gsap.set($('.dish__leader', row), { scaleX: 0, transformOrigin: '0% 50%' }));

    ScrollTrigger.create({
      trigger: card,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        intro.play();
        gsap.delayedCall(0.5, () => entry.play());
      },
    });
    // Each row writes itself when it reaches the lower part of the screen.
    ScrollTrigger.batch(dishes, {
      start: 'top 92%',
      once: true,
      interval: 0.1,
      onEnter: (batch) => {
        const tl = gsap.timeline({ defaults: { ease: EASE.out } });
        batch.forEach((row, i) => {
          const t = i * 0.07;
          tl.to($$('.dish__name, .mark, .dish__desc', row), { autoAlpha: 1, y: 0, startAt: { y: 8 }, duration: 0.5 }, t)
            .to($('.dish__leader', row), { scaleX: 1, duration: 0.6, ease: 'power2.out' }, t + 0.08)
            .to($('.dish__price', row), { autoAlpha: 1, scale: 1, startAt: { scale: 0.6, transformOrigin: '100% 50%' }, duration: 0.45, ease: 'back.out(2)' }, t + 0.4);
        });
      },
    });

    return () => {
      intro.kill();
      entry.kill();
    };
  });

  const select = (tab: HTMLButtonElement, focus = false): void => {
    if (tab === current) return;
    current.setAttribute('aria-selected', 'false');
    current.tabIndex = -1;
    panelOf(current).hidden = true;

    tab.setAttribute('aria-selected', 'true');
    tab.tabIndex = 0;
    if (focus) tab.focus();
    const panel = panelOf(tab);
    panel.hidden = false;
    current = tab;
    movePill(tab);
    applyFilters();
    write?.(panel);
    ScrollTrigger.refresh();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const keys: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      select(tabs[(keys[e.key] + tabs.length) % tabs.length], true);
    });
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const t = chip.dataset.filter as DishTag;
      const on = !active.has(t);
      on ? active.add(t) : active.delete(t);
      chip.setAttribute('aria-pressed', String(on));
      applyFilters();
    });
  });

  sec.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('[data-clear-filters]')) return;
    active.clear();
    chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
    applyFilters();
    chips[0]?.focus();
  });

  movePill(current);
  new ResizeObserver(() => movePill(current)).observe($('.tabs', sec));
  document.fonts?.ready.then(() => movePill(current));
}
