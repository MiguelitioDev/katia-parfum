TAREFA: Criar o scraper em TypeScript que baixa o catálogo da Oulab (API pública VTEX) e gera src/data/fragrances.json + imagens locais, seguindo SOLID.

CONTEXTO: Projeto Vite + TypeScript vanilla (Node 22, fetch nativo, ESM, "type": "module"). Leia PLANO.md na raiz para visão geral. O scraper será rodado por outra pessoa com `npx tsx scripts/scrape.ts`.
Endpoint: GET https://www.oulab.com.br/api/catalog_system/pub/products/search?_from=0&_to=49 (header User-Agent "Mozilla/5.0"). Retorna array de 16 produtos = 8 fragrâncias x (30ml, 100ml).

ARQUIVOS (criar):
- src/domain/Fragrance.ts — tipos:
  export interface Variant { volumeMl: 30 | 100; price: number; listPrice: number; sourceSlug: string }
  export interface NotesPyramid { top: string[]; heart: string[]; base: string[] }
  export interface Fragrance { number: string /* "08","62"... */; name: string /* "Secret Citric" */; fullName: string /* "Secret Citric 62" */; category: string /* "Cítrico" */; family: string /* Família Olfativa */; feelsLike: string; keyNotes: string[]; pyramid: NotesPyramid; description: string /* texto puro, 1º parágrafo */; howToUse: string; images: string[] /* caminhos públicos "/products/62-1.jpg" */; variants: Variant[] /* ordenadas 30, 100 */ }
- src/domain/FragranceRepository.ts — export interface FragranceRepository { all(): Fragrance[]; byNumber(n: string): Fragrance | undefined }
- scripts/scraper/VtexCatalogClient.ts — classe com método fetchProducts(): Promise<VtexProduct[]>; define tipo VtexProduct mínimo (só campos usados). Lança Error com status HTTP se !res.ok.
- scripts/scraper/ProductMapper.ts — função pura groupAndMap(products: VtexProduct[]): Fragrance[] (sem I/O; images ainda com URLs remotas).
- scripts/scraper/ImageDownloader.ts — classe que recebe pasta destino; download(url, fileName): Promise<string> retorna caminho público. Cria pasta se não existir.
- scripts/scraper/JsonWriter.ts — write(path, data) com JSON.stringify(data, null, 2) em UTF-8.
- scripts/scrape.ts — entrypoint que só orquestra: client -> mapper -> downloader (troca URLs por locais) -> writer. Loga "N fragrâncias salvas".

DETALHES:
- Agrupar por fragrância: extrair nome e número de productName com regex /^(.*?)\s+(\d{2})\s+Deo Parfum\s+(\d+)\s*ml/i (case-insensitive; há "100ML").
- category: categories[0] ex "/Perfume/Cítrico/" -> "Cítrico".
- Campos vêm como arrays de 1 string: p["Notes"][0] = "Grapefruit . Bergamota . Âmbar" -> keyNotes split por " . " com trim. p["Feels Like"][0], p["Família Olfativa"][0], p["Como Usar"][0]. Se ausente, string vazia / [].
- description é HTML: 1º parágrafo = texto antes do primeiro "<br><br>", removendo tags. Pirâmide: localizar linhas "TOPO:", "CORPO:", "FUNDO:" (separadas por <br>), split por ",", trim, converter de CAIXA ALTA para Title Case pt-BR (ex "MUSGO DE CARVALHO" -> "Musgo de Carvalho"; preposições de/da/do/e em minúsculo).
- Preço: items[0].sellers[0].commertialOffer.Price e .ListPrice. sourceSlug = linkText.
- Imagens: usar as 2 primeiras de items[0].images[].imageUrl da variante 30ml. Reescrever /arquivos/ids/(\d+)/ para /arquivos/ids/$1-900-900/ e remover querystring. Salvar em public/products/<numero>-<i>.jpg; caminho público "/products/<numero>-<i>.jpg".
- Ordenar fragrâncias por número crescente. Downloads em sequência (não paralelo massivo).
- Tipos estritos, sem any.

NÃO FAÇA: não crie arquivos em src/ além dos dois de domain; não instale dependências nem edite package.json; não execute comandos de terminal; não use bibliotecas de scraping/HTML parser.

PRONTO QUANDO: os 7 arquivos existem, compilam com tsc strict, e scrape.ts produz src/data/fragrances.json com 8 itens de 2 variantes cada.

RESPOSTA: Responda apenas com a lista de arquivos alterados e uma linha por arquivo descrevendo a mudança. Não cole código.
