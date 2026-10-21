TAREFA: Deixar o header fixo e ajustar fontes e cores da landing KatiaParfum para leitura confortável (sem cansar a vista, sem letras finas ou que "desaparecem").

CONTEXTO: Vite + TS vanilla. Estilos em src/styles/{tokens,base,sections}.css; fontes carregadas em index.html (Google Fonts). Diagnóstico:
- Bodoni Moda tem hairlines finíssimas: números ("4", "1"), o "+" da Coleção 8 e o itálico do catálogo quase somem.
- Vários textos a 14px em --ameixa-suave (#6D5F7E) sobre --nevoa ficam fracos.
- --latao (#A88A45) sobre fundo claro tem contraste ~3:1, insuficiente para texto pequeno.
- body usa -webkit-font-smoothing: antialiased, que afina ainda mais o texto.
- Branco quase puro (#FBFAFC) sobre berinjela gera brilho excessivo em blocos de texto.

ARQUIVOS E MUDANÇAS:

index.html — troque Bodoni Moda por Libre Bodoni: family=Libre+Bodoni:ital,wght@0,400..700;1,400..700 (mantenha Hanken Grotesk 400;500;600 e display=swap, preconnect).

src/styles/tokens.css:
- --font-serif: 'Libre Bodoni', Georgia, serif;
- Cores (substituir/adicionar):
  --ameixa-suave: #574A68   (texto secundário no claro, ≥ 7:1 sobre --nevoa)
  --lilas-claro: #D9D1E3    (texto secundário no escuro)
  --texto-claro: #F1ECF4    (texto principal sobre berinjela — mais suave que branco puro)
  --latao-escuro: #7A6226   (latão para texto em fundo claro, ≥ 4.5:1)
  manter --berinjela, --berinjela-2, --nevoa, --vidro, --latao, --latao-claro, --linha, --foto.
- Escala: troque --font-14 por --font-15: 15px e crie --font-17: 17px. Atualize TODAS as referências a --font-14 em base.css e sections.css para --font-15.

src/styles/base.css:
- body: font-size var(--font-17); line-height 1.6; color var(--berinjela). REMOVA -webkit-font-smoothing e -moz-osx-font-smoothing.
- html: scroll-padding-top: 72px.
- h1–h4: font-weight 500 (Libre Bodoni).
- :focus-visible continua --latao em fundo claro; dentro do hero e do footer use --latao-claro (já deve existir; confira).

src/styles/sections.css:
- HEADER FIXO: .site-header { position: sticky; top: 0; z-index: 50; background: var(--nevoa); border-bottom: 1px solid var(--linha); } Altura continua 64px. Wordmark Libre Bodoni peso 600, 26px. Link do header: Hanken 600 16px. Garanta que nada no hero/seletor fique por cima do header (sem z-index acima de 50 no resto da página).
- Pesos do serif: todos os usos de var(--font-serif) com peso 500 (títulos de seção, citação do hero, nomes no catálogo, números do seletor, somas da Coleção 8, números do Como usar); wordmarks 600. Itálico da frase feelsLike no catálogo: Libre Bodoni italic 500, 19px, cor --berinjela.
- Coleção 8: o "+" passa para --ameixa-suave com peso 500 (não mais claro que isso); nomes abaixo 15px --ameixa-suave.
- Hero (fundo berinjela): textos principais (citação, nome, CTA não) em --texto-claro; pergunta, notas e números inativos do seletor em --lilas-claro; número ativo em --texto-claro. Citação: line-height 1.12.
- Catálogo: família olfativa 15px --ameixa-suave peso 500; dt da pirâmide 15px peso 600 --berinjela; dd 15px --ameixa-suave peso 500 (não 400); textos dos radios 15px peso 600.
- Como usar: números em --latao-escuro (não --latao); texto 17px.
- Footer: texto --texto-claro; horário e copyright --lilas-claro 15px peso 500.
- Qualquer outro texto em --latao sobre fundo claro passa para --latao-escuro.
- Nenhum texto da página com font-weight < 400 e nenhum texto de leitura abaixo de 15px.

NÃO FAÇA: não altere src/ui (a menos que algum texto use estilo inline), src/domain, src/infra, src/format, scripts, src/data, package.json; não mude layout além do header fixo; não adicione dependências; não execute comandos.

PRONTO QUANDO: header permanece visível ao rolar; Bodoni Moda não aparece mais em nenhum lugar; todo texto tem contraste AA (≥ 4.5:1, ou ≥ 3:1 apenas para texto ≥ 24px); nenhuma referência a --font-14 restante.

RESPOSTA: Responda apenas com a lista de arquivos alterados e uma linha por arquivo descrevendo a mudança. Não cole código.
