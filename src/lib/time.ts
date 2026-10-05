import { openingHours, weekDays } from '../data/restaurant';

/** Current day and minute-of-day in Paris, whatever the visitor's timezone. */
export interface ParisNow {
  /** 0 = dimanche */
  day: number;
  minutes: number;
  /** YYYY-MM-DD */
  iso: string;
}

export function parisNow(date = new Date()): ParisNow {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const o: Record<string, string> = {};
  for (const p of parts) o[p.type] = p.value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday);
  return {
    day,
    minutes: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10),
    iso: `${o.year}-${o.month}-${o.day}`,
  };
}

/** 1305 → "21 h 45", 720 → "12 h" */
export function formatMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h} h${mm ? ` ${String(mm).padStart(2, '0')}` : ''}`;
}

export const toMinutes = (hm: string): number => {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
};

export const formatSlot = (hm: string): string => formatMinutes(toMinutes(hm));

export interface OpenStatus {
  open: boolean;
  /** Short label for the nav pill */
  label: string;
}

export function openStatus(now = parisNow()): OpenStatus {
  const today = openingHours[now.day] ?? [];
  for (const [start, end] of today) {
    if (now.minutes >= start && now.minutes < end) {
      return { open: true, label: `Ouvert jusqu’à ${formatMinutes(end)}` };
    }
  }
  for (let k = 0; k < 8; k++) {
    const d = (now.day + k) % 7;
    for (const [start] of openingHours[d] ?? []) {
      if (k > 0 || start > now.minutes) {
        const when = k === 0 ? 'à' : k === 1 ? 'demain à' : `${weekDays[d].toLowerCase()} à`;
        return { open: false, label: `Ouvre ${when} ${formatMinutes(start)}` };
      }
    }
  }
  return { open: false, label: 'Fermé' };
}

/* ——— Date helpers (UTC-based to avoid DST drift) ——— */

const parseIso = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const dayOfIso = (iso: string): number => parseIso(iso).getUTCDay();

export function addDays(iso: string, n: number): string {
  const d = parseIso(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions): string {
  return parseIso(iso).toLocaleDateString('fr-FR', { ...opts, timeZone: 'UTC' });
}
