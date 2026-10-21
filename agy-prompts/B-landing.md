TAREFA: Construir a landing page única da KatiaParfum (Vite + TypeScript vanilla) a partir de src/data/fragrances.json, seguindo a seção 3 de PLANO.md à risca.

CONTEXTO: Leia PLANO.md inteiro antes de começar — ele define tokens de cor, tipografia, wireframe, princípios e estrutura SOLID. Tipos já existem em src/domain/Fragrance.ts e src/domain/FragranceRepository.ts (não altere). Dados: src/data/fragrances.json (8 fragrâncias). Imagens em public/products/. O objetivo de design é NÃO parecer gerado por IA: uma única ousadia (o seletor do hero), resto contido.

ARQUIVOS (criar):
- index.html — lang="pt-BR", <title>KatiaParfum</title>, meta description, Google Fonts Bodoni Moda (400,500) + Hanken Grotesk (400,500,600) com preconnect; <main id="app">.
- src/main.ts — composição: new JsonFragranceRepository(data); monta Header, Hero, CollectionEight, Catalog, HowToUse, Footer injetando repo/config.
- src/infra/JsonFragranceRepository.ts — implementa FragranceRepository.
- src/config/site.ts — { brand: 'KatiaParfum', whatsapp: '55XXXXXXXXXXX', instagram: 'katiaparfum', hours: 'Segunda a sexta, das 9h às 19h' } (placeholders, comentário dizendo para preencher).
- src/config/palette.ts — Record<string,string> número->hex exatamente: 08 #8E1B3A, 17 #C2621B, 26 #6E7F5A, 35 #B5782A, 44 #B4506A, 53 #4A3326, 62 #C9B92E, 80 #6B4A3A; fallback #6D5F7E.
- src/format/currency.ts — formatBRL via Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).
- src/format/whatsapp.ts — buildOrderLink(phone, fragrance, variant): https://wa.me/<phone>?text=<encodeURIComponent("Olá Katia! Quero o <fullName> <volume> ml (<preço>).")>.
- src/ui/Component.ts — interface Component { mount(root: HTMLElement): void }.
- src/ui/Header.ts, Hero.ts, CollectionEight.ts, Catalog.ts, HowToUse.ts, Footer.ts — cada um implementa Component, recebe dependências no construtor (Pick<FragranceRepository,'all'> etc.), cria DOM com document.createElement/textContent (nunca innerHTML com dados).
- src/styles/tokens.css, base.css, sections.css — importados em main.ts.

DETALHES POR SEÇÃO:
- Header: wordmark "KatiaParfum" em Bodoni Moda 28px; à direita link "Pedir no WhatsApp" (wa.me sem texto). Sem menu.
- Hero (o elemento ousado): h1 "Como você quer se sentir hoje?" (Hanken 21px, --ameixa-suave). Frase feelsLike da fragrância ativa entre aspas tipográficas “ ” em Bodoni Moda clamp(38px, 7vw, 89px), line-height 1.05, máx 14ch. Abaixo: fullName (Hanken 600, 21px), keyNotes juntas por ", ", preço "a partir de R$ 149,90" em --latao, botão "Pedir <fullName> pelo WhatsApp" (30ml). À direita a foto de campanha images[1] (modelo segurando o frasco; aspect-ratio 4/5, object-fit cover, border-radius 2px, sem sombra; fallback images[0]). Ao trocar de fragrância a foto troca junto (pré-carregue as 8 após o load com new Image()).
IMAGENS: images[0] = frasco sobre fundo creme claro; images[1] = foto de campanha. No catálogo use images[0] com mix-blend-mode: multiply para o fundo creme se fundir ao fundo da página. Todas as <img> com width/height (900x900), loading="lazy" exceto a do hero, e alt descritivo ("Frasco de Secret Citric 62", "Campanha de Secret Citric 62"). Seletor: div role="radiogroup" aria-label="Escolha a fragrância" com 8 botões role="radio" aria-checked, texto = número em Bodoni 28px, borda inferior 2px na cor da fragrância quando ativo; setas ←/→ movem seleção (roving tabindex). Ao trocar: atualiza textos/imagem, aria-live="polite" na frase, e seta --tinta-fragrancia no elemento hero; fundo do hero = color-mix(in oklab, var(--tinta-fragrancia) 14%, var(--nevoa)), transition background-color 400ms. Inicial: 62.
- CollectionEight: h2 "Coleção 8" (Bodoni 50px). Parágrafo: "Em cada fragrância, os dois algarismos somam 8 — o número da prosperidade e do infinito." Linha com as somas derivadas dos dados (ex "6 + 2" para 62), em Bodoni 38px, gap generoso, cada uma com o nome curto embaixo em 14px. Sem cards.
- Catalog: h2 "Todas as fragrâncias". Lista <ul> de linhas separadas por borda 1px rgba(43,30,58,.15). Cada linha (grid desktop: 120px | 1fr | 1fr | auto): imagem 120px, nome Bodoni 28px + número, família + categoria em --ameixa-suave, pirâmide (Topo/Corpo/Fundo com rótulos em sentence case), e controle segmentado 30 ml | 100 ml (radio inputs nativos estilizados) que atualiza o preço e o href do link "Pedir pelo WhatsApp". Ponto de 6px na cor da fragrância ao lado do nome. Mobile (<720px): bloco empilhado.
- HowToUse: h2 "Como usar". 3 parágrafos curtos reescritos de howToUse da primeira fragrância: aplicar na pele limpa e hidratada nos pontos de pulsação; 1–2 borrifadas para efeito suave; aplicar também na roupa para prolongar. Largura máx 60ch.
- Footer: wordmark, WhatsApp, Instagram (link https://instagram.com/<user>), horário, "© <ano> KatiaParfum". Nada da Oulab (sem CNPJ, endereço, logos).

CSS:
- tokens.css: --nevoa #E7E4EC, --berinjela #2B1E3A, --ameixa-suave #6D5F7E, --latao #A88A45, --vidro #F6F5F8; escala de fonte 14/16/21/28/38/50/67/89; espaçamentos 8/16/24/40/64/104.
- body: background var(--nevoa); color var(--berinjela); Hanken Grotesk 16px/1.55. Container max 1200px, padding-inline 16px (mobile) / 40px (≥720px). Seções separadas por padding-block 104px (64px mobile) — defina SÓ em .section, sem margens conflitantes.
- Botões: fundo --berinjela, texto --vidro, border-radius 2px, padding 14px 24px, sem seta, sem sombra. Hover: fundo var(--tinta-fragrancia, #2B1E3A) com cor de texto que mantenha contraste (use --vidro só se a cor for escura; para 62 e 17 mantenha --berinjela de fundo — implemente via classe .is-light-tint definida em palette: números 62, 35, 17 são claros).
- :focus-visible { outline: 2px solid var(--latao); outline-offset: 3px }.
- @media (prefers-reduced-motion: reduce) desliga transitions.
- Sem: text-transform uppercase, letter-spacing largo, gradientes, box-shadow, animações de entrada, border-radius > 4px, fontes monospace, "→".
- Nenhuma rolagem horizontal em 360px (exceto o seletor do hero no mobile, que é overflow-x auto com scroll-snap).

NÃO FAÇA: não altere src/domain/*, scripts/*, src/data/*, package.json; não adicione dependências nem frameworks; não execute comandos de terminal; não crie outras páginas.

PRONTO QUANDO: todos os arquivos existem, código em TS strict sem any, a página renderiza as 8 fragrâncias com o hero interativo e links de WhatsApp corretos.

RESPOSTA: Responda apenas com a lista de arquivos alterados e uma linha por arquivo descrevendo a mudança. Não cole código.
