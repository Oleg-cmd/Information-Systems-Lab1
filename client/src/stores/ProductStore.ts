import * as yup from "yup";
import { toast } from "react-toastify";
import { makeAutoObservable, runInAction } from "mobx";
import { Product } from "../types/types";
import * as productApi from "../api/products";

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
}

export const productStore = new ProductStore();
