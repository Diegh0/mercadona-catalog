import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import { ProductListComponent } from './product-list.component';
import { CatalogProduct } from '../../../../core/models/catalog.model';

describe('ProductListComponent', () => {
  let fixture: any;
  let component: ProductListComponent;

  const clickable: CatalogProduct = {
    id: 1,
    name: 'Producto con hijos',
    photo: null,
    priceAmount: 1.2,
    priceCurrency: 'EUR',
    priceUnit: 'ud',
    formatDescription: 'test',
    totalWeight: 100,
    children: [
      {
        id: 2,
        name: 'Hijo',
        photo: null,
        priceAmount: 0.5,
        priceCurrency: 'EUR',
        priceUnit: 'ud',
        formatDescription: '',
        totalWeight: 50,
        children: [],
      },
    ],
  };

  const finalProduct: CatalogProduct = {
    id: 3,
    name: 'Producto final',
    photo: null,
    priceAmount: 0.8,
    priceCurrency: 'EUR',
    priceUnit: 'ud',
    formatDescription: 'final',
    totalWeight: 80,
    children: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('emits selectProduct when clicking a clickable product', () => {
    component.products = [clickable];
    fixture.detectChanges();

    let emitted: number | null = null;
    component.selectProduct.subscribe((id) => (emitted = id));

    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(false);

    btn.click();
    expect(emitted).toBe(1);
  });

  it('does not emit when clicking a final product', () => {
  component.products = [finalProduct];
  fixture.detectChanges();

  let emitted: number | null = null;
  component.selectProduct.subscribe((id) => (emitted = id));

  // en tu HTML actual, los finales son un DIV
  const finalCard = fixture.nativeElement.querySelector('.card.final') as HTMLElement;
  expect(finalCard).toBeTruthy();

  finalCard.click();
  expect(emitted).toBeNull();
});

});
