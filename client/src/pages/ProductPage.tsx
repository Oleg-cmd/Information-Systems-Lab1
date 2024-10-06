import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const ProductPage = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className='demo-logo' />
        <Menu
          theme='dark'
          mode='horizontal'
          items={[{ key: 0, label: "Home", onClick: () => navigate("/") }]}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: "50px 48px" }}>
        <h2 style={{ textAlign: "center" }}>Product Management</h2>
        <ProductForm />
        <ProductTable />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        olevegic ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default ProductPage;
