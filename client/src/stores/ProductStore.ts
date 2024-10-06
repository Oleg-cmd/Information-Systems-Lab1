import { makeAutoObservable } from "mobx";

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  partNumber: string;
}

class ProductStore {
  products: Product[] = [];
  selectedProduct: Product | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  addProduct(product: Product) {
    this.products.push(product);
  }

  updateProduct(id: number, updatedProduct: Product) {
    this.products = this.products.map((p) =>
      p.id === id ? updatedProduct : p
    );
  }

  deleteProduct(id: number) {
    this.products = this.products.filter((p) => p.id !== id);
  }

  setSelectedProduct(product: Product | null) {
    this.selectedProduct = product;
  }
}

export const productStore = new ProductStore();
