# KatiaParfum — Plano de implementação

Landing page única que apresenta as fragrâncias raspadas de https://www.oulab.com.br/ sob a marca **KatiaParfum**.
Execução: Claude planeja e verifica; o **agy** escreve o código; Claude roda `npm`, o scraper e o build.

---

## 1. Fonte dos dados (já verificada)

O site roda em VTEX. Não é preciso fazer parsing de HTML, porque a API pública de catálogo devolve tudo em JSON:

```
GET https://www.oulab.com.br/api/catalog_system/pub/products/search?_from=0&_to=49
```

Ela retorna 16 produtos: **8 fragrâncias × 2 tamanhos** (30 ml a R$ 149,90 e 100 ml a R$ 329,90).

| Nº | Fragrância | Categoria |
|---|---|---|
| 08 | Addictive Cherry | Frutal |
| 17 | Bold Saffron | Oriental |
| 26 | Unforgettable Flowers | Chypre |
| 35 | Juicy Amber | Oriental |
| 44 | Rich Rose | Floral |
| 53 | Noir Tobacco | Oriental |
| 62 | Secret Citric | Cítrico |
| 80 | Soulful Leather | Amadeirado |

Campos usados de cada produto: `productName`, `linkText`, `categories[0]`, `Notes[0]`, `Feels Like[0]`, `Família Olfativa[0]`, `Volumetria[0]`, `Como Usar[0]`, `description` (HTML com "TOPO / CORPO / FUNDO"), `items[0].images[].imageUrl` e `items[0].sellers[0].commertialOffer.Price` / `ListPrice`.

Os dígitos de todos os números somam 8 (0+8, 1+7, 2+6…). Esse é o conceito da "Coleção 8" do site e vira um elemento do design.

## 2. Stack e estrutura (princípios SOLID)

**Stack:** Vite + TypeScript vanilla, sem framework de UI. Dependências de desenvolvimento: `vite`, `typescript` e `tsx` (para rodar o scraper). O Node 22 já tem `fetch`, então não entra nenhuma lib de scraping.

```
scripts/
  scrape.ts                 # entrypoint: orquestra apenas
  scraper/
    VtexCatalogClient.ts    # S: só HTTP com a API VTEX
    ProductMapper.ts        # S: JSON VTEX -> Fragrance (domínio)
    ImageDownloader.ts      # S: baixa imagens p/ public/products/
    JsonWriter.ts           # S: grava src/data/fragrances.json
src/
  domain/
    Fragrance.ts            # tipos: Fragrance, Variant, NotesPyramid
    FragranceRepository.ts  # D/I: interface { all(): Fragrance[]; byNumber(n) }
  infra/
    JsonFragranceRepository.ts  # implementação que lê fragrances.json
  config/
    site.ts                 # nome, WhatsApp, Instagram da Katia (placeholders)
    palette.ts              # cor de cada fragrância por número (O: estender sem editar componentes)
  format/
    currency.ts             # formatBRL(n) com Intl
    whatsapp.ts             # buildOrderLink(fragrance, variant)
  ui/
    Component.ts            # interface { mount(root: HTMLElement): void }
    Hero.ts  CollectionEight.ts  Catalog.ts  HowToUse.ts  Footer.ts
  main.ts                   # composição: instancia o repo e injeta nos componentes
  styles/ tokens.css  base.css  sections.css
index.html
```

Como cada letra do SOLID aparece:

- **S:** cada arquivo tem uma responsabilidade.
- **O:** uma fragrância nova entra só pelo JSON e pelo `palette.ts`, sem tocar nos componentes.
- **L:** qualquer `FragranceRepository` substitui o JSON (no futuro, uma API).
- **I:** os componentes recebem só o que usam (`Pick<FragranceRepository, 'all'>`).
- **D:** `main.ts` injeta as dependências e nenhum componente importa a infra diretamente.

## 3. Direção de design (skill frontend-design)

**Assunto:** a página de uma revendedora de perfumaria de nicho. O público compra pelo WhatsApp ou Instagram e escolhe a fragrância pela **sensação**. O site original já fala assim, com frases como "Em uma festa de verão sem fim".
**Trabalho principal da página:** fazer a pessoa achar a fragrância dela e pedir pelo WhatsApp.

### Tokens

| Token | Hex | Uso |
|---|---|---|
| `--nevoa` | `#E7E4EC` | fundo base (lavanda acinzentado e frio, de propósito longe do creme) |
| `--berinjela` | `#2B1E3A` | texto e tinta principal |
| `--ameixa-suave` | `#6D5F7E` | texto secundário |
| `--latao` | `#A88A45` | detalhe raro: preço e foco (remete ao "nosso ouro") |
| `--vidro` | `#F6F5F8` | superfícies elevadas |
| `--tinta-fragrancia` | variável | trocada via JS conforme a fragrância ativa |

Paleta por fragrância (`palette.ts`): 08 `#8E1B3A`, 17 `#C2621B`, 26 `#6E7F5A`, 35 `#B5782A`, 44 `#B4506A`, 53 `#4A3326`, 62 `#C9B92E`, 80 `#6B4A3A`.
O fundo do hero usa `color-mix(in oklab, var(--tinta-fragrancia) 14%, var(--nevoa))`, e o texto fica sempre em `--berinjela`, para manter o contraste AA.

**Tipografia (Google Fonts):**

- **Bodoni Moda** para display: tem o alto contraste do vernáculo de perfumaria.
- **Hanken Grotesk** para texto e UI.

Escala modular de 1.333: 14 / 16 / 21 / 28 / 38 / 50 / 67 / 89 px. Texto em `line-height: 1.55` e no máximo 65ch.
O alinhamento é à esquerda em toda a página. Só os números da Coleção 8 ficam centralizados no próprio bloco.

### Layout

```
┌──────────────────────────────────────────────────────┐
│ KatiaParfum                        Pedir no WhatsApp │
├──────────────────────────────────────────────────────┤
│ Como você quer se sentir hoje?                       │
│                                                      │
│  "Em uma festa de verão      ┌──────────┐            │
│   sem fim"   (Bodoni, 67px)  │  frasco  │            │
│  Secret Citric 62            │  (foto)  │            │
│  Grapefruit · Bergamota ·    └──────────┘            │
│  Âmbar                                               │
│                                                      │
│  [08] [17] [26] [35] [44] [53] [62] [80]  ← seletor  │
├──────────────────────────────────────────────────────┤
│ Coleção 8        0+8  1+7  2+6  3+5  4+4  5+3  6+2  8+0
│ texto curto explicando                               │
├──────────────────────────────────────────────────────┤
│ Catálogo: linhas, não cards                          │
│ img │ Nome + nº │ família │ notas │ 30ml|100ml │ Pedir │
│ ─────────────────────────────────────────────────────│
│ ...8 linhas                                          │
├──────────────────────────────────────────────────────┤
│ Como usar (3 frases curtas, tiradas de "Como Usar")  │
├──────────────────────────────────────────────────────┤
│ Rodapé: WhatsApp, Instagram, horário                 │
└──────────────────────────────────────────────────────┘
```

No mobile o hero empilha a frase, depois o frasco e por último o seletor, que vira uma faixa com rolagem horizontal (`scroll-snap`). As linhas do catálogo viram blocos com a imagem no topo.

### Princípios

1. **O elemento ousado é um só:** o hero "Como você quer se sentir hoje?". Ao clicar num número, a frase "Feels like" troca, a foto troca e o fundo muda de tinta numa transição de 400 ms. Esse é o único movimento da página, porque responde à ação da pessoa.
2. **O resto é quieto.** Nada de fade-in por seção, sombra cinza padrão, eyebrow em CAIXA ALTA, "→" nos botões, gradiente decorativo ou cards idênticos arredondados.
3. **Os números são nomes, não sequência.** Eles aparecem como identidade da fragrância e nunca como "01 / 02 / 03".
4. **A copy é direta e em sentence case.** O CTA diz o que acontece: "Pedir Secret Citric 62 pelo WhatsApp".
5. **Piso de qualidade:** foco visível (contorno `--latao` de 2px), `prefers-reduced-motion` desliga a transição, seletor com `role="radiogroup"` e navegação por setas, `alt` em todas as imagens e nenhuma rolagem horizontal da página com 16px de margem lateral.

**Revisão contra os defaults genéricos:** a primeira ideia era fundo creme + serifa + acento terracota, que é o default nº 1. Troquei por névoa fria + berinjela, com a cor vinda de cada fragrância. A grade de cards de produto também saiu e virou uma lista em linhas, para o catálogo ler como uma carta de perfumes.

## 4. Marca e conteúdo

- **Nome:** KatiaParfum, em wordmark tipográfico com Bodoni Moda. O logo da Oulab não é usado.
- **Do site original, aproveitar só o conteúdo de produto:** nomes, notas, frases, famílias, preços, imagens e o "como usar".
- **Não copiar:** CNPJ, endereço, telefone ou redes da Oulab.
- **Contato:** `site.ts` traz placeholders (`whatsapp: '55XXXXXXXXXXX'`, `instagram: '@katiaparfum'`) que precisam ser preenchidos com os dados reais.
- **Link de pedido:** `https://wa.me/<numero>?text=` com a mensagem "Olá Katia! Quero o <nome> <volume> (R$ <preço>)." codificada na URL.

## 5. Execução

| Passo | Quem | O quê |
|---|---|---|
| 1 | Claude | `npm init -y`, depois `npm i -D vite typescript tsx` e um `tsconfig.json` mínimo |
| 2 | agy | Prompt A: scraper (`scripts/`) e tipos de domínio |
| 3 | Claude | `npx tsx scripts/scrape.ts` e conferir se saem 8 fragrâncias e as imagens em `public/products/` |
| 4 | agy | Prompt B: landing completa (`src/`, `index.html`) |
| 5 | Claude | `npx tsc --noEmit` e `npx vite build`, e depois um screenshot desktop/mobile para criticar |
| 6 | agy (`-c`) | Correções pontuais, se houver |

Os prompts prontos para o agy estão em `agy-prompts/A-scraper.md` e `agy-prompts/B-landing.md`.

## 6. Critérios de pronto

- `src/data/fragrances.json` com 8 fragrâncias, cada uma com 2 variantes, notas (topo/corpo/fundo), frase "feels like" e 1–2 imagens locais.
- `npx tsc --noEmit` sem erros e `npx vite build` passando.
- O hero troca de fragrância por clique e pelas setas do teclado.
- O CTA de cada variante abre o WhatsApp com a mensagem correta.
- Nenhuma menção a dados empresariais da Oulab. Funciona em 360px de largura sem rolagem horizontal.
