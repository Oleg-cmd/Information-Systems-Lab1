import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import { HeaderComponent } from "../components/header";
import { ProductList } from "../components/product-list";
import OrganizationTableComponent from "../components/organization-table";
import PersonTableComponent from "../components/person-table";
import AddressTableComponent from "../components/adress-table";
import { LocationTableComponent } from "../components/location-table";
import SpecialOperationsPage from "../components/SpecialOperations";
import AdminApprovalPage from "../components/AdminApprovePage";
import PollingComponent from "../components/PollingComponents";
import GraphVisualization from "../components/GraphVisualization";
import ImportHistoryPage from "../components/import-history-page";

export const MainPage: React.FC = observer(() => {
  const [currentTable, setCurrentTable] = useState<
    | "products"
    | "organizations"
    | "persons"
    | "adress"
    | "location"
    | "special"
    | "admin"
    | "visual"
    | "history"
  >("products");

  const renderTable = () => {
    switch (currentTable) {
      case "products":
        return <ProductList />;
      case "organizations":
        return <OrganizationTableComponent />;
      case "persons":
        return <PersonTableComponent />;
      case "adress":
        return <AddressTableComponent />;
      case "location":
        return <LocationTableComponent />;
      case "special":
        return <SpecialOperationsPage />;
      case "admin":
        return <AdminApprovalPage />;
      case "visual":
        return <GraphVisualization />;
      case "history":
        return <ImportHistoryPage />;
      default:
        return null;
    }
  };

  return (
    <div className='w-[100%] flex-col flex items-center'>
      <HeaderComponent onChangeTable={setCurrentTable} />
      <PollingComponent />
      <div className='w-[80%]'>{renderTable()}</div>
    </div>
  );
});
