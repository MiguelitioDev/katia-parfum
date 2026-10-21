import type { Component } from './Component';

const STEPS: readonly string[] = [
  'Aplique a fragrância sempre na pele limpa e hidratada, nos principais pontos de pulsação, como pulsos, pescoço e atrás das orelhas.',
  'Para um efeito suave e íntimo, uma ou duas borrifadas são suficientes. Aproxime a aplicação caso deseje maior presença.',
  'Para prolongar a fixação ao longo do dia, aplique também sobre as roupas, evitando apenas tecidos delicados.',
];

export class HowToUse implements Component {
  mount(root: HTMLElement): void {
    const section = document.createElement('section');
    section.className = 'section how-to-use';

    const container = document.createElement('div');
    container.className = 'container how-to-use__container';

    const title = document.createElement('h2');
    title.className = 'how-to-use__title';
    title.textContent = 'Como usar';

    const list = document.createElement('ol');
    list.className = 'how-to-use__list';

    STEPS.forEach((stepText, index) => {
      const item = document.createElement('li');
      item.className = 'how-to-use__step';

      const number = document.createElement('span');
      number.className = 'how-to-use__number';
      number.setAttribute('aria-hidden', 'true');
      number.textContent = String(index + 1);

      const text = document.createElement('p');
      text.className = 'how-to-use__text';
      text.textContent = stepText;

      item.appendChild(number);
      item.appendChild(text);
      list.appendChild(item);
    });

    container.appendChild(title);
    container.appendChild(list);
    section.appendChild(container);

    root.appendChild(section);
  }
}
