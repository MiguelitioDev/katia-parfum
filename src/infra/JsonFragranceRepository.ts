import type { Fragrance } from '../domain/Fragrance';
import type { FragranceRepository } from '../domain/FragranceRepository';

export class JsonFragranceRepository implements FragranceRepository {
  private readonly fragrances: Fragrance[];

  constructor(data: Fragrance[]) {
    this.fragrances = [...data];
  }

  all(): Fragrance[] {
    return this.fragrances;
  }

  byNumber(n: string): Fragrance | undefined {
    return this.fragrances.find((fragrance) => fragrance.number === n);
  }
}
