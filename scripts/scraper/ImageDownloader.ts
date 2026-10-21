import fs from 'node:fs';
import path from 'node:path';

export class ImageDownloader {
  private readonly targetDir: string;
  private readonly publicPrefix: string;

  constructor(targetDir: string, publicPrefix = '/products') {
    this.targetDir = targetDir;
    this.publicPrefix = publicPrefix.replace(/\/+$/, '');
  }

  async download(url: string, fileName: string): Promise<string> {
    await fs.promises.mkdir(this.targetDir, { recursive: true });

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Falha ao baixar imagem de ${url}: HTTP ${response.status} ${response.statusText}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const filePath = path.join(this.targetDir, fileName);
    await fs.promises.writeFile(filePath, Buffer.from(arrayBuffer));

    return `${this.publicPrefix}/${fileName}`;
  }
}
