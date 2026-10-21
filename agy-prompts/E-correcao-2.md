CORREÇÃO pontual após revisão visual. Altere apenas src/styles/sections.css (e Catalog.ts só se indispensável):

1. Seletor 30 ml | 100 ml do catálogo aparece com borda dupla: a moldura externa e o segmento selecionado têm bordas/espaço próprios, gerando um contorno duplo com um vão claro entre eles. Deve ser UMA moldura de 1px --berinjela com raio 2px e overflow hidden, sem padding interno; os dois segmentos encostam nela e entre si, separados apenas por uma divisória de 1px; o segmento selecionado preenche toda a metade (fundo --berinjela, texto --vidro). Altura mínima 44px no mobile, 36px no desktop.
2. Ponto de cor antes do nome da fragrância fica centralizado verticalmente quando o nome quebra em duas linhas (ex.: "Unforgettable Flowers 26"). Alinhe o ponto à primeira linha: container com align-items: flex-start e o ponto com margin-top calculado para centralizar na altura da primeira linha (ex.: margin-top: calc((1lh - 8px) / 2), com fallback 0.55em). flex-shrink: 0 no ponto.

NÃO FAÇA: nada além desses dois itens; não execute comandos.
RESPOSTA: só lista de arquivos alterados com uma linha cada.
