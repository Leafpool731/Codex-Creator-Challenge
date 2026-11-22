#!/usr/bin/env node
/**
 * Measure a product's shade from a swatch image and (optionally) add it to data/products.json.
 *
 *   node scripts/add-product.mjs <swatch-image> [options]
 *
 * Options
 *   --category lips|cheeks|eyes   required with --write
 *   --brand "Brand" --name "Product" --shade "Shade name"
 *   --finish matte|satin|...      optional
 *   --retailer "Sephora"          optional, shown on the Shop button
 *   --url "https://..."           your affiliate link (or a plain product link)
 *   --no-affiliate                the url is a plain link, not an affiliate one
 *   --region 0.3                  fraction of the image (centred) to sample, default 0.3
 *   --hex "#aabbcc"               skip measuring and use this colour instead
 *   --write                       append to data/products.json (otherwise just prints)
 *
 * Use a flat, evenly lit swatch (the retailer's shade chip or a swatch photo on white).
 * The script takes the per-channel median of the centre region, which ignores glare,
 * shadows and edges better than an average.
 */

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(`--${name}`);
const file = args.find((a, i) => !a.startsWith("--") && (i === 0 || !args[i - 1].startsWith("--")));

function median(values) {
  const s = [...values].sort((a, b) => a - b);
  return s[s.length >> 1];
}

async function measure(image, region) {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("This script needs sharp: npm i -D sharp");
    process.exit(1);
  }
  const { data, info } = await sharp(image).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const x0 = Math.floor((w * (1 - region)) / 2);
  const y0 = Math.floor((h * (1 - region)) / 2);
  const x1 = Math.ceil(w - x0);
  const y1 = Math.ceil(h - y0);
  const r = [];
  const g = [];
  const b = [];
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * w + x) * info.channels;
      r.push(data[i]);
      g.push(data[i + 1]);
      b.push(data[i + 2]);
    }
  }
  return [median(r), median(g), median(b)];
}

const toHex = (rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
const lin = (u) => {
  u /= 255;
  return u <= 0.04045 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4;
};
function oklch([R, G, B]) {
  const r = lin(R), g = lin(G), b = lin(B);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const H = (Math.atan2(Bb, A) * 180) / Math.PI;
  return `oklch(${L.toFixed(3)} ${Math.hypot(A, Bb).toFixed(3)} ${(H < 0 ? H + 360 : H).toFixed(1)})`;
}

let hex = opt("hex");
if (hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) {
    console.error("--hex must look like #aabbcc");
    process.exit(1);
  }
} else {
  if (!file) {
    console.error("Usage: node scripts/add-product.mjs <swatch-image> [--category lips --brand ... --write]");
    process.exit(1);
  }
  hex = toHex(await measure(file, Number(opt("region", "0.3"))));
}
const rgb = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
console.log(`shade ${hex}  ${oklch(rgb)}`);

const category = opt("category");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const product = {
  id: slug(`${opt("brand", "brand")}-${opt("name", "product")}-${opt("shade", hex)}`),
  category: category ?? "lips",
  brand: opt("brand", ""),
  name: opt("name", ""),
  shade: opt("shade", ""),
  hex: hex.toLowerCase(),
  ...(opt("finish") ? { finish: opt("finish") } : {}),
  retailer: opt("retailer", ""),
  url: opt("url", ""),
  ...(flag("no-affiliate") ? { affiliate: false } : {})
};

if (!flag("write")) {
  console.log(JSON.stringify(product, null, 2));
  process.exit(0);
}

if (!["lips", "cheeks", "eyes"].includes(category ?? "")) {
  console.error("--write needs --category lips|cheeks|eyes");
  process.exit(1);
}
if (!product.brand || !product.name || !product.shade) {
  console.error("--write needs --brand, --name and --shade");
  process.exit(1);
}
const dataPath = path.join(process.cwd(), "data", "products.json");
const list = JSON.parse(readFileSync(dataPath, "utf8"));
const existing = list.findIndex((p) => p.id === product.id);
if (existing >= 0) list[existing] = product;
else list.push(product);
writeFileSync(dataPath, JSON.stringify(list, null, 2) + "\n");
console.log(`${existing >= 0 ? "updated" : "added"} ${product.id} (${list.length} products)`);
