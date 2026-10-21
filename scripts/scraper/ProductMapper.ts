import type {
  Fragrance,
  NotesPyramid,
  Variant,
} from '../../src/domain/Fragrance';
import type { VtexProduct } from './VtexCatalogClient';

const PT_BR_LOWERCASE = new Set([
  'de',
  'da',
  'do',
  'das',
  'dos',
  'e',
  'em',
  'com',
  'para',
  'por',
  'a',
  'o',
  'as',
  'os',
]);

function capitalizeWord(word: string): string {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function toTitleCasePtBr(text: string): string {
  const trimmed = text.trim().replace(/\.+$/, '');
  if (!trimmed) return '';

  const words = trimmed.split(/\s+/);
  return words
    .map((word, index) => {
      if (word.includes('-')) {
        return word
          .split('-')
          .map((part, partIdx) => {
            const lower = part.toLowerCase();
            if ((index > 0 || partIdx > 0) && PT_BR_LOWERCASE.has(lower)) {
              return lower;
            }
            return capitalizeWord(part);
          })
          .join('-');
      }

      const lower = word.toLowerCase();
      if (index > 0 && PT_BR_LOWERCASE.has(lower)) {
        return lower;
      }
      return capitalizeWord(word);
    })
    .join(' ');
}

function extractDescription(html?: string): string {
  if (!html) return '';
  const firstParagraph = html.split(/<br\s*\/?>\s*<br\s*\/?>/i)[0] ?? '';
  return firstParagraph.replace(/<[^>]+>/g, '').trim();
}

function extractPyramid(html?: string): NotesPyramid {
  const pyramid: NotesPyramid = {
    top: [],
    heart: [],
    base: [],
  };

  if (!html) return pyramid;

  const lines = html.split(/<br\s*\/?>|\r?\n/i);

  for (const rawLine of lines) {
    const cleanLine = rawLine.replace(/<[^>]+>/g, '').trim();
    if (!cleanLine) continue;

    const topMatch = cleanLine.match(/TOPO?\s*:\s*(.*)$/i);
    if (topMatch && topMatch[1]) {
      pyramid.top = topMatch[1]
        .split(',')
        .map((s) => toTitleCasePtBr(s))
        .filter(Boolean);
      continue;
    }

    const heartMatch = cleanLine.match(/(?:CORPO|CORAÇÃO)\s*:\s*(.*)$/i);
    if (heartMatch && heartMatch[1]) {
      pyramid.heart = heartMatch[1]
        .split(',')
        .map((s) => toTitleCasePtBr(s))
        .filter(Boolean);
      continue;
    }

    const baseMatch = cleanLine.match(/FUNDO\s*:\s*(.*)$/i);
    if (baseMatch && baseMatch[1]) {
      pyramid.base = baseMatch[1]
        .split(',')
        .map((s) => toTitleCasePtBr(s))
        .filter(Boolean);
      continue;
    }
  }

  return pyramid;
}

function extractCategory(categories?: string[]): string {
  const rawCat = categories?.[0] ?? '';
  const segments = rawCat.split('/').map((s) => s.trim()).filter(Boolean);
  return segments.length > 0 ? (segments[segments.length - 1] ?? '') : '';
}

function extractKeyNotes(notes?: string[]): string[] {
  const raw = notes?.[0];
  if (!raw) return [];
  return raw
    .split(/\s*\.\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeImageUrl(rawUrl: string): string {
  let url = rawUrl.trim();
  if (url.startsWith('//')) {
    url = `https:${url}`;
  }
  const withoutQuery = url.split('?')[0] ?? '';
  return withoutQuery.replace(
    /\/arquivos\/ids\/(\d+)(?:-\d+-\d+)?\//,
    '/arquivos/ids/$1-900-900/',
  );
}

interface ProductGroup {
  number: string;
  name: string;
  product30?: VtexProduct;
  product100?: VtexProduct;
  variants: Variant[];
  fallbackProduct: VtexProduct;
}

export function groupAndMap(products: VtexProduct[]): Fragrance[] {
  const groups = new Map<string, ProductGroup>();

  for (const product of products) {
    const match = product.productName.match(
      /^(.*?)\s+(\d{2})\s+Deo Parfum\s+(\d+)\s*ml/i,
    );
    if (!match || !match[1] || !match[2] || !match[3]) {
      continue;
    }

    const name = match[1].trim();
    const number = match[2].trim();
    const volumeNum = parseInt(match[3], 10);
    const volumeMl: 30 | 100 = volumeNum === 100 ? 100 : 30;

    const sellerOffer = product.items?.[0]?.sellers?.[0]?.commertialOffer;
    const price = sellerOffer?.Price ?? 0;
    const listPrice = sellerOffer?.ListPrice ?? price;
    const sourceSlug = product.linkText ?? '';

    const variant: Variant = {
      volumeMl,
      price,
      listPrice,
      sourceSlug,
    };

    let group = groups.get(number);
    if (!group) {
      group = {
        number,
        name,
        variants: [],
        fallbackProduct: product,
      };
      groups.set(number, group);
    }

    group.variants.push(variant);

    if (volumeMl === 30) {
      group.product30 = product;
    } else if (volumeMl === 100) {
      group.product100 = product;
    }
  }

  const fragrances: Fragrance[] = [];

  for (const group of groups.values()) {
    const mainProduct =
      group.product30 ?? group.product100 ?? group.fallbackProduct;
    const altProduct =
      group.product100 ?? group.product30 ?? group.fallbackProduct;

    const category =
      extractCategory(mainProduct.categories) ||
      extractCategory(altProduct.categories);
    const family = (
      mainProduct['Família Olfativa']?.[0] ??
      altProduct['Família Olfativa']?.[0] ??
      ''
    ).trim();
    const feelsLike = (
      mainProduct['Feels Like']?.[0] ??
      altProduct['Feels Like']?.[0] ??
      ''
    ).trim();
    const keyNotesFromMain = extractKeyNotes(mainProduct.Notes);
    const keyNotes =
      keyNotesFromMain.length > 0
        ? keyNotesFromMain
        : extractKeyNotes(altProduct.Notes);

    const descriptionHtml =
      // A descrição do 100ml é preferida: na fonte, a do 30ml do nº 08 é cópia da do nº 26.
      altProduct.description || mainProduct.description || '';
    const description = extractDescription(descriptionHtml);
    const pyramid = extractPyramid(descriptionHtml);
    const howToUse = (
      mainProduct['Como Usar']?.[0] ??
      altProduct['Como Usar']?.[0] ??
      ''
    ).trim();

    const imageSource =
      (group.product30?.items?.[0]?.images?.length
        ? group.product30.items[0].images
        : mainProduct.items?.[0]?.images) ?? [];

    const images = imageSource
      .slice(0, 2)
      .filter(
        (img): img is { imageUrl: string } =>
          typeof img?.imageUrl === 'string' && Boolean(img.imageUrl),
      )
      .map((img) => normalizeImageUrl(img.imageUrl));

    group.variants.sort((a, b) => a.volumeMl - b.volumeMl);

    fragrances.push({
      number: group.number,
      name: group.name,
      fullName: `${group.name} ${group.number}`,
      category,
      family,
      feelsLike,
      keyNotes,
      pyramid,
      description,
      howToUse,
      images,
      variants: group.variants,
    });
  }

  fragrances.sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));

  return fragrances;
}
