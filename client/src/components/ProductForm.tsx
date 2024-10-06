import React from "react";
import { Form, Input, Button, Select } from "antd";
import { observer } from "mobx-react-lite";
import { productStore } from "../stores/ProductStore";
import userStore from "../stores/UserStore";
import { createProduct } from "../api/products";

const { Option } = Select;

const ProductForm = observer(() => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const newProduct = await createProduct({
        ...values,
        ownerId: userStore.getUserId(),
      });
      productStore.addProduct(newProduct);
      form.resetFields();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Form
      style={{
        maxWidth: 400,
        margin: 20,
        border: "1px solid #B3B3B3",
        borderRadius: 20,
        padding: 20,
      }}
      form={form}
      layout='vertical'
      onFinish={onFinish}
      initialValues={productStore.selectedProduct || {}}
    >
      <Form.Item
        name='name'
        label='Product Name'
        rules={[{ required: true, message: "Please input the product name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name='price'
        label='Price'
        rules={[
          {
            required: true,
            message: "Please input the price!",
          },
          {
            validator: (_, value) => {
              if (value && value <= 0) {
                return Promise.reject(
                  new Error("Price must be greater than zero!")
                );
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input type='number' />
      </Form.Item>

      <Form.Item
        name='rating'
        label='Rating'
        rules={[
          {
            required: true,
            message: "Please input the rating!",
          },
          {
            validator: (_, value) => {
              if (value && value <= 0) {
                return Promise.reject(
                  new Error("Rating must be greater than zero!")
                );
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input type='number' />
      </Form.Item>

      <Form.Item
        name='partNumber'
        label='Part Number'
        rules={[
          {
            required: true,
            min: 15,
            message: "Part Number must be at least 15 characters long!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name='manufactureCost'
        label='Manufacture Cost'
        rules={[
          {
            required: false,
            message: "Please input the manufacture cost!",
          },
          {
            validator: (_, value) => {
              if (value && value < 0) {
                return Promise.reject(
                  new Error("Manufacture Cost cannot be negative!")
                );
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input type='number' />
      </Form.Item>

      <Form.Item
        name='unitOfMeasure'
        label='Unit of Measure'
        rules={[
          { required: true, message: "Please select a unit of measure!" },
        ]}
      >
        <Select placeholder='Select a unit of measure'>
          <Option value='KILOGRAM'>Kilogram</Option>
          <Option value='LITRE'>Litre</Option>
          <Option value='ITEM'>Item</Option>
          {/* Добавьте другие единицы измерения по мере необходимости */}
        </Select>
      </Form.Item>

      <Form.Item label='Coordinates'>
        <Form.Item
          name={["coordinates", "x"]}
          label='X Coordinate'
          rules={[
            {
              required: true,

              message: "Please input the X coordinate!",
            },
          ]}
          style={{ display: "inline-block", width: "calc(50% - 8px)" }}
        >
          <Input type='number' />
        </Form.Item>
        <Form.Item
          name={["coordinates", "y"]}
          label='Y Coordinate'
          rules={[
            {
              required: true,

              message: "Please input the Y coordinate!",
            },
          ]}
          style={{
            display: "inline-block",
            width: "calc(50% - 8px)",
            marginLeft: "16px",
          }}
        >
          <Input type='number' />
        </Form.Item>
      </Form.Item>

      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
        >
          {productStore.selectedProduct ? "Update" : "Add"} Product
        </Button>
      </Form.Item>
    </Form>
  );
});

export default ProductForm;
