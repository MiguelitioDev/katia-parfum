TAREFA: Redesenhar o visual da landing page KatiaParfum (Vite + TypeScript vanilla, já funcionando), mantendo toda a funcionalidade e a arquitetura SOLID existentes.

CONTEXTO:
- Landing de uma revendedora de perfumaria de nicho. Pedidos são feitos pelo WhatsApp. Público escolhe a fragrância pela sensação ("Feels like").
- Estrutura atual: src/ui/{Header,Hero,CollectionEight,Catalog,HowToUse,Footer}.ts (DOM via createElement), src/styles/{tokens,base,sections}.css, src/config/{site,palette}.ts, src/format/*, src/domain/*, src/infra/*.
- Fotos em public/products/: <n>-1.jpg = frasco sobre fundo creme quente (~#EEE7E2) com sombra; <n>-2.jpg = foto de campanha (modelo com o frasco, céu azul/tons quentes).
- Problemas encontrados na auditoria visual (corrija todos):
  1. Fundo do hero = color-mix(tinta da fragrância, lavanda) fica sujo/barrento (com 62, amarelo-esverdeado, vira bege-cinza).
  2. Fotos do frasco com mix-blend-mode multiply sobre lavanda fria mostram um quadrado creme; quente x frio briga.
  3. Citação do hero a 89px é grande demais.
  4. Catálogo repete 8 botões escuros pesados que competem com o CTA principal do hero.
  5. No mobile o seletor de números fica abaixo da foto grande: ao trocar a fragrância, a frase muda fora da tela.

DIREÇÃO DE DESIGN (siga exatamente):
Conceito: "balcão de prova". O hero é um balcão escuro onde a fotografia de campanha brilha; o resto da página é claro, calmo, como uma carta de perfumes impressa. A cor de cada fragrância é só acento (fio, ponto), nunca fundo.

Tokens (tokens.css — substitua os de cor, mantenha nomes existentes quando possível):
  --berinjela #2B1E3A   (texto principal; fundo do hero)
  --berinjela-2 #3A2B4C (superfícies dentro do hero: borda do seletor, hover)
  --ameixa-suave #6D5F7E (texto secundário no claro)
  --lilas-claro #CFC6DA  (texto secundário sobre berinjela; contraste ≥ 4.5:1)
  --nevoa #EEEBF1        (fundo da página, levemente mais claro que hoje)
  --vidro #FBFAFC        (texto sobre berinjela, superfícies)
  --latao #A88A45        (preço e foco no claro) ; --latao-claro #D4B872 (preço e foco sobre berinjela)
  --linha rgba(43,30,58,.14) (divisórias)
  --foto #EEE7E2         (cor de fundo das molduras de frasco = cor do fundo da foto; serve de placeholder enquanto a imagem carrega)
  --tinta-fragrancia continua sendo setada via JS.
Tipografia: manter Bodoni Moda (display) + Hanken Grotesk (texto). Nova escala: 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64. Nada acima de 64px.
Raio: 2px em tudo que tiver raio. Sem box-shadow, sem gradiente, sem uppercase, sem letter-spacing largo, sem "→", sem emojis, sem animação de entrada.

MUDANÇAS POR ARQUIVO:

src/styles/tokens.css, base.css, sections.css — reescreva conforme abaixo, removendo regras mortas. Seções com padding-block só via .section (64px mobile / 96px ≥720px). Container max 1200px, padding-inline 16px / 40px.

Header (Header.ts + CSS): fundo --nevoa, borda inferior 1px --linha, altura 64px. Wordmark Bodoni 26px. Link à direita mantém comportamento atual (texto curto no mobile). Hover do link: sublinhado mais grosso (text-decoration-thickness 2px).

Hero (Hero.ts + CSS) — fundo sólido --berinjela, texto --vidro:
- Desktop (≥960px): grid 2 colunas 7fr / 5fr, gap 64px, alinhado ao topo. Coluna esquerda em ordem: pergunta "Como você quer se sentir hoje?" (Hanken 18px, --lilas-claro) → seletor → citação → nome → notas → preço → CTA. Coluna direita: foto de campanha aspect-ratio 4/5, object-fit cover, raio 2px.
- Mobile (<960px): ordem pergunta → seletor → foto (aspect-ratio 4/5, largura total, máx 70vh de altura com object-fit cover) → citação → nome/notas/preço → CTA. Assim a troca é visível. Use CSS grid-template-areas; NÃO duplique elementos no DOM.
- Seletor (manter role radiogroup, aria-checked, roving tabindex e setas): botões Bodoni 26px, cor --lilas-claro, ativo em --vidro com fio inferior 2px var(--tinta-fragrancia) e um ponto 6px da mesma cor acima do número. Grid repeat(8, minmax(0,1fr)) no desktop; no mobile faixa overflow-x auto com scroll-snap e padding-inline para o último item não colar na borda. Hover: cor --vidro.
- Citação: Bodoni clamp(36px, 5vw, 64px), line-height 1.08, máx 16ch, aspas tipográficas, aria-live polite.
- Nome Hanken 600 22px; notas 16px --lilas-claro; preço "a partir de R$ 149,90" em --latao-claro.
- CTA primário (o único botão sólido da página inteira): fundo --vidro, texto --berinjela, padding 16px 28px, raio 2px. Hover: fundo --tinta-fragrancia com texto --berinjela se a tinta for clara (is-light-tint: 62, 35, 17) ou --vidro se escura. Focus-visible: outline 2px --latao-claro offset 3px.
- Troca de fragrância: remova o color-mix de fundo. A única transição é a foto: crossfade de opacidade 250ms (mantenha <img> único: ao trocar, opacity 0 → troca src → no load opacity 1). prefers-reduced-motion: troca direta.
- Mantenha pré-carregamento das imagens.

CollectionEight: mantém conteúdo e grids (8 col desktop, 4 col mobile). Título Bodoni 48px (36 mobile). Somas Bodoni clamp(28px,3.5vw,36px) com o "+" em --ameixa-suave; nome em 14px --ameixa-suave abaixo. Cada soma tem um fio superior 2px na cor da fragrância (palette.ts) — é a única informação de cor da seção.

Catalog — vira uma carta de perfumes legível para comparação:
- Título "Todas as fragrâncias" Bodoni 48px (36 mobile) + linha de apoio 16px --ameixa-suave: "30 ml por R$ 149,90 ou 100 ml por R$ 329,90." (gere a partir dos dados: menor e maior preço por volume da primeira fragrância; não hardcode números).
- Cada item <li> em grid desktop: [moldura 152px] [bloco nome] [pirâmide] [compra], colunas 152px minmax(0,1.1fr) minmax(0,1.3fr) 200px, gap 32px, padding-block 32px, divisória 1px --linha.
- Moldura: div com fundo --foto, aspect-ratio 1, raio 2px, overflow hidden; img object-fit cover com transform scale(1.25). REMOVA mix-blend-mode.
- Bloco nome: ponto 8px var(--cor) + nome Bodoni 28px; abaixo família olfativa 14px --ameixa-suave; abaixo a frase feelsLike em Bodoni itálico 18px (é o que diferencia as fragrâncias na leitura).
- Pirâmide: <dl> com dt "Topo", "Corpo", "Fundo" (Hanken 600 14px) e dd 14px; mantenha dados atuais.
- Compra (alinhada à direita no desktop): seletor 30 ml | 100 ml (inputs radio nativos já existentes; estilo: duas metades com borda 1px --berinjela, raio 2px, selecionado com fundo --berinjela e texto --vidro, focus-visible com outline --latao), preço Hanken 600 22px --berinjela, e link "Pedir pelo WhatsApp" como CTA SECUNDÁRIO: texto --berinjela, sublinhado 1px offset 4px, peso 600; hover sublinhado 2px. Nada de botão sólido aqui.
- Mobile (<720px): grid 2 colunas [moldura 96px][nome+família+frase]; pirâmide e compra ocupam a largura total abaixo; compra em linha: seletor à esquerda, preço à direita, link embaixo.
- Tablet (720–959px): pirâmide desce para baixo do bloco nome; compra continua à direita.

HowToUse: layout de 2 colunas ≥960px: título à esquerda (Bodoni 48px) e os 3 passos à direita como <ol> (são de fato uma sequência), cada passo com número Bodoni 28px --latao e texto 16px, máx 60ch. Mobile empilha.

Footer: fundo --berinjela, texto --vidro, links --vidro sublinhados, horário --lilas-claro, copyright 14px --lilas-claro. Grid: wordmark à esquerda, links e horário à direita; empilha no mobile. Padding-block 64px.

Qualidade obrigatória:
- Zero rolagem horizontal da página em 360px (só o seletor do hero rola).
- Contraste AA em todo texto. Focus visível em todo interativo. Áreas de toque ≥ 44px no mobile (seletor e radios).
- Todos os grids usam minmax(0,1fr). Sem regras de margem conflitantes entre .section e classes de seção.
- Mantenha todos os textos alt, aria-* e o comportamento de JS atual (links de WhatsApp, atualização de preço, teclado no seletor).

NÃO FAÇA: não altere src/domain, src/infra, src/format, scripts/, src/data, package.json, index.html (exceto se precisar ajustar pesos de fonte do Google Fonts: Bodoni Moda 400 e 400 itálico, Hanken 400/500/600); não adicione dependências; não crie novas seções ou funcionalidades; não execute comandos de terminal.

PRONTO QUANDO: todos os 5 problemas da auditoria estão resolvidos, a direção acima está aplicada em todas as seções e o TypeScript continua strict sem any.

RESPOSTA: Responda apenas com a lista de arquivos alterados e uma linha por arquivo descrevendo a mudança. Não cole código.
