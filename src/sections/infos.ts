import { html, $ } from '../lib/html';
import { asset } from '../lib/asset';
import { icon } from '../lib/icons';
import { displayWeek, openingHours, restaurant, services, weekDays } from '../data/restaurant';
import { formatMinutes, parisNow } from '../lib/time';

const hoursCell = (day: number) => {
  const slots = openingHours[day];
  if (!slots) return html`<td class="is-closed">Fermé</td>`;
  return html`<td>${slots.map(([a, b], i) => html`${i ? html`<br />` : ''}${formatMinutes(a)} à ${formatMinutes(b)}`)}</td>`;
};

export function renderInfos() {
  const { lat, lng } = restaurant.geo;
  const d = 0.006;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d / 2}%2C${lng + d}%2C${lat + d / 2}&layer=mapnik&marker=${lat}%2C${lng}`;
  const today = parisNow().day;

  return html`
    <section class="infos" id="infos" aria-labelledby="infos-title">
      <div class="wrap">
        <header class="sec-head">
          <h2 id="infos-title" data-reveal="words">Horaires et accès</h2>
          <p class="sec-head__lede" data-reveal>Sur place ou à emporter, du mardi au vendredi.</p>
        </header>

        <div class="infos__grid">
          <div class="infos__block" data-reveal="left">
            <h3>${icon('clock')}Horaires</h3>
            <table class="hours">
              <caption class="sr-only">Horaires d’ouverture</caption>
              <tbody>
                ${displayWeek.map(
                  (d) => html`<tr class="${d === today ? 'is-today' : ''}">
                    <th scope="row">${weekDays[d]}${d === today ? html`<span class="hours__today">aujourd’hui</span>` : ''}</th>
                    ${hoursCell(d)}
                  </tr>`,
                )}
              </tbody>
            </table>
          </div>

          <div class="infos__block infos__map" data-reveal="up">
            <h3>${icon('mapPin')}Nous trouver</h3>
            <address>${restaurant.address.street}<br />${restaurant.address.postalCode} ${restaurant.address.city}</address>
            <p>Au cœur du bourg, le long de la Vilaine.</p>
            <div class="map" data-src="${mapSrc}">
              <img src="${asset('/media/devanture.webp')}" alt="" loading="lazy" decoding="async" />
              <button class="btn btn--light btn--sm" type="button">${icon('mapPin')}Afficher la carte</button>
              <span class="map__note">La carte est chargée depuis OpenStreetMap.</span>
            </div>
            <a class="link" href="${restaurant.mapsUrl}" target="_blank" rel="noopener">Ouvrir l’itinéraire${icon('arrowUpRight')}</a>
          </div>

          <div class="infos__block" data-reveal="right">
            <h3>${icon('phone')}Appeler ou emporter</h3>
            <a class="tel-big" href="${restaurant.phone.href}">${restaurant.phone.display}</a>
            <p>Pour emporter, commandez par téléphone : on vous dit à quelle heure passer.</p>
            <ul class="services">
              ${services.map((s) => html`<li>${icon(s.icon)}<span><strong>${s.label}</strong>${s.detail}</span></li>`)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  `;
}

/** The map is only loaded on demand: no third-party request until the visitor asks. */
export function mountInfos(): void {
  const map = $('.map');
  $('button', map).addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = map.dataset.src!;
    iframe.title = 'Carte : La Ponte Vecchio à Cesson-Sévigné';
    iframe.loading = 'lazy';
    map.replaceChildren(iframe);
    map.classList.add('is-loaded');
  });
}
