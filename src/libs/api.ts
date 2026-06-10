const BASE_URL = "https://dummyjson.com";

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
};

export type CostMetrics = {
  cpu: number;
  ram: number;
  storage: number;
  network: number;
  gpu: number;
  efficiency: number;
  total: number;
};

export type ResourceNode = {
  id: string;
  name: string;
  metrics: CostMetrics;
  children?: ResourceNode[];
};

type ProductsResponse = {
  products: Product[];
};

function titleCase(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function createMetrics(products: Product[]): CostMetrics {
  const cpu = Math.round(
    products.reduce((total, product) => total + product.price * 3.8, 0)
  );
  const ram = Math.round(
    products.reduce((total, product) => total + product.price * 2.1, 0)
  );
  const storage = Math.round(
    products.reduce((total, product) => total + product.stock * 1.7, 0)
  );
  const network = Math.round(
    products.reduce((total, product) => total + product.rating * 22, 0)
  );
  const gpu = Math.round(
    products.reduce(
      (total, product) => total + product.price * product.rating * 0.55,
      0
    )
  );
  const efficiency = Math.round(
    products.reduce(
      (total, product) => total + product.discountPercentage,
      0
    ) / products.length
  );

  return {
    cpu,
    ram,
    storage,
    network,
    gpu,
    efficiency,
    total: cpu + ram + storage + network + gpu,
  };
}

function groupBy<T>(items: T[], getKey: (item: T) => string) {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const key = getKey(item);
    groups[key] = [...(groups[key] ?? []), item];
    return groups;
  }, {});
}

function createPod(product: Product): ResourceNode {
  return {
    id: `pod-${product.id}`,
    name: product.title,
    metrics: createMetrics([product]),
  };
}

function createNamespace(brand: string, products: Product[]): ResourceNode {
  return {
    id: `namespace-${brand.toLowerCase().replaceAll(" ", "-")}`,
    name: brand,
    metrics: createMetrics(products),
    children: products.map(createPod),
  };
}

function createCluster(category: string, products: Product[]): ResourceNode {
  const brands = groupBy(
    products,
    (product) => product.brand || `${titleCase(category)} Core`
  );

  return {
    id: `cluster-${category}`,
    name: `${titleCase(category)} Cluster`,
    metrics: createMetrics(products),
    children: Object.entries(brands).map(([brand, brandProducts]) =>
      createNamespace(brand, brandProducts)
    ),
  };
}

export async function fetchCloudResources(): Promise<ResourceNode[]> {
  const response = await fetch(
    `${BASE_URL}/products?limit=24&select=id,title,category,price,discountPercentage,rating,stock,brand`
  );

  if (!response.ok) {
    throw new Error("Cloud cost data could not be loaded.");
  }

  const data = (await response.json()) as ProductsResponse;
  const categories = groupBy(data.products, (product) => product.category);

  return Object.entries(categories)
    .map(([category, products]) => createCluster(category, products))
    .sort((a, b) => b.metrics.total - a.metrics.total)
    .slice(0, 4);
}
