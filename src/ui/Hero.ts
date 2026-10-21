import type { Component } from './Component';
import type { Fragrance } from '../domain/Fragrance';
import type { FragranceRepository } from '../domain/FragranceRepository';
import type { SiteConfig } from '../config/site';
import { getFragranceColor } from '../config/palette';
import { formatBRL } from '../format/currency';
import { buildOrderLink } from '../format/whatsapp';

export class Hero implements Component {
  private activeFragrance!: Fragrance;
  private readonly fragrances: Fragrance[];
  private radioButtons: HTMLButtonElement[] = [];
  private isInitialRender = true;
  private transitionToken = 0;

  constructor(
    private readonly repo: Pick<FragranceRepository, 'all' | 'byNumber'>,
    private readonly config: Pick<SiteConfig, 'whatsapp'>
  ) {
    this.fragrances = this.repo.all();
    const initial = this.repo.byNumber('62') ?? this.fragrances[0];
    if (!initial) {
      throw new Error('Nenhuma fragrância encontrada no repositório.');
    }
    this.activeFragrance = initial;
  }

  mount(root: HTMLElement): void {
    const heroSection = document.createElement('section');
    heroSection.className = 'section hero';

    const container = document.createElement('div');
    container.className = 'container hero__container';

    const eyebrow = document.createElement('h1');
    eyebrow.className = 'hero__eyebrow';
    eyebrow.textContent = 'Como você quer se sentir hoje?';

    // Selector
    const selectorWrapper = document.createElement('div');
    selectorWrapper.className = 'hero__selector-wrapper';

    const selector = document.createElement('div');
    selector.className = 'hero__selector';
    selector.setAttribute('role', 'radiogroup');
    selector.setAttribute('aria-label', 'Escolha a fragrância');

    // Media column
    const media = document.createElement('div');
    media.className = 'hero__media';

    const image = document.createElement('img');
    image.className = 'hero__image';
    image.width = 900;
    image.height = 900;
    image.setAttribute('fetchpriority', 'high');
    image.decoding = 'async';

    media.appendChild(image);

    // Body (quote + details + CTA)
    const body = document.createElement('div');
    body.className = 'hero__body';

    const quote = document.createElement('blockquote');
    quote.className = 'hero__quote';
    quote.setAttribute('aria-live', 'polite');

    const details = document.createElement('div');
    details.className = 'hero__details';

    const name = document.createElement('p');
    name.className = 'hero__name';
    name.setAttribute('translate', 'no');

    const notes = document.createElement('p');
    notes.className = 'hero__notes';

    const price = document.createElement('p');
    price.className = 'hero__price';

    const cta = document.createElement('a');
    cta.className = 'btn hero__cta';
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';

    details.appendChild(name);
    details.appendChild(notes);
    details.appendChild(price);
    details.appendChild(cta);

    body.appendChild(quote);
    body.appendChild(details);

    this.radioButtons = this.fragrances.map((fragrance, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hero-selector__btn';
      btn.setAttribute('role', 'radio');
      btn.textContent = fragrance.number;
      btn.setAttribute('aria-label', fragrance.fullName);

      btn.addEventListener('click', () => {
        this.selectFragrance(fragrance, heroSection, quote, name, notes, price, cta, image);
        btn.focus();
      });

      btn.addEventListener('keydown', (e: KeyboardEvent) => {
        let targetIndex = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          targetIndex = (index + 1) % this.fragrances.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          targetIndex = (index - 1 + this.fragrances.length) % this.fragrances.length;
        } else if (e.key === 'Home') {
          targetIndex = 0;
        } else if (e.key === 'End') {
          targetIndex = this.fragrances.length - 1;
        }

        if (targetIndex !== -1) {
          e.preventDefault();
          const targetFragrance = this.fragrances[targetIndex];
          if (targetFragrance) {
            this.selectFragrance(targetFragrance, heroSection, quote, name, notes, price, cta, image);
            this.radioButtons[targetIndex]?.focus();
          }
        }
      });

      selector.appendChild(btn);
      return btn;
    });

    selectorWrapper.appendChild(selector);

    container.appendChild(eyebrow);
    container.appendChild(selectorWrapper);
    container.appendChild(media);
    container.appendChild(body);
    heroSection.appendChild(container);
    root.appendChild(heroSection);

    // Initial render
    this.selectFragrance(this.activeFragrance, heroSection, quote, name, notes, price, cta, image);

    // Preload 8 campaign images after page load
    this.preloadCampaignImages();
  }

  private selectFragrance(
    fragrance: Fragrance,
    heroSection: HTMLElement,
    quote: HTMLElement,
    name: HTMLElement,
    notes: HTMLElement,
    price: HTMLElement,
    cta: HTMLAnchorElement,
    image: HTMLImageElement
  ): void {
    this.activeFragrance = fragrance;
    const color = getFragranceColor(fragrance.number);

    // Update hero variables
    heroSection.style.setProperty('--tinta-fragrancia', color);

    // Update text content
    quote.textContent = `“${fragrance.feelsLike}”`;
    name.textContent = fragrance.fullName;
    notes.textContent = fragrance.keyNotes.join(', ');

    const variant30 = fragrance.variants.find((v) => v.volumeMl === 30) ?? fragrance.variants[0];
    const basePrice = variant30 ? formatBRL(variant30.price) : 'R$ 149,90';
    price.textContent = `a partir de ${basePrice}`;

    cta.textContent = `Pedir ${fragrance.fullName} pelo WhatsApp`;
    if (variant30) {
      cta.href = buildOrderLink(this.config.whatsapp, fragrance, variant30);
    }

    // Update media with 250ms opacity crossfade (or direct swap on initial/reduced-motion)
    const campaignImage = fragrance.images[1] ?? fragrance.images[0] ?? '';
    const altText = fragrance.images[1]
      ? `Campanha de ${fragrance.fullName}`
      : `Frasco de ${fragrance.fullName}`;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.isInitialRender || prefersReducedMotion || image.getAttribute('src') === campaignImage) {
      this.isInitialRender = false;
      image.src = campaignImage;
      image.alt = altText;
      image.style.opacity = '1';
    } else {
      const token = ++this.transitionToken;
      image.style.opacity = '0';

      const handleLoad = (): void => {
        if (token !== this.transitionToken) return;
        image.style.opacity = '1';
      };

      image.addEventListener('load', handleLoad, { once: true });
      image.alt = altText;
      image.src = campaignImage;
    }

    // Update radiogroup buttons
    this.radioButtons.forEach((btn, index) => {
      const itemFragrance = this.fragrances[index];
      if (!itemFragrance) return;

      const isSelected = itemFragrance.number === fragrance.number;
      btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      btn.tabIndex = isSelected ? 0 : -1;
      btn.classList.toggle('hero-selector__btn--active', isSelected);
    });
  }

  private preloadCampaignImages(): void {
    const preload = (): void => {
      this.fragrances.forEach((fragrance) => {
        const src = fragrance.images[1] ?? fragrance.images[0];
        if (src) {
          const img = new Image();
          img.src = src;
        }
      });
    };

    if (document.readyState === 'complete') {
      preload();
    } else {
      window.addEventListener('load', preload, { once: true });
    }
  }
}
