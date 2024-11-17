"use client";

import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { locationStore } from "../stores/LocationStore";
import { Location } from "../types/types";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const initialLocation: Location = {
  id: 0,
  x: 0,
  y: 0,
  z: 0,
};

export const LocationTableComponent = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLocation, setCurrentLocation] =
    useState<Location>(initialLocation);
  const [sortField, setSortField] = useState<keyof Location>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    locationStore.loadLocations();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Location
  ) => {
    const { value } = e.target;
    setCurrentLocation((prev) => ({
      ...prev,
      [field]: parseFloat(value),
    }));
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await locationStore.updateLocation(currentLocation.id, currentLocation);
      } else {
        await locationStore.createLocation(currentLocation);
      }
      setIsModalOpen(false);
      setIsEditing(false);
      setCurrentLocation(initialLocation);
    } catch (error) {
      console.error("Ошибка сохранения локации:", error);
    }
  };

  const handleEdit = (location: Location) => {
    setCurrentLocation(location);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить эту локацию?")) {
      await locationStore.deleteLocation(id);
    }
  };

  const sortLocations = (field: keyof Location) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedLocations = [...locationStore.locations].sort((a, b) => {
    const aField = a[sortField];
    const bField = b[sortField];
    if (aField < bField) return sortDirection === "asc" ? -1 : 1;
    if (aField > bField) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className='container mx-auto p-4'>
      <Button
        onClick={() => {
          setCurrentLocation(initialLocation);
          setIsEditing(false);
          setIsModalOpen(true);
        }}
        className='mb-4'
      >
        Создать локацию
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => sortLocations("id")}
              className='cursor-pointer'
            >
              ID
            </TableHead>
            <TableHead
              onClick={() => sortLocations("x")}
              className='cursor-pointer'
            >
              Координата X
            </TableHead>
            <TableHead
              onClick={() => sortLocations("y")}
              className='cursor-pointer'
            >
              Координата Y
            </TableHead>
            <TableHead
              onClick={() => sortLocations("z")}
              className='cursor-pointer'
            >
              Координата Z
            </TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLocations.map((location) => (
            <TableRow key={location.id}>
              <TableCell>{location.id}</TableCell>
              <TableCell>{location.x}</TableCell>
              <TableCell>{location.y}</TableCell>
              <TableCell>{location.z}</TableCell>
              <TableCell>
                <Button
                  variant='outline'
                  onClick={() => handleEdit(location)}
                  className='mr-2'
                >
                  Редактировать
                </Button>
                <Button
                  variant='destructive'
                  onClick={() => handleDelete(location.id)}
                >
                  Удалить
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Редактировать локацию" : "Создать локацию"}
            </DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label>Координата X</Label>
              <Input
                type='number'
                value={currentLocation.x.toString()}
                onChange={(e) => handleInputChange(e, "x")}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label>Координата Y</Label>
              <Input
                type='number'
                value={currentLocation.y.toString()}
                onChange={(e) => handleInputChange(e, "y")}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label>Координата Z</Label>
              <Input
                type='number'
                value={currentLocation.z.toString()}
                onChange={(e) => handleInputChange(e, "z")}
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsModalOpen(false)}
            >
              Отмена
            </Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});
