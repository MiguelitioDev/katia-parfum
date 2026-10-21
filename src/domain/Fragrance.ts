export interface Variant {
  volumeMl: 30 | 100;
  price: number;
  listPrice: number;
  sourceSlug: string;
}

export interface NotesPyramid {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Fragrance {
  number: string; /* "08","62"... */
  name: string; /* "Secret Citric" */
  fullName: string; /* "Secret Citric 62" */
  category: string; /* "Cítrico" */
  family: string; /* Família Olfativa */
  feelsLike: string;
  keyNotes: string[];
  pyramid: NotesPyramid;
  description: string; /* texto puro, 1º parágrafo */
  howToUse: string;
  images: string[]; /* caminhos públicos "/products/62-1.jpg" */
  variants: Variant[]; /* ordenadas 30, 100 */
}
