import * as yup from "yup";
import { toast } from "react-toastify";
import { makeAutoObservable, runInAction } from "mobx";
import { signinUser, signupUser } from "../api/auth";
import { User } from "../types/types";

// Схемы валидации
const signinSchema = yup.object().shape({
  username: yup.string().required("Имя пользователя обязательно"),
  password: yup
    .string()
    .required("Пароль обязателен")
    .min(6, "Пароль должен быть не менее 6 символов"),
});

const signupSchema = yup.object().shape({
  username: yup.string().required("Имя пользователя обязательно"),
  password: yup
    .string()
    .required("Пароль обязателен")
    .min(6, "Пароль должен быть не менее 6 символов"),
  role: yup
    .string()
    .required("Роль обязательна")
    .oneOf(["USER", "ADMIN"], "Роль должна быть USER или ADMIN"),
});

class UserStore {
  user: User | null = null; // Текущий пользователь
  isAuthenticated = false; // Статус аутентификации
  loading = false; // Флаг загрузки
  error: string | null = null; // Сообщение об ошибке

  constructor() {
    makeAutoObservable(this);
    this.loadUser();
  }

  // Получить ID текущего пользователя
  getUserId(): number | null {
    return this.user?.id || null;
  }

  // Сбросить ошибку
  resetError() {
    this.error = null;
  }

  // Загрузить пользователя из localStorage
  loadUser() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.isAuthenticated = true;
    }
  }

  // Вход
  async signin(username: string, password: string): Promise<void> {
    this.loading = true;
    this.resetError();
    try {
      // Валидация входных данных
      await signinSchema.validate(
        { username, password },
        { abortEarly: false }
      );

      const user = await signinUser(username, password);
      runInAction(() => {
        this.user = user;
        this.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Вход выполнен успешно");
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        toast.error(`Ошибка валидации: ${error.errors.join(", ")}`);
      } else {
        runInAction(() => {
          this.error =
            error instanceof Error ? error.message : "Ошибка входа в систему";
        });
        toast.error(this.error || "Ошибка входа в систему");
      }
      throw error; // Проброс ошибки для дальнейшей обработки (если требуется)
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // Регистрация
  async signup(
    username: string,
    password: string,
    role: string
  ): Promise<void> {
    this.loading = true;
    this.resetError();
    try {
      // Валидация входных данных
      await signupSchema.validate(
        { username, password, role },
        { abortEarly: false }
      );

      const user = await signupUser(username, password, role);
      runInAction(() => {
        this.user = user;
        this.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Регистрация выполнена успешно");
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        toast.error(`Ошибка валидации: ${error.errors.join(", ")}`);
      } else {
        runInAction(() => {
          this.error =
            error instanceof Error ? error.message : "Ошибка регистрации";
        });
        toast.error(this.error || "Ошибка регистрации");
      }
      throw error; // Проброс ошибки для дальнейшей обработки (если требуется)
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // Выход
  logout() {
    this.user = null;
    this.isAuthenticated = false;
    localStorage.removeItem("user");
    toast.info("Вы вышли из системы");
  }
}

const userStore = new UserStore();
export default userStore;
