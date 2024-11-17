"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { personStore } from "../stores/PersonStore";
import { locationStore } from "../stores/LocationStore";
import { Person, Color, Country } from "../types/types";
import moment from "moment";

import CreatePersonModal from "./CreatePersonModal";
import EditPersonModal from "./EditPersonModal";
import { toJS } from "mobx";

const initialPerson: Person = {
  id: 0,
  name: "",
  birthday: undefined,
  hairColor: Color.BROWN,
  eyeColor: Color.RED,
  nationality: Country.RUSSIA,
  location: { id: 0, x: 0, y: 0, z: 0 },
};

const PersonTableComponent = observer(() => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<Person>(initialPerson);

  const [sortField, setSortField] = useState<keyof Person>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    personStore.loadPersons();
    locationStore.loadLocations();
  }, []);

  const handleEdit = (person: Person) => {
    const plainPerson = toJS(person); // Преобразуем MobX-прокси в обычный объект
    setCurrentPerson(plainPerson);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm(
      "Вы уверены, что хотите удалить этого владельца?"
    );
    if (isConfirmed) {
      await personStore.deletePerson(id);
    }
  };

  // Сортировка данных
  const sortPersons = (): Person[] => {
    const sorted = [...personStore.persons].sort((a, b) => {
      const aField = a[sortField] ?? ""; // Установить значение по умолчанию, если null/undefined
      const bField = b[sortField] ?? "";

      if (aField < bField) return sortDirection === "asc" ? -1 : 1;
      if (aField > bField) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  // Переключение направления сортировки
  const handleSort = (field: keyof Person) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Функция для рендера ячейки
  const renderCell = (key: keyof Person, value: unknown): React.ReactNode => {
    if (key === "birthday" && typeof value === "string") {
      return moment(value).format("DD.MM.YYYY");
    }
    if (key === "location" && typeof value === "object" && value) {
      const { x, y, z } = value as { x: number; y: number; z: number };
      return `(${x}, ${y}, ${z})`;
    }
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
    return "N/A";
  };

  const exlude = ["createdBy", "linkLocationId", "createLocation"];

  return (
    <div className='container mx-auto p-4'>
      <Button
        onClick={() => {
          setCurrentPerson(initialPerson);
          setIsCreateModalOpen(true);
        }}
        className='mb-4'
      >
        Создать владельца
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => handleSort("id")}
              className='cursor-pointer select-none'
            >
              ID
            </TableHead>
            <TableHead
              onClick={() => handleSort("name")}
              className='cursor-pointer select-none'
            >
              Имя
            </TableHead>
            <TableHead>Цвет глаз</TableHead>
            <TableHead>Цвет волос</TableHead>
            <TableHead>Местоположение</TableHead>

            <TableHead
              onClick={() => handleSort("birthday")}
              className='cursor-pointer select-none'
            >
              Дата рождения
            </TableHead>

            <TableHead>Национальность</TableHead>

            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortPersons().map((person: Person) => (
            <TableRow key={person.id}>
              {Object.entries(person)
                .filter(([key]) => !exlude.includes(key))
                .map(([key, value]) => (
                  <TableCell key={key}>
                    {renderCell(key as keyof Person, value)}
                  </TableCell>
                ))}
              <TableCell>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleEdit(person)}
                  className='mr-2'
                >
                  Редактировать
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => handleDelete(person.id)}
                >
                  Удалить
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CreatePersonModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <EditPersonModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        person={currentPerson}
      />
    </div>
  );
});

export default PersonTableComponent;
