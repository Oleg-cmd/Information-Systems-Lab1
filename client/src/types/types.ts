// Перечисления
export enum UnitOfMeasure {
  KILOGRAMS = "KILOGRAMS",
  CENTIMETERS = "CENTIMETERS",
  SQUARE_METERS = "SQUARE_METERS",
  LITERS = "LITERS",
}

export enum Color {
  RED = "RED",
  ORANGE = "ORANGE",
  GREEN = "GREEN",
  WHITE = "WHITE",
  BROWN = "BROWN",
}

export enum Country {
  RUSSIA = "RUSSIA",
  INDIA = "INDIA",
  VATICAN = "VATICAN",
  SOUTH_KOREA = "SOUTH_KOREA",
}

// Вспомогательные интерфейсы
export interface Coordinates {
  x: number;
  y: number;
}

export interface Location {
  id: number;
  x: number;
  y: number;
  z: number;
}

export interface Address {
  id: number;
  zipCode?: string; // Поле может быть null
  town?: Location | undefined; // Поле может быть null
}

export interface AddressWithExtraFields extends Address {
  createTown?: Omit<Location, "id">; // Новая локация без id
  linkTownId?: number | null;
}

// Интерфейс для класса Person
export interface Person {
  id: number;
  name: string;
  birthday?: Date; // Поле может быть null
  hairColor: Color;
  eyeColor?: Color; // Цвет глаз, может быть null
  nationality: Country;
  location: Location | undefined; // Местоположение, обязательно
}

export interface PersonWithExtraFields extends Person {
  createLocation?: Omit<Location, "id">; // Новая локация без id
  linkLocationId?: number | null; // ID существующей локации
}

// Интерфейс для класса Organization
export interface Organization {
  id: number;
  name: string;
  officialAddress?: Address; // Может быть null
  annualTurnover?: number; // Может быть null
  employeesCount: number;
  rating?: number; // Может быть null
  postalAddress?: Address; // Может быть null
  fullName?: string;
}

export interface OrganizationWithExtraFields extends Organization {
  createOfficialAddress?: Omit<AddressWithExtraFields, "id">; // Создание нового официального адреса
  linkOfficialAddressId?: number | null; // Привязка существующего официального адреса
  createPostalAddress?: Omit<AddressWithExtraFields, "id">; // Создание нового почтового адреса
  linkPostalAddressId?: number | null; // Привязка существующего почтового адреса
}

// Основной интерфейс для класса Product
export interface Product {
  id: number;
  name: string;
  coordinates: Coordinates;
  creationDate: Date; // Автоматически генерируемое поле
  unitOfMeasure: UnitOfMeasure;
  manufacturer: Organization;
  price: number;
  manufactureCost?: number | null; // Может быть null
  rating: number;
  partNumber: string;
  owner: Person;
}

// Интерфейс для User
export interface User {
  username: string;
  role: "USER" | "ADMIN";
  approved: boolean;
  products: Product[] | null;
  id: number;
  jwt: string;
}
