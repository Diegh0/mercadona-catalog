import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RawItem } from '../models/raw-item.model';
import { CatalogCategory } from '../models/catalog.model';
import { CatalogTransformService } from './catalog-transform.service';

@Injectable({ providedIn: 'root' })
export class CatalogApiService {
    private readonly url = 'productos.json';

  constructor(
    private readonly http: HttpClient,
    private readonly transform: CatalogTransformService
  ) {}

  getCatalogRaw$(): Observable<RawItem[]> {
    return this.http.get<RawItem[]>(this.url);
  }

  getCatalog$(): Observable<CatalogCategory[]> {
    return this.getCatalogRaw$().pipe(map((raw) => this.transform.toCatalog(raw)));
  }
}
