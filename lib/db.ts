import fs from "fs";
import os from "os";
import path from "path";
import { DbShape, Product, SiteEvent } from "./types";
import { seedProducts } from "./seed";

const dbRoot = process.env.VERCEL ? os.tmpdir() : path.join(process.cwd(), ".data");
const dbPath = path.join(dbRoot, "formanest-db.json");

function initialDb(): DbShape {
  return { products: seedProducts, events: [] };
}

function ensureDb(): DbShape {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(initialDb(), null, 2));
  }
  return JSON.parse(fs.readFileSync(dbPath, "utf8")) as DbShape;
}

function writeDb(db: DbShape) {
  try {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch {
    // Vercel's filesystem may be read-only outside /tmp. The seeded catalog still renders.
  }
}

export function getProducts() {
  return ensureDb().products;
}

export function getProduct(id: string) {
  return getProducts().find((product) => product.id === id);
}

export function getRecommendedProducts(currentId?: string) {
  return getProducts()
    .filter((product) => product.id !== currentId)
    .sort((a, b) => scoreProduct(b) - scoreProduct(a))
    .slice(0, 3);
}

export function scoreProduct(product: Product) {
  const demand = product.visits * 0.14 + product.likes * 1.8 + product.bought * 4;
  const margin = product.price - product.supplierCost;
  return product.trendScore + demand + margin * 0.08;
}

export function trackEvent(type: SiteEvent["type"], productId?: string, amount?: number) {
  const db = ensureDb();
  const product = productId ? db.products.find((item) => item.id === productId) : undefined;
  if (product && type === "visit") product.visits += 1;
  if (product && type === "like") product.likes += 1;
  if (product && type === "purchase") product.bought += 1;
  db.events.push({
    id: crypto.randomUUID(),
    type,
    productId,
    amount,
    createdAt: new Date().toISOString()
  });
  writeDb(db);
}

export function getAnalytics() {
  const db = ensureDb();
  const products = [...db.products];
  const revenue = db.events.filter((event) => event.type === "purchase").reduce((sum, event) => sum + (event.amount ?? 0), 0);
  const seededRevenue = products.reduce((sum, product) => sum + product.bought * product.price, 0);
  const seededProfit = products.reduce((sum, product) => sum + product.bought * (product.price - product.supplierCost), 0);
  return {
    products,
    events: db.events,
    totals: {
      visits: products.reduce((sum, product) => sum + product.visits, 0),
      likes: products.reduce((sum, product) => sum + product.likes, 0),
      bought: products.reduce((sum, product) => sum + product.bought, 0),
      revenue: revenue + seededRevenue,
      profit: seededProfit,
      averageMargin: Math.round(products.reduce((sum, product) => sum + (product.price - product.supplierCost), 0) / products.length)
    },
    mostVisited: products.sort((a, b) => b.visits - a.visits).slice(0, 5),
    mostLiked: [...products].sort((a, b) => b.likes - a.likes).slice(0, 5),
    mostBought: [...products].sort((a, b) => b.bought - a.bought).slice(0, 5),
    trending: [...products].sort((a, b) => scoreProduct(b) - scoreProduct(a)).slice(0, 5)
  };
}
