// ImportHistoryPage.tsx
"use client";

import { observer } from "mobx-react-lite";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEffect } from "react";
import importHistoryStore from "../stores/ImportHistoryStore";
import { toast } from "react-toastify";
import userStore from "../stores/UserStore";

const ImportHistoryPage = observer(() => {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Import History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex justify-between mb-4'>
          {/* <Select
            value={importHistoryStore.filterStatus}
            onValueChange={importHistoryStore.setFilterStatus}
          >
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Filter by status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='SUCCESS'>Success</SelectItem>
              <SelectItem value='ERROR'>Error</SelectItem>
            </SelectContent>
          </Select> */}

          {userStore.user?.role === "ADMIN" && (
            <Input
              placeholder='Filter by User ID'
              value={importHistoryStore.filterUserId}
              onChange={(e) =>
                importHistoryStore.setFilterUserId(e.target.value)
              }
              className='w-[200px]'
            />
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => importHistoryStore.sortHistory("id")}>
                ID
              </TableHead>
              {userStore.user?.role === "ADMIN" && (
                <TableHead
                  onClick={() => importHistoryStore.sortHistory("userId")}
                >
                  User ID
                </TableHead>
              )}
              <TableHead
                onClick={() => importHistoryStore.sortHistory("status")}
              >
                Status
              </TableHead>
              <TableHead
                onClick={() => importHistoryStore.sortHistory("successCount")}
              >
                Success Count
              </TableHead>
              <TableHead
                onClick={() => importHistoryStore.sortHistory("timestamp")}
              >
                Timestamp
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {importHistoryStore.getCurrentHistory().map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                {userStore.user?.role === "ADMIN" && (
                  <TableCell>{item.userId}</TableCell>
                )}
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.successCount}</TableCell>
                <TableCell>
                  {new Date(item.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='flex justify-center mt-4'>
          {Array.from(
            {
              length: Math.ceil(
                importHistoryStore.filterHistory().length /
                  importHistoryStore.itemsPerPage
              ),
            },
            (_, i) => (
              <Button
                key={i}
                onClick={() => importHistoryStore.paginate(i + 1)}
                variant={
                  importHistoryStore.currentPage === i + 1
                    ? "default"
                    : "outline"
                }
                className='mx-1'
              >
                {i + 1}
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default ImportHistoryPage;
