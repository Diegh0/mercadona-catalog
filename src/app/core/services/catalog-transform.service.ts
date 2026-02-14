import { Injectable } from '@angular/core';
import { RawItem } from '../models/raw-item.model';
import { CatalogCategory, CatalogProduct } from '../models/catalog.model';

@Injectable({ providedIn: 'root' })
export class CatalogTransformService {
  toCatalog(raw: RawItem[]): CatalogCategory[] {
    // 1) separar categorías (category_id = null) del resto
    const categoryItems = raw.filter((x) => x.category_id === null);
    const productItems = raw.filter((x) => x.category_id !== null);

    // 2) crear nodos de producto (sin enlazar aún)
    const productById = new Map<number, CatalogProduct>();

    for (const p of productItems) {
      productById.set(p.id, this.mapToProduct(p));
    }

    // 3) enlazar subvariedades: si un item tiene parent, cuelga del parent
    for (const p of productItems) {
      if (p.parent === null) continue;
      const child = productById.get(p.id);
      const parent = productById.get(p.parent);

      if (!child || !parent) continue;

      parent.children.push(child);
    }

    // 4) productos raíz por categoría = los que NO tienen parent y pertenecen a esa categoría
    // (en tu JSON: category_id es array, normalmente con 1 id)
    const rootsByCategoryId = new Map<number, CatalogProduct[]>();

    for (const p of productItems) {
      if (p.parent !== null) continue;

      const categoryIds = p.category_id ?? [];
      for (const catId of categoryIds) {
        const list = rootsByCategoryId.get(catId) ?? [];
        list.push(productById.get(p.id)!);
        rootsByCategoryId.set(catId, list);
      }
    }

    // 5) construir categorías finales
    const categories: CatalogCategory[] = categoryItems.map((c) => ({
      id: c.id,
      name: c.name,
      products: rootsByCategoryId.get(c.id) ?? [],
    }));

    // (opcional) orden estable por nombre para que siempre se vean igual
    categories.sort((a, b) => a.name.localeCompare(b.name));

    return categories;
  }

  private mapToProduct(p: RawItem): CatalogProduct {
    return {
      id: p.id,
      name: p.name,
      photo: p.photo,

      priceAmount: p.price.amount,
      priceCurrency: p.price.currency,
      priceUnit: p.price.unit,

      formatDescription: p.format.description,
      totalWeight: p.format.totalWeight,

      children: [],
    };
  }
}
