/**
 * Réglages de la réservation.
 * Pour la mise en ligne, renseigner `endpoint` (Formspree, Getform, Basin…) OU `email`.
 * Les deux vides = mode démonstration (rien n'est envoyé).
 */
export const bookingConfig = {
  endpoint: '',
  email: '',
  /** Jours proposés en raccourci dans le sélecteur. */
  quickDays: 8,
  /** Réservation possible jusqu'à N jours à l'avance. */
  maxDaysAhead: 90,
  /** Délai minimum avant un créneau le jour même. */
  leadMinutes: 30,
  /** Délai simulé de l'envoi, en mode démonstration. */
  demoDelay: 900,
};

export type Service = 'midi' | 'soir';

export const slots: Record<Service, string[]> = {
  midi: ['12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30'],
  soir: ['19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15'],
};

/**
 * Disponibilités simulées : quelques créneaux "complets", toujours les mêmes pour une date donnée.
 * Le vendredi soir est plus chargé, comme dans la vraie vie.
 */
export function isSlotFull(dateIso: string, service: Service, slot: string, weekday: number): boolean {
  let h = 0;
  for (const c of `${dateIso}${service}${slot}`) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const threshold = weekday === 5 && service === 'soir' ? 45 : 18;
  return h % 100 < threshold;
}
