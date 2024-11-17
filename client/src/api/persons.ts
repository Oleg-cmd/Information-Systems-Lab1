import axiosInstance from "../instance/axiosInstance";
import { Person } from "../types/types";

// Получить список всех владельцев
export const fetchPersons = async (): Promise<Person[]> => {
  try {
    const response = await axiosInstance.get<Person[]>("/persons");
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении списка владельцев:", error);
    throw error;
  }
};

// Создать владельца
export const createPerson = async (
  person: Omit<Person, "id">
): Promise<Person> => {
  try {
    const response = await axiosInstance.post<Person>("/persons", person);
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании владельца:", error);
    throw error;
  }
};

// Обновить владельца
export const updatePerson = async (
  id: number,
  person: Omit<Person, "id">
): Promise<Person> => {
  try {
    const response = await axiosInstance.put<Person>(`/persons/${id}`, person);
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении владельца:", error);
    throw error;
  }
};

// Удалить владельца
export const deletePerson = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/persons/${id}`);
  } catch (error) {
    console.error("Ошибка при удалении владельца:", error);
    throw error;
  }
};
