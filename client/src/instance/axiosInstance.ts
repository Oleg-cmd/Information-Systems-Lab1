// src/instance/axiosInstance.ts
import axios from "axios";
import userStore from "../stores/UserStore";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Добавляем интерцептор для каждого запроса
axiosInstance.interceptors.request.use(
  (config) => {
    // Проверяем, есть ли пользователь и токен
    const user = userStore.user;
    if (user && user.jwt) {
      config.headers["Authorization"] = `Bearer ${user.jwt}`; // Добавляем JWT в заголовок
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обработка ошибок ответа, если нужно
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (
        error.response?.status === 500 &&
        error.response.data.message === "Could not commit JPA transaction"
      ) {
        toast.error(
          "Невозможно выполнить операцию, объект над которым производится операция связан с другими объектами, вы можете отследить это в визуализации"
        );
      } else if (error.response?.status === 401) {
        toast.warning("У вас нету доступа к данному ресурсу");
      } else if (error.response?.status === 403) {
        alert(error.response.data.message);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
