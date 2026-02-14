import { Routes } from '@angular/router';
import { CatalogPageComponent } from './features/catalog/catalog-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: CatalogPageComponent },
  { path: '**', redirectTo: '' },
];
