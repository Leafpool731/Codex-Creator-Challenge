export interface MaskRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Percent-based regions; x/y are center anchors (see regionStyle in UI). */
export const MASK_REGIONS = {
  hair: { x: 50, y: 23, width: 58, height: 42 },
  hairLeft: { x: 29, y: 33, width: 22, height: 40 },
  hairRight: { x: 71, y: 33, width: 22, height: 40 },
  hairCrown: { x: 50, y: 12, width: 44, height: 20 },
  leftIris: { x: 44.5, y: 39.5, width: 2.4, height: 2.2 },
  rightIris: { x: 55.5, y: 39.5, width: 2.4, height: 2.2 },
  lips: { x: 50, y: 58, width: 17, height: 4.5 },
  leftCheek: { x: 37, y: 49, width: 30, height: 14 },
  rightCheek: { x: 63, y: 49, width: 30, height: 14 },
  freckles: { x: 50, y: 46.5, width: 42, height: 18 }
} satisfies Record<string, MaskRegion>;
