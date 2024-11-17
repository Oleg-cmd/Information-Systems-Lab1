import axiosInstance from "../instance/axiosInstance";
import { Location } from "../types/types";

// Получить список локаций
export const fetchLocations = async (): Promise<Location[]> => {
  try {
    const response = await axiosInstance.get<Location[]>("/locations");
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении списка локаций:", error);
    throw error;
  }
};

// Создать локацию
export const createLocation = async (
  location: Omit<Location, "id">
): Promise<Location> => {
  try {
    const response = await axiosInstance.post<Location>("/locations", location);
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании локации:", error);
    throw error;
  }
};

// Обновить локацию
export const updateLocation = async (
  id: number,
  location: Location
): Promise<Location> => {
  try {
    const response = await axiosInstance.put<Location>(
      `/locations/${id}`,
      location
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении локации:", error);
    throw error;
  }
};

// Удалить локацию
export const deleteLocation = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/locations/${id}`);
  } catch (error) {
    console.error("Ошибка при удалении локации:", error);
    throw error;
  }
};
