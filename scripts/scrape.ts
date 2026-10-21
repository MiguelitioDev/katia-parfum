import path from 'node:path';
import { VtexCatalogClient } from './scraper/VtexCatalogClient';
import { groupAndMap } from './scraper/ProductMapper';
import { ImageDownloader } from './scraper/ImageDownloader';
import { JsonWriter } from './scraper/JsonWriter';

async function run(): Promise<void> {
  const client = new VtexCatalogClient();
  const products = await client.fetchProducts();

  const fragrances = groupAndMap(products);

  const imagesDir = path.resolve(process.cwd(), 'public/products');
  const downloader = new ImageDownloader(imagesDir, '/products');

  for (const fragrance of fragrances) {
    const localImages: string[] = [];

    for (let i = 0; i < fragrance.images.length; i++) {
      const remoteUrl = fragrance.images[i];
      if (!remoteUrl) continue;

      const fileName = `${fragrance.number}-${i + 1}.jpg`;
      const publicPath = await downloader.download(remoteUrl, fileName);
      localImages.push(publicPath);
    }

    fragrance.images = localImages;
  }

  const outputFilePath = path.resolve(process.cwd(), 'src/data/fragrances.json');
  const writer = new JsonWriter();
  await writer.write(outputFilePath, fragrances);

  console.log(`${fragrances.length} fragrâncias salvas`);
}

run().catch((error: unknown) => {
  console.error('Falha ao executar o scraper:', error);
  process.exit(1);
});
