import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CatalogProduct } from '../../../../core/models/catalog.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  @Input({ required: true }) products: CatalogProduct[] = [];

  // En el siguiente paso lo usaremos para navegar a subvariedades.
  @Output() selectProduct = new EventEmitter<number>();

  isClickable(p: CatalogProduct): boolean {
    return p.children.length > 0;
  }

  priceLabel(p: CatalogProduct): string {
    if (p.priceAmount == null) return '-';
    const amount = p.priceAmount.toFixed(2).replace('.', ',');
    const unit = p.priceUnit ?? '';
    return `${amount} €/${unit}`;
  }
}
