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
import { addressStore } from "../stores/AddressStore";
import { locationStore } from "../stores/LocationStore";
import { Address } from "../types/types";

import CreateAddressModal from "./CreateAddressModal";
import EditAddressModal from "./EditAddressModal";

const initialAddress: Address = {
  id: 0,
  zipCode: "505050",
  town: {
    x: 0,
    y: 0,
    z: 0,
    id: 0,
  },
};

const AddressTableComponent = observer(() => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);

  const [sortField, setSortField] = useState<keyof Address>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    addressStore.loadAddresses();
    locationStore.loadLocations();
  }, []);

  const handleEdit = (address: Address) => {
    setCurrentAddress(address);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm(
      "Вы уверены, что хотите удалить этот адрес?"
    );
    if (isConfirmed) {
      await addressStore.deleteAddress(id);
    }
  };

  // Сортировка данных
  const sortAddresses = (): Address[] => {
    const sorted = [...addressStore.addresses].sort((a, b) => {
      const aField = a[sortField] ?? "";
      const bField = b[sortField] ?? "";

      if (aField < bField) return sortDirection === "asc" ? -1 : 1;
      if (aField > bField) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  // Переключение направления сортировки
  const handleSort = (field: keyof Address) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Форматирование данных ячейки
  const renderCell = (key: keyof Address, value: unknown): React.ReactNode => {
    if (key === "town" && typeof value === "object" && value) {
      const { x, y, z } = value as { x: number; y: number; z: number };
      return `(${x}, ${y}, ${z})`;
    }
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
    return "N/A";
  };

  const exclude = ["createdBy", "linkTownId", "createTown"];

  return (
    <div className='container mx-auto p-4'>
      <Button
        onClick={() => {
          setCurrentAddress(null);
          setIsCreateModalOpen(true);
        }}
        className='mb-4'
      >
        Создать адрес
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
              onClick={() => handleSort("zipCode")}
              className='cursor-pointer select-none'
            >
              Почтовый индекс
            </TableHead>
            <TableHead>Локация (X, Y, Z)</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortAddresses().map((address) => (
            <TableRow key={address.id}>
              {Object.entries(address)
                .filter(([key]) => !exclude.includes(key))
                .map(([key, value]) => (
                  <TableCell key={key}>
                    {renderCell(key as keyof Address, value)}
                  </TableCell>
                ))}
              <TableCell>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    handleEdit(address);
                  }}
                  className='mr-2 mb-2'
                >
                  Редактировать
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => handleDelete(address.id)}
                >
                  Удалить
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateAddressModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <EditAddressModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        address={currentAddress || initialAddress}
      />
    </div>
  );
});

export default AddressTableComponent;
