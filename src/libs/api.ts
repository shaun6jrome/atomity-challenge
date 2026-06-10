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

const CLUSTER_NAMES = [
  "Production",
  "AI Training",
  "Analytics",
  "Platform",
];

const NAMESPACE_NAMES = [
  "inference",
  "gpu-workers",
  "customer-api",
  "event-streams",
  "data-platform",
  "etl-pipelines",
  "metrics-stack",
  "observability",
];

const POD_NAMES = [
  "api-gateway-01",
  "api-gateway-02",
  "trainer-gpu-01",
  "trainer-gpu-02",
  "inference-worker-01",
  "inference-worker-02",
  "scheduler-01",
  "scheduler-02",
  "redis-cache-01",
  "kafka-consumer-01",
  "metrics-agent-01",
  "etl-worker-01",
];

function createMetrics(
  products: Product[]
): CostMetrics {
  const cpu = Math.round(
    products.reduce(
      (total, product) =>
        total + product.price * 3.8,
      0
    )
  );

  const ram = Math.round(
    products.reduce(
      (total, product) =>
        total + product.price * 2.1,
      0
    )
  );

  const storage = Math.round(
    products.reduce(
      (total, product) =>
        total + product.stock * 1.7,
      0
    )
  );

  const network = Math.round(
    products.reduce(
      (total, product) =>
        total + product.rating * 22,
      0
    )
  );

  const gpu = Math.round(
    products.reduce(
      (total, product) =>
        total +
        product.price *
          product.rating *
          0.55,
      0
    )
  );

  const efficiency = Math.round(
    products.reduce(
      (total, product) =>
        total +
        product.discountPercentage,
      0
    ) /
      Math.max(
        products.length,
        1
      )
  );

  return {
    cpu,
    ram,
    storage,
    network,
    gpu,
    efficiency,
    total:
      cpu +
      ram +
      storage +
      network +
      gpu,
  };
}

function groupBy<T>(
  items: T[],
  getKey: (item: T) => string
) {
  return items.reduce<
    Record<string, T[]>
  >((groups, item) => {
    const key = getKey(item);

    groups[key] = [
      ...(groups[key] ?? []),
      item,
    ];

    return groups;
  }, {});
}

function createPod(
  product: Product,
  index: number
): ResourceNode {
  return {
    id: `pod-${product.id}`,
    name:
      POD_NAMES[
        index % POD_NAMES.length
      ],
    metrics: createMetrics([
      product,
    ]),
  };
}

function createNamespace(
  brand: string,
  products: Product[],
  index: number
): ResourceNode {
  return {
    id: `namespace-${index}`,
    name:
      NAMESPACE_NAMES[
        index %
          NAMESPACE_NAMES.length
      ],
    metrics: createMetrics(
      products
    ),
    children: products.map(
      (product, podIndex) =>
        createPod(
          product,
          podIndex
        )
    ),
  };
}

function createCluster(
  category: string,
  products: Product[],
  index: number
): ResourceNode {
  const brands = groupBy(
    products,
    (product) =>
      product.brand ||
      "core-services"
  );

  return {
    id: `cluster-${category}`,
    name:
      CLUSTER_NAMES[
        index %
          CLUSTER_NAMES.length
      ],
    metrics: createMetrics(
      products
    ),
    children:
      Object.entries(brands).map(
        (
          [
            brand,
            brandProducts,
          ],
          namespaceIndex
        ) =>
          createNamespace(
            brand,
            brandProducts,
            namespaceIndex
          )
      ),
  };
}

export async function fetchCloudResources(): Promise<
  ResourceNode[]
> {
  const response =
    await fetch(
      `${BASE_URL}/products?limit=24&select=id,title,category,price,discountPercentage,rating,stock,brand`
    );

  if (!response.ok) {
    throw new Error(
      "Cloud cost data could not be loaded."
    );
  }

  const data =
    (await response.json()) as ProductsResponse;

  const categories =
    groupBy(
      data.products,
      (product) =>
        product.category
    );

  return Object.entries(
    categories
  )
    .sort(([a], [b]) =>
      a.localeCompare(b)
    )
    .slice(0, 4)
    .map(
      (
        [category, products],
        index
      ) =>
        createCluster(
          category,
          products,
          index
        )
    );
}