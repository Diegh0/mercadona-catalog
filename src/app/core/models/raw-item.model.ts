export interface RawItem {
  id: number;
  name: string;
  category_id: number[] | null;
  parent: number | null;
  photo: string | null;
  price: {
    amount: number | null;
    currency: string | null;
    unit: string | null;
  };
  format: {
    description: string | null;
    totalWeight: number | null;
  };
}
//Esto representa exactamente el JSON