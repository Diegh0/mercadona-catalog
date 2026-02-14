import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CatalogApiService } from '../../core/services/catalog-api.service';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CatalogCategory } from '../../core/models/catalog.model';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [AsyncPipe, CategoryListComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPageComponent {
  private readonly api = inject(CatalogApiService);

  readonly categories$ = this.api.getCatalog$();

  readonly selectedCategoryId = signal<number | null>(null);

  onSelectCategory(id: number) {
    this.selectedCategoryId.set(id);
  }
}
