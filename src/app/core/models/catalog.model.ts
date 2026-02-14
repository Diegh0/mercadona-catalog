export interface CatalogCategory {
  id: number;
  name: string;
  products: CatalogProduct[]; // productos “raíz” de esa categoría
}

export interface CatalogProduct {
  id: number;
  name: string;
  photo: string | null;

  priceAmount: number | null;
  priceCurrency: string | null;
  priceUnit: string | null;

  formatDescription: string | null;
  totalWeight: number | null;
  children: CatalogProduct[];
}
