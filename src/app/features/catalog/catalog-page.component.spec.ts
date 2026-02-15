import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { CatalogPageComponent } from './catalog-page.component';
import { CatalogStore } from './store/catalog.store';
import { CatalogApiService } from '../../core/services/catalog-api.service';
import { CatalogPersistenceService } from '../../core/services/catalog-persistence.service';

describe('CatalogPageComponent', () => {
  let fixture: any;
  let component: CatalogPageComponent;

  const apiMock = {
    getCatalog$: vi.fn(() =>
      of([
        {
          id: 1,
          name: 'Bebidas',
          products: [],
        },
      ])
    ),
  };

  const persistenceMock = {
    load: vi.fn(() => null),
    save: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogPageComponent],
      providers: [
        CatalogStore,
        { provide: CatalogApiService, useValue: apiMock },
        { provide: CatalogPersistenceService, useValue: persistenceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows empty state when no category selected', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Seleccione una categoría');
  });

  it('shows search input when category is selected', () => {
    component.store.selectCategory(1);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.search-input')).toBeTruthy();
  });

  it('shows back button when navigating into product path', () => {
  // condición 1: hay categoría seleccionada para que exista la columna derecha
  component.store.selectCategory(1);

  // condición 2: hay ruta (estamos “dentro”)
  component.store.productPath.set([
    {
      id: 10,
      name: 'Test',
      photo: null,
      priceAmount: 1,
      priceCurrency: 'EUR',
      priceUnit: 'ud',
      formatDescription: '',
      totalWeight: 0,
      children: [],
    },
  ]);

  fixture.detectChanges();

  const compiled = fixture.nativeElement as HTMLElement;

  // Como el texto puede cambiar o tener espacios, buscamos el botón
  const backBtn = Array.from(compiled.querySelectorAll('button'))
    .find((b) => (b.textContent ?? '').includes('Atrás'));

  expect(backBtn).toBeTruthy();
});
it('does not show search input when no category selected', () => {
  const compiled = fixture.nativeElement as HTMLElement;
  expect(compiled.querySelector('.search-input')).toBeFalsy();
});

it('toggles sort arrow when clicking sort button', () => {
  // seleccionar categoría para renderizar derecha
  component.store.selectCategory(1);
  fixture.detectChanges();

  const compiled = fixture.nativeElement as HTMLElement;

  // buscamos el botón "Ordenar" (tiene la flecha dentro)
  const sortBtn = Array.from(compiled.querySelectorAll('button'))
    .find((b) => (b.textContent ?? '').includes('Ordenar'));

  expect(sortBtn).toBeTruthy();

  const initialText = (sortBtn!.textContent ?? '').trim();

  // click
  sortBtn!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  fixture.detectChanges();

  const afterText = (sortBtn!.textContent ?? '').trim();

  // Debería cambiar ↑ <-> ↓
  expect(afterText).not.toBe(initialText);
});


});
