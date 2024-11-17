"use client";

import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { organizationStore } from "../stores/OrganizationStore";
import { Organization } from "../types/types";
import CreateOrganizationModal from "./CreateOrganizationModal";
import EditOrganizationModal from "./EditOrganizationModal";

const OrganizationTable = observer(() => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);

  const [sortField, setSortField] = useState<keyof Organization>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    organizationStore.loadOrganizations();
  }, []);

  const handleCreate = () => {
    setCurrentOrganization(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (organization: Organization) => {
    setCurrentOrganization(organization);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить эту организацию?")) {
      await organizationStore.deleteOrganization(id);
    }
  };

  // Функция для сортировки
  const sortOrganizations = (): Organization[] => {
    const sorted = [...organizationStore.organizations].sort((a, b) => {
      const aField = a[sortField] ?? "";
      const bField = b[sortField] ?? "";

      if (aField < bField) return sortDirection === "asc" ? -1 : 1;
      if (aField > bField) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  // Переключение направления сортировки
  const handleSort = (field: keyof Organization) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Форматирование данных ячейки
  const renderCell = (
    key: keyof Organization,
    value: unknown
  ): React.ReactNode => {
    if (key === "officialAddress" || key === "postalAddress") {
      if (value && typeof value === "object") {
        const address = value as {
          town?: { x: number; y: number; z: number };
          zipCode?: string;
        };
        return address.town
          ? `(${address.town.x}, ${address.town.y}, ${address.town.z}) ZIP: ${
              address.zipCode || "N/A"
            }`
          : "N/A";
      }
      return "N/A";
    }

    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
    return "N/A";
  };

  const exclude = [
    "createdBy",
    "linkLocationId",
    "createLocation",
    "createOfficialAddress",
    "linkOfficialAddressId",
    "createPostalAddress",
    "linkPostalAddressId",
  ];

  return (
    <div className='container mx-auto p-4'>
      <Button
        onClick={handleCreate}
        className='mb-4'
      >
        Создать организацию
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
              Название
            </TableHead>

            <TableHead>Официальный адрес</TableHead>
            <TableHead>Почтовый адрес</TableHead>
            <TableHead
              onClick={() => handleSort("annualTurnover")}
              className='cursor-pointer select-none'
            >
              Годовой оборот
            </TableHead>

            <TableHead
              onClick={() => handleSort("employeesCount")}
              className='cursor-pointer select-none'
            >
              Количество сотрудников
            </TableHead>

            <TableHead
              onClick={() => handleSort("fullName")}
              className='cursor-pointer select-none'
            >
              Полное название
            </TableHead>

            <TableHead
              onClick={() => handleSort("rating")}
              className='cursor-pointer select-none'
            >
              Рейтинг
            </TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortOrganizations().map((org) => (
            <TableRow key={org.id}>
              {Object.entries(org)
                .filter(([key]) => !exclude.includes(key))
                .map(([key, value]) => (
                  <TableCell key={key}>
                    {renderCell(key as keyof Organization, value)}
                  </TableCell>
                ))}
              <TableCell>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleEdit(org)}
                  className='mr-2'
                >
                  Редактировать
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => handleDelete(org.id)}
                >
                  Удалить
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <EditOrganizationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        organization={currentOrganization}
      />
    </div>
  );
});

export default OrganizationTable;
