import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach,vi } from 'vitest';

import { CatalogApiService } from './catalog-api.service';
import { CatalogTransformService } from './catalog-transform.service';

describe('CatalogApiService', () => {
  let service: CatalogApiService;
  let httpMock: HttpTestingController;
  let transform: CatalogTransformService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CatalogApiService,
        CatalogTransformService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(CatalogApiService);
    httpMock = TestBed.inject(HttpTestingController);
    transform = TestBed.inject(CatalogTransformService);
  });

  it('fetches raw json and maps it to catalog categories', () => {
    const spy = vi.spyOn(transform, 'toCatalog').mockReturnValue([
      { id: 1, name: 'Bebidas', products: [] },
    ]);

    let result: any = null;

    service.getCatalog$().subscribe((cats) => (result = cats));

    const req = httpMock.expectOne((r) => r.url.includes('productos.json'));
    expect(req.request.method).toBe('GET');

    // Raw mínimo para que pase por el pipe (da igual, porque hemos mockeado el transform)
    req.flush([{ id: 1, name: 'Bebidas', category_id: null }]);

    httpMock.verify();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ id: 1, name: 'Bebidas', products: [] }]);
  });
});
