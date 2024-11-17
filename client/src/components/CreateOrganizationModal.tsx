"use client";

import { useEffect, useState } from "react";
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
import { organizationStore } from "../stores/OrganizationStore";
import { locationStore } from "../stores/LocationStore";
import {
  Organization,
  Location,
  Address,
  AddressWithExtraFields,
  OrganizationWithExtraFields,
} from "../types/types";
import { addressStore } from "../stores/AddressStore";

const initialOrganization: Organization = {
  id: 0,
  name: "",
  fullName: "",
  officialAddress: {
    id: 0,
    zipCode: "",
    town: { x: 0, y: 0, z: 0, id: 0 },
  },
  annualTurnover: undefined,
  employeesCount: 0,
  rating: undefined,
  postalAddress: {
    id: 0,
    zipCode: "",
    town: { x: 0, y: 0, z: 0, id: 0 },
  },
};

const initialAddress: AddressWithExtraFields = {
  id: 0,
  zipCode: "",
  town: { id: 0, x: 0, y: 0, z: 0 },
  createTown: { x: 0, y: 0, z: 0 },
};

const CreateOrganizationModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [organization, setOrganization] = useState(initialOrganization);

  const [officialAddressOption, setOfficialAddressOption] = useState<
    "create" | "link"
  >("create");
  const [postalAddressOption, setPostalAddressOption] = useState<
    "create" | "link"
  >("create");

  const [newOfficialAddress, setNewOfficialAddress] =
    useState<AddressWithExtraFields>({
      id: 0,
      zipCode: "",
      town: { id: 0, x: 0, y: 0, z: 0 },
      createTown: { x: 0, y: 0, z: 0 },
    });
  const [linkedOfficialAddressId, setLinkedOfficialAddressId] = useState<
    number | null
  >(null);

  const [newPostalAddress, setNewPostalAddress] =
    useState<AddressWithExtraFields>({
      id: 0,
      zipCode: "",
      town: { id: 0, x: 0, y: 0, z: 0 },
      createTown: { x: 0, y: 0, z: 0 },
    });
  const [linkedPostalAddressId, setLinkedPostalAddressId] = useState<
    number | null
  >(null);

  const handleSave = async () => {
    try {
      const organizationToSave: OrganizationWithExtraFields = {
        ...organization,
        createOfficialAddress:
          officialAddressOption === "create"
            ? { ...newOfficialAddress } // Используем пользовательские данные
            : undefined,
        linkOfficialAddressId:
          officialAddressOption === "link" ? linkedOfficialAddressId : null,
        createPostalAddress:
          postalAddressOption === "create"
            ? { ...newPostalAddress } // Используем пользовательские данные
            : undefined,
        linkPostalAddressId:
          postalAddressOption === "link" ? linkedPostalAddressId : null,
      };

      await organizationStore.createOrganization(organizationToSave);

      onClose();
    } catch (error) {
      console.error("Ошибка создания организации:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Сбрасываем состояние при открытии модального окна
      setOrganization(initialOrganization);
      setOfficialAddressOption("create");
      setPostalAddressOption("create");
      setNewOfficialAddress(initialAddress);
      setNewPostalAddress(initialAddress);
      setLinkedOfficialAddressId(null);
      setLinkedPostalAddressId(null);
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать организацию</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {/* Название */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Название</Label>
            <Input
              placeholder='Название'
              value={organization.name}
              onChange={(e) =>
                setOrganization({ ...organization, name: e.target.value })
              }
              className='col-span-3'
            />
          </div>

          {/* Полное название */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Полное название</Label>
            <Input
              placeholder='Полное название'
              value={organization.fullName}
              onChange={(e) =>
                setOrganization({ ...organization, fullName: e.target.value })
              }
              className='col-span-3'
            />
          </div>

          {/* Годовой оборот */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Годовой оборот</Label>
            <Input
              type='number'
              placeholder='Годовой оборот'
              value={organization.annualTurnover || ""}
              onChange={(e) =>
                setOrganization({
                  ...organization,
                  annualTurnover: parseFloat(e.target.value) || undefined,
                })
              }
              className='col-span-3'
            />
          </div>

          {/* Количество сотрудников */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Количество сотрудников</Label>
            <Input
              type='number'
              placeholder='Количество сотрудников'
              value={organization.employeesCount.toString()}
              onChange={(e) =>
                setOrganization({
                  ...organization,
                  employeesCount: parseInt(e.target.value, 10),
                })
              }
              className='col-span-3'
            />
          </div>

          {/* Рейтинг */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Рейтинг</Label>
            <Input
              type='number'
              placeholder='Рейтинг'
              value={organization.rating || ""}
              onChange={(e) =>
                setOrganization({
                  ...organization,
                  rating: parseFloat(e.target.value) || undefined,
                })
              }
              className='col-span-3'
            />
          </div>
          {/* Официальный адрес */}
          <div className='mb-4'>
            <h3 className='text-lg font-semibold mb-2'>Официальный адрес</h3>
            <div className='grid grid-cols-4 items-center gap-4 mb-4'>
              <Label>Тип адреса</Label>
              <Select
                value={officialAddressOption}
                onValueChange={(value) =>
                  setOfficialAddressOption(value as "create" | "link")
                }
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Выберите опцию' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='create'>Создать новый адрес</SelectItem>
                  <SelectItem value='link'>
                    Привязать существующий адрес
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {officialAddressOption === "create" && (
              <div className='grid gap-4'>
                <Input
                  placeholder='Почтовый индекс'
                  value={newOfficialAddress.zipCode}
                  onChange={(e) =>
                    setNewOfficialAddress({
                      ...newOfficialAddress,
                      zipCode: e.target.value,
                    })
                  }
                />
                <Input
                  type='number'
                  placeholder='Координата X'
                  value={newOfficialAddress.createTown?.x || 0}
                  onChange={(e) =>
                    setNewOfficialAddress((prev) => ({
                      ...prev,
                      createTown: {
                        ...prev.createTown!,
                        x: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
                <Input
                  type='number'
                  placeholder='Координата Y'
                  value={newOfficialAddress.createTown?.y || 0}
                  onChange={(e) =>
                    setNewOfficialAddress((prev) => ({
                      ...prev,
                      createTown: {
                        ...prev.createTown!,
                        y: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
                <Input
                  type='number'
                  placeholder='Координата Z'
                  value={newOfficialAddress.createTown?.z || 0}
                  onChange={(e) =>
                    setNewOfficialAddress((prev) => ({
                      ...prev,
                      createTown: {
                        ...prev.createTown!,
                        z: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
            )}

            {officialAddressOption === "link" && (
              <div className='grid gap-4'>
                <Select
                  value={
                    linkedOfficialAddressId
                      ? String(linkedOfficialAddressId)
                      : ""
                  }
                  onValueChange={(id) => setLinkedOfficialAddressId(Number(id))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Выберите существующий адрес' />
                  </SelectTrigger>
                  <SelectContent>
                    {addressStore.addresses.map((address) => (
                      <SelectItem
                        key={address.id}
                        value={String(address.id)}
                      >
                        {`ID: ${address.id} (ZIP: ${address.zipCode})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Почтовый адрес */}
          <div className='mb-4'>
            <h3 className='text-lg font-semibold mb-2'>Почтовый адрес</h3>
            <div className='grid grid-cols-4 items-center gap-4 mb-4'>
              <Label>Тип адреса</Label>
              <Select
                value={postalAddressOption}
                onValueChange={(value) =>
                  setPostalAddressOption(value as "create" | "link")
                }
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Выберите опцию' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='create'>Создать новый адрес</SelectItem>
                  <SelectItem value='link'>
                    Привязать существующий адрес
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {postalAddressOption === "create" && (
              <div className='grid gap-4'>
                <Input
                  placeholder='Почтовый индекс'
                  value={newPostalAddress.zipCode}
                  onChange={(e) =>
                    setNewPostalAddress({
                      ...newPostalAddress,
                      zipCode: e.target.value,
                    })
                  }
                />
                <Input
                  type='number'
                  placeholder='Координата X'
                  value={newPostalAddress.createTown?.x || 0}
                  onChange={(e) =>
                    setNewPostalAddress((prev) => ({
                      ...prev,
                      createTown: {
                        ...prev.createTown!,
                        x: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
                <Input
                  type='number'
                  placeholder='Координата Y'
                  value={newPostalAddress.createTown?.y || 0}
                  onChange={(e) =>
                    setNewPostalAddress((prev) => ({
                      ...prev,
                      createTown: {
                        ...prev.createTown!,
                        y: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
                <Input
                  type='number'
                  placeholder='Координата Z'
                  value={newPostalAddress.createTown?.z || 0}
                  onChange={(e) =>
                    setNewPostalAddress((prev) => ({
                      ...prev,
                      createTown: {
                        ...prev.createTown!,
                        z: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
            )}

            {postalAddressOption === "link" && (
              <div className='grid gap-4'>
                <Select
                  value={
                    linkedPostalAddressId ? String(linkedPostalAddressId) : ""
                  }
                  onValueChange={(id) => setLinkedPostalAddressId(Number(id))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Выберите существующий адрес' />
                  </SelectTrigger>
                  <SelectContent>
                    {addressStore.addresses.map((address) => (
                      <SelectItem
                        key={address.id}
                        value={String(address.id)}
                      >
                        {`ID: ${address.id} (ZIP: ${address.zipCode})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganizationModal;
