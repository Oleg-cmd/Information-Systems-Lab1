"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { addressStore } from "../stores/AddressStore";
import { locationStore } from "../stores/LocationStore";

const CreateAddressModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [zipCode, setZipCode] = useState("");
  const [locationOption, setLocationOption] = useState<"create" | "link">(
    "create"
  );
  const [newLocation, setNewLocation] = useState({ x: 0, y: 0, z: 0 });
  const [linkedLocationId, setLinkedLocationId] = useState<number | null>(null);

  const handleSave = async () => {
    try {
      const addressToSave = {
        id: 0,
        zipCode,
        town:
          locationOption === "create"
            ? { ...newLocation, id: 0 }
            : { id: linkedLocationId!, x: 0, y: 0, z: 0 },
        linkTownId: locationOption === "link" ? linkedLocationId : undefined,
        createTown:
          locationOption === "create" ? { ...newLocation } : undefined,
      };

      await addressStore.createAddress(addressToSave);
      onClose();
    } catch (error) {
      console.error("Ошибка создания адреса:", error);
    }
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать адрес</DialogTitle>
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
          <RadioGroup
            value={locationOption}
            onValueChange={(value) =>
              setLocationOption(value as "create" | "link")
            }
            className='flex gap-4'
          >
            <div className='flex items-center gap-2'>
              <RadioGroupItem value='create' />
              <span>Создать новую локацию</span>
            </div>
            <div className='flex items-center gap-2'>
              <RadioGroupItem value='link' />
              <span>Привязать существующую локацию</span>
            </div>
          </RadioGroup>

          {locationOption === "link" && (
            <Select
              value={linkedLocationId ? String(linkedLocationId) : ""}
              onValueChange={(id) => setLinkedLocationId(Number(id))}
            >
              <SelectTrigger>
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
          )}

          {locationOption === "create" && (
            <div className='grid gap-4'>
              <Input
                type='number'
                placeholder='Координата X'
                value={newLocation.x}
                onChange={(e) =>
                  setNewLocation((prev) => ({
                    ...prev,
                    x: Number(e.target.value),
                  }))
                }
              />
              <Input
                type='number'
                placeholder='Координата Y'
                value={newLocation.y}
                onChange={(e) =>
                  setNewLocation((prev) => ({
                    ...prev,
                    y: Number(e.target.value),
                  }))
                }
              />
              <Input
                type='number'
                placeholder='Координата Z'
                value={newLocation.z}
                onChange={(e) =>
                  setNewLocation((prev) => ({
                    ...prev,
                    z: Number(e.target.value),
                  }))
                }
              />
            </div>
          )}
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

export default CreateAddressModal;
