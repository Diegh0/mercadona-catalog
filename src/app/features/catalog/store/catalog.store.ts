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
    return cat ? cat.products : [];
  });

  readonly showSearch = computed(() => this.selectedCategoryId() !== null);

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
  }
}
