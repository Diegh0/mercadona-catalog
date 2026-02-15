import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { CatalogStore } from './catalog.store';
import { CatalogApiService } from '../../../core/services/catalog-api.service';
import { CatalogPersistenceService } from '../../../core/services/catalog-persistence.service';
import { CatalogCategory } from '../../../core/models/catalog.model';
import { SortConfig } from '../../../core/models/sort-config.model';

function buildCatalogMock(): CatalogCategory[] {
  return [
    {
      id: 1,
      name: 'Bebidas',
      products: [
        {
          id: 10,
          name: 'Agua',
          photo: null,
          priceAmount: 0.5,
          priceCurrency: 'EUR',
          priceUnit: 'l',
          formatDescription: '1L',
          totalWeight: 1000,
          children: [],
        },
        {
          id: 20,
          name: 'Leche semidesnatada',
          photo: null,
          priceAmount: 1.25,
          priceCurrency: 'EUR',
          priceUnit: 'l',
          formatDescription: '1L',
          totalWeight: 1000,
          children: [
            {
              id: 21,
              name: 'Leche semidesnatada pack',
              photo: null,
              priceAmount: 4.8,
              priceCurrency: 'EUR',
              priceUnit: 'ud',
              formatDescription: '6x1L',
              totalWeight: 6000,
              children: [
                {
                  id: 22,
                  name: 'Leche semidesnatada mini',
                  photo: null,
                  priceAmount: 2.0,
                  priceCurrency: 'EUR',
                  priceUnit: 'ud',
                  formatDescription: '6x500ml',
                  totalWeight: 3000,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Conservas',
      products: [],
    },
  ];
}

describe('CatalogStore', () => {
  let store: CatalogStore;

  const catalogMock = buildCatalogMock();

  const apiMock = {
    getCatalog$: vi.fn(() => of(catalogMock)),
  };

  const persistenceMock = {
    load: vi.fn(() => null),
    save: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CatalogStore,
        { provide: CatalogApiService, useValue: apiMock },
        { provide: CatalogPersistenceService, useValue: persistenceMock },
      ],
    });

    store = TestBed.inject(CatalogStore);
  });

  it('carga categorías al iniciar', () => {
    expect(store.loading()).toBe(false);
    expect(store.categories().length).toBe(2);
    expect(store.categories()[0].name).toBe('Bebidas');
  });

  it('selectCategory guarda categoryId y resetea ruta y búsqueda', () => {
    // precondición: simular que había estado
    store.searchTerm.set('leche');
    store.productPath.set([catalogMock[0].products[1]]);

    store.selectCategory(1);

    expect(store.selectedCategoryId()).toBe(1);
    expect(store.productPath().length).toBe(0);
    expect(store.searchTerm()).toBe('');
  });

  it('rightProducts muestra productos raíz si no hay productPath', () => {
    store.selectCategory(1);

    const list = store.rightProductsBase();
    expect(list.map(p => p.name)).toEqual(['Agua', 'Leche semidesnatada']);
  });

  it('selectProduct solo navega si el producto tiene children', () => {
    store.selectCategory(1);

    // Agua no tiene children
    store.selectProduct(10);
    expect(store.productPath().length).toBe(0);

    // Leche semidesnatada sí tiene children
    store.selectProduct(20);
    expect(store.productPath().length).toBe(1);
    expect(store.productPath()[0].name).toBe('Leche semidesnatada');

    // ahora derecha son los children (pack)
    expect(store.rightProductsBase().map(p => p.id)).toEqual([21]);
  });

  it('back hace pop del productPath', () => {
    store.selectCategory(1);
    store.selectProduct(20); // entra a pack
    expect(store.productPath().length).toBe(1);

    store.back();
    expect(store.productPath().length).toBe(0);
    expect(store.rightProductsBase().map(p => p.id)).toEqual([10, 20]);
  });

  it('búsqueda solo filtra a partir de 3 caracteres', () => {
    store.selectCategory(1);

    store.searchTerm.set('le');
    expect(store.rightProducts().length).toBe(2); // no filtra

    store.searchTerm.set('lec');
    expect(store.rightProducts().map(p => p.name)).toEqual(['Leche semidesnatada']);
  });

  it('ordenación por precio asc/desc funciona', () => {
    store.selectCategory(1);

    const cfg: SortConfig = {
      filterName: 'Ordenar',
      typeFilter: 'price',
      initialStatus: 'asc',
    };
    store.setSortConfig(cfg);

    // asc: 0.5 (Agua) -> 1.25 (Leche)
    expect(store.rightProductsView().map(p => p.id)).toEqual([10, 20]);

    store.toggleSortStatus();
    // desc: 1.25 -> 0.5
    expect(store.rightProductsView().map(p => p.id)).toEqual([20, 10]);
  });
  it('back does nothing when productPath is empty', () => {
  store.selectCategory(1);
  expect(store.productPath().length).toBe(0);
  store.back();
  expect(store.productPath().length).toBe(0);
});

it('selectCategory with unknown id sets selectedCategoryId anyway but selectedCategory becomes null', () => {
  store.selectCategory(999);
  expect(store.selectedCategoryId()).toBe(999);
  expect(store.selectedCategory()).toBeNull();
});

});
