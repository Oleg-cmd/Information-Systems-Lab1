"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Organization, Person, Product, UnitOfMeasure } from "../types/types";
import { fetchOrganizations } from "../api/organizations";
import { fetchPersons } from "../api/persons";
import { personStore } from "../stores/PersonStore";
import { organizationStore } from "../stores/OrganizationStore";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  product?: Product | null;
}

export function ProductModalComponent({
  isOpen,
  onClose,
  onSave,
  product,
}: ProductModalProps) {
  const { persons } = personStore;
  const { organizations } = organizationStore;

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    coordinates: { x: 0, y: 0 },
    unitOfMeasure: UnitOfMeasure.CENTIMETERS,
    price: 0,
    manufactureCost: null,
    rating: 0,
    partNumber: "",
    manufacturer: undefined,
    owner: undefined,
  });

  useEffect(() => {
    if (product) {
      // Режим редактирования: заполняем форму данными продукта
      setFormData({
        ...product,
        name: product.name || "",
        coordinates: product.coordinates || { x: 0, y: 0 },
        unitOfMeasure: product.unitOfMeasure || UnitOfMeasure.CENTIMETERS,
        price: product.price || 0,
        manufactureCost: product.manufactureCost ?? null,
        rating: product.rating || 0,
        partNumber: product.partNumber || "",
        manufacturer: product.manufacturer || undefined,
        owner: product.owner || undefined,
      });
    } else if (isOpen) {
      // Режим создания: сбрасываем форму
      // setFormData({
      //   name: "",
      //   coordinates: { x: 0, y: 0 },
      //   unitOfMeasure: UnitOfMeasure.CENTIMETERS,
      //   price: 0,
      //   manufactureCost: null,
      //   rating: 0,
      //   partNumber: "",
      //   manufacturer: undefined,
      //   owner: undefined,
      // });
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoordinatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      coordinates: {
        x: prev.coordinates?.x ?? 0, // Устанавливаем значение по умолчанию, если `coordinates` не инициализировано
        y: prev.coordinates?.y ?? 0,
        [name]: Number(value),
      },
    }));
  };

  const handleSelectChange = (name: keyof Product) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value as UnitOfMeasure }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {product ? "Редактировать продукт" : "Создать продукт"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='name'
                className='text-right'
              >
                Название
              </Label>
              <Input
                id='name'
                name='name'
                value={formData.name || ""}
                onChange={handleChange}
                className='col-span-3'
                required
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='coordinates-x'
                className='text-right'
              >
                Координаты X
              </Label>
              <Input
                id='coordinates-x'
                name='x'
                type='number'
                value={formData.coordinates?.x ?? 0}
                onChange={handleCoordinatesChange}
                className='col-span-3'
                required
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='coordinates-y'
                className='text-right'
              >
                Координаты Y
              </Label>
              <Input
                id='coordinates-y'
                name='y'
                type='number'
                value={formData.coordinates?.y ?? 0}
                onChange={handleCoordinatesChange}
                className='col-span-3'
                required
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='unitOfMeasure'
                className='text-right'
              >
                Единица измерения
              </Label>
              <Select
                value={formData.unitOfMeasure || UnitOfMeasure.CENTIMETERS}
                onValueChange={handleSelectChange("unitOfMeasure")}
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Выберите единицу измерения' />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UnitOfMeasure).map((unit) => (
                    <SelectItem
                      key={unit}
                      value={unit}
                    >
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='price'
                className='text-right'
              >
                Цена
              </Label>
              <Input
                id='price'
                name='price'
                type='number'
                value={formData.price ?? 0}
                onChange={handleChange}
                className='col-span-3'
                required
                min='0'
                step='0.01'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='manufactureCost'
                className='text-right'
              >
                Стоимость производства
              </Label>
              <Input
                id='manufactureCost'
                name='manufactureCost'
                type='number'
                value={formData.manufactureCost ?? ""}
                onChange={handleChange}
                className='col-span-3'
                min='0'
                step='0.01'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='rating'
                className='text-right'
              >
                Рейтинг
              </Label>
              <Input
                id='rating'
                name='rating'
                type='number'
                value={formData.rating ?? 0}
                onChange={handleChange}
                className='col-span-3'
                required
                min='0'
                step='0.1'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='partNumber'
                className='text-right'
              >
                Номер партии
              </Label>
              <Input
                id='partNumber'
                name='partNumber'
                value={formData.partNumber || ""}
                onChange={handleChange}
                className='col-span-3'
                required
                minLength={15}
              />
            </div>
            {/* Организация */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right'>Организация</Label>
              <Select
                value={
                  formData.manufacturer?.id
                    ? String(formData.manufacturer.id)
                    : ""
                }
                onValueChange={(id) =>
                  setFormData((prev) => ({
                    ...prev,
                    manufacturer: organizations.find(
                      (org) => org.id === Number(id)
                    ),
                  }))
                }
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Выберите организацию' />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem
                      key={org.id}
                      value={String(org.id)}
                    >
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Владелец */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right'>Владелец</Label>
              <Select
                value={formData.owner?.id ? String(formData.owner.id) : ""}
                onValueChange={(id) =>
                  setFormData((prev) => ({
                    ...prev,
                    owner: persons.find((person) => person.id === Number(id)),
                  }))
                }
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Выберите владельца' />
                </SelectTrigger>
                <SelectContent>
                  {persons.map((person) => (
                    <SelectItem
                      key={person.id}
                      value={String(person.id)}
                    >
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Сохранить</Button>
            <Button
              type='button'
              onClick={onClose}
            >
              Отмена
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
