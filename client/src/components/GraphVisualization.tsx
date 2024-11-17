import React, { useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";

import { addressStore } from "../stores/AddressStore";
import { locationStore } from "../stores/LocationStore";
import { organizationStore } from "../stores/OrganizationStore";
import { personStore } from "../stores/PersonStore";
import { productStore } from "../stores/ProductStore";
import { toJS } from "mobx";

// Настройки dagre
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Функция для авторазмещения узлов
const getLayoutedNodesAndEdges = (nodes: Node[], edges: Edge[]) => {
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 150, ranksep: 200 });

  // Добавляем узлы
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 150, height: 50 });
  });

  // Добавляем связи
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Рассчитываем позиции
  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x, y },
      style: { backgroundColor: getNodeColor(node.id), borderRadius: "8px" },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// Цветовая схема для узлов
const getNodeColor = (id: string): string => {
  if (id.startsWith("product")) return "#FFD700"; // Золотой для продуктов
  if (id.startsWith("organization")) return "#87CEEB"; // Голубой для организаций
  if (id.startsWith("person")) return "#90EE90"; // Зеленый для людей
  if (id.startsWith("address")) return "#FFB6C1"; // Розовый для адресов
  if (id.startsWith("location")) return "#D3D3D3"; // Серый для локаций
  return "#FFFFFF"; // Белый по умолчанию
};

const GraphVisualization = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    // Загружаем данные из сторов
    addressStore.loadAddresses();
    locationStore.loadLocations();
    organizationStore.loadOrganizations();
    personStore.loadPersons();
    productStore.loadProducts();

    // Создаём узлы
    const addressNodes = addressStore.addresses.map((address) => ({
      id: `address-${address.id}`,
      data: { label: `Address ${address.id}` },
      position: { x: 0, y: 0 },
    }));
    // console.log("Address Nodes:", addressNodes);

    const locationNodes = locationStore.locations.map((location) => ({
      id: `location-${location.id}`,
      data: { label: `Location ${location.id}` },
      position: { x: 0, y: 0 },
    }));
    // console.log("Location Nodes:", locationNodes);

    const organizationNodes = organizationStore.organizations.map((org) => ({
      id: `organization-${org.id}`,
      data: { label: `Organization: ${org.name}` },
      position: { x: 0, y: 0 },
    }));
    // console.log("Organization Nodes:", organizationNodes);

    const personNodes = personStore.persons.map((person) => ({
      id: `person-${person.id}`,
      data: { label: `Person: ${person.name}` },
      position: { x: 0, y: 0 },
    }));
    // console.log("Person Nodes:", personNodes);

    const productNodes = productStore.products.map((product) => ({
      id: `product-${product.id}`,
      data: { label: `Product: ${product.name}` },
      position: { x: 0, y: 0 },
    }));
    // console.log("Product Nodes:", productNodes);

    // Создаём связи
    const addressEdges = addressStore.addresses.flatMap((address) => {
      const edges = [];

      // Связь с локацией
      if (address.town) {
        edges.push({
          id: `edge-address-${address.id}-town-${address.town.id}`,
          source: `address-${address.id}`,
          target: `location-${address.town.id}`,
          animated: true,
        });
      }

      // Связь с организациями
      organizationStore.organizations.forEach((org) => {
        if (org.officialAddress?.id === address.id) {
          edges.push({
            id: `edge-address-${address.id}-organization-${org.id}`,
            source: `address-${address.id}`,
            target: `organization-${org.id}`,
            animated: true,
          });
        }
        if (org.postalAddress?.id === address.id) {
          edges.push({
            id: `edge-address-${address.id}-organization-postal-${org.id}`,
            source: `address-${address.id}`,
            target: `organization-${org.id}`,
            animated: true,
          });
        }
      });

      return edges;
    });
    // console.log("Address Edges:", addressEdges);

    const productEdges = productStore.products.flatMap((product) => [
      {
        id: `edge-product-${product.id}-manufacturer-${product.manufacturer.id}`,
        source: `product-${product.id}`,
        target: `organization-${product.manufacturer.id}`,
        animated: true,
      },
      {
        id: `edge-product-${product.id}-owner-${product.owner.id}`,
        source: `product-${product.id}`,
        target: `person-${product.owner.id}`,
        animated: true,
      },
    ]);

    const personEdges = personStore.persons.flatMap((person) => {
      const edges = [];

      // Если у Person есть локация, добавляем связь с Location
      if (person.location) {
        edges.push({
          id: `edge-person-${person.id}-location-${person.location.id}`,
          source: `person-${person.id}`,
          target: `location-${person.location.id}`,
          animated: true,
        });
      }

      return edges;
    });

    // console.log("Product Edges:", productEdges);

    const allNodes = [
      ...addressNodes,
      ...locationNodes,
      ...organizationNodes,
      ...personNodes,
      ...productNodes,
    ];
    // console.log("All Nodes:", allNodes);

    const allEdges = [...addressEdges, ...productEdges, ...personEdges];
    // console.log("All Edges:", allEdges);

    // Вычисляем позиции узлов и связей
    const { nodes: layoutedNodes, edges: layoutedEdges } =
      getLayoutedNodesAndEdges(allNodes, allEdges);

    // console.log("Layouted Nodes:", layoutedNodes);
    // console.log("Layouted Edges:", layoutedEdges);

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <MiniMap nodeColor={(node) => getNodeColor(node.id)} />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default GraphVisualization;
