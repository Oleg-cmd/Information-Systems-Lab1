import * as yup from "yup";
import { toast } from "react-toastify";
import { makeAutoObservable } from "mobx";
import { Location } from "../types/types";
import {
  fetchLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../api/location";

// Определяем схему валидации для Location
const locationSchema = yup.object().shape({
  x: yup
    .number()
    .required("Координата X обязательна")
    .moreThan(-947, "Координата X должна быть больше -947"),
  y: yup
    .number()
    .required("Координата Y обязательна")
    .max(903, "Координата Y не может быть больше 903"),
  z: yup.number().required("Координата Z обязательна"),
});

class LocationStore {
  locations: (Location & { id: number })[] = [];
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadLocations() {
    try {
      this.locations = await fetchLocations();
      this.error = null;
    } catch (error) {
      console.error("Ошибка загрузки локаций:", error);
      this.error = "Не удалось загрузить локации.";
      toast.error("Ошибка загрузки локаций");
    }
  }

  async createLocation(location: Omit<Location, "id">) {
    try {
      // Валидация перед созданием
      await locationSchema.validate(location, { abortEarly: false });

      const newLocation = await createLocation(location);
      this.locations.push(newLocation);
      this.error = null;
      toast.success("Локация успешно создана");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        toast.error(`Ошибка валидации: ${error.errors.join(", ")}`);
      } else {
        console.error("Ошибка создания локации:", error);
        this.error = "Не удалось создать локацию.";
        toast.error("Ошибка создания локации");
      }
    }
  }

  async updateLocation(id: number, location: Location) {
    try {
      // Валидация перед обновлением
      await locationSchema.validate(location, { abortEarly: false });

      const updatedLocation = await updateLocation(id, location);
      this.locations = this.locations.map((l) =>
        l.id === id ? updatedLocation : l
      );
      this.error = null;
      toast.success("Локация успешно обновлена");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        toast.error(`Ошибка валидации: ${error.errors.join(", ")}`);
      } else {
        console.error("Ошибка обновления локации:", error);
        this.error = "Не удалось обновить локацию.";
        toast.error("Ошибка обновления локации");
      }
    }
  }

  async deleteLocation(id: number) {
    try {
      await deleteLocation(id);
      this.locations = this.locations.filter((l) => l.id !== id);
      this.error = null;
      toast.success("Локация успешно удалена");
    } catch (error) {
      console.error("Ошибка удаления локации:", error);
      this.error = "Не удалось удалить локацию.";
      toast.error("Ошибка удаления локации");
    }
  }
}

export const locationStore = new LocationStore();
