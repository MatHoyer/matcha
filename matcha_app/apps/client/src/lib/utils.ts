import { DECIMAL_SEPARATOR, THOUSAND_SEPARATOR } from '@matcha/common';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const exists = (v: unknown) => v !== null && v !== undefined;

export const formatNumber = ({
  value,
  scale = 0,
}: {
  value: number | null | undefined;
  scale: number;
}) => {
  if (!(value || value === 0)) return '';
  if (typeof value !== 'number') return '*** error number ***';
  const decimal = DECIMAL_SEPARATOR;
  const thousand = THOUSAND_SEPARATOR;
  if (!scale || scale === 255) {
    scale = 0;
  }
  const x = value.toFixed(scale).split('.');
  let intPart = x[0];
  if (
    value >= 10000 ||
    value <= -10000 ||
    ((value >= 1000 || value <= -1000) && scale)
  ) {
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(intPart)) {
      intPart = intPart.replace(rgx, '$1' + thousand + '$2');
    }
  }
  return intPart + (scale ? decimal + x[1] : '');
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
