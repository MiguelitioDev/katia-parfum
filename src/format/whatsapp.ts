import type { Fragrance, Variant } from '../domain/Fragrance';
import { formatBRL } from './currency';

export function buildOrderLink(
  phone: string,
  fragrance: Fragrance,
  variant: Variant
): string {
  const cleanPhone = phone.replace(/[^0-9A-Za-z]/g, '');
  const message = `Olá Katia! Quero o ${fragrance.fullName} ${variant.volumeMl} ml (${formatBRL(variant.price)}).`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
