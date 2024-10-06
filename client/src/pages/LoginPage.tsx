import React from "react";
import { Form, Input, Button, Select, notification } from "antd";
import { observer } from "mobx-react-lite";
import userStore from "../stores/UserStore";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const inputStyles = {
  maxWidth: 300,
  marginLeft: "auto",
};

const LoginPage = observer(() => {
  const navigate = useNavigate();

  const onFinish = async (values: {
    username: string;
    password: string;
    role: string;
  }) => {
    try {
      await userStore.login(values.username, values.password, values.role);
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        notification.error({
          message: "Login Failed",
          description: error.message, // Display the error message
        });
      } else {
        notification.error({
          message: "Login Failed",
          description: "An unexpected error occurred.", // Fallback for unknown errors
        });
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        marginTop: "5%",
        margin: "auto",
        padding: "50px 20px",
        border: "1px solid #d9d9d9",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 50 }}>Login</h2>
      <Form
        name='login'
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 400 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label='Username'
          name='username'
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input style={inputStyles} />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password style={inputStyles} />
        </Form.Item>

        <Form.Item
          label='Role'
          name='role'
          rules={[{ required: true, message: "Please select your role!" }]}
        >
          <Select
            placeholder='Select your role'
            style={inputStyles}
          >
            <Option value='USER'>User</Option>
            <Option value='ADMIN'>Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type='primary'
            htmlType='submit'
            style={{ width: 100 }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default LoginPage;
