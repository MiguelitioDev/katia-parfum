import type { Component } from './Component';
import type { FragranceRepository } from '../domain/FragranceRepository';
import type { SiteConfig } from '../config/site';
import { getFragranceColor } from '../config/palette';
import { formatBRL } from '../format/currency';
import { buildOrderLink } from '../format/whatsapp';

function toSentenceCase(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export class Catalog implements Component {
  constructor(
    private readonly repo: Pick<FragranceRepository, 'all'>,
    private readonly config: Pick<SiteConfig, 'whatsapp'>
  ) {}

  mount(root: HTMLElement): void {
    const section = document.createElement('section');
    section.className = 'section catalog';

    const container = document.createElement('div');
    container.className = 'container catalog__container';

    const header = document.createElement('div');
    header.className = 'catalog__header';

    const title = document.createElement('h2');
    title.className = 'catalog__title';
    title.textContent = 'Todas as fragrâncias';
    header.appendChild(title);

    const fragrances = this.repo.all();
    const firstFragrance = fragrances[0];
    if (firstFragrance && firstFragrance.variants.length > 0) {
      const sortedVariants = [...firstFragrance.variants].sort((a, b) => a.price - b.price);
      const minVariant = sortedVariants[0];
      const maxVariant = sortedVariants[sortedVariants.length - 1];
      if (minVariant && maxVariant) {
        const subtitle = document.createElement('p');
        subtitle.className = 'catalog__subtitle';
        subtitle.textContent = `${minVariant.volumeMl} ml por ${formatBRL(minVariant.price)} ou ${maxVariant.volumeMl} ml por ${formatBRL(maxVariant.price)}.`;
        header.appendChild(subtitle);
      }
    }

    const list = document.createElement('ul');
    list.className = 'catalog__list';

    fragrances.forEach((fragrance) => {
      const color = getFragranceColor(fragrance.number);

      const item = document.createElement('li');
      item.id = `fragrancia-${fragrance.number}`;
      item.className = 'catalog-item';
      item.style.setProperty('--cor', color);
      item.style.setProperty('--tinta-fragrancia', color);

      // Column 1: Image frame
      const media = document.createElement('div');
      media.className = 'catalog-item__media';

      const img = document.createElement('img');
      img.className = 'catalog-item__image';
      img.src = fragrance.images[0] ?? '';
      img.alt = `Frasco de ${fragrance.fullName}`;
      img.width = 900;
      img.height = 900;
      img.loading = 'lazy';
      img.decoding = 'async';

      media.appendChild(img);

      // Column 2: Name, Family & Feels Like
      const info = document.createElement('div');
      info.className = 'catalog-item__info';

      const headerDiv = document.createElement('div');
      headerDiv.className = 'catalog-item__header';

      const dot = document.createElement('span');
      dot.className = 'catalog-item__dot';
      dot.style.backgroundColor = color;
      dot.setAttribute('aria-hidden', 'true');

      const name = document.createElement('h3');
      name.className = 'catalog-item__name';
      name.setAttribute('translate', 'no');
      name.textContent = fragrance.fullName;

      headerDiv.appendChild(dot);
      headerDiv.appendChild(name);

      const classification = document.createElement('p');
      classification.className = 'catalog-item__classification';
      classification.textContent = toSentenceCase(fragrance.family);

      const feelsLike = document.createElement('p');
      feelsLike.className = 'catalog-item__feels-like';
      feelsLike.textContent = fragrance.feelsLike;

      info.appendChild(headerDiv);
      info.appendChild(classification);
      info.appendChild(feelsLike);

      // Column 3: Notes pyramid (<dl>)
      const pyramid = document.createElement('dl');
      pyramid.className = 'catalog-item__pyramid';

      const pyramidRows: Array<[string, string[]]> = [
        ['Topo', fragrance.pyramid.top],
        ['Corpo', fragrance.pyramid.heart],
        ['Fundo', fragrance.pyramid.base],
      ];

      pyramidRows.forEach(([label, notes]) => {
        const dt = document.createElement('dt');
        dt.className = 'catalog-item__note-label';
        dt.textContent = label;

        const dd = document.createElement('dd');
        dd.className = 'catalog-item__note-value';
        dd.textContent = notes.join(', ');

        pyramid.appendChild(dt);
        pyramid.appendChild(dd);
      });

      // Column 4: Volume selector, Price & Secondary WhatsApp link
      const actions = document.createElement('div');
      actions.className = 'catalog-item__actions';

      const initialVariant = fragrance.variants[0];
      if (!initialVariant) return;

      const price = document.createElement('p');
      price.className = 'catalog-item__price';
      price.textContent = formatBRL(initialVariant.price);

      const segmented = document.createElement('fieldset');
      segmented.className = 'catalog-item__segmented';

      const legend = document.createElement('legend');
      legend.className = 'sr-only';
      legend.textContent = `Escolha o volume de ${fragrance.fullName}`;
      segmented.appendChild(legend);

      const orderLink = document.createElement('a');
      orderLink.className = 'catalog-item__cta';
      orderLink.textContent = 'Pedir pelo WhatsApp';
      orderLink.target = '_blank';
      orderLink.rel = 'noopener noreferrer';
      orderLink.href = buildOrderLink(this.config.whatsapp, fragrance, initialVariant);

      fragrance.variants.forEach((variant, vIdx) => {
        const label = document.createElement('label');
        label.className = 'catalog-item__radio-label';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `variant-${fragrance.number}`;
        radio.value = variant.volumeMl.toString();
        radio.className = 'catalog-item__radio-input';
        if (vIdx === 0) {
          radio.checked = true;
        }

        radio.addEventListener('change', () => {
          if (radio.checked) {
            price.textContent = formatBRL(variant.price);
            orderLink.href = buildOrderLink(this.config.whatsapp, fragrance, variant);
          }
        });

        const span = document.createElement('span');
        span.className = 'catalog-item__radio-text';
        span.textContent = `${variant.volumeMl} ml`;

        label.appendChild(radio);
        label.appendChild(span);
        segmented.appendChild(label);
      });

      actions.appendChild(segmented);
      actions.appendChild(price);
      actions.appendChild(orderLink);

      item.appendChild(media);
      item.appendChild(info);
      item.appendChild(pyramid);
      item.appendChild(actions);

      list.appendChild(item);
    });

    container.appendChild(header);
    container.appendChild(list);
    section.appendChild(container);

    root.appendChild(section);
  }
}
