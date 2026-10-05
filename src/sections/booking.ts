import { html, $, $$ } from '../lib/html';
import { icon } from '../lib/icons';
import { bookingConfig, isSlotFull, slots, type Service } from '../data/booking';
import { openDays, restaurant } from '../data/restaurant';
import { addDays, dayOfIso, formatDate, formatSlot, parisNow, toMinutes } from '../lib/time';
import { gsap } from '../animations/scroll';
import { EASE, reducedMotion } from '../lib/motion';

interface Booking {
  date: string;
  service: Service;
  time: string;
  guests: number;
  name: string;
  phone: string;
  note: string;
}

/** Next N open days, starting today if the restaurant is open today. */
function upcomingOpenDays(n: number): string[] {
  const out: string[] = [];
  let d = parisNow().iso;
  while (out.length < n) {
    if (openDays.includes(dayOfIso(d))) out.push(d);
    d = addDays(d, 1);
  }
  return out;
}

export function renderBooking() {
  const days = upcomingOpenDays(bookingConfig.quickDays);
  const today = parisNow().iso;
  return html`
    <section class="booking" id="reserver" aria-labelledby="resa-title">
      <div class="wrap booking__grid">
        <aside class="booking__aside">
          <h2 id="resa-title" data-reveal="words">Réserver une table</h2>
          <p data-reveal="left">Choisissez votre jour et votre heure : nous vous rappelons pour confirmer.</p>
          <div class="summary" aria-live="polite" data-reveal="pop">
            <span class="summary__label">Votre demande</span>
            <p class="summary__text" id="summary"></p>
          </div>
          <p class="booking__call" data-reveal="left">
            Plus de ${restaurant.maxGuestsOnline} personnes, ou pour ce soir ? Le plus simple reste de nous appeler.
            <a class="tel-big" href="${restaurant.phone.href}">${icon('phone')}${restaurant.phone.display}</a>
          </p>
        </aside>

        <div class="booking__main" data-reveal="right">
          <form class="form" id="booking-form" novalidate>
            <fieldset class="field" id="f-date">
              <legend>Jour</legend>
              <div class="date-chips">
                ${days.map(
                  (d, i) => html`
                    <label class="date-chip">
                      <input type="radio" name="date" value="${d}" ${i === 0 ? html`checked` : ''} />
                      <span class="date-chip__dow">${d === today ? 'Aujourd’hui' : formatDate(d, { weekday: 'short' })}</span>
                      <span class="date-chip__day">${formatDate(d, { day: 'numeric' })}</span>
                      <span class="date-chip__month">${formatDate(d, { month: 'short' })}</span>
                    </label>
                  `,
                )}
                <label class="date-chip date-chip--other">
                  <input type="radio" name="date" value="other" />
                  <span class="date-chip__dow">Autre</span>
                  ${icon('calendar')}
                  <span class="date-chip__month">date</span>
                </label>
              </div>
              <div class="other-date" hidden>
                <label for="r-date">Choisir une date</label>
                <input type="date" id="r-date" min="${today}" max="${addDays(today, bookingConfig.maxDaysAhead)}" />
                <span class="hint">Ouvert du mardi au vendredi</span>
              </div>
              <span class="err" id="e-date"></span>
            </fieldset>

            <div class="form__row form__row--pair">
              <fieldset class="field">
                <legend>Service</legend>
                <div class="segmented">
                  <label><input type="radio" name="service" value="midi" checked /><span>Midi</span></label>
                  <label><input type="radio" name="service" value="soir" /><span>Soir</span></label>
                </div>
              </fieldset>

              <div class="field">
                <span class="field__label" id="lbl-guests">Personnes</span>
                <div class="stepper" role="group" aria-labelledby="lbl-guests">
                  <button type="button" data-guests="-1">${icon('minus')}<span class="sr-only">Une personne de moins</span></button>
                  <output id="guests" aria-live="polite">2</output>
                  <button type="button" data-guests="1">${icon('plus')}<span class="sr-only">Une personne de plus</span></button>
                </div>
                <span class="hint" id="guests-hint"></span>
              </div>
            </div>

            <fieldset class="field" id="f-time">
              <legend>Heure d’arrivée</legend>
              <div class="slots" id="slots"></div>
              <span class="err" id="e-time"></span>
            </fieldset>

            <div class="form__row">
              <div class="field" id="f-name">
                <label for="r-name">Nom</label>
                <input type="text" id="r-name" name="name" autocomplete="name" required />
                <span class="err" id="e-name"></span>
              </div>
              <div class="field" id="f-phone">
                <label for="r-phone">Téléphone</label>
                <input type="tel" id="r-phone" name="phone" autocomplete="tel" inputmode="tel" placeholder="06 12 34 56 78" required />
                <span class="err" id="e-phone"></span>
              </div>
            </div>

            <details class="note">
              <summary>${icon('plus')}Ajouter un message <span class="optional">(facultatif)</span></summary>
              <textarea id="r-note" name="note" rows="3" aria-label="Message" placeholder="Chaise haute, anniversaire, pâte au charbon pour tout le monde…"></textarea>
            </details>

            <div class="form__send">
              <p class="form__recap" aria-hidden="true"></p>
              <button class="btn btn--primary btn--lg form__submit" type="submit">
                <span class="form__submit-label">Envoyer la demande</span>${icon('arrowRight')}
              </button>
            </div>
          </form>

          <div class="done" hidden tabindex="-1">
            <svg class="done__check" viewBox="0 0 52 52" aria-hidden="true">
              <circle cx="26" cy="26" r="24" /><path d="M15 27 l7 7 l15 -16" />
            </svg>
            <h3>Demande envoyée</h3>
            <p>Merci. Nous vous rappelons rapidement pour confirmer votre table.</p>
            <dl class="done__list"></dl>
            <p class="done__demo" hidden>Version de démonstration : cette demande n’a été transmise à personne.</p>
            <div class="done__actions">
              <a class="btn btn--ghost btn--sm" id="ics" download="reservation-la-ponte-vecchio.ics">${icon('calendar')}Ajouter à mon agenda</a>
              <button class="btn btn--ghost btn--sm" type="button" id="again">Faire une autre demande</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function mountBooking(): void {
  const form = $<HTMLFormElement>('#booking-form');
  const done = $('.done');
  const slotsEl = $('#slots');
  const otherWrap = $('.other-date', form);
  const otherInput = $<HTMLInputElement>('#r-date');
  const guestsOut = $('#guests');
  const summary = $('#summary');
  const recap = $('.form__recap');
  let guests = 2;

  const selectedDate = (): string => {
    const v = form.querySelector<HTMLInputElement>('input[name="date"]:checked')?.value ?? '';
    return v === 'other' ? otherInput.value : v;
  };
  const service = (): Service => (form.querySelector<HTMLInputElement>('input[name="service"]:checked')?.value as Service) ?? 'midi';
  const selectedTime = (): string => form.querySelector<HTMLInputElement>('input[name="time"]:checked')?.value ?? '';

  /** Is there still a table to offer on this day for this service? */
  const hasFree = (date: string, svc: Service): boolean => {
    const now = parisNow();
    const weekday = dayOfIso(date);
    return slots[svc].some(
      (t) => !(date === now.iso && toMinutes(t) <= now.minutes + bookingConfig.leadMinutes) && !isSlotFull(date, svc, t, weekday),
    );
  };
  const checkService = (svc: Service): void => {
    form.querySelector<HTMLInputElement>(`input[name="service"][value="${svc}"]`)!.checked = true;
  };
  /** The chosen service is sold out that day but the other is not: switch instead of showing an empty list. */
  const settleService = (date: string): void => {
    const other: Service = service() === 'midi' ? 'soir' : 'midi';
    if (date && !hasFree(date, service()) && hasFree(date, other)) checkService(other);
  };
  /**
   * Open on the first day and service that still have a free table, so the common case is one tap
   * on "Envoyer": today after lunch lands on tonight, a full day lands on the next open one.
   */
  const preselect = (): void => {
    const radios = $$<HTMLInputElement>('input[name="date"]:not([value="other"])', form);
    const first = radios.find((r) => hasFree(r.value, 'midi') || hasFree(r.value, 'soir')) ?? radios[0];
    first.checked = true;
    checkService(hasFree(first.value, 'midi') || !hasFree(first.value, 'soir') ? 'midi' : 'soir');
    // Bring the chosen day to the middle of the row, without scrolling the page itself.
    const row = first.closest<HTMLElement>('.date-chips')!;
    const chip = first.closest<HTMLElement>('.date-chip')!;
    row.scrollLeft = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
  };

  const setError = (id: string, msg: string): void => {
    $(`#f-${id}`).classList.toggle('is-invalid', !!msg);
    $(`#e-${id}`).textContent = msg;
  };

  const renderSlots = (): void => {
    const keep = selectedTime();
    const date = selectedDate();
    const now = parisNow();
    const weekday = date ? dayOfIso(date) : -1;
    const closed = !!date && !openDays.includes(weekday);
    slotsEl.innerHTML = '';

    if (!date || closed) {
      slotsEl.innerHTML = `<p class="slots__empty">${closed ? 'Nous sommes fermés ce jour-là : choisissez un jour du mardi au vendredi.' : 'Choisissez d’abord un jour.'}</p>`;
      return updateSummary();
    }

    let firstFree: HTMLInputElement | null = null;
    let kept = false;
    for (const t of slots[service()]) {
      const past = date === now.iso && toMinutes(t) <= now.minutes + bookingConfig.leadMinutes;
      const full = !past && isSlotFull(date, service(), t, weekday);
      const label = document.createElement('label');
      label.className = 'slot';
      label.innerHTML = `<input type="radio" name="time" value="${t}" ${past || full ? 'disabled' : ''}/><span>${formatSlot(t)}</span>${full ? '<small>complet</small>' : ''}`;
      const input = label.querySelector('input')!;
      if (!input.disabled) {
        firstFree ??= input;
        if (t === keep) {
          input.checked = true;
          kept = true;
        }
      }
      slotsEl.append(label);
    }
    if (!kept && firstFree) firstFree.checked = true;
    if (!firstFree) {
      slotsEl.insertAdjacentHTML('beforeend', '<p class="slots__empty">Plus de créneau pour ce service. Essayez le soir ou un autre jour.</p>');
    }
    if (!reducedMotion()) {
      gsap.from(slotsEl.children, { y: 6, autoAlpha: 0, duration: 0.35, stagger: 0.02, ease: EASE.out });
    }
    updateSummary();
  };

  const updateSummary = (): void => {
    const date = selectedDate();
    const time = selectedTime();
    const parts = [
      date ? formatDate(date, { weekday: 'long', day: 'numeric', month: 'long' }) : 'Jour à choisir',
      time ? formatSlot(time) : 'heure à choisir',
      `${guests} personne${guests > 1 ? 's' : ''}`,
    ];
    summary.textContent = parts.join(', ');
    recap.textContent = summary.textContent;
  };

  const setGuests = (n: number): void => {
    guests = Math.max(1, Math.min(restaurant.maxGuestsOnline, n));
    guestsOut.textContent = String(guests);
    $<HTMLButtonElement>('[data-guests="-1"]').disabled = guests <= 1;
    $<HTMLButtonElement>('[data-guests="1"]').disabled = guests >= restaurant.maxGuestsOnline;
    $('#guests-hint').textContent =
      guests >= restaurant.maxGuestsOnline ? `Au-delà, appelez-nous au ${restaurant.phone.display}.` : '';
    updateSummary();
  };

  $$<HTMLButtonElement>('[data-guests]').forEach((b) => b.addEventListener('click', () => setGuests(guests + Number(b.dataset.guests))));

  form.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === 'date') {
      otherWrap.hidden = t.value !== 'other';
      if (t.value === 'other') otherInput.focus();
      else settleService(t.value);
      setError('date', '');
      renderSlots();
    } else if (t === otherInput) {
      setError('date', '');
      settleService(otherInput.value);
      renderSlots();
    } else if (t.name === 'service') {
      renderSlots();
    } else if (t.name === 'time') {
      setError('time', '');
      updateSummary();
    }
  });
  ['name', 'phone'].forEach((id) => $(`#r-${id}`).addEventListener('input', () => setError(id, '')));

  const validate = (): Booking | null => {
    const now = parisNow();
    const date = selectedDate();
    const errors: [string, string][] = [];
    if (!date) errors.push(['date', 'Choisissez une date.']);
    else if (date < now.iso) errors.push(['date', 'Cette date est déjà passée.']);
    else if (date > addDays(now.iso, bookingConfig.maxDaysAhead)) errors.push(['date', 'Les réservations sont ouvertes jusqu’à 3 mois à l’avance.']);
    else if (!openDays.includes(dayOfIso(date))) errors.push(['date', 'Nous sommes fermés ce jour-là. Choisissez un jour du mardi au vendredi.']);
    if (date && !selectedTime()) errors.push(['time', 'Choisissez une heure disponible.']);
    const name = $<HTMLInputElement>('#r-name').value.trim();
    if (name.length < 2) errors.push(['name', 'Indiquez votre nom.']);
    const phone = $<HTMLInputElement>('#r-phone').value.trim();
    if (!/^(\+33|0033|0)[1-9]\d{8}$/.test(phone.replace(/[\s.-]/g, ''))) errors.push(['phone', 'Indiquez un numéro valide, par exemple 06 12 34 56 78.']);

    ['date', 'time', 'name', 'phone'].forEach((id) => setError(id, ''));
    errors.forEach(([id, msg]) => setError(id, msg));
    if (errors.length) {
      const first = $(`#f-${errors[0][0]}`);
      first.querySelector<HTMLElement>('input:not([disabled]), textarea')?.focus();
      if (!reducedMotion()) gsap.fromTo(first, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
      return null;
    }
    return { date, service: service(), time: selectedTime(), guests, name, phone, note: $<HTMLTextAreaElement>('#r-note').value.trim() };
  };

  const send = async (b: Booking): Promise<boolean> => {
    if (bookingConfig.endpoint) {
      const r = await fetch(bookingConfig.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...b, jour: formatDate(b.date, { weekday: 'long', day: 'numeric', month: 'long' }) }),
      });
      if (!r.ok) throw new Error('send failed');
      return false;
    }
    if (bookingConfig.email) {
      const body = `Demande de réservation\n\nJour : ${b.date}\nHeure : ${b.time}\nPersonnes : ${b.guests}\nNom : ${b.name}\nTéléphone : ${b.phone}${b.note ? `\nMessage : ${b.note}` : ''}`;
      location.href = `mailto:${bookingConfig.email}?subject=${encodeURIComponent(`Réservation ${b.date} ${b.time}`)}&body=${encodeURIComponent(body)}`;
      return false;
    }
    await new Promise((r) => setTimeout(r, bookingConfig.demoDelay));
    return true;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const b = validate();
    if (!b) return;
    const btn = $<HTMLButtonElement>('.form__submit', form);
    const label = $('.form__submit-label', btn);
    btn.disabled = true;
    btn.classList.add('is-loading');
    label.textContent = 'Envoi en cours…';
    try {
      const demo = await send(b);
      showDone(b, demo);
    } catch {
      setError('phone', `La demande n’a pas pu partir. Réessayez ou appelez le ${restaurant.phone.display}.`);
    } finally {
      btn.disabled = false;
      btn.classList.remove('is-loading');
      label.textContent = 'Envoyer la demande';
    }
  });

  const showDone = (b: Booking, demo: boolean): void => {
    const rows: [string, string][] = [
      ['Jour', formatDate(b.date, { weekday: 'long', day: 'numeric', month: 'long' })],
      ['Heure', formatSlot(b.time)],
      ['Personnes', String(b.guests)],
      ['Nom', b.name],
      ['Téléphone', b.phone],
    ];
    if (b.note) rows.push(['Message', b.note]);
    $('.done__list', done).replaceChildren(
      ...rows.flatMap(([k, v]) => {
        const dt = document.createElement('dt');
        dt.textContent = k;
        const dd = document.createElement('dd');
        dd.textContent = v;
        return [dt, dd];
      }),
    );
    $('.done__demo', done).hidden = !demo;
    $<HTMLAnchorElement>('#ics').href = icsFor(b);

    form.hidden = true;
    done.hidden = false;
    done.focus();
    if (!reducedMotion()) {
      const tl = gsap.timeline({ defaults: { ease: EASE.out } });
      tl.from(done, { y: 16, autoAlpha: 0, duration: 0.5 })
        .fromTo('.done__check circle', { strokeDashoffset: 151 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, 0.1)
        .fromTo('.done__check path', { strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, 0.55)
        .from(done.querySelectorAll('h3, p, dl, .done__actions'), { y: 10, autoAlpha: 0, stagger: 0.06, duration: 0.5 }, 0.3)
        .add(() => burst(), 0.75);
    }
  };

  /** A once-per-booking celebration: basil, tomato and mozzarella pop out of the check, then fall. */
  const burst = (): void => {
    const check = $('.done__check', done);
    const layer = document.createElement('div');
    layer.className = 'done__burst';
    layer.setAttribute('aria-hidden', 'true');
    // SVG elements have no offsetLeft: measure against the card instead.
    const c = check.getBoundingClientRect();
    const d = done.getBoundingClientRect();
    layer.style.left = `${c.left - d.left + c.width / 2}px`;
    layer.style.top = `${c.top - d.top + c.height / 2}px`;
    const kinds = ['basil', 'tomato', 'cheese'];
    const bits = Array.from({ length: 18 }, (_, i) => {
      const bit = document.createElement('span');
      bit.className = `bit bit--${kinds[i % kinds.length]}`;
      layer.append(bit);
      return bit;
    });
    done.append(layer);
    const tl = gsap.timeline({ onComplete: () => layer.remove() });
    bits.forEach((bit, i) => {
      const angle = (i / bits.length) * Math.PI * 2 + gsap.utils.random(-0.25, 0.25);
      const dist = gsap.utils.random(60, 120);
      tl.fromTo(
        bit,
        { x: 0, y: 0, scale: 0.4, rotate: 0, autoAlpha: 1 },
        { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist * 0.7 - 30, scale: 1, rotate: gsap.utils.random(-200, 200), duration: 0.55, ease: 'power3.out' },
        0,
      ).to(bit, { y: '+=70', autoAlpha: 0, rotate: '+=60', duration: 0.8, ease: 'power2.in' }, 0.5);
    });
  };

  $('#again').addEventListener('click', () => {
    form.reset();
    otherWrap.hidden = true;
    $<HTMLDetailsElement>('.note', form).open = false;
    preselect();
    setGuests(2);
    renderSlots();
    done.hidden = true;
    form.hidden = false;
    form.querySelector<HTMLInputElement>('input[name="date"]')?.focus();
  });

  preselect();
  setGuests(2);
  renderSlots();
}

/** Calendar file so the guest can keep the (pending) booking in their agenda. */
function icsFor(b: Booking): string {
  const [h, m] = b.time.split(':').map(Number);
  const start = `${b.date.replace(/-/g, '')}T${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
  const end = `${b.date.replace(/-/g, '')}T${String(h + 2).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
  const { street, postalCode, city } = restaurant.address;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//La Ponte Vecchio//Reservation//FR',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@laponte-vecchio`,
    `DTSTART;TZID=Europe/Paris:${start}`,
    `DTEND;TZID=Europe/Paris:${end}`,
    `SUMMARY:Table à La Ponte Vecchio (${b.guests} pers.)`,
    `LOCATION:${street}\\, ${postalCode} ${city}`,
    'DESCRIPTION:Demande de réservation en attente de confirmation par téléphone.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
