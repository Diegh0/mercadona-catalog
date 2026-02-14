import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CatalogCategory } from '../../../../core/models/catalog.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListComponent {
  @Input({ required: true }) categories: CatalogCategory[] = [];
  @Input() selectedCategoryId: number | null = null;

  @Output() selectCategory = new EventEmitter<number>();
}
