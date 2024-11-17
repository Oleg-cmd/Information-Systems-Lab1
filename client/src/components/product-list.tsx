"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { productStore } from "../stores/ProductStore";
import { Product } from "../types/types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ProductModalComponent } from "./product-modal";
import { toJS } from "mobx";
import moment from "moment";

export const ProductList = observer(() => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Product>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterName, setFilterName] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const sortProducts = (field: keyof Product) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filterProducts = () => {
    return productStore.products.filter((product) =>
      product.name.toLowerCase().includes(filterName.toLowerCase())
    );
  };

  const getCurrentProducts = () => {
    const filteredProducts = filterProducts();
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      const aField = a[sortField];
      const bField = b[sortField];
      if (aField == null || bField == null) return 0;
      if (aField < bField) return sortDirection === "asc" ? -1 : 1;
      if (aField > bField) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  };

  const renderCell = (key: keyof Product, value: unknown): React.ReactNode => {
    if (key === "coordinates" && typeof value === "object" && value) {
      const { x, y } = value as { x: number; y: number };
      return `(${x}, ${y})`;
    }
    if (key === "creationDate" && typeof value === "object") {
      return moment(value).format("DD.MM.YYYY HH:mm");
    }
    if (typeof value === "object" && value && "name" in value) {
      return (value as { name: string }).name;
    }
    if (typeof value === "string" || typeof value === "number") {
      return value; // Совместимо с ReactNode
    }
    return "N/A"; // Если значение не подходит, возвращаем null
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (product: Partial<Product>) => {
    if (selectedProduct) {
      await productStore.updateProduct(selectedProduct.id, product as Product);
    } else {
      await productStore.createProduct(product as Product);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Список продуктов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex justify-between mb-4'>
            <Input
              placeholder='Фильтр по названию'
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className='max-w-sm'
            />
            <Button onClick={handleCreateProduct}>Создать продукт</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => sortProducts("id")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  ID
                </TableHead>
                <TableHead
                  onClick={() => sortProducts("name")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Название
                </TableHead>
                <TableHead>Координаты</TableHead>
                <TableHead
                  onClick={() => sortProducts("creationDate")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Дата создания
                </TableHead>
                <TableHead>Единица измерения</TableHead>
                <TableHead>Производитель</TableHead>
                <TableHead
                  onClick={() => sortProducts("price")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Цена
                </TableHead>
                <TableHead
                  onClick={() => sortProducts("manufactureCost")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Стоимость производства
                </TableHead>
                <TableHead
                  onClick={() => sortProducts("rating")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Рейтинг
                </TableHead>
                <TableHead>Номер партии</TableHead>
                <TableHead>Владелец</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentProducts().map((product) => (
                <TableRow key={product.id}>
                  {Object.entries(product)
                    .filter(([key]) => key !== "createdBy") // Exclude createdBy
                    .map(([key, value]) => (
                      <TableCell key={key}>
                        {renderCell(key as keyof Product, value)}
                      </TableCell>
                    ))}
                  <TableCell>
                    <Button
                      variant='outline'
                      onClick={() => handleEditProduct(product)}
                      className='mr-2 mb-2'
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant='destructive'
                      onClick={() => productStore.deleteProduct(product.id)}
                    >
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className='flex justify-center mt-4'>
            {Array.from(
              {
                length: Math.ceil(productStore.products.length / itemsPerPage),
              },
              (_, i) => (
                <Button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className='mx-1'
                >
                  {i + 1}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <ProductModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={toJS(selectedProduct)}
      />
    </>
  );
});
