/**
 * Product shade matching.
 *
 * Each product carries one measured shade colour (hex). A product matches a season when
 * that shade sits close, in OKLab, to one of the season's target cosmetic shades for the
 * same category (see cosmeticsForSeason in lib/palette.ts). OKLab distance is perceptual,
 * so "0.03 away" means roughly the same visible difference anywhere in the colour space.
 */

import productData from "@/data/products.json";
import { hexToOklab, type Lab } from "@/lib/color/oklab";
import { cosmeticsForSeason, type Swatch } from "@/lib/palette";
import type { Season } from "@/lib/seasons";

export type ProductCategory = "lips" | "cheeks" | "eyes";

export interface Product {
  id: string;
  category: ProductCategory;
  brand: string;
  name: string;
  shade: string;
  /** Measured shade colour, e.g. sampled from the retailer's swatch image. */
  hex: string;
  finish?: string;
  retailer?: string;
  /** Product link. Leave empty until the product has one. */
  url?: string;
  /**
   * Whether `url` earns a commission (default true). Set false for plain links so
   * good shades without an affiliate program still rank and show normally.
   */
  affiliate?: boolean;
  /** Placeholder entries shipped for development; flagged in the UI. */
  sample?: boolean;
}

export interface ProductMatch {
  product: Product;
  /** 0–100 */
  score: number;
  /** OKLab distance to the closest target shade */
  distance: number;
  /** The season target this product is closest to */
  target: Swatch;
}

const HEX = /^#[0-9a-f]{6}$/i;
const categories: ProductCategory[] = ["lips", "cheeks", "eyes"];

function validate(raw: unknown[]): Product[] {
  return raw.filter((p): p is Product => {
    const x = p as Partial<Product>;
    const ok =
      typeof x.id === "string" &&
      categories.includes(x.category as ProductCategory) &&
      typeof x.brand === "string" &&
      typeof x.name === "string" &&
      typeof x.shade === "string" &&
      typeof x.hex === "string" &&
      HEX.test(x.hex);
    if (!ok && process.env.NODE_ENV !== "production") {
      console.warn("[products] skipping invalid entry", p);
    }
    return ok;
  });
}

export const products: Product[] = validate(productData as unknown[]);

const labCache = new Map<string, Lab>();
function lab(hex: string): Lab {
  let v = labCache.get(hex);
  if (!v) {
    v = hexToOklab(hex);
    labCache.set(hex, v);
  }
  return v;
}

export function deltaE(a: Lab, b: Lab): number {
  return Math.hypot(a.L - b.L, a.a - b.a, a.b - b.b);
}

/** Distance at which a shade stops reading as "the same family" next to the target. */
const TOLERANCE = 0.075;

export function scoreFromDistance(d: number): number {
  return Math.round(100 * Math.exp(-((d / TOLERANCE) ** 2)));
}

export type ShadeCloseness = "veryClose" | "close" | "similar";

/**
 * OKLab distance bands. ~0.02 is about the smallest difference people reliably notice
 * side by side; swatch photos and screens add more error than that, so bands stay coarse.
 */
export function shadeCloseness(distance: number): ShadeCloseness {
  if (distance < 0.03) return "veryClose";
  if (distance < 0.055) return "close";
  return "similar";
}

export function matchProducts(
  season: Season,
  category: ProductCategory,
  { limit = 6, minScore = 40, pool = products }: { limit?: number; minScore?: number; pool?: Product[] } = {}
): ProductMatch[] {
  const targets = cosmeticsForSeason(season)[category];
  return pool
    .filter((p) => p.category === category)
    .map((product) => {
      const pl = lab(product.hex);
      let best = targets[0];
      let distance = Infinity;
      for (const t of targets) {
        const d = deltaE(pl, lab(t.hex));
        if (d < distance) {
          distance = d;
          best = t;
        }
      }
      return { product, distance, target: best, score: scoreFromDistance(distance) };
    })
    .filter((m) => m.score >= minScore)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}
