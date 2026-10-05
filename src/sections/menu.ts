import { html, $, $$ } from '../lib/html';
import { icon, type IconName } from '../lib/icons';
import { charcoalSupplement, formatPrice, menu, menuFilters, tagLabels, type Dish, type DishTag } from '../data/menu';
import { gsap } from '../animations/scroll';
import { EASE, reducedMotion } from '../lib/motion';

const tagIcons: Record<DishTag, IconName> = { veg: 'leaf', spicy: 'pepper', new: 'sparkle', signature: 'star' };

const dishItem = (d: Dish) => html`
  <li class="dish" data-tags="${(d.tags ?? []).join(' ')}">
    <div class="dish__head">
      <h3 class="dish__name">${d.name}</h3>
      <span class="dish__leader" aria-hidden="true"></span>
      <span class="dish__price">${formatPrice(d.price)}</span>
    </div>
    <p class="dish__desc">${d.description}</p>
    ${d.tags?.length
      ? html`<ul class="dish__tags" aria-label="Particularités">
          ${d.tags.map((t) => html`<li class="tag tag--${t}">${icon(tagIcons[t])}${tagLabels[t]}</li>`)}
        </ul>`
      : ''}
  </li>
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

        <div class="menu-tools" data-reveal="pop">
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
            ${menuFilters.map(
              (t) => html`<button class="chip" type="button" aria-pressed="false" data-filter="${t}">${icon(tagIcons[t])}${tagLabels[t]}</button>`,
            )}
          </div>
        </div>

        <div class="menu-body">
          <div class="menu-visual" aria-hidden="true" data-reveal="clip">
            ${menu.map(
              (c, i) => html`<img src="${c.image.src}" alt="" loading="lazy" decoding="async" data-visual="${c.id}" class="${i === 0 ? 'is-active' : ''}" />`,
            )}
          </div>

          <div class="menu-panels">
            ${menu.map(
              (c, i) => html`
                <div class="menu-panel" role="tabpanel" id="panel-${c.id}" aria-labelledby="tab-${c.id}" ${i === 0 ? '' : html`hidden`}>
                  <p class="menu-panel__intro">${c.intro}</p>
                  <ul class="dishes" ${i === 0 ? html`data-reveal="rows"` : ''}>${c.dishes.map(dishItem)}</ul>
                  <div class="menu-empty" hidden>
                    <p>Aucun plat de cette catégorie ne correspond à ces filtres.</p>
                    <button class="btn btn--ghost btn--sm" type="button" data-clear-filters>Retirer les filtres</button>
                  </div>
                </div>
              `,
            )}
            <p class="sr-only" aria-live="polite" id="menu-count"></p>
          </div>
        </div>

        <p class="menu-foot" data-reveal>
          ${icon('wine')} Une petite carte de vins italiens accompagne les pizzas. Demandez conseil, on aime en parler.
        </p>
      </div>
    </section>
  `;
}

export function mountMenu(): void {
  const sec = $('#carte');
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

  const animateIn = (els: Element[]): void => {
    if (reducedMotion() || !els.length) return;
    gsap.fromTo(els, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: EASE.out, stagger: 0.035, overwrite: true });
  };

  const applyFilters = (): Element[] => {
    const panel = panelOf(current);
    const items = $$('.dish', panel);
    const shown: Element[] = [];
    for (const item of items) {
      const tags = (item.dataset.tags ?? '').split(' ');
      const visible = [...active].every((t) => tags.includes(t));
      if (visible && item.hidden) shown.push(item);
      item.hidden = !visible;
    }
    const n = items.filter((i) => !i.hidden).length;
    $('.menu-empty', panel).hidden = n > 0;
    count.textContent = `${n} plat${n > 1 ? 's' : ''} affiché${n > 1 ? 's' : ''}`;
    return shown;
  };

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
    // Keep the active tab in view on small screens where tabs scroll sideways.
    tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });

    const id = tab.id.replace('tab-', '');
    $$('[data-visual]', sec).forEach((img) => img.classList.toggle('is-active', img.dataset.visual === id));

    applyFilters();
    animateIn([$('.menu-panel__intro', panel), ...$$('.dish:not([hidden])', panel)]);
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
      animateIn(applyFilters());
    });
  });

  sec.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('[data-clear-filters]')) return;
    active.clear();
    chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
    animateIn(applyFilters());
    chips[0]?.focus();
  });

  movePill(current);
  new ResizeObserver(() => movePill(current)).observe($('.tabs', sec));
  document.fonts?.ready.then(() => movePill(current));
}
