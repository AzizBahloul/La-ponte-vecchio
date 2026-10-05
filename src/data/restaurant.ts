/**
 * Données de démonstration : à valider avec l'établissement avant la mise en ligne.
 * Tout le contenu du site est centralisé dans ce dossier `src/data/`.
 */

export const restaurant = {
  name: 'La Ponte Vecchio',
  tagline: 'Pizzeria familiale',
  phone: { display: '02 99 83 42 52', href: 'tel:+33299834252' },
  address: {
    street: '4 cours de la Vilaine',
    postalCode: '35510',
    city: 'Cesson-Sévigné',
  },
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=La+Ponte+Vecchio+4+cours+de+la+Vilaine+35510+Cesson-S%C3%A9vign%C3%A9',
  /** Position approximative, pour la carte OpenStreetMap (démo). */
  geo: { lat: 48.1206, lng: -1.6035 },
  rating: { score: 4.6, count: 387 },
  since: 2004,
  /** Au-delà, on demande d'appeler. */
  maxGuestsOnline: 8,
} as const;

export const weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'] as const;

/** Minutes depuis minuit, par jour (0 = dimanche). Jours absents = fermé. */
export const openingHours: Record<number, [number, number][]> = {
  2: [[720, 840], [1140, 1305]],
  3: [[720, 840], [1140, 1305]],
  4: [[720, 840], [1140, 1305]],
  5: [[720, 840], [1140, 1305]],
};

export const openDays = Object.keys(openingHours).map(Number);

/** Ordre d'affichage du tableau des horaires : lundi → dimanche. */
export const displayWeek = [1, 2, 3, 4, 5, 6, 0];

export const services = [
  { icon: 'storefront', label: 'Sur place', detail: '42 couverts, terrasse l’été' },
  { icon: 'shoppingBag', label: 'À emporter', detail: 'Commande par téléphone' },
  { icon: 'baby', label: 'Familles', detail: 'Chaises hautes, menu enfant' },
  { icon: 'wheelchair', label: 'Accessible', detail: 'Salle de plain-pied' },
  { icon: 'car', label: 'Stationnement', detail: 'Parking du bourg à 2 min' },
] as const;

export const navLinks = [
  { href: '#carte', label: 'La carte' },
  { href: '#charbon', label: 'Pâte noire' },
  { href: '#savoir-faire', label: 'Savoir-faire' },
  { href: '#photos', label: 'Photos' },
  { href: '#infos', label: 'Horaires et accès' },
] as const;
