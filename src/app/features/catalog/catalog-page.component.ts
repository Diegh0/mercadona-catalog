import { AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EnvironmentInjector,
  ViewChild,
  effect,
  inject,
  runInInjectionContext,
  signal, } from '@angular/core';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CatalogStore } from './store/catalog.store';
import { ProductListComponent } from './components/product-list/product-list.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { SortConfig } from '../../core/models/sort-config.model';

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

  @ViewChild('leftCol') leftCol?: ElementRef<HTMLElement>;
  @ViewChild('rightCol') rightCol?: ElementRef<HTMLElement>;
  private readonly envInjector = inject(EnvironmentInjector);

  readonly mobileTab = signal<'left' | 'right'>('left');

showLeft(): boolean {
  return this.mobileTab() === 'left';
}

showRight(): boolean {
  return this.mobileTab() === 'right';
}

  onSelectProduct(id: number) {
  this.store.selectProduct(id);
}
onSelectCategory(id: number) {
  this.store.selectCategory(id);
  this.mobileTab.set('right');
}

  onBack() {
      this.store.back();
    }
  readonly sortConfig: SortConfig = {
  filterName: 'Ordenar',
  typeFilter: 'price',     
  initialStatus: 'asc',
};
constructor() {
    this.store.setSortConfig(this.sortConfig);
  }
  sortArrow(): string {
  return this.store.sortStatus() === 'asc' ? '↑' : '↓';
}

  onToggleSort() {
    this.store.toggleSortStatus();
  }
ngAfterViewInit(): void {
  runInInjectionContext(this.envInjector, () => {
    effect(() => {
      if (!this.store.isHydrated()) return;

      queueMicrotask(() => {
        const left = this.leftCol?.nativeElement;
        const right = this.rightCol?.nativeElement;

        if (left) left.scrollTop = this.store.leftScrollTop();
        if (right) right.scrollTop = this.store.rightScrollTop();
      });
    });
  });
}

}
