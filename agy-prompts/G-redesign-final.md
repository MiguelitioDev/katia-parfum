TAREFA: Rodada final de redesign da landing KatiaParfum para qualidade de produção: fotos sem corte, semântica/acessibilidade, ritmo visual entre seções e polimento de interação — mantendo stack, arquitetura, conteúdo e funcionalidades.

CONTEXTO:
- Vite + TypeScript vanilla com arquitetura SOLID: src/ui/*.ts (componentes via createElement, interface Component.mount(root)), src/styles/{tokens,base,sections}.css, src/config/{site,palette}.ts. NÃO migre para framework, NÃO adicione dependências.
- Identidade atual (manter): fundo --nevoa #EEEBF1, texto --berinjela #2B1E3A, hero/footer em berinjela, Libre Bodoni (display, peso 500) + Hanken Grotesk (texto 17px), latão como detalhe. Tokens de contraste já validados: --ameixa-suave #574A68, --texto-claro #F1ECF4, --lilas-claro #D9D1E3, --latao-escuro #7A6226, --latao-claro #D4B872, --vidro #FBFAFC, --foto #EEE7E2.
- Fotos em public/products/: TODAS quadradas 900x900. <n>-1.jpg = frasco em fundo creme; <n>-2.jpg = campanha. Regra do cliente: não distorcer nem cortar fotos sem necessidade.
- Leia src/ui/*.ts e src/styles/*.css antes de editar. Textos em pt-BR, sentence case (não use Title Case).

MUDANÇAS:

1. Fotos sem corte
   - Hero: foto de campanha em aspect-ratio 1/1 (formato nativo), object-fit cover (sem corte real por ser quadrada), raio 2px. Desktop: coluna da foto 5fr como hoje, alinhada ao topo do bloco de texto. Adicione fetchpriority="high" e decoding="async" na <img> do hero (nas demais, loading="lazy" + decoding="async").
   - Catálogo: REMOVA transform: scale(1.25). Moldura aspect-ratio 1/1, img 100% x 100% object-fit cover (sem corte, pois é quadrada). Mantenha width/height 900 nos atributos.

2. Estrutura semântica (index.html + src/main.ts)
   - index.html: troque <main id="app"> por <div id="app"></div>. Adicione <meta name="theme-color" content="#EEEBF1"> e <meta name="color-scheme" content="light">.
   - main.ts: Header e Footer montam direto em #app; crie <main id="conteudo" tabindex="-1"> dentro de #app (entre header e footer) e monte Hero, CollectionEight, Catalog, HowToUse dentro dele. Mantenha o padrão de injeção de dependências.
   - Header: primeiro elemento é um skip link <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>, visualmente oculto até receber foco (aparece no canto superior esquerdo, fundo --berinjela, texto --texto-claro, padding 12px 16px, z-index 60).
   - Wordmark "KatiaParfum" e nomes de fragrância (hero e catálogo) com atributo translate="no".
   - Cada <li> do catálogo recebe id="fragrancia-<numero>" (ex.: fragrancia-62). CSS: scroll-margin-top: 80px (header fixo tem 64px).

3. Hero — indicadores que não dependem de cor
   - Seletor: estado ativo = número em --texto-claro + sublinhado 2px em --latao-claro (igual para todas) + ponto 8px na cor da fragrância com contorno 1px --texto-claro (assim 53 e 80, marrons, continuam visíveis). Inativos em --lilas-claro. Hover (somente em @media (hover: hover)): cor --texto-claro.
   - Mobile (<720px): o seletor deixa de ser faixa com rolagem; vira grid de 4 colunas x 2 linhas (repeat(4, minmax(0,1fr))), cada botão com min-height 48px, todos os 8 visíveis. Mantenha role=radiogroup, roving tabindex, setas ←/→ (e adicione ↑/↓ movendo ±4 no mobile é opcional — NÃO precisa).
   - CTA primário: hover deixa de usar --tinta-fragrancia; passa a fundo --latao-claro com texto --berinjela (contraste consistente para todas as fragrâncias). Remova a lógica/estilos is-light-tint que só serviam a esse hover, se não forem usados em mais nada.

4. Coleção 8 — vira navegação útil
   - Cada soma passa a ser um <a href="#fragrancia-<numero>"> (mantendo visual: fio superior 2px na cor da fragrância, somas em Libre Bodoni, nome em 15px). aria-label="Ver <fullName> no catálogo". Hover (hover: hover): nome sublinhado e fio superior engrossa para 4px (transition apenas de border-width/ color, 150ms). Focus-visible padrão.
   - Fundo da seção: --vidro (#FBFAFC), criando uma faixa clara distinta entre o hero escuro e o catálogo em --nevoa. Bordas superior e inferior 1px --linha.

5. Como usar — faixa própria
   - Fundo --foto (#EEE7E2, o mesmo tom das fotos do frasco) para fechar a página com calor antes do footer escuro. Verifique contraste: --berinjela e --latao-escuro sobre #EEE7E2 (ambos passam AA). Layout atual de 2 colunas mantido.

6. Polimento global (base.css / sections.css)
   - Preços (hero, catálogo, linha de apoio): font-variant-numeric: tabular-nums lining-nums.
   - h1, h2, citação do hero, nomes do catálogo: text-wrap: balance. Parágrafos: text-wrap: pretty.
   - a, button, label, input: touch-action: manipulation; -webkit-tap-highlight-color: transparent (o foco/hover visível já cobre o feedback).
   - Todos os estados :hover envolvidos em @media (hover: hover) and (pointer: fine), para não "grudar" no toque.
   - Liste propriedades nas transitions (nunca all). Todas desligadas em prefers-reduced-motion (já existe regra global; confirme).
   - Header fixo: confirme que o foco de teclado nunca fica escondido sob ele (scroll-padding-top já existe em html; mantenha 80px).
   - Flex children com texto: min-width: 0 onde houver flex/grid com nomes longos.

NÃO FAÇA: não altere src/domain, src/infra, src/format, scripts/, src/data, package.json, tsconfig; não remova seções, textos, fotos, links de WhatsApp, seletor de volume ou comportamento de teclado; não adicione gradientes, sombras, animações de entrada, uppercase, emojis ou novas fontes; não execute comandos de terminal.

PRONTO QUANDO:
- Nenhuma foto recebe scale/crop; hero e catálogo mostram as fotos quadradas inteiras.
- Header e footer fora de <main>; skip link funcional; ids fragrancia-NN existem e as somas da Coleção 8 navegam até eles sem ficar sob o header.
- Seletor do hero mostra os 8 números no mobile, sem rolagem.
- Ativo do seletor e hover do CTA são visíveis para todas as 8 fragrâncias.
- TypeScript strict sem any.

RESPOSTA: Responda apenas com a lista de arquivos alterados e uma linha por arquivo descrevendo a mudança. Não cole código.
