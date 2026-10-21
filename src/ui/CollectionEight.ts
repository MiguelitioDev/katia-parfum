import type { Component } from './Component';
import type { FragranceRepository } from '../domain/FragranceRepository';
import { getFragranceColor } from '../config/palette';

export class CollectionEight implements Component {
  constructor(private readonly repo: Pick<FragranceRepository, 'all'>) {}

  mount(root: HTMLElement): void {
    const section = document.createElement('section');
    section.className = 'section collection-eight';

    const container = document.createElement('div');
    container.className = 'container collection-eight__container';

    const title = document.createElement('h2');
    title.className = 'collection-eight__title';
    title.textContent = 'Coleção 8';

    const description = document.createElement('p');
    description.className = 'collection-eight__description';
    description.textContent =
      'Em cada fragrância, os dois algarismos somam 8 — o número da prosperidade e do infinito.';

    const list = document.createElement('div');
    list.className = 'collection-eight__list';

    const fragrances = this.repo.all();
    fragrances.forEach((fragrance) => {
      const item = document.createElement('a');
      item.className = 'collection-eight__item';
      item.href = `#fragrancia-${fragrance.number}`;
      item.setAttribute('aria-label', `Ver ${fragrance.fullName} no catálogo`);
      item.style.setProperty('--cor', getFragranceColor(fragrance.number));

      const sumEl = document.createElement('span');
      sumEl.className = 'collection-eight__sum';

      const digits = fragrance.number.split('');
      if (digits.length >= 2) {
        sumEl.appendChild(document.createTextNode(`${digits[0]} `));
        const plusEl = document.createElement('span');
        plusEl.className = 'collection-eight__plus';
        plusEl.textContent = '+';
        sumEl.appendChild(plusEl);
        sumEl.appendChild(document.createTextNode(` ${digits[1]}`));
      } else {
        sumEl.textContent = fragrance.number;
      }

      const nameEl = document.createElement('span');
      nameEl.className = 'collection-eight__name';
      nameEl.setAttribute('translate', 'no');
      nameEl.textContent = fragrance.name;

      item.appendChild(sumEl);
      item.appendChild(nameEl);
      list.appendChild(item);
    });

    container.appendChild(title);
    container.appendChild(description);
    container.appendChild(list);
    section.appendChild(container);

    root.appendChild(section);
  }
}
