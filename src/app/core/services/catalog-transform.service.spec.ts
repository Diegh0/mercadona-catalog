import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CatalogTransformService } from './catalog-transform.service';

describe('CatalogTransformService', () => {
  let service: CatalogTransformService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogTransformService],
    });
    service = TestBed.inject(CatalogTransformService);
  });

  it('builds hierarchy based on parent ids and category_id arrays', () => {
    const raw = [
      // ✅ categoría (category_id === null)
      { id: 1, name: 'Bebidas', category_id: null },

      // ✅ productos (category_id es ARRAY)
      {
        id: 10,
        name: 'Base',
        category_id: [1],
        parent: null,
        photo: null,
        price: { amount: 1.25, currency: 'EUR', unit: 'l' },
        format: { description: '1L', totalWeight: 1000 },
      },
      {
        id: 11,
        name: 'Pack',
        category_id: [1],
        parent: 10,
        photo: null,
        price: { amount: 4.8, currency: 'EUR', unit: 'ud' },
        format: { description: '6x1L', totalWeight: 6000 },
      },
      {
        id: 12,
        name: 'Mini',
        category_id: [1],
        parent: 11,
        photo: null,
        price: { amount: 2.0, currency: 'EUR', unit: 'ud' },
        format: { description: '6x500ml', totalWeight: 3000 },
      },
      {
        id: 20,
        name: 'Otro',
        category_id: [1],
        parent: null,
        photo: null,
        price: { amount: 0.5, currency: 'EUR', unit: 'l' },
        format: { description: '1L', totalWeight: 1000 },
      },
    ];

    const result = service.toCatalog(raw as any);

    const bebidas = result.find((c: any) => c.id === 1);
    expect(bebidas).toBeTruthy();

    // raíces: 10 y 20
    expect(bebidas!.products.map((p: any) => p.id)).toEqual([10, 20]);

    // 10 -> 11 -> 12
    const base = bebidas!.products.find((p: any) => p.id === 10);
    expect(base).toBeTruthy();
    expect(base!.children.map((p: any) => p.id)).toEqual([11]);

    const pack = base!.children.find((p: any) => p.id === 11);
    expect(pack).toBeTruthy();
    expect(pack!.children.map((p: any) => p.id)).toEqual([12]);
  });
});
