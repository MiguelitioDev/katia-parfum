export interface VtexSellerOffer {
  Price: number;
  ListPrice: number;
}

export interface VtexSeller {
  commertialOffer?: VtexSellerOffer;
}

export interface VtexImage {
  imageUrl: string;
}

export interface VtexItem {
  images?: VtexImage[];
  sellers?: VtexSeller[];
}

export interface VtexProduct {
  productName: string;
  linkText: string;
  categories?: string[];
  description?: string;
  items?: VtexItem[];
  Notes?: string[];
  'Feels Like'?: string[];
  'Família Olfativa'?: string[];
  'Como Usar'?: string[];
}

export class VtexCatalogClient {
  private readonly endpointUrl: string;

  constructor(
    endpointUrl = 'https://www.oulab.com.br/api/catalog_system/pub/products/search?_from=0&_to=49',
  ) {
    this.endpointUrl = endpointUrl;
  }

  async fetchProducts(): Promise<VtexProduct[]> {
    const response = await fetch(this.endpointUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erro ao consultar catálogo VTEX: HTTP ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as VtexProduct[];
  }
}
