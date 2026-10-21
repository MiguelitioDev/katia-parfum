import type { Component } from './Component';
import type { SiteConfig } from '../config/site';

export class Header implements Component {
  constructor(private readonly config: Pick<SiteConfig, 'brand' | 'whatsapp'>) {}

  mount(root: HTMLElement): void {
    const header = document.createElement('header');
    header.className = 'site-header';

    const skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    skipLink.href = '#conteudo';
    skipLink.textContent = 'Pular para o conteúdo';

    const container = document.createElement('div');
    container.className = 'container site-header__container';

    const wordmark = document.createElement('a');
    wordmark.className = 'site-header__wordmark';
    wordmark.href = '#';
    wordmark.setAttribute('translate', 'no');
    wordmark.textContent = this.config.brand;

    const cleanPhone = this.config.whatsapp.replace(/[^0-9A-Za-z]/g, '');
    const cta = document.createElement('a');
    cta.className = 'site-header__cta';
    cta.href = `https://wa.me/${cleanPhone}`;
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';

    const ctaLong = document.createElement('span');
    ctaLong.className = 'site-header__cta-long';
    ctaLong.textContent = 'Pedir no WhatsApp';

    const ctaShort = document.createElement('span');
    ctaShort.className = 'site-header__cta-short';
    ctaShort.textContent = 'WhatsApp';

    cta.appendChild(ctaLong);
    cta.appendChild(ctaShort);

    container.appendChild(wordmark);
    container.appendChild(cta);
    header.appendChild(skipLink);
    header.appendChild(container);

    root.appendChild(header);
  }
}
