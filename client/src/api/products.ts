import { Product } from "../types/types";
import axiosInstance from "../instance/axiosInstance";

// Создать продукт
export const createProduct = async (product: Product) => {
  try {
    const response = await axiosInstance.post("/products", product);
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании продукта:", error);
    throw error;
  }
};

// import product
export const importProduct = async (products: Product[]) => {
  try {
    const response = await axiosInstance.post(
      "/import/bulk-products",
      products
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при импорте продукта:", error);
    throw error;
  }
};

// Обновить продукт
export const updateProduct = async (id: number, product: Product) => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, product);
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении продукта:", error);
    throw error;
  }
};

// Удалить продукт
export const deleteProduct = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при удалении продукта:", error);
    throw error;
  }
};

// Получить список всех продуктов
export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении списка продуктов:", error);
    throw error;
  }
};
