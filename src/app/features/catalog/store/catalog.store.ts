import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CatalogApiService } from '../../../core/services/catalog-api.service';
import { CatalogCategory, CatalogProduct } from '../../../core/models/catalog.model';

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private readonly api = inject(CatalogApiService);

  // Data
  readonly categories = signal<CatalogCategory[]>([]);
  readonly loading = signal<boolean>(true);

  // Selection
  readonly selectedCategoryId = signal<number | null>(null);

  // Derived
  readonly selectedCategory = computed(() => {
    const id = this.selectedCategoryId();
    if (id === null) return null;
    return this.categories().find((c) => c.id === id) ?? null;
  });

  readonly rightProducts = computed<CatalogProduct[]>(() => {
  const cat = this.selectedCategory();
  if (!cat) return [];

  const path = this.productPath();
  if (path.length === 0) return cat.products;

  const last = path[path.length - 1];
  return last.children;
});


  readonly showSearch = computed(() => this.selectedCategoryId() !== null);
  // Ruta de productos seleccionados (cadena)
  readonly productPath = signal<CatalogProduct[]>([]);
  readonly hasProductSelected = computed(() => this.productPath().length > 0);

  constructor() {
    // Load once
    this.api.getCatalog$().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.loading.set(false);
      },
      error: () => {
        this.categories.set([]);
        this.loading.set(false);
      },
    });
  }

  selectCategory(id: number) {
  this.selectedCategoryId.set(id);
  this.productPath.set([]);
}
selectProduct(productId: number) {
  const current = this.rightProducts();
  const found = current.find((p) => p.id === productId);
  if (!found) return;

  // Si no tiene children, es final: no hacemos nada
  if (found.children.length === 0) return;

  this.productPath.update((prev) => [...prev, found]);
}
back() {
  this.productPath.update((prev) => prev.slice(0, -1));
}


}
