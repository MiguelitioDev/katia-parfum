import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import fragrancesData from './data/fragrances.json';
import type { Fragrance } from './domain/Fragrance';
import { JsonFragranceRepository } from './infra/JsonFragranceRepository';
import { siteConfig } from './config/site';
import { Header } from './ui/Header';
import { Hero } from './ui/Hero';
import { CollectionEight } from './ui/CollectionEight';
import { Catalog } from './ui/Catalog';
import { HowToUse } from './ui/HowToUse';
import { Footer } from './ui/Footer';

function initApp(): void {
  const app = document.getElementById('app');
  if (!app) {
    throw new Error('Elemento #app não encontrado no DOM.');
  }

  const repository = new JsonFragranceRepository(fragrancesData as Fragrance[]);

  const header = new Header(siteConfig);
  const main = document.createElement('main');
  main.id = 'conteudo';
  main.tabIndex = -1;

  const mainComponents = [
    new Hero(repository, siteConfig),
    new CollectionEight(repository),
    new Catalog(repository, siteConfig),
    new HowToUse(),
  ];

  const footer = new Footer(siteConfig);

  header.mount(app);
  app.appendChild(main);
  mainComponents.forEach((component) => component.mount(main));
  footer.mount(app);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
