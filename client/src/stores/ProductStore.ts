import * as yup from "yup";
import { toast } from "react-toastify";
import { makeAutoObservable, runInAction } from "mobx";
import { Product } from "../types/types";
import * as productApi from "../api/products";
import { personSchema, personStore } from "./PersonStore";
import { organizationSchema, organizationStore } from "./OrganizationStore";
import userStore from "./UserStore";

// Схема валидации для Product
const productSchema = yup.object().shape({
  name: yup
    .string()
    .required("Название продукта обязательно")
    .min(1, "Название не может быть пустым"),
  coordinates: yup
    .object()
    .shape({
      x: yup.number().required("Координата X обязательна").moreThan(-947),
      y: yup.number().required("Координата Y обязательна").max(903),
    })
    .required("Координаты обязательны"),
  creationDate: yup.date().notRequired(),
  unitOfMeasure: yup
    .string()
    .required("Единица измерения обязательна")
    .oneOf(
      ["KILOGRAMS", "CENTIMETERS", "SQUARE_METERS", "LITERS"],
      "Недопустимая единица измерения"
    ),
  manufacturer: yup
    .object()
    .shape({
      id: yup.number().required("ID производителя обязателен"),
      name: yup.string().required("Название производителя обязательно"),
    })
    .required("Производитель обязателен"),
  price: yup
    .number()
    .required("Цена обязательна")
    .moreThan(0, "Цена должна быть больше 0"),
  manufactureCost: yup.number().nullable(),
  rating: yup
    .number()
    .required("Рейтинг обязателен")
    .moreThan(0, "Рейтинг должен быть больше 0"),
  partNumber: yup
    .string()
    .required("Part Number обязателен")
    .min(15, "Part Number должен содержать не менее 15 символов"),
  owner: yup
    .object()
    .shape({
      id: yup.number().required("ID владельца обязателен"),
      name: yup.string().required("Имя владельца обязательно"),
    })
    .required("Владелец обязателен"),
});

class ProductStore {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Сброс ошибки
  resetError() {
    this.error = null;
  }

  // Загрузить продукты с сервера
  async loadProducts() {
    this.loading = true;
    this.resetError();
    try {
      const data = await productApi.fetchProducts();
      runInAction(() => {
        this.products = data.map((product: Product) => ({
          ...product,
          creationDate: new Date(product.creationDate),
        }));
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Ошибка при загрузке продуктов";
      });
      toast.error("Ошибка при загрузке продуктов");
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // Создать продукт
  async createProduct(product: Product) {
    this.resetError();
    try {
      // Валидация перед созданием
      await productSchema.validate(product, { abortEarly: false });

      const newProduct = await productApi.createProduct(product);
      runInAction(() => {
        this.products.push(newProduct);
      });
      toast.success("Продукт успешно создан");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        toast.error(`Ошибка валидации: ${error.errors.join(", ")}`);
      } else {
        runInAction(() => {
          this.error = "Ошибка при создании продукта";
        });
        toast.error("Ошибка при создании продукта");
      }
    }
  }

  // Обновить продукт
  async updateProduct(id: number, updatedProduct: Product) {
    this.resetError();
    try {
      // Валидация перед обновлением
      await productSchema.validate(updatedProduct, { abortEarly: false });

      const product = await productApi.updateProduct(id, updatedProduct);
      runInAction(() => {
        this.products = this.products.map((p) => (p.id === id ? product : p));
      });
      toast.success("Продукт успешно обновлен");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        toast.error(`Ошибка валидации: ${error.errors.join(", ")}`);
      } else {
        runInAction(() => {
          this.error = "Ошибка при обновлении продукта";
        });
        toast.error("Ошибка при обновлении продукта");
      }
    }
  }

  // Удалить продукт
  async deleteProduct(id: number) {
    this.resetError();
    try {
      await productApi.deleteProduct(id);
      runInAction(() => {
        this.products = this.products.filter((p) => p.id !== id);
      });
      toast.success("Продукт успешно удален");
    } catch (error) {
      runInAction(() => {
        this.error = "Ошибка при удалении продукта";
      });
      toast.error("Ошибка при удалении продукта");
    }
  }

  // Установить выбранный продукт
  setSelectedProduct(product: Product | null) {
    this.selectedProduct = product;
  }

  // Импорт продуктов
  async importProducts(products: Product[]): Promise<void> {
    this.loading = true;
    this.resetError();

    try {
      const userId = userStore.getUserId();
      if (userId !== null) {
        updateCreatedBy(products, userId);
      }

      for (const product of products) {
        // Валидация владельца
        await personSchema.validate(product.owner, { abortEarly: false });

        // Валидация производителя
        await organizationSchema.validate(product.manufacturer, {
          abortEarly: false,
        });

        // Валидация продукта
        await productSchema.validate(product, { abortEarly: false });
      }

      console.log("all is ok");

      const result = await productApi.importProduct(products);
      if (result) {
        toast.success("Продукты успешно импортированы");
      } else {
        toast.success("Произошла ошибка при импорте продуктов");
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Обрабатываем ошибки валидации
        runInAction(() => {
          this.error = "Ошибка валидации данных продукта";
        });
        toast.error("Ошибка валидации данных продукта");

        // Логируем все ошибки валидации
        console.error("Ошибки валидации:", error.inner);

        // Выводим подробности для каждой ошибки
        error.inner.forEach((err) => {
          console.error(`Ошибка в поле "${err.path}": ${err.message}`);
        });

        const validationErrors = error.inner
          .map((err) => `${err.path}: ${err.message}`)
          .join(", ");
        toast.error(`Ошибки валидации: ${validationErrors}`);
      }
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

function updateCreatedBy(data: any, userId: number): void {
  console.log(`userId: ${userId}`);
  if (Array.isArray(data)) {
    data.forEach((item) => updateCreatedBy(item, userId));
  } else if (typeof data === "object" && data !== null) {
    for (const key in data) {
      if (key === "createdBy") {
        data[key] = userId;
      } else if (typeof data[key] === "object" && data[key] !== null) {
        updateCreatedBy(data[key], userId);
      }
    }
  }
}

export const productStore = new ProductStore();
