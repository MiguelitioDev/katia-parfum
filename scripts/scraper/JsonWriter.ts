import fs from 'node:fs';
import path from 'node:path';

export class JsonWriter {
  async write(filePath: string, data: unknown): Promise<void> {
    const dir = path.dirname(filePath);
    await fs.promises.mkdir(dir, { recursive: true });
    const json = JSON.stringify(data, null, 2) + '\n';
    await fs.promises.writeFile(filePath, json, 'utf-8');
  }
}
