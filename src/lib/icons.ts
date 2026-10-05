import { raw, type Raw } from './html';

import arrowRight from '@phosphor-icons/core/assets/regular/arrow-right.svg?raw';
import arrowUpRight from '@phosphor-icons/core/assets/regular/arrow-up-right.svg?raw';
import arrowsOut from '@phosphor-icons/core/assets/regular/arrows-out.svg?raw';
import baby from '@phosphor-icons/core/assets/regular/baby.svg?raw';
import calendar from '@phosphor-icons/core/assets/regular/calendar-blank.svg?raw';
import car from '@phosphor-icons/core/assets/regular/car.svg?raw';
import caretLeft from '@phosphor-icons/core/assets/regular/caret-left.svg?raw';
import caretRight from '@phosphor-icons/core/assets/regular/caret-right.svg?raw';
import check from '@phosphor-icons/core/assets/regular/check.svg?raw';
import clock from '@phosphor-icons/core/assets/regular/clock.svg?raw';
import fire from '@phosphor-icons/core/assets/regular/fire.svg?raw';
import leaf from '@phosphor-icons/core/assets/regular/leaf.svg?raw';
import list from '@phosphor-icons/core/assets/regular/list.svg?raw';
import mapPin from '@phosphor-icons/core/assets/regular/map-pin.svg?raw';
import minus from '@phosphor-icons/core/assets/regular/minus.svg?raw';
import pause from '@phosphor-icons/core/assets/fill/pause-fill.svg?raw';
import play from '@phosphor-icons/core/assets/fill/play-fill.svg?raw';
import pepper from '@phosphor-icons/core/assets/regular/pepper.svg?raw';
import phone from '@phosphor-icons/core/assets/regular/phone.svg?raw';
import plus from '@phosphor-icons/core/assets/regular/plus.svg?raw';
import shoppingBag from '@phosphor-icons/core/assets/regular/shopping-bag.svg?raw';
import star from '@phosphor-icons/core/assets/fill/star-fill.svg?raw';
import storefront from '@phosphor-icons/core/assets/regular/storefront.svg?raw';
import wheelchair from '@phosphor-icons/core/assets/regular/wheelchair.svg?raw';
import wine from '@phosphor-icons/core/assets/regular/wine.svg?raw';
import x from '@phosphor-icons/core/assets/regular/x.svg?raw';
import sparkle from '@phosphor-icons/core/assets/regular/sparkle.svg?raw';

const ICONS = {
  arrowRight,
  arrowUpRight,
  arrowsOut,
  baby,
  calendar,
  car,
  caretLeft,
  caretRight,
  check,
  clock,
  fire,
  leaf,
  list,
  mapPin,
  minus,
  pause,
  pepper,
  phone,
  play,
  plus,
  shoppingBag,
  sparkle,
  star,
  storefront,
  wheelchair,
  wine,
  x,
} as const;

export type IconName = keyof typeof ICONS;

/** Phosphor icon as inline SVG, decorative by default. */
export function icon(name: IconName, className = ''): Raw {
  return raw(ICONS[name].replace('<svg ', `<svg class="icon ${className}" aria-hidden="true" focusable="false" `));
}
