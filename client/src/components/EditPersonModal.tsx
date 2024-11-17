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
import { useEffect, useState } from "react";
import { personStore } from "../stores/PersonStore";
import { locationStore } from "../stores/LocationStore";
import { Person, Color, Country } from "../types/types";

interface EditPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: Person; // Передаваемый объект Person
}

const EditPersonModal: React.FC<EditPersonModalProps> = ({
  isOpen,
  onClose,
  person,
}) => {
  const [name, setName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [eyeColor, setEyeColor] = useState<Color | undefined>();
  const [hairColor, setHairColor] = useState<Color>(Color.BROWN);
  const [nationality, setNationality] = useState<Country>(Country.RUSSIA);
  const [linkedLocationId, setLinkedLocationId] = useState<number | null>(null);

  // Синхронизация состояния с `person`
  useEffect(() => {
    if (person) {
      setName(person.name);
      setBirthday(
        person.birthday
          ? new Date(person.birthday).toISOString().split("T")[0]
          : ""
      );
      setEyeColor(person.eyeColor);
      setHairColor(person.hairColor);
      setNationality(person.nationality);
      setLinkedLocationId(person.location?.id || null);
    }
  }, [person]);

  const handleSave = async () => {
    try {
      if (!linkedLocationId) {
        throw new Error("Местоположение должно быть выбрано.");
      }

      const selectedLocation = locationStore.locations.find(
        (location) => location.id === linkedLocationId
      );

      if (!selectedLocation) {
        throw new Error("Выбранная локация не найдена.");
      }

      await personStore.updatePerson(person.id, {
        ...person,
        name,
        birthday: birthday ? new Date(birthday) : undefined,
        eyeColor,
        hairColor,
        nationality,
        location: selectedLocation, // Передаем полный объект Location
      });
      onClose();
    } catch (error) {
      console.error("Ошибка обновления владельца:", error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать владельца</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {/* Имя */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Имя</Label>
            <Input
              placeholder='Имя'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='col-span-3'
            />
          </div>

          {/* Дата рождения */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Дата рождения</Label>
            <Input
              type='date'
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className='col-span-3'
            />
          </div>

          {/* Цвет глаз */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Цвет глаз</Label>
            <Select
              value={eyeColor || ""}
              onValueChange={(value) => setEyeColor(value as Color)}
            >
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Выберите цвет глаз' />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Color).map((color) => (
                  <SelectItem
                    key={color}
                    value={color}
                  >
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Цвет волос */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Цвет волос</Label>
            <Select
              value={hairColor || ""}
              onValueChange={(value) => setHairColor(value as Color)}
            >
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Выберите цвет волос' />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Color).map((color) => (
                  <SelectItem
                    key={color}
                    value={color}
                  >
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Национальность */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Национальность</Label>
            <Select
              value={nationality || ""}
              onValueChange={(value) => setNationality(value as Country)}
            >
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Выберите национальность' />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Country).map((country) => (
                  <SelectItem
                    key={country}
                    value={country}
                  >
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Местоположение */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label>Местоположение</Label>
            <Select
              value={linkedLocationId ? String(linkedLocationId) : ""}
              onValueChange={(id) => setLinkedLocationId(Number(id))}
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

export default EditPersonModal;
