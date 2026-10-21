import type { Fragrance } from './Fragrance';

export interface FragranceRepository {
  all(): Fragrance[];
  byNumber(n: string): Fragrance | undefined;
}
