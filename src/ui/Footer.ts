import type { Component } from './Component';
import type { SiteConfig } from '../config/site';

export class Footer implements Component {
  constructor(
    private readonly config: Pick<SiteConfig, 'brand' | 'whatsapp' | 'instagram' | 'hours'>
  ) {}

  mount(root: HTMLElement): void {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';

    const container = document.createElement('div');
    container.className = 'container site-footer__container';

    const mainRow = document.createElement('div');
    mainRow.className = 'site-footer__main';

    const wordmark = document.createElement('p');
    wordmark.className = 'site-footer__wordmark';
    wordmark.setAttribute('translate', 'no');
    wordmark.textContent = this.config.brand;

    const nav = document.createElement('div');
    nav.className = 'site-footer__links';

    const cleanPhone = this.config.whatsapp.replace(/[^0-9A-Za-z]/g, '');
    const waLink = document.createElement('a');
    waLink.className = 'site-footer__link';
    waLink.href = `https://wa.me/${cleanPhone}`;
    waLink.target = '_blank';
    waLink.rel = 'noopener noreferrer';
    waLink.textContent = 'WhatsApp';

    const cleanInsta = this.config.instagram.replace(/^@/, '');
    const igLink = document.createElement('a');
    igLink.className = 'site-footer__link';
    igLink.href = `https://instagram.com/${cleanInsta}`;
    igLink.target = '_blank';
    igLink.rel = 'noopener noreferrer';
    igLink.textContent = 'Instagram';

    const hours = document.createElement('span');
    hours.className = 'site-footer__hours';
    hours.textContent = this.config.hours;

    nav.appendChild(waLink);
    nav.appendChild(igLink);
    nav.appendChild(hours);

    mainRow.appendChild(wordmark);
    mainRow.appendChild(nav);

    const bottomRow = document.createElement('div');
    bottomRow.className = 'site-footer__bottom';

    const copyright = document.createElement('p');
    copyright.className = 'site-footer__copyright';
    const year = new Date().getFullYear();
    copyright.textContent = `© ${year} ${this.config.brand}`;

    bottomRow.appendChild(copyright);

    container.appendChild(mainRow);
    container.appendChild(bottomRow);
    footer.appendChild(container);

    root.appendChild(footer);
  }
}
