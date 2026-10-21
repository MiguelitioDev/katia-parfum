# KatiaParfum

Landing page de apresentação da KatiaParfum, revenda de perfumaria de nicho. A página mostra as 8 fragrâncias da Coleção 8, cada uma em 30 ml e 100 ml, e encaminha o pedido para o WhatsApp com a mensagem já preenchida.

O catálogo (nomes, notas, pirâmide olfativa, preços e fotos) é obtido da API pública de catálogo VTEX de [oulab.com.br](https://www.oulab.com.br/) por um script de raspagem.

## Stack

- [Vite](https://vite.dev/) + TypeScript (vanilla, sem framework de UI)
- [`tsx`](https://github.com/privatenumber/tsx) para rodar o scraper
- Fontes: Libre Bodoni (títulos) e Hanken Grotesk (texto), via Google Fonts

Requer Node.js 22 ou mais recente (usa o `fetch` nativo).

## Como rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # checagem de tipos + build de produção em dist/
npm run scrape   # atualiza src/data/fragrances.json e public/products/
```

## Configuração

Antes de publicar, preencha os contatos reais em `src/config/site.ts`:

| Campo | Descrição |
|---|---|
| `whatsapp` | Número com DDI e DDD, só dígitos (ex.: `5511999999999`) |
| `instagram` | Usuário sem `@` |
| `hours` | Horário de atendimento exibido no rodapé |

## Estrutura

O código segue os princípios SOLID: cada módulo tem uma responsabilidade e os componentes recebem suas dependências em `main.ts`.

```
scripts/
  scrape.ts                   # orquestra a raspagem
  scraper/                    # cliente VTEX, mapeamento, download de imagens, escrita do JSON
src/
  domain/                     # tipos Fragrance e interface FragranceRepository
  infra/                      # JsonFragranceRepository
  config/                     # site.ts (contatos) e palette.ts (cor de cada fragrância)
  format/                     # moeda (Intl) e link do WhatsApp
  ui/                         # Header, Hero, CollectionEight, Catalog, HowToUse, Footer
  styles/                     # tokens.css, base.css, sections.css
  data/fragrances.json        # gerado pelo scraper
public/products/              # fotos baixadas pelo scraper (<número>-1 frasco, <número>-2 campanha)
agy-prompts/                  # prompts usados para delegar a implementação ao agy CLI
```

## Seções da página

1. **Hero**: "Como você quer se sentir hoje?". Ao escolher um dos 8 números, trocam a frase da fragrância, a foto de campanha e o botão de pedido.
2. **Coleção 8**: os dois algarismos de cada fragrância somam 8. Cada soma leva à fragrância no catálogo.
3. **Todas as fragrâncias**: lista para comparar família olfativa e pirâmide (topo, corpo, fundo), com seletor de 30 ml / 100 ml e link de pedido.
4. **Como usar**: três passos de aplicação.
5. **Rodapé**: contatos e horário.

## Acessibilidade

- Contraste AA em todo o texto (mínimo de 4,9:1).
- Texto com no mínimo 15px.
- Foco visível e link "Pular para o conteúdo".
- Seletor de fragrâncias com `role="radiogroup"` e navegação pelas setas do teclado.
- `prefers-reduced-motion` respeitado.
- Layout testado em 390, 820 e 1440 px.

## Observações

- As fotos e os textos de produto pertencem à Oulab. Confirme a autorização de uso antes de publicar a página.
- Na própria fonte, as fragrâncias 08 e 26 têm a mesma pirâmide olfativa, e a descrição do 08 (30 ml) é uma cópia da do 26. Por isso o scraper usa a descrição do 100 ml.
- `PLANO.md` registra o plano inicial. A direção visual atual está descrita em `agy-prompts/D-redesign.md`, `F-legibilidade-header.md` e `G-redesign-final.md`.
