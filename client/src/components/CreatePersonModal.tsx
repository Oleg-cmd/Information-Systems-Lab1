import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import { personStore } from "./../stores/PersonStore";
import { locationStore } from "./../stores/LocationStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Color, Country, PersonWithExtraFields } from "../types/types";

interface CreatePersonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePersonModal: React.FC<CreatePersonModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState<string | undefined>(undefined);
  const [eyeColor, setEyeColor] = useState<Color | undefined>(undefined);
  const [hairColor, setHairColor] = useState<Color | undefined>(undefined);
  const [nationality, setNationality] = useState<Country | undefined>(
    undefined
  );
  const [locationOption, setLocationOption] = useState<"create" | "link">(
    "create"
  );
  const [linkedLocationId, setLinkedLocationId] = useState<number | null>(null);
  const [newLocation, setNewLocation] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const handleSave = async () => {
    try {
      if (locationOption === "create" && !newLocation) {
        alert("Для создания требуется указать новую локацию.");
        return;
      }

      if (locationOption === "link" && !linkedLocationId) {
        alert("Для привязки требуется выбрать существующую локацию.");
        return;
      }

      const personToSave: PersonWithExtraFields = {
        id: 0,
        name,
        birthday: birthday ? new Date(birthday) : undefined,
        eyeColor: eyeColor as Color, // Приведение к типу Color
        hairColor: hairColor as Color, // Приведение к типу Color
        nationality: nationality as Country, // Приведение к типу Country
        location:
          locationOption === "create"
            ? { ...newLocation, id: 0 } // Добавляем id для соответствия Location
            : { id: linkedLocationId!, x: 0, y: 0, z: 0 }, // Для привязки локации
        createLocation:
          locationOption === "create" ? { ...newLocation } : undefined,
        linkLocationId:
          locationOption === "link" ? linkedLocationId : undefined,
      };

      await personStore.createPerson(personToSave);
      onClose();
    } catch (error) {
      console.error("Ошибка создания владельца:", error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать владельца</DialogTitle>
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
              value={birthday || ""}
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
            <RadioGroup
              value={locationOption}
              onValueChange={(value) =>
                setLocationOption(value as "create" | "link")
              }
              className='flex gap-4 col-span-3'
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
          </div>

          {locationOption === "create" && (
            <div className='grid gap-4'>
              <Input
                type='number'
                placeholder='Координата X'
                value={newLocation.x}
                onChange={(e) =>
                  setNewLocation({ ...newLocation, x: +e.target.value })
                }
              />
              <Input
                type='number'
                placeholder='Координата Y'
                value={newLocation.y}
                onChange={(e) =>
                  setNewLocation({ ...newLocation, y: +e.target.value })
                }
              />
              <Input
                type='number'
                placeholder='Координата Z'
                value={newLocation.z}
                onChange={(e) =>
                  setNewLocation({ ...newLocation, z: +e.target.value })
                }
              />
            </div>
          )}

          {locationOption === "link" && (
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label>Выберите локацию</Label>
              <Select
                value={linkedLocationId ? String(linkedLocationId) : ""}
                onValueChange={(id) => setLinkedLocationId(Number(id))}
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Привязать к локации' />
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
          )}
        </div>
        <Button onClick={handleSave}>Сохранить</Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePersonModal;
