import { Product } from "../types/Product";
import axiosInstance from "../instance/axiosInstance";

export const createProduct = async (product: Product) => {
  const response = await axiosInstance.post("/products", product);
  return response.data;
};
