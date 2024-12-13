import { useEffect } from "react";
import { productStore } from "../stores/ProductStore";
import { organizationStore } from "../stores/OrganizationStore";
import { personStore } from "../stores/PersonStore";
import { addressStore } from "../stores/AddressStore";
import { locationStore } from "../stores/LocationStore";
import importHistoryStore from "../stores/ImportHistoryStore";

const PollingComponent: React.FC = () => {
  useEffect(() => {
    // Функция для загрузки данных
    const fetchData = () => {
      productStore.loadProducts();
      organizationStore.loadOrganizations();
      personStore.loadPersons();
      addressStore.loadAddresses();
      locationStore.loadLocations();
      importHistoryStore.fetchHistory();
    };

    // Выполняем начальную загрузку
    fetchData();

    // Устанавливаем polling с интервалом 5 секунд
    const interval = setInterval(fetchData, 5000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  return null; // Компонент не рендерит ничего, он только инициирует polling
};

export default PollingComponent;
