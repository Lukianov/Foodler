import { Product } from '../services/vision';

export function totalCalories(products: Product[]): number {
  return products.reduce((sum, p) => sum + (p.kcal || 0), 0);
}
