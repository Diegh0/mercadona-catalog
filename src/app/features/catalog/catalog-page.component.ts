import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CatalogStore } from './store/catalog.store';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CategoryListComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPageComponent {
  readonly store = inject(CatalogStore);
}
