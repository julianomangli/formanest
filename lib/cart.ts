export type CartItem = { id: string; quantity: number };

export function parseCart(value: string | null): CartItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as CartItem[];
    return Array.isArray(parsed) ? parsed.filter((item) => item.id && item.quantity > 0) : [];
  } catch {
    return [];
  }
}
