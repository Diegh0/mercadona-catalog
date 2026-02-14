import { Injectable } from '@angular/core';
import { SortConfig } from '../models/sort-config.model';

export interface CatalogPersistedState {
  selectedCategoryId: number | null;
  productPathIds: number[];
  searchTerm: string;
  sortConfig: SortConfig;
  sortStatus: 'asc' | 'desc';
}

const KEY = 'mercadona_catalog_state_v1';

@Injectable({ providedIn: 'root' })
export class CatalogPersistenceService {
  load(): CatalogPersistedState | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as CatalogPersistedState) : null;
    } catch {
      return null;
    }
  }

  save(state: CatalogPersistedState): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // storage lleno/bloqueado -> ignoramos
    }
  }

  clear(): void {
    localStorage.removeItem(KEY);
  }
}
