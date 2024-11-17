"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { addressStore } from "../stores/AddressStore";
import { locationStore } from "../stores/LocationStore";
import { Address, Location } from "../types/types";

interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: Address;
}

const EditAddressModal: React.FC<EditAddressModalProps> = ({
  isOpen,
  onClose,
  address,
}) => {
  const [zipCode, setZipCode] = useState<string>(address.zipCode ?? "");
  const [linkedTownId, setLinkedTownId] = useState<number | null>(
    address.town?.id || null
  );

  useEffect(() => {
    if (address) {
      setZipCode(address.zipCode ?? ""); // Устанавливаем пустую строку, если zipCode undefined
      setLinkedTownId(address.town?.id || null);
    }
  }, [address]);

  const handleSave = async () => {
    try {
      if (!linkedTownId) {
        alert("Необходимо выбрать локацию.");
        return;
      }

      const selectedTown = locationStore.locations.find(
        (location) => location.id === linkedTownId
      );

      if (!selectedTown) {
        alert("Выбранная локация не найдена.");
        return;
      }

      const updatedAddress = {
        ...address,
        id: address.id ?? 0, // Убедитесь, что `id` всегда задан
        zipCode,
        town: selectedTown,
      };

      await addressStore.updateAddress(address.id!, updatedAddress);
      onClose();
    } catch (error) {
      console.error("Ошибка обновления адреса:", error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать адрес</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Почтовый индекс</Label>
            <Input
              placeholder='Почтовый индекс'
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className='col-span-3'
            />
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Локация</Label>
            <Select
              value={linkedTownId ? String(linkedTownId) : ""}
              onValueChange={(id) => setLinkedTownId(Number(id))}
            >
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Выберите локацию' />
              </SelectTrigger>
              <SelectContent>
                {locationStore.locations.map((location) => (
                  <SelectItem
                    key={location.id}
                    value={String(location.id)}
                  >
                    {`ID: ${location.id} (${location.x}, ${location.y}, ${location.z})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='flex justify-end'>
          <Button
            variant='outline'
            onClick={onClose}
            className='mr-2'
          >
            Отмена
          </Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAddressModal;
