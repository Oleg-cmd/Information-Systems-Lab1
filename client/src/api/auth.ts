import axiosInstance from "../instance/axiosInstance";
import { User } from "../types/types";

export const signinUser = async (
  username: string,
  password: string
): Promise<User> => {
  try {
    const response = await axiosInstance.post<User>("/auth/signin", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при входе пользователя:", error);
    throw error; // Пробрасываем ошибку для обработки на уровне вызывающего кода
  }
};

export const signupUser = async (
  username: string,
  password: string,
  role: string
): Promise<User> => {
  try {
    const response = await axiosInstance.post<User>("/auth/signup", {
      username,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при регистрации пользователя:", error);
    throw error;
  }
};
