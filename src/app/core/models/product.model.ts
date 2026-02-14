export interface Product {
  id: string;
  name: string;
  image: string;
  format: string;
  price: number;
  weight?: number;
  children?: Product[]; // subvariedades
}
