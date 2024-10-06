export interface Product {
  name: string;
  coordinates: {
    x: number;
    y: number;
  };
  unitOfMeasure: string;
  manufacturerId: number;
  price: number;
  manufactureCost?: number;
  rating: number;
  partNumber?: string;
  ownerId: number;
}
