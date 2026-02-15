import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CatalogPersistenceService } from './catalog-persistence.service';
import { SortConfig } from '../models/sort-config.model';

describe('CatalogPersistenceService', () => {
  let service: CatalogPersistenceService;

  const cfg: SortConfig = { filterName: 'Ordenar', typeFilter: 'name', initialStatus: 'asc' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogPersistenceService],
    });
    service = TestBed.inject(CatalogPersistenceService);

    // limpiar localStorage fake
    localStorage.clear();
  });

  it('returns null when nothing saved', () => {
    expect(service.load()).toBeNull();
  });

  it('saves and loads state', () => {
    service.save({
      selectedCategoryId: 1,
      productPathIds: [10, 20],
      searchTerm: 'lec',
      sortConfig: cfg,
      sortStatus: 'desc',
      leftScrollTop: 123,
      rightScrollTop: 456,
    });

    const loaded = service.load();
    expect(loaded).toBeTruthy();
    expect(loaded!.selectedCategoryId).toBe(1);
    expect(loaded!.productPathIds).toEqual([10, 20]);
    expect(loaded!.sortStatus).toBe('desc');
    expect(loaded!.leftScrollTop).toBe(123);
  });

  it('clear removes stored state', () => {
    service.save({
      selectedCategoryId: 1,
      productPathIds: [],
      searchTerm: '',
      sortConfig: cfg,
      sortStatus: 'asc',
      leftScrollTop: 0,
      rightScrollTop: 0,
    });

    service.clear();
    expect(service.load()).toBeNull();
  });

  it('load returns null for invalid JSON', () => {
    // forzamos JSON corrupto
    localStorage.setItem('mercadona_catalog_state_v1', '{bad json');
    expect(service.load()).toBeNull();
  });
});
