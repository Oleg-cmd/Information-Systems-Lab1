import axiosInstance from "../instance/axiosInstance";
import { Organization } from "../types/types";

// Получить список организаций
export const fetchOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await axiosInstance.get<Organization[]>("/organizations");
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении списка организаций:", error);
    throw error;
  }
};

// Создать организацию
export const createOrganization = async (
  organization: Omit<Organization, "id">
): Promise<Organization> => {
  try {
    const response = await axiosInstance.post<Organization>(
      "/organizations",
      organization
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании организации:", error);
    throw error;
  }
};

// Обновить организацию
export const updateOrganization = async (
  id: number,
  organization: Organization
): Promise<Organization> => {
  try {
    const response = await axiosInstance.put<Organization>(
      `/organizations/${id}`,
      organization
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении организации:", error);
    throw error;
  }
};

// Удалить организацию
export const deleteOrganization = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/organizations/${id}`);
  } catch (error) {
    console.error("Ошибка при удалении организации:", error);
    throw error;
  }
};
