import * as yup from "yup";
import { toast } from "react-toastify";
import { makeAutoObservable, runInAction } from "mobx";
import {
  fetchOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from "../api/organizations";
import { Organization } from "../types/types";

// Определяем схему валидации для Organization
const organizationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Название организации обязательно")
    .min(1, "Название не может быть пустым"),
  employeesCount: yup
    .number()
    .required("Количество сотрудников обязательно")
    .moreThan(0, "Количество сотрудников должно быть больше 0"),
  annualTurnover: yup
    .number()
    .nullable()
    .moreThan(0, "Годовой оборот должен быть больше 0")
    .notRequired(),
  rating: yup
    .number()
    .nullable()
    .moreThan(0, "Рейтинг должен быть больше 0")
    .notRequired(),
  fullName: yup.string().nullable(),
});

export class OrganizationStore {
  organizations: Organization[] = []; // Типизация массива организаций
  loading: boolean = false; // Флаг загрузки
  error: string | null = null; // Ошибка может быть строкой или null

  constructor() {
    makeAutoObservable(this);
  }

  // Сбросить ошибку
  resetError(): void {
    this.error = null;
  }

  // Загрузить организации с сервера
  async loadOrganizations(): Promise<void> {
    this.loading = true;
    this.resetError();
    try {
      const data = await fetchOrganizations();
      runInAction(() => {
        this.organizations = data;
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Ошибка загрузки организаций";
      });
      toast.error("Ошибка загрузки организаций");
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // Создать организацию
  async createOrganization(org: Omit<Organization, "id">): Promise<void> {
    this.resetError();
    try {
      // Валидация перед созданием
      await organizationSchema.validate(org, { abortEarly: false });

      const newOrganization = await createOrganization(org);
      runInAction(() => {
        this.organizations.push(newOrganization);
      });
      toast.success("Организация успешно создана");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        toast.error(`Ошибка валидации: ${error.errors.join(", ")}`);
      } else {
        runInAction(() => {
          this.error = "Ошибка создания организации";
        });
        toast.error("Ошибка создания организации");
      }
    }
  }

  // Обновить организацию
  async updateOrganization(
    id: number,
    updatedOrg: Organization
  ): Promise<void> {
    this.resetError();
    try {
      // Валидация перед обновлением
      await organizationSchema.validate(updatedOrg, { abortEarly: false });

      const updatedOrganization = await updateOrganization(id, updatedOrg);
      runInAction(() => {
        this.organizations = this.organizations.map((org) =>
          org.id === id ? updatedOrganization : org
        );
      });
      toast.success("Организация успешно обновлена");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        toast.error(`Ошибка валидации: ${error.errors.join(", ")}`);
      } else {
        runInAction(() => {
          this.error = "Ошибка обновления организации";
        });
        toast.error("Ошибка обновления организации");
      }
    }
  }

  // Удалить организацию
  async deleteOrganization(id: number): Promise<void> {
    this.resetError();
    try {
      await deleteOrganization(id);
      runInAction(() => {
        this.organizations = this.organizations.filter((org) => org.id !== id);
      });
      toast.success("Организация успешно удалена");
    } catch (error) {
      runInAction(() => {
        this.error = "Ошибка удаления организации";
      });
      toast.error("Ошибка удаления организации");
    }
  }
}

export const organizationStore = new OrganizationStore();
