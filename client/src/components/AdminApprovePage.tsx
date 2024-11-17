import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { fetchPendingAdmins, approveAdmin } from "../api/adminApproval";
import { User } from "../types/types";

const AdminApprovalPage: React.FC = () => {
  const [pendingAdmins, setPendingAdmins] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPendingAdmins = async () => {
      try {
        const admins = await fetchPendingAdmins();
        setPendingAdmins(admins);
      } catch (e) {
        setError("Ошибка загрузки неподтвержденных администраторов.");
      }
    };
    loadPendingAdmins();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await approveAdmin(id, true);
      setPendingAdmins((prev) => prev.filter((admin) => admin.id !== id));
    } catch (e) {
      setError("Ошибка подтверждения администратора.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await approveAdmin(id, false);
      setPendingAdmins((prev) => prev.filter((admin) => admin.id !== id));
    } catch (e) {
      setError("Ошибка отклонения администратора.");
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>
        Подтверждение новых администраторов
      </h1>
      {error && <p className='text-red-500'>{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Имя пользователя</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingAdmins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.id}</TableCell>
              <TableCell>{admin.username}</TableCell>
              <TableCell>
                <Button
                  className='mr-4'
                  onClick={() => handleApprove(admin.id)}
                >
                  Одобрить
                </Button>
                <Button
                  onClick={() => handleReject(admin.id)}
                  variant='destructive'
                >
                  Отклонить
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminApprovalPage;
