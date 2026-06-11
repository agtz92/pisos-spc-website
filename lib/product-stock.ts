/**
 * Stock-badge resolution helper.
 *
 * Single source of truth for the "In stock / Out of stock" pill rendered by
 * every product surface: ProductCard, the 5 ProductsLayout* components, and
 * the product detail page. Returns ``null`` when the tenant has disabled the
 * indicator entirely — the renderer should then skip the badge.
 *
 * Stock semantics (intentionally kept simple — matches v1 behavior):
 *   • ``null`` / ``undefined`` → treated as in-stock (the shop doesn't track
 *     quantity for this product, so don't claim it's sold out).
 *   • ``0``                    → out of stock.
 *   • ``> 0``                  → in stock.
 *
 * The label is text-only; we deliberately dropped the "X in stock" composition
 * (the numeric quantity) per user decision. If a tenant wants that back later,
 * add it as a separate ``product_show_stock_count`` toggle.
 */
import type { TenantInfo } from './graphql';

/** Subset of TenantInfo a renderer needs in order to compute a stock badge.
 *  Passed down from list pages and the LandingPage products section so
 *  ``getStockBadge`` doesn't need the full tenant object. */
export type StockConfig = Pick<
  TenantInfo,
  | 'productStockIndicatorEnabled'
  | 'productInStockLabel'
  | 'productInStockColor'
  | 'productOutOfStockLabel'
  | 'productOutOfStockColor'
>;

export interface StockBadge {
  label: string;
  /** Hex color (e.g. ``'#16a34a'``). Used as the pill background OR text
   *  color depending on the renderer's visual treatment — see each layout
   *  for specifics. */
  color: string;
  inStock: boolean;
}

export function getStockBadge(
  stock: number | null | undefined,
  tenant: StockConfig | null | undefined,
): StockBadge | null {
  // Missing tenant (backend down) → silent fallback, no badge.
  if (!tenant) return null;
  if (!tenant.productStockIndicatorEnabled) return null;

  const inStock = stock == null || stock > 0;
  return {
    inStock,
    label: inStock
      ? tenant.productInStockLabel || 'In stock'
      : tenant.productOutOfStockLabel || 'Out of stock',
    color: inStock
      ? tenant.productInStockColor || '#16a34a'
      : tenant.productOutOfStockColor || '#dc2626',
  };
}
