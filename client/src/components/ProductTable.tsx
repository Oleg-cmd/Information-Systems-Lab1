import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Table, Button } from "antd";
import { productStore } from "../stores/ProductStore";

const ProductTable = observer(() => {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Rating", dataIndex: "rating", key: "rating" },
    { title: "Part Number", dataIndex: "partNumber", key: "partNumber" },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => (
        <>
          <Button onClick={() => productStore.setSelectedProduct(record)}>
            Edit
          </Button>
          <Button
            danger
            onClick={() => productStore.deleteProduct(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    // Подгрузка данных о продуктах
    // Здесь может быть вызов API для получения данных
  }, []);

  return (
    <Table
      dataSource={productStore.products}
      columns={columns}
      rowKey='id'
    />
  );
});

export default ProductTable;
