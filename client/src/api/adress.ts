// src/api/addressApi.ts
import axiosInstance from "../instance/axiosInstance";
import { Address, AddressWithExtraFields } from "../types/types";

// Получить список адресов
export const fetchAddresses = async (): Promise<Address[]> => {
  try {
    const response = await axiosInstance.get<Address[]>("/addresses");
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении списка адресов:", error);
    throw error; // Пробрасываем ошибку для обработки на уровне вызывающего кода
  }
};

// Создать адрес
export const createAddress = async (
  address: AddressWithExtraFields
): Promise<Address> => {
  try {
    const response = await axiosInstance.post<Address>("/addresses", address);
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании адреса:", error);
    throw error;
  }
};

// Обновить адрес
export const updateAddress = async (
  id: number,
  address: AddressWithExtraFields
): Promise<Address> => {
  try {
    const response = await axiosInstance.put<Address>(
      `/addresses/${id}`,
      address
    );
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении адреса с ID ${id}:`, error);
    throw error;
  }
};

// Удалить адрес
export const deleteAddress = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/addresses/${id}`);
  } catch (error) {
    console.error(`Ошибка при удалении адреса с ID ${id}:`, error);
    throw error;
  }
};
