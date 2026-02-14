import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RawItem } from '../models/raw-item.model';

@Injectable({ providedIn: 'root' })
export class CatalogApiService {
  private readonly url = 'assets/productos.json';

  constructor(private readonly http: HttpClient) {}

  getCatalog$(): Observable<RawItem[]> {
    return this.http.get<RawItem[]>(this.url);
  }
}
