CORREÇÃO após revisão visual (screenshots em 1440px e 390px). Ajuste apenas CSS/TS de src/ui e src/styles:

1. MOBILE COM ROLAGEM HORIZONTAL (bug principal, 390px): o header corta o link "Pedir no WhatsApp", o h2 "Todas as fragrâncias" (50px) estoura a largura e a grade da Coleção 8 também. Corrija:
   - h2 de seção: font-size clamp(38px, 8vw, 50px); overflow-wrap: anywhere não — prefira reduzir tamanho.
   - Header: em <720px o link vira só "WhatsApp" (texto curto via span visualmente oculto ou dois spans com display por media query), sem estourar.
   - Garanta html, body { overflow-x: clip } NÃO como solução; corrija a causa. Todos os grids com minmax(0,1fr).
2. Seletor do hero no desktop quebra em duas linhas (80 cai sozinho). Deve ser uma linha única: display grid, grid-template-columns: repeat(8, minmax(0,1fr)), largura do bloco de texto. No mobile mantém faixa com overflow-x auto + scroll-snap (só o seletor rola).
3. Coleção 8 quebra em 7 + 1 no desktop. Use grid repeat(8, minmax(0,1fr)) no desktop e repeat(4, minmax(0,1fr)) abaixo de 720px (2 linhas de 4). Fonte das somas clamp(28px, 4vw, 38px).
4. Metadados do catálogo usam " · " (ex "Frutal Sedutor · Frutal"). Mostre só a família olfativa em sentence case ("Frutal sedutor"); remova a categoria repetida.
5. Imagens do catálogo: aumente para 160px no desktop e zoom no frasco com object-fit: cover + transform: scale(1.35) dentro de um wrapper overflow:hidden, para o frasco não ficar minúsculo. No mobile, imagem 120px alinhada à esquerda (não full width).

NÃO FAÇA: não mude dados, domínio, scripts nem package.json; não execute comandos.
RESPOSTA: só lista de arquivos alterados com uma linha cada.
