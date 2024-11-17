"use client";

import React, { useState } from "react";
import {
  fetchAverageRating,
  fetchCountByPartNumber,
  fetchProductsByPartNumberPrefix,
  fetchProductsByPriceRange,
  fetchProductsByUnitOfMeasure,
} from "../api/specialOperations";
import { Product, UnitOfMeasure } from "../types/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const SpecialOperationsPage: React.FC = () => {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [partNumberCount, setPartNumberCount] = useState<number | null>(null);
  const [partNumberPrefix, setPartNumberPrefix] = useState("");
  const [productsByPrefix, setProductsByPrefix] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [productsByPrice, setProductsByPrice] = useState<Product[]>([]);
  const [unitOfMeasure, setUnitOfMeasure] = useState("");
  const [productsByUnit, setProductsByUnit] = useState<Product[]>([]);

  const handleAverageRating = async () => {
    const result = await fetchAverageRating();
    setAverageRating(result);
  };

  const handleCountByPartNumber = async (partNumber: string) => {
    const result = await fetchCountByPartNumber(partNumber);
    setPartNumberCount(result);
  };

  const handleFindByPartNumberPrefix = async () => {
    const result = await fetchProductsByPartNumberPrefix(partNumberPrefix);
    setProductsByPrefix(result);
  };

  const handleFindByPriceRange = async () => {
    const result = await fetchProductsByPriceRange(
      priceRange.min,
      priceRange.max
    );
    setProductsByPrice(result);
  };

  const handleFindByUnitOfMeasure = async () => {
    const result = await fetchProductsByUnitOfMeasure(unitOfMeasure);
    setProductsByUnit(result);
  };

  return (
    <div className='container mx-auto p-4 space-y-8'>
      <h1 className='text-3xl font-bold mb-6'>Специальные операции</h1>

      <Card>
        <CardHeader>
          <CardTitle>Среднее значение поля rating</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAverageRating}>Рассчитать</Button>
          {averageRating !== null && (
            <p className='mt-4'>Средний рейтинг: {averageRating}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Количество объектов по partNumber</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex space-x-2'>
            <Input
              type='text'
              placeholder='Введите partNumber'
              onChange={(e) => handleCountByPartNumber(e.target.value)}
            />
          </div>
          {partNumberCount !== null && (
            <p className='mt-4'>Количество: {partNumberCount}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Объекты с partNumber начинается с</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex space-x-2 mb-4'>
            <Input
              type='text'
              value={partNumberPrefix}
              onChange={(e) => setPartNumberPrefix(e.target.value)}
              placeholder='Введите префикс'
            />
            <Button onClick={handleFindByPartNumberPrefix}>Найти</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Рейтинг</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsByPrefix.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Продукция по диапазону цен</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex space-x-2 mb-4'>
            <Input
              type='number'
              placeholder='Мин. цена'
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: +e.target.value })
              }
            />
            <Input
              type='number'
              placeholder='Макс. цена'
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: +e.target.value })
              }
            />
            <Button onClick={handleFindByPriceRange}>Найти</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Цена</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsByPrice.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Продукция по единицам измерения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex space-x-2 mb-4'>
            <select
              className='border rounded p-2'
              value={unitOfMeasure}
              onChange={(e) => setUnitOfMeasure(e.target.value)}
            >
              <option value=''>Выберите единицу измерения</option>
              {Object.values(UnitOfMeasure).map((measure) => (
                <option
                  key={measure}
                  value={measure}
                >
                  {measure}
                </option>
              ))}
            </select>
            <Button onClick={handleFindByUnitOfMeasure}>Найти</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Ед. измерения</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsByUnit.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.unitOfMeasure}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialOperationsPage;
