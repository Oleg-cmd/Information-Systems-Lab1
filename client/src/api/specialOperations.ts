import axiosInstance from "../instance/axiosInstance";
import { Product } from "../types/types";

export const fetchAverageRating = async (): Promise<number> => {
  const response = await axiosInstance.get<number>(
    "/organizations/averageRating"
  );
  return response.data;
};

export const fetchCountByPartNumber = async (
  partNumber: string
): Promise<number> => {
  const response = await axiosInstance.get<number>(
    `/products/countByPartNumber?partNumber=${partNumber}`
  );
  return response.data;
};

export const fetchProductsByPartNumberPrefix = async (
  prefix: string
): Promise<Product[]> => {
  const response = await axiosInstance.get<Product[]>(
    `/products/findByPartNumberStartingWith?partNumberPrefix=${prefix}`
  );
  return response.data;
};

export const fetchProductsByPriceRange = async (
  minPrice: number,
  maxPrice: number
): Promise<Product[]> => {
  const response = await axiosInstance.get<Product[]>(
    `/products/findByPriceBetween?minPrice=${minPrice}&maxPrice=${maxPrice}`
  );
  return response.data;
};

export const fetchProductsByUnitOfMeasure = async (
  unitOfMeasure: string
): Promise<Product[]> => {
  const response = await axiosInstance.get<Product[]>(
    `/products/findByUnitOfMeasure?unitOfMeasure=${unitOfMeasure}`
  );
  return response.data;
};
