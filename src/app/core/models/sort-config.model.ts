export interface SortConfig {
  filterName: string; // Texto del botón
  typeFilter: 'price' | 'weight' | 'name';
  initialStatus: 'asc' | 'desc';
}
