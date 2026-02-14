import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CatalogStore } from './store/catalog.store';
import { ProductListComponent } from './components/product-list/product-list.component';
import { BackButtonComponent } from './components/back-button/back-button.component';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CategoryListComponent,ProductListComponent,BackButtonComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPageComponent {
  readonly store = inject(CatalogStore);

  onSelectProduct(id: number) {
  this.store.selectProduct(id);
}
onBack() {
    this.store.back();
  }

}
