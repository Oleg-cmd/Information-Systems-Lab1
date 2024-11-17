import * as yup from "yup";
import { toast } from "react-toastify";
import { makeAutoObservable } from "mobx";
import { Address, AddressWithExtraFields } from "../types/types";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../api/adress";

// Определяем схему валидации с помощью yup
const addressSchema = yup.object().shape({
  zipCode: yup.string().nullable(), // zipCode может быть null
  town: yup
    .object()
    .shape({
      id: yup.number().required("Идентификатор города обязателен"),
      x: yup.number().required("Координата X обязательна"),
      y: yup.number().required("Координата Y обязательна"),
      z: yup.number().required("Координата Z обязательна"),
    })
    .nullable(), // town может быть null
});

class AddressStore {
  addresses: Address[] = [];
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadAddresses() {
    try {
      this.addresses = await fetchAddresses();
    } catch (error) {
      toast.error("Ошибка загрузки адресов");
    }
  }

  async createAddress(address: AddressWithExtraFields) {
    try {
      // Валидация данных перед вызовом API
      await addressSchema.validate(address, { abortEarly: false });

      const response = await createAddress(address);
      this.addresses.push(response);
      toast.success("Адрес успешно создан");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        toast.error(`Ошибка валидации: ${error.errors.join(", ")}`);
      } else {
        toast.error("Ошибка создания адреса");
      }
    }
  }

  async updateAddress(id: number, address: AddressWithExtraFields) {
    try {
      // Валидация данных перед вызовом API
      await addressSchema.validate(address, { abortEarly: false });

      const response = await updateAddress(id, address);
      this.addresses = this.addresses.map((a) => (a.id === id ? response : a));
      toast.success("Адрес успешно обновлен");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        toast.error(`Ошибка валидации: ${error.errors.join(", ")}`);
      } else {
        toast.error("Ошибка обновления адреса");
      }
    }
  }

  async deleteAddress(id: number) {
    try {
      await deleteAddress(id);
      this.addresses = this.addresses.filter((a) => a.id !== id);
      toast.success("Адрес успешно удален");
    } catch (error) {
      toast.error("Ошибка удаления адреса");
    }
  }
}

export const addressStore = new AddressStore();
