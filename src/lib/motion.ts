/** Shared motion constants so every animation on the page speaks the same language. */

/**
 * Deliberately ignores the OS "reduce motion" flag: many desktops (GNOME with animations off, remote
 * sessions, battery savers) report it without the visitor asking for it, and the site's motion is its
 * personality. Set to true to bring the calm path back everywhere.
 */
export const HONOUR_REDUCED_MOTION = false;
export const reducedMotion = (): boolean =>
  HONOUR_REDUCED_MOTION && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Desktop-size layouts (wide screens with motion allowed). */
export const MQ = {
  desktop: '(min-width: 900px)',
  mobile: '(max-width: 899px)',
  motion: 'all',
  reduce: 'not all',
} as const;

/** GSAP equivalents of the CSS custom curves in tokens.css */
export const EASE = {
  out: 'expo.out',
  inOut: 'power3.inOut',
  soft: 'power2.out',
} as const;
