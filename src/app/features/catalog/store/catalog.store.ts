import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CatalogApiService } from '../../../core/services/catalog-api.service';
import { CatalogPersistenceService } from '../../../core/services/catalog-persistence.service';
import { CatalogCategory, CatalogProduct } from '../../../core/models/catalog.model';
import { SortConfig } from '../../../core/models/sort-config.model';

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private readonly api = inject(CatalogApiService);

  readonly sortConfig = signal<SortConfig>({
  filterName: 'Ordenar',
  typeFilter: 'name',
  initialStatus: 'asc',
});
  private readonly persistence = inject(CatalogPersistenceService);
  private readonly hydrated = signal(false);


  readonly sortStatus = signal<'asc' | 'desc'>(this.sortConfig().initialStatus);
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

  readonly rightProductsBase = computed<CatalogProduct[]>(() => {
  const cat = this.selectedCategory();
  if (!cat) return [];

  const path = this.productPath();
  if (path.length === 0) return cat.products;

  const last = path[path.length - 1];
  return last.children;
});

readonly rightProducts = computed<CatalogProduct[]>(() => {
  const list = this.rightProductsBase();
  const term = this.searchTerm().trim().toLowerCase();

  if (term.length < 3) return list;

  return list.filter((p) => p.name.toLowerCase().includes(term));
});
//LISTA FINAL DE PRODUCTOS
readonly rightProductsView = computed(() => {
  const list = this.rightProducts(); // filtrado (min 3)
  const { typeFilter } = this.sortConfig();
  const status = this.sortStatus();
  const factor = status === 'asc' ? 1 : -1;

  return [...list].sort((a, b) => {
    if (typeFilter === 'name') {
      return factor * a.name.localeCompare(b.name);
    }

    if (typeFilter === 'price') {
      const av = a.priceAmount ?? Number.POSITIVE_INFINITY;
      const bv = b.priceAmount ?? Number.POSITIVE_INFINITY;
      return factor * (av - bv);
    }

    // weight
    const aw = a.totalWeight ?? Number.POSITIVE_INFINITY;
    const bw = b.totalWeight ?? Number.POSITIVE_INFINITY;
    return factor * (aw - bw);
  });
});

  readonly showSearch = computed(() => this.selectedCategoryId() !== null);
  // Ruta de productos seleccionados (cadena)
  readonly productPath = signal<CatalogProduct[]>([]);
  readonly hasProductSelected = computed(() => this.productPath().length > 0);
  readonly searchTerm = signal<string>('');

  constructor() {
    // Load once
    this.api.getCatalog$().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.loading.set(false);
        const saved = this.persistence.load();
        if (saved) {
          this.sortConfig.set(saved.sortConfig);
          this.sortStatus.set(saved.sortStatus);

          this.selectedCategoryId.set(saved.selectedCategoryId);

          const rebuilt = this.rebuildProductPath(saved.productPathIds);
          this.productPath.set(rebuilt);

          this.searchTerm.set(saved.searchTerm ?? '');
        }

        this.hydrated.set(true);

      },
      
      error: () => {
        this.categories.set([]);
        this.loading.set(false);
      },
    });
    
   effect(() => {
  if (!this.hydrated()) return;

  this.persistence.save({
    selectedCategoryId: this.selectedCategoryId(),
    productPathIds: this.productPath().map((p) => p.id),
    searchTerm: this.searchTerm(),
    sortConfig: this.sortConfig(),
    sortStatus: this.sortStatus(),
  });
});


}
private rebuildProductPath(ids: number[]) {
  const cat = this.selectedCategory();
  if (!cat || ids.length === 0) return [];

  const result = [];
  let currentLevel = cat.products;

  for (const id of ids) {
    const found = currentLevel.find((p) => p.id === id);
    if (!found) break;
    result.push(found);
    currentLevel = found.children;
  }

  return result;
}


  selectCategory(id: number) {
  this.selectedCategoryId.set(id);
  this.productPath.set([]);
  this.searchTerm.set('');

}
selectProduct(productId: number) {
  const current = this.rightProductsBase();
  const found = current.find((p) => p.id === productId);
  if (!found) return;

  // Si no tiene children, es final: no hacemos nada
  if (found.children.length === 0) return;
  this.searchTerm.set('');
  this.productPath.update((prev) => [...prev, found]);
}

back() {
  this.productPath.update((prev) => prev.slice(0, -1));
  this.searchTerm.set('');
}
//ORDENACIÓN
setSortConfig(config: SortConfig) {
  this.sortConfig.set(config);
  this.sortStatus.set(config.initialStatus);
}
toggleSortStatus() {
  this.sortStatus.update((s) => (s === 'asc' ? 'desc' : 'asc'));
}


}
