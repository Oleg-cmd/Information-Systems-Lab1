import * as yup from "yup";
import { toast } from "react-toastify";
import { makeAutoObservable, runInAction } from "mobx";
import {
  fetchPersons,
  createPerson,
  updatePerson,
  deletePerson,
} from "../api/persons";
import { Person } from "../types/types";

// Схема валидации для Person
const personSchema = yup.object().shape({
  name: yup
    .string()
    .required("Имя обязательно")
    .min(1, "Имя не может быть пустым"),
  birthday: yup.date().nullable().notRequired(),
  hairColor: yup
    .string()
    .required("Цвет волос обязателен")
    .oneOf(
      ["RED", "GREEN", "ORANGE", "WHITE", "BROWN"],
      "Недопустимый цвет волос"
    ),
  eyeColor: yup
    .string()
    .nullable()
    .oneOf(
      ["RED", "GREEN", "ORANGE", "WHITE", "BROWN"],
      "Недопустимый цвет глаз"
    )
    .notRequired(),
  nationality: yup
    .string()
    .required("Национальность обязательна")
    .oneOf(
      ["RUSSIA", "INDIA", "VATICAN", "SOUTH_KOREA"],
      "Недопустимая национальность"
    ),
  location: yup
    .object()
    .shape({
      id: yup.number().required("ID локации обязателен"),
      x: yup.number().required("Координата X обязательна"),
      y: yup.number().required("Координата Y обязательна"),
      z: yup.number().required("Координата Z обязательна"),
    })
    .required("Локация обязательна"),
});

export class PersonStore {
  persons: Person[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Сброс ошибки
  resetError(): void {
    this.error = null;
  }

  // Загрузка владельцев
  async loadPersons(): Promise<void> {
    this.loading = true;
    this.resetError();
    try {
      const data = await fetchPersons();
      runInAction(() => {
        this.persons = data;
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Ошибка загрузки владельцев";
      });
      toast.error("Ошибка загрузки владельцев");
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // Создание владельца
  async createPerson(person: Omit<Person, "id">): Promise<void> {
    this.resetError();
    try {
      // Валидация перед созданием
      await personSchema.validate(person, { abortEarly: false });

      const newPerson = await createPerson(person);
      runInAction(() => {
        this.persons.push(newPerson);
      });
      toast.success("Владелец успешно создан");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        toast.error(`Ошибка валидации: ${error.errors.join(", ")}`);
      } else {
        runInAction(() => {
          this.error = "Ошибка при создании владельца";
        });
        toast.error("Ошибка при создании владельца");
      }
    }
  }

  // Обновление владельца
  async updatePerson(id: number, person: Omit<Person, "id">): Promise<void> {
    this.resetError();
    try {
      // Валидация перед обновлением
      await personSchema.validate(person, { abortEarly: false });

      const updatedPerson = await updatePerson(id, person);
      runInAction(() => {
        this.persons = this.persons.map((p) =>
          p.id === id ? updatedPerson : p
        );
      });
      toast.success("Владелец успешно обновлен");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        toast.error(`Ошибка валидации: ${error.errors.join(", ")}`);
      } else {
        runInAction(() => {
          this.error = "Ошибка при обновлении владельца";
        });
        toast.error("Ошибка при обновлении владельца");
      }
    }
  }

  // Удаление владельца
  async deletePerson(id: number): Promise<void> {
    this.resetError();
    try {
      await deletePerson(id);
      runInAction(() => {
        this.persons = this.persons.filter((p) => p.id !== id);
      });
      toast.success("Владелец успешно удален");
    } catch (error) {
      runInAction(() => {
        this.error = "Ошибка при удалении владельца";
      });
      toast.error("Ошибка при удалении владельца");
    }
  }
}

export const personStore = new PersonStore();
