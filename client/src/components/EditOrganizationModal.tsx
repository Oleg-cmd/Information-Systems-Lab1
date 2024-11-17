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
import { organizationStore } from "../stores/OrganizationStore";
import { addressStore } from "../stores/AddressStore"; // Используем store для адресов
import {
  Organization,
  Address,
  OrganizationWithExtraFields,
} from "../types/types";

const EditOrganizationModal = ({
  isOpen,
  onClose,
  organization,
}: {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationWithExtraFields | null;
}) => {
  const [formData, setFormData] = useState<OrganizationWithExtraFields | null>(
    organization
  );
  const [linkedOfficialAddressId, setLinkedOfficialAddressId] = useState<
    number | null
  >(organization?.officialAddress?.id || null);
  const [linkedPostalAddressId, setLinkedPostalAddressId] = useState<
    number | null
  >(organization?.postalAddress?.id || null);

  useEffect(() => {
    if (organization) {
      setFormData(organization);
      setLinkedOfficialAddressId(organization.officialAddress?.id || null);
      setLinkedPostalAddressId(organization.postalAddress?.id || null);
    }
  }, [organization]);

  const handleSave = async () => {
    try {
      if (formData) {
        const updatedOrganization: OrganizationWithExtraFields = {
          ...formData,
          createOfficialAddress: undefined,
          linkOfficialAddressId: linkedOfficialAddressId,
          createPostalAddress: undefined,
          linkPostalAddressId: linkedPostalAddressId,
        };

        await organizationStore.updateOrganization(
          formData.id,
          updatedOrganization
        );
      }
      onClose();
    } catch (error) {
      console.error("Ошибка редактирования организации:", error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать организацию</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {/* Название */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Название</Label>
            <Input
              placeholder='Название'
              value={formData?.name || ""}
              onChange={(e) =>
                setFormData({ ...formData!, name: e.target.value })
              }
              className='col-span-3'
            />
          </div>

          {/* Полное название */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Полное название</Label>
            <Input
              placeholder='Полное название'
              value={formData?.fullName || ""}
              onChange={(e) =>
                setFormData({ ...formData!, fullName: e.target.value })
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
              value={formData?.annualTurnover?.toString() || ""}
              onChange={(e) =>
                setFormData({
                  ...formData!,
                  annualTurnover: parseFloat(e.target.value),
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
              value={formData?.employeesCount.toString() || ""}
              onChange={(e) =>
                setFormData({
                  ...formData!,
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
              value={formData?.rating?.toString() || ""}
              onChange={(e) =>
                setFormData({
                  ...formData!,
                  rating: parseFloat(e.target.value),
                })
              }
              className='col-span-3'
            />
          </div>

          {/* Официальный адрес */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Официальный адрес</Label>
            <Select
              value={
                linkedOfficialAddressId ? String(linkedOfficialAddressId) : ""
              }
              onValueChange={(id) => setLinkedOfficialAddressId(Number(id))}
            >
              <SelectTrigger className='col-span-3'>
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

          {/* Почтовый адрес */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Почтовый адрес</Label>
            <Select
              value={linkedPostalAddressId ? String(linkedPostalAddressId) : ""}
              onValueChange={(id) => setLinkedPostalAddressId(Number(id))}
            >
              <SelectTrigger className='col-span-3'>
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

export default EditOrganizationModal;
