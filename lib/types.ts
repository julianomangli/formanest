export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  details: string;
  image: string;
  supplierCost: number;
  price: number;
  stock: number;
  materials: string;
  dimensions: string;
  room: string;
  trendScore: number;
  visits: number;
  likes: number;
  bought: number;
};

export type SiteEvent = {
  id: string;
  type: "visit" | "like" | "purchase" | "checkout";
  productId?: string;
  amount?: number;
  createdAt: string;
};

export type DbShape = {
  products: Product[];
  events: SiteEvent[];
};
