import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";
import Layout from "./shared/Layout";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Layout>
      <App />
    </Layout>
    <ToastContainer
      position='bottom-right'
      autoClose={3000}
    />
  </React.StrictMode>
);
